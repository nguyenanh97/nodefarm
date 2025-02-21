const http = require('http')
const url = require('url')
const fs = require('fs')
const replaceTemplate = require('./modules/replaceTemplate')
const slugify = require('slugify')
// đường dẫn đến file tuyệt đối
const tempOver = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8')
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8')
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8')
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8')
const dataObj = JSON.parse(data)
const slugs = dataObj.map(el => slugify(el.productName, { lower: true }))
console.log(slugs)




const server = http.createServer((req, res) => {
    // đường dẫn URL phía trước ? 
    const { query, pathname } = url.parse(req.url, true)
    // OverView Page 
    if (pathname === '/' || pathname === '/overview') {
        res.writeHead(200, { 'Content-type': 'text/html' })
        // xử lý lặp qua các phần tử của JSON, đây dữ liệu về đường dẫn tuyệt đối 
        const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('')
        // thay thế view => thành dữ liệu đc xử lý từ JSON
        const output = tempOver.replace('{%PRODUCT_CARDS%}', cardsHtml)
        res.end(output)

        // Product View    
    } else if (pathname === '/product') {
        res.writeHead(200, { 'Content-type': 'text/html' })
        const product = dataObj[query.id]
        const output = replaceTemplate(tempProduct, product)
        res.end(output)

        // API    
    } else if (pathname === '/api') {
        // thiết lập mã trạng thái 200 ok, đảm bảo phía client nhận được đúng định dạng dữ liệu)
        res.writeHead(200, { 'Content-type': 'application/json' })
        res.end(data)
    }
    // Not Foud
    else {
        res.writeHead(404, {
            'Content-type': 'text/html',
            'my-own-header': 'hello world'
        })
        res.end('<h1>Page not found! </h1>')
    }
})
server.listen(8000, '127.0.0.1', () => {
    console.log('Successfully Connected To Server....')
})