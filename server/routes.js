const	express = require('express'),
	mg = require('mongoose'),
	routes = express.Router();
routes.get('/', (req, res)=>{
	res.render('index');
});
module.exports = routes;
