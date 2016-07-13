app.factory('login', ($http)=>{
	var login = {
		user : null,
		pwd : null,
		setUser: (user)=>{
			if(user){
				login.user = user;
			}
		},
		setPwd: (pwd)=>{
			if(pwd){
				login.pwd =  pwd;	
			}
		},
	};
	return {
		setU :(user)=>{
			login.setUser(user);
		},
		setP :(pwd)=>{
			login.setPwd(pwd);
		},
		sendServer :()=>{
			return $http.post('/login', {pseudo: login.user, pwd: login.pwd});
		}
	};
});
