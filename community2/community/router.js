var express = require('express')
var router = express.Router()
var mongoose = require('mongoose')
var User = require('./modelsData/user')
var md5 = require('blueimp-md5')

mongoose.connect('mongodb://localhost/test', { useMongoClient: true })

router.get('/', function(req, res) {
    res.render('index.html', {
        user: req.session.user
    })
})

router.get('/login', function(req, res) {
    res.render('login.html')
})

router.post('/login', function(req, res) {
    User.findOne({
        email: req.body.email,
        password: md5(md5(req.body.password))
    }, function(err, user) {
        if (err) {
            return next(err)
        }

        // 如果没找到用户
        if (!user) {
            return res.status(200).json({
                err_code: 1,
                message: 'email or password is invalid'
            })
        }

        // 用户存在，登陆成功，通过 session 记录登陆状态
        req.session.user = user
        res.status(200).json({
            err_code: 0,
            message: 'ok'
        })
    })
})

router.get('/register', function(req, res) {
    res.render('register.html')
})

router.post('/register', function(req, res) {
    var body = req.body
    User.findOne({
        $or: [{
                email: body.email
            },
            {
                nickname: body.nickname
            }
        ]
    }, function(err, data) {
        if (err) {
            return next(err)
        }
        if (data) {
            // 邮箱或者昵称已经存在
            return res.status(200).json({
                err_code: 1,
                message: 'email or nickname exits'
            })
        }
        // 对密码进行 md5 二次重复加密
        body.password = md5(md5(body.password))
        new User(body).save(function(err, user) {
            if (err) {
                return next(err)
            }
            // 通过 session 记录用户登录状态
            req.session.user = user
                // express 提供了一个响应方法：json
                // 该方法接受一个对象作为参数，他会自动把对象转为字符串发送给浏览器
            res.status(200).json({
                err_code: 0,
                message: 'ok'
            })
        })

    })
})
router.get('/logout', function(req, res) {
    // 清除登陆状态，重定向到指定页面
    req.session.user = null
    res.redirect('/')
})

router.get('/count', function(req, res) {
    res.render('count.html')
})
module.exports = router