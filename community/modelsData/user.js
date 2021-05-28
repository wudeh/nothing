var mongoose = require('mongoose')
var Schema = mongoose.Schema


var userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    nickname: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    created_time: {
        type: Date,
        // 这里不要写 Data.now() 因为会立刻调用
        // 这里直接给了方法 Data.now
        // 当你去 new model 的时候，如果你没有传递 create_time ，则 mongoose 就会调用 default 指定的 Date.now 方法，使用其返回值作为默认值
        default: Date.now
    },
    last_modified_time: {
        type: Date,
        default: Date.now
    },
    avatar: {
        type: String,
        default: '/public/img/avatar-default.jpg'
    },
    bio: {
        type: String,
        default: ''
    },
    gender: {
        type: Number,
        enum: [0, 1, -1],
        default: -1
    },
    birthday: {
        type: Date,

    },
    status: {
        type: Number,
        // 1不可以评论，2不可以登陆使用，0没有限制
        enum: [1, 2, 0],
        default: 0
    }
})

module.exports = mongoose.model('User', userSchema)