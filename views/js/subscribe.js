app.factory('subscribe', ($http)=>{
	var sub = {
		user : null,
		pwd : null,
		method : null,
		defineVar: (data, value)=>{
			if(sub.hasOwnProperty(data)){
				sub[data] = value;
			}
		}
	};
	return {
		defVar : (prop, value)=>{
			sub.defineVar(prop,value);	
		},
		postSub : (type)=>{
			sub.defineVar('method', type);
			return $http.post('/sub', {method: sub.method, pseudo: sub.user, pwd:sub.pwd}); 
		}
	}
});
