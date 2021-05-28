const mongoose = require('mongoose');

// 连接 MongoDB 数据库
mongoose.connect('mongodb://localhost/test');

// 创建一个模型，就是在设计数据库
const Cat = mongoose.model('Cat', { name: String });

// 实例化一只cat
const kitty = new Cat({ name: 'Zildjian' });

// 持久化保存 Kitty
// kitty.save().then(() => console.log('meow'));
kitty.save(function(err) {
    if (err) {
        console.log(err)
    } else {
        console.log('meow')
    }
})