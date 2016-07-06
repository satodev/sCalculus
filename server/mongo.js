const 	express = require("express"),
	crypto = require("crypto"),
	mg = require("mongoose"),
	user = "sato",
	mdp = "sat",
	schema = mg.Schema({
		name : String,
		password: String,
		date:{type:Date, default:Date.now}
	});
	//defineExport obj
	m = {
		//var
		u : user,
		md : mdp,
		mgU : null,
		pwd : "password!d?45",
		//init 
		initUserSchema : ()=>{
			m.defineUModel();
		},
		//define
		defineUModel: ()=>{
			m.mgU = mg.model("mgUser", schema);	
		},
		//utils
		connect : ()=>{
			mg.connect("mongodb://"+m.u+":"+m.md+"@ds011735.mlab.com:11735/scalculus");
		},
		disconnect: ()=>{
			mg.connection.close();
		},
		insertSub : (user, mdp)=>{
			if(user && mdp){
				m.connect();
				m.mgU.find({name: user}, (err, userFound)=>{
					if(err) console.log(err);
					if(userFound.length > 0){
						console.log("user does already exists, check another one");	
						m.disconnect();
					}else{
						m.mgU.create({name:user, password:m.Hmac(mdp)}, (err,user)=>{
							if(err) console.log(err);
							console.log('user created');
							m.disconnect();
						});
					}
				});
			}
		},
		Hmac : (password)=>{
			return crypto.createHmac('sha256', m.pwd).update(password).digest('hex');
		}
	}

//exports
module.exports = m;
