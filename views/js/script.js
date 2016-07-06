var app = angular.module('scalculus', []);
app.controller('sCalCtrl', ['$scope', '$http', 'login','subscribe',($scope, $http, login, subscribe)=>{
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
			$scope.stateSub = ' OK ';
			subscribe.defVar('user', $scope.userName);
			subscribe.defVar('pwd', $scope.userPwd);
			subscribe.sendData();
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
		login.sendServer();
		if($scope.logUser == "Sato" && $scope.logPwd == "pwd"){
			$scope.loginStatus = "true";
		}else{
			$scope.loginStatus = "false";
		}
	}
	var grid = document.getElementById('grid');
	grid.innerHTML = "Hello, i've been catched";
}]);
app.factory('subscribe', ($http)=>{
	var sub = {
		user : null,
		pwd : null,
		defineVar: (data, value)=>{
			if(sub.hasOwnProperty(data)){
				sub[data] = value;
				console.log(sub[data]);
			}
		},
		sendData : ()=>{
			if(sub.user && sub.pwd){
				data = {
					pseudo: sub.user,
					pwd : sub.pwd
				}
				$http.post('/sub', data).then(
						success = (e)=>{
							console.log('User registered', e);
						},
						fail = (e)=>{
							console.log(e.data);
						}
						);
			}
		}
	};
	return {
		defVar : (prop, value)=>{
			sub.defineVar(prop,value);	
		},
		sendData: ()=>{
			sub.sendData();
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
		sendData: ()=>{
			if(login.user && login.pwd){
				//send data to server and wait for response	
				console.log(login.user ,login.pwd);
				data = {
					pseudo : login.user,
					pwd : login.pwd
				}
				$http.post('/login', data).then(
						success = (e)=>{
							console.log(e.data.pseudo, e.data.pwd);		
						},
						fail = (e)=>{
							console.log(e.data);
						}
						);
			}
		}
	};
	return {
		setU :(user)=>{
			login.setUser(user);
		},
		setP :(pwd)=>{
			login.setPwd(pwd);
		},
		sendServer :()=>{
			login.sendData();
		}
	};
});
