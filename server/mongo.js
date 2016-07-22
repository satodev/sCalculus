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
	gridSchema = mg.Schema({
		id_user: String,
		box: {},
	});
	var db = mg.connection;
	db.on('error', (err)=>{
		mg.disconnect();
	});
	//defineExport obj
	m = {
		//var
		u : user,
		md : mdp,
		mgU : null,
		mgG : null,
		pwd : "password!d?45",
		query : null,
		//init 
		initUserSchema : ()=>{
			m.defineUModel();
		},
		initGridSchema : ()=>{
			m.defineGModel();
		},
		//define
		defineUModel: ()=>{
			m.mgU = mg.model("mgUser", schema);	
		},
		defineGModel: ()=>{
			m.mgG = mg.model("mgGrid", gridSchema);	
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
						m.disconnect();
					}else{
						m.mgU.create({name:user, password:m.Hmac(mdp)}, (err,user)=>{
							if(err) console.log(err);
							m.disconnect();
						});
					}
				});
			}
		},
		qfindUser : (user)=>{
			if(user){
				m.query = m.mgU.find({name:user});
			}
		},
		qinsertUser: (user, mdp)=>{
			if(user && mdp){
				m.query = new m.mgU({name:user, password:m.Hmac(mdp)});
			}
		},
		login : (user, pwd)=>{
			if(user, pwd){
				m.query = m.mgU.findOne({name: user, password: m.Hmac(pwd)});
			}
		},
		Hmac : (password)=>{
			return crypto.createHmac('sha256', m.pwd).update(password).digest('hex');
		},
		qLoadGrid : (id_u)=>{
			if(id_u){
				//query find grid with id
				m.query = m.mgG.find({id_user : id_u});
			}
		},
		qFindGrid : (id_u)=>{
			if(id_u){
				m.query = m.mgG.find({id_user: id_u});
			}
		},
		qUpdateGrid : (id_u, coor)=>{
			if(id_u, coor){
				var query = {id_user : id_u};
				m.query = m.mgG.update(query, {box: coor});
			}
		},
		qSaveGrid : (id_u, coor)=>{
			if(coor){
				//insert grid 	
				m.query = new m.mgG({id_user: id_u, box: coor});
			}
		}
	}

//exports
module.exports = m;
