var express = require('express')
var router = express.Router()
var mongoose = require('mongoose')
var User = require('./modelsData/user')
var md5 = require('blueimp-md5')
var multer = require('multer')

mongoose.connect('mongodb://localhost/test')

var datatime = './public/img/'
//将图片放到服务器
var multer = require('multer')
var storage = multer.diskStorage({
    destination: datatime,
    //给上传文件重命名，获取添加后缀名
    filename: function (req, file, cb) {
        cb(null,  file.originalname);
     }
}); 

var upload = multer({
    storage: storage
});

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
        console.log(req.session.user.id)
        console.log(req.session.user)
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
    if (!req.session.user) {
        return res.render('404.html')
    }
    res.render('count.html', {
        user: req.session.user
    })
})

router.post('/count/pwdModified', function(req, res) {
    User.update({
        email: req.session.user.email
    }, {
        $set: { password: md5(md5(req.body.pwdNew)) }
    }, function(err, data) {
        if (err) {
            return next(err)
        }
        User.find({ email: req.session.user.email }, function(err, data) {
            if (err) {
                console.log('查询失败')
            }
            console.log('查询成功')
            console.log(data)
        })
        console.log('修改成功')
        console.log(data)
        req.session.user = null
        res.status(200).json({
            err_code: 0,
            message: 'ok'
        })
    })
})

router.get('/personal', function(req, res) {
    console.log(req.session.user)
    res.render('personal.html', {
        user: req.session.user
    })
})

router.post('/avatar', upload.single('avatar'), function(req, res, next) {
    console.log(req.file)
    User.update({
        email: req.session.user.email
    }, {
        $set: { avatar: './public/img/' + req.file.originalname }
    }, function(err, data) {
        if (err) {
            return next(err)
        }
        User.find({ email: req.session.user.email }, function(err, data) {
            if (err) {
                console.log('查询失败')
            }
            console.log('查询成功')
            console.log(data)
        })
        res.redirect('/')
    })
})
module.exports = router