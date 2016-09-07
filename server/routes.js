const	express = require('express'),
	mg = require('mongoose'),
	m = require('./mongo.js'),
	routes = express.Router();
routes.get('/', (req, res)=>{
	res.render('index');
});
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
routes.post('/grid', (req, res)=>{
	if(req.body.method == 'load'){
		m.initGridSchema();
		m.qFindGrid(req.body.id_user);
		m.connect();
		m.query.exec((err, grid)=>{
			if(err) console.log(err);
			if(grid && grid.length > 0){ // frequent problem here (when multi request is on going)
				res.send(grid);
				m.disconnect();
			}else{
				res.send('error reload');
				m.disconnect();
			}
		});
	}
	if(req.body.method == 'save'){
		m.initGridSchema();
		m.qFindGrid(req.body.id_user);
		m.connect();
		m.query.exec((err, grid)=>{
			if(err) console.log(err);
			if(!grid || grid.length == 0){
				m.qSaveGrid(req.body.id_user, req.body.content);
				m.query.save((err, grid)=>{
					if(err) console.log(err);
					res.send(grid);
					m.disconnect();
				});
			}else{
				m.qUpdateGrid(req.body.id_user, req.body.content);
				m.query.exec((err, grid)=>{
					if(err) console.log(err);
					res.send(grid);
					m.disconnect();
				});
			}
		});
	}
});
module.exports = routes;
