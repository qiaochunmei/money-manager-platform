// login & register

const express = require('express');
const router = express.Router(); // 实例化一个router
const bcrypt = require('bcrypt');
const gravatar = require('gravatar');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');

const User = require('../../models/User');

// $route GET api/users/test
// @desc 返回的请求的json数据
// @access public
router.get('/test', (req, res) => {
  res.json({ msg: 'login works' });
});

// @route  POST api/users/register
// @desc   返回的请求的json数据
// @access public
router.post('/register', (req, res) => {
  console.log('register-------');
  // console.log(req.body);  {email: 'test@test.com'} post参数
  // 查询数据库中是否拥有邮箱
  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(400).json('邮箱已被注册!'); // return一个状态码加json数据，即邮箱被占用
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: '200', // size
        r: 'pg', // 格式
        d: 'mm' // 如果没有图片使用默认图片
      });

      // 创建用户
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar,
        password: req.body.password,
        identity: req.body.identity
      });

      // 对密码进行加密处理
      bcrypt.genSalt(10, function (err, salt) {
        // bcrypt.hash是对谁进行加密
        bcrypt.hash(newUser.password, salt, (err, hash) => { // hash加密后的密码
          if (err) throw err;

          newUser.password = hash;

          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

// @route  POST api/users/login
// @desc   返回token jwt passport
// @access public
router.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  // 查询数据库
  User.findOne({ email }).then(user => {
    if (!user) {
      return res.status(404).json('用户不存在!');  // 返回状态码
    }

    // 密码匹配
    bcrypt.compare(password, user.password).then(isMatch => { // 当前用户输入的密码以及数据里的密码
      if (isMatch) { // 匹配成功
        const rule = { // 自己定义规则
          id: user.id,
          name: user.name,
          avatar: user.avatar,
          identity: user.identity
        };
        // jwt.sign("规则", '加密名字', {过期时间}, '箭头函数')
        jwt.sign(rule, keys.secretOrKey, { expiresIn: 3600 }, (err, token) => { // sign签名
          if (err) throw err;
          res.json({
            success: true,
            token: 'Bearer ' + token // 必须是这种形式的,即Bearer加空格后面再跟token
          });
        });
        // res.json({ msg: "success" });
      } else {
        return res.status(400).json('密码错误!');
      }
    });
  });
});

// @route  GET api/users/current
// @desc   return current user
// @access Private

// passport.authenticate('jwt', { session: false }验证token
router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.json({
    id: req.user.id,
    name: req.user.name,
    email: req.user.email,
    identity: req.user.identity
  });
});

module.exports = router;