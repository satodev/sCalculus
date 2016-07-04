const	express = require('express'),
	mg = require('mongoose'),
	mgu = require('./mongo.js'),
	routes = express.Router();
routes.get('/', (req, res)=>{
	res.render('index');
});
routes.get('/users', (req,res)=>{
	mg.connect("mongodb://"+mgu.u+":"+mgu.md+"@ds011735.mlab.com:11735/scalculus");
	mgu.mgU.find((err, users)=>{
		if(err)	{
			console.log(err);
		}
		if(users){
			res.send(users);
		}
		mg.connection.close();
	});
});
routes.get('/users/:id', (req, res)=>{
	mg.connect("mongodb://"+mgu.u+":"+mgu.md+"@ds011735.mlab.com:11735/scalculus");
	mgu.mgU.findById(req.params.id, (err, user)=>{
		if(err){
			console.log(err);
			res.send('no users at that id');
		}
		if(user){
			res.send(user);
		}
		mg.connection.close();
	});
});
routes.post('/sub', (req,res)=>{
	if(req.body.UserName || req.body.UserPwd){
		console.log(req.body.UserName);
		res.send('ok');
	}
});
routes.get('/sub', (req, res)=>{
	res.render('subscribe');
});
module.exports = routes;
