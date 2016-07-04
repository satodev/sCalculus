const express = require('express'),
	app = express(),
	port = process.env.PORT || 8080
	routes = require('./server/routes.js');

app.set('view engine', 'pug');
app.use('/', routes);
app.use('/views', express.static(__dirname+'/views'));
app.use('/node_modules', express.static(__dirname+'/node_modules'));
app.listen(port, ()=>{
	console.log('Server listening on port '+port);
});
