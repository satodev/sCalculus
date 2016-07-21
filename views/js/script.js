var app = angular.module('scalculus', []);
app.controller('sCalCtrl', ['$scope', '$http', 'login','subscribe', 'cookieManager', 'gridManager',($scope, $http, login, subscribe, cookieManager, gridManager)=>{
	var username = cookieManager.r(0);
	if(username){
		$scope.user_log = username;
		$scope.user_id = cookieManager.r(1);
		gridManager.del();
		gridManager.create();
		$scope.grid_alert = 'loading';
		gridManager.gen($scope.user_id).then((grids)=>{
			if(grids){
				gridManager.build(grids);
			}
		}).finally(()=>{
			$scope.grid_alert = 'ok';	
		});
	}else{
		$scope.user_log = '';
		$scope.user_id = '';
	}
	$scope.disconnect = function(){
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
				gridManager.del();
				gridManager.create();
				gridManager.gen($scope.user_id).then((grids)=>{
					if(grids){
						gridManager.build(grids);
						let current_grid = grids.data[0].box;
						for(let i in current_grid){
							console.log(current_grid[i], i);						
						}
					}
				}).finally(()=>{
					$scope.grid_alert = 'ok';	
				});
			}else{
				$scope.loginStatus = 'Fail to Authenticate';
			}
		}).finally(()=>{
			$scope.Login_loading = false;	
		});
	}
	$scope.gridSave = function(){
		gridManager.getContent();
		if($scope.user_id){
			$scope.grid_alert = 'Saving';
			gridManager.save($scope.user_id).then((data)=>{
				if(data.length > 0 && data.status == 200){
					$scope.grid_alert='Saved';
				}else{
					$scope.grid_alert="Problem while saving, try again";
				}
			});
		}else{
			console.log('not able to save that grid');
		}
	}
	$scope.gridLoad = function(){
		$scope.grid_alert = 'loading';
		gridManager.gen($scope.user_id).then((grids)=>{
			if(grids){
				gridManager.build(grids);
				let current_grid = grids.data[0].box;
				for(let i in current_grid){
					console.log(current_grid[i], i);						
				}
			}
		}).finally(()=>{
			$scope.grid_alert = 'ok';	
		});
	}
	$scope.getCoor = function($event){
		$scope.coord = $event.toElement.getAttribute('id');
	}
	$scope.gridSelect = function(){
//		gridManager.select();		
	}
}]);
