/**
 * students.js
 * 数据操作文件模块
 * 职责：操作文件中的数据，只处理数据，不关心业务
 */

var fs = require('fs')

var dbPath = './db.json'

/**
 * 获取所有学生列表
 * return []
 */
exports.find = function(callback) { // 异步操作的结果必须由回调函数得到
        fs.readFile(dbPath, 'utf8', function(err, data) {
            if (err) {
                return callback(err)
            }
            callback(null, JSON.parse(data).students)
        })
    }
    /**
     * 
     * @param {number} id 学生id
     * @param {Function} callback 回调函数
     */
exports.findById = function(id, callback) {
    fs.readFile(dbPath, 'utf8', function(err, data) {
        if (err) {
            return callback(err)
        }
        var students = JSON.parse(data).students
        var ret = students.find(function(item) {
            return item.id === id
        })
        callback(null, ret)
    })
}

/**
 * 添加保存学生
 */
exports.save = function(student, callback) {
    fs.readFile(dbPath, 'utf8', function(err, data) {
        if (err) {
            return callback(err)
        }
        var students = JSON.parse(data).students
        student.id = students[students.length - 1].id + 1
        students.push(student)
            // 把字符串保存到文件中
        fs.writeFile(dbPath, JSON.stringify({
            students: students
        }), function(err) {
            if (err) {
                return callback(err)
            }
            callback(null)
        })

    })
}

/**
 * 更新学生
 */
exports.updateById = function(student, callback) {
    fs.readFile(dbPath, 'utf8', function(err, data) {
        if (err) {
            return callback(err)
        }
        var students = JSON.parse(data).students
            // 这里记得把 id 统一转换为数字类型
        student.id = parseInt(studenet.id)
        var stu = students.find(function(item) {
            return item.id === parseInt(student.id)
        })
        for (var key in student) {
            stu[key] = student[key]
        }
        fs.writeFile(dbPath, JSON.stringify({
            students: students
        }), function(err) {
            if (err) {
                return callback(err)
            }

        })
    })
}

/**
 * 删除学生
 */
exports.deleteById = function(id, callback) {
    fs.readFile(dbPath, 'utf8', function(err, data) {
        if (err) {
            return callback(err)
        }
        var students = JSON.parse(data).students

        // findIndex 方法专门用来根据条件查找元素下标
        var deleteId = students.findIndex(function(item) {
            return item.id === parseInt(id)
        })

        // 根据下标从数组中删除对应的学生对象
        students.splice(deleteId, 1)

        fs.writeFile(dbPath, JSON.stringify({
            students: students
        }), function(err) {
            if (err) {
                return callback(err)
            }
            callback(null)
        })
    })
}