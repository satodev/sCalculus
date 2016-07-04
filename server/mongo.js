const 	express = require('express'),
	mg = require('mongoose'),
	user = 'sato',
	mdp = "sat";

//DefineSchema
var UserSchema = mg.Schema({
	name : String,
	email : String,
	password : String,
	date: {type:Date, default:Date.now}
});

//DefineModel
var mgUser = mg.model('mgUser', UserSchema);

//defineExport obj
m = {
	u : user,
	md : mdp,
	mgU : mgUser
}

//exports
module.exports = m;
