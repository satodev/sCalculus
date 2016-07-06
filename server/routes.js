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
		pseudo : req.body.pseudo,
		pwd : req.body.pwd
	}
	if(data.pseudo && data.pwd){
		m.initUserSchema();
		m.insertSub(data.pseudo, data.pwd);
		//shere
		res.send();		
	}else{
		res.send('nope');
	}
});
routes.post('/login', (req,res)=>{
	data = {
		pseudo :req.body.pseudo,
		pwd : req.body.pwd
	}
	res.send(data);
});
module.exports = routes;
