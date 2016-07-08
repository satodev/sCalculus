var app = angular.module('scalculus', []);
app.controller('sCalCtrl', ['$scope', '$http', 'login','subscribe', 'getCookieUser',($scope, $http, login, subscribe, getCookieUser)=>{
	if(getCookieUser == 0){
		$scope.user_log = '';
	}else{
		$scope.user_log = getCookieUser;	
	}
	$scope.disconnect = function(){
		document.cookie = 'username=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
		$scope.user_log = '';
	}
	$scope.passwordConfirm = function(){
		if($scope.userPwd && $scope.userPwd.length > 3){
			$scope.stateSub = 'Correct Password Format';
			$scope.passConf = true;
		}else{
			$scope.stateSub = ' Password not long enough';
			$scope.passConf = false;
		}
	}
	$scope.subscribe = function(){
		if($scope.userName && $scope.userPwd == $scope.vuserPwd){
			subscribe.defVar('user', $scope.userName);
			subscribe.defVar('pwd', $scope.userPwd);
			$scope.register_loading = true;
			subscribe.postSub('seekUser').then((fullfill)=>{
				if(fullfill.data == 'user'){
					$scope.stateSub = 'User already Exists';
					$scope.register_loading = false;
				}
				if(fullfill.data == 'nuser'){
					subscribe.postSub('insertUser').then((success)=>{
						$scope.stateSub = 'User Created';
					}, (fail)=>{
						$scope.stateSub = 'Fail to Create User';
					}).finally(()=>{
						$scope.register_loading = false;	
					});
				}
			}, (failure)=>{
				$scope.stateSub = 'Fail to Connect to Db';
			});
			$scope.userName = "";
			$scope.userPwd = "";
			$scope.vuserPwd = "";
		}else{
			$scope.stateSub = 'Enter the same password or enter userName';
		}
	}
	$scope.login = function(){
		login.setU($scope.logUser);
		login.setP($scope.logPwd);
		$scope.Login_loading = true;
		login.sendServer().then((res)=>{
			if(res.data.name){
				$scope.loginStatus = "You are now connected as : "+res.data.name;
				var d = new Date();
				d.setTime(d.getTime()+(10*24*60*60*1000));
				document.cookie= 'username='+res.data.name+'; expires='+ d.toUTCString();
				$scope.user_log = res.data.name;	
			}else{
				$scope.loginStatus = 'Fail to Authenticate';
			}
		}).finally(()=>{
			$scope.Login_loading = false;	
		});
	}
	var grid = document.getElementById('grid');
	grid.innerHTML = "Hello, i've been catched";
}]);
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
app.factory('getCookieUser', ()=>{
	var x = document.cookie;
	var un = x.substr(x.trim().search('username')).split('=');
	if(un[1]){
		return un[1];
	}else{
		return 0
	}
});
