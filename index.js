const 	express = require('express'),
	bodyParser = require('body-parser'),
	app = express(),
	port = process.env.PORT || 8080
	routes = require('./server/routes.js');

app.set('view engine', 'pug');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended:true
}));
app.use('/', routes);
app.use('/views', express.static(__dirname+'/views'));
app.use('/node_modules', express.static(__dirname+'/node_modules'));
app.listen(port, ()=>{
	console.log('Server listening on port '+port);
});
