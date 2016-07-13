var app = angular.module('scalculus', []);
app.controller('sCalCtrl', ['$scope', '$http', 'login','subscribe', 'cookieManager', 'gridManager',($scope, $http, login, subscribe, cookieManager, gridManager)=>{
	var username = cookieManager.r(0);
	if(username){
		$scope.user_log = username;
		$scope.user_id = cookieManager.r(1);
		gridManager.gen();
		gridManager.create();
	}else{
		$scope.user_log = '';
		$scope.user_id = '';
	}
	$scope.disconnect = function(){
		console.log('pass');
		for(var i = 0; i < cookieManager.array.length; i++){
			cookieManager.d(i);
		}
		$scope.user_log = '';
		$scope.user_id = '';
		gridManager.del();
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
		$scope.loginStatus = '';
		login.sendServer().then((res)=>{
			if(res.data.name){
				$scope.loginStatus = "You are now connected as : "+res.data.name;
				cookieManager.w(0, res.data.name);
				cookieManager.w(1, res.data._id);
				cookieManager.w(3, res.data.date);
				$scope.user_log = res.data.name;	
				$scope.user_id = res.data._id;
				gridManager.gen();
			}else{
				$scope.loginStatus = 'Fail to Authenticate';
			}
		}).finally(()=>{
			$scope.Login_loading = false;	
		});
	}
}]);
