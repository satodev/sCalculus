const	express = require('express'),
	mg = require('mongoose'),
	m = require('./mongo.js'),
	routes = express.Router();
routes.get('/', (req, res)=>{
	res.render('index');
});
//routes.get('/users', (req,res)=>{
//	m.connect();
//	m.mgU.find((err, users)=>{
//		if(err)	{
//			console.log(err);
//		}
//		if(users){
//			res.send(users);
//		}
//		mg.disconnect();
//	});
//});
//routes.get('/users/:id', (req, res)=>{
//	m.connect();
//	m.mgU.findById(req.params.id, (err, user)=>{
//		if(err){
//			console.log(err);
//			res.send('no users at that id');
//		}
//		if(user){
//			res.send(user);
//		}
//		mg.disconnect();
//	});
//});
routes.post('/sub', (req,res)=>{
	data = {
		method : req.body.method,
		pseudo : req.body.pseudo,
		pwd : req.body.pwd
	}
	if(data.method == 'seekUser'){
		m.initUserSchema();
		m.qfindUser(data.pseudo)
		m.connect()
		m.query.exec((err,user)=>{
			if(err) console.log(err);
			if(user.length > 0){
				res.send('user');
				m.disconnect();
			}else{
				res.send('nuser');
				m.disconnect();
			}
		});
	}
	if(data.method == 'insertUser'){
		m.connect();
		m.initUserSchema();
		m.qinsertUser(data.pseudo, data.pwd);
		m.query.save((err,data)=>{
			if(err) console.log(err);
			console.log(data);
			res.send('cuser');
			m.disconnect();
			
		});
	}
	if(data.method == 'Null'){
		res.send('nope');
	}
});
routes.post('/login', (req,res)=>{
	data = {
		pseudo :req.body.pseudo,
		pwd : req.body.pwd
	}
	m.initUserSchema();
	m.login(data.pseudo, data.pwd);
	m.connect();
	m.query.exec((err, user)=>{
		if(err) console.log(err);
		res.send(user);
		m.disconnect();
	});
});
module.exports = routes;
