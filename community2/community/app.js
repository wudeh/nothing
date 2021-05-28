var express = require('express')
var app = express()
var router = require('./router')
var path = require('path')
var bodyParser = require('body-parser')
var session = require('express-session')
    // 开放静态资源
app.use('/node_modules/', express.static(path.join(__dirname, './node_modules/')))
app.use('/public/', express.static(path.join(__dirname, './public/')))

// art-template
app.engine('html', require('express-art-template'))

// 配置模板引擎和 body-parser 一定要在 app.use(router) 挂载路由之前
app.use(bodyParser.urlencoded({ extender: false }))
app.use(bodyParser.json())

// 配置 session 第三方插件，给 req 对象，添加一个成员 req.session ，它是一个对象
app.use(session({
    secret: 'keyboard cat', // 配置加密字符串，他会在原有加密基础上和这个字符串拼起来加密
    resave: false,
    saveUninitialized: true // true 表示无论是否使用session，默认给用户分配一把钥匙，false 表示只有使用 session 的时候才给你分配钥匙
}))

// 把路由容器挂载到 router 中
app.use(router)


// 配置处理 404 错误页面 中间件
app.use(function(req, res) {
    res.render('404.html')
})


// 配置全局出错处理
app.use(function(err, req, res, next) {
    return res.status(500).json({
        err_code: 500,
        message: err.message
    })
})
app.listen(3000, function() {
    console.log('running 3000...')
})