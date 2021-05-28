var http = require('http')
var fs = require('fs')
var template = require('art-template')
var url = require('url')

var comments = [{
    name: '张三',
    message: '今天天气不错',
    dataTime: '2015-07-12'
}, {
    name: '张三',
    message: '今天天气不错',
    dataTime: '2015-07-12'
}, {
    name: '张三',
    message: '今天天气不错',
    dataTime: '2015-07-12'
}, {
    name: '张三',
    message: '今天天气不错',
    dataTime: '2015-07-12'
}, ]
http
    .createServer(function(req, res) {
        var urlObj = url.parse(req.url, true)
        var pathname = urlObj.pathname
        if (pathname === '/') {
            fs.readFile('./views/index.html', function(err, data) {
                if (err) {
                    return res.end('404')
                }
                data = template.render(data.toString(), {
                    comments: comments
                })
                res.end(data)

            })
        } else if (pathname === '/post') {
            fs.readFile('./views/post.html', function(err, data) {
                if (err) {
                    return res.end('404')
                }
                res.end(data)
            })
        } else if (pathname === '/pinglun') {
            // 提交留言
            var comment = urlObj.query
            comment.dataTime = '2017-03-14'
            comments.push(comment)
                // 重定向
            res.statusCode = '302'
            res.setHeader('Location', '/')
            res.end()
        } else if (pathname.startsWith('/public')) {
            fs.readFile('.' + pathname, function(err, data) {
                if (err) {
                    return res.end('404')
                }
                res.end(data)
            })
        }
    })
    .listen(3000, function() {
        console.log('服务器启动了')
    })