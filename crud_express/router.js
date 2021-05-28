/**
 * router.js 模块
 * 职责：
 *  处理路由
 *  根据不同的请求方法 + 请求路径设置具体的请求处理函数
 * 模块职责要单一，不要乱写
 * 划分模块的目的就是为了增强项目代码的可维护性
 * 提升开发效率
 */

var fs = require('fs')

var express = require('express')
    // 1.创建一个路由容器
var router = express.Router()
    // 拿到操作学生 api 
var Student = require('./students')

// 2.把路由都挂载到 router 容器中
router.get('/', function(req, res) {
    Student.find(function(err, students) {
        if (err) {
            return res.status(500).send('Sever erorr')
        }
        res.render('index.html', {
            students: students
        })
    })
})

router.get('/students/new', function(req, res) {
    res.render('new.html')
})

router.post('/students/new', function(req, res) {
    // 处理，将数据保存到 db.json 文件中用以持久化
    Student.save(req.body, function(err, data) {
        if (err) {
            return res.status(500).send('Sever Error')
        }
    })
    res.redirect('/')
})

router.get('/students/edit', function(req, res) {
    // 渲染编辑页面，根据 id 查找学生信息，使用模板引擎渲染页面
    Student.findById(parseInt(req.query.id), function(err, student) {
        if (err) {
            return res.send(500).send('Serve error')
        }
        res.render('edit.html', {
            student: student
        })
    })
})

router.post('/students/edit', function(req, res) {
    Student.updateById(req.body, function(err) {
        if (err) {
            return res.send(500).send('Serve error')
        }
        res.redirect('/')
    })
})

router.get('/students/delete', function(req, res) {
    Student.deleteById(req.query.id, function(err) {
        if (err) {
            return res.status(500).send('Sever error')
        }
        res.redirect('/')
    })
})

// 3.把 router 导出
module.exports = router