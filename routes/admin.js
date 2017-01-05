var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.render('admin', {title: '后台管理'})
});

router.get('/user', function (req,res,next) {
    res.render('user', {title: '用户信息修改'});
});
module.exports = router;
