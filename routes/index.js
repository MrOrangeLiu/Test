// var express = require('express');
// var router = express.Router();

// /* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

// module.exports = router;

var crypto = require('crypto');
User = require('../models/user.js');

module.exports = function(app) {

	app.get('/', function (req, res) {
		res.render('index', { title: 'Home page' });
	});

	app.get('/reg', function (req, res) {
		res.render('reg', { title: 'Register' });
	});

	app.post('/reg', function (req, res) {
		var name = req.body.name,
			password = req.body.password,
			password_re = req.body['password-repeat']; //??为什么写法和上一行不一样??
			//验证用户两次输入的密码是否一致
			if(password_re != password) {
				//req.flash('error', '两次输入的密码不一致');
				console.log('两次密码输入不一致');
				return res.redirect('/reg');
			}
			//生成密码的 md5 值
			var md5 = crypto.createHash('md5'),
				password = md5.update(req.body.password).digest('hex');
			var newUser = new User({
				name: name,
				password: password,
				email: req.body.email
			});
			//检查用户名是否已经存在
			User.get(newUser.name, function(err, user) {
				if(err) {
					//req.flash('error', err);
					console.log('error in getting users');
					return res.redirect('/');
				}
				if(user) {
					//req.flash('error', '用户已存在！');
					console.log('用户已存在！')
					return res.redirect('/reg');//返回注册首页
				}
				//如果用户是新用户
				newUser.save(function (err, user) {
					if(err) {
						//req.flash('error', err);
						console.log('error in saving users');
						return res.redirect('/reg');
					}
					req.session.user = newUser;
					//req.flash('success', '注册成功');
					console.log('注册成功！');
					res.redirect('/');
				});
			});
	});

	app.get('/login', function (req, res) {
		res.render('login', { title: 'Login' });
	});

	app.post('/login', function (req, res) {
	});

	app.get('/post', function (req, res) {
		res.render('index', { title: 'Post' });
	});

	app.post('/post', function (req, res) {
	});

	app.get('/logout', function(req, res) {
	});

};
