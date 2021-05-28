/*
    app.js 入门模块
    职责
        创建服务
        做一些服务相关配置
            模板引擎
            body——parse 解析表单 post 请求体
            提供静态资源服务
            挂载路由
        监听端口启动服务
*/
var express = require('express')
var app = express()
var router = require('./router')
var bodyParser = require('body-parser')
var path = require('path')
    // 开放静态资源
app.use('/node_modules/', express.static(path.join(__dirname, './node_modules/')))
app.use('/public/', express.static(path.join(__dirname, './public/')))

// art-template
app.engine('html', require('express-art-template'))

// 配置模板引擎和 body-parser 一定要在 app.use(router) 挂载路由之前
app.use(bodyParser.urlencoded({ extender: false }))
app.use(bodyParser.json())

// 把路由容器挂载到 router 中
app.use(router)

app.listen(3000, function() {
    console.log('running 3000...')
})