var app = angular.module('scalculus', []);
app.controller('sCalCtrl', ['$scope', '$http', 'login','subscribe', 'cookieManager', 'gridManager',($scope, $http, login, subscribe, cookieManager, gridManager)=>{
	$scope.select_state = false;
	gridManager.create();
	document.onreadystatechange = function(){
		if(document.readyState == "complete"){
			var username = cookieManager.r(0);
			if(username){
				$scope.user_log = username;
				$scope.user_id = cookieManager.r(1);
				$scope.grid_alert = 'loading';
				gridManager.gen($scope.user_id).then((grids)=>{
					if(grids){
						gridManager.build(grids);
						$scope.grid_alert = "ok";
					}else{
						$scope.grid_alert = "problem while loading";
					}
				});
			}else{
				$scope.user_log = '';
				$scope.user_id = '';
			}
		}
	}
	//scope functions
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
						//for futur theoretical multi tabs sheets
						//	for(let i in current_grid){
						//		console.log(current_grid[i], i);						
						//	}
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
				if(data.status == 200){
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
				//for(let i in current_grid){
				//		console.log(current_grid[i], i);						
				//	}
			}
		}).finally(()=>{
			$scope.grid_alert = 'ok';	
		});
	}
	$scope.gridClicked = function($event){
		//current_coor
		let ae = document.activeElement;
		let fnc = document.getElementById('fnc');
		if(ae.getAttribute('disabled') == null && ae.classList.contains('box')){
			$scope.current_coor = ae.getAttribute('id');
			$scope.current_coor_value = $event.target.value;
			fnc.value = $scope.current_coor_value;
		}
	}
	$scope.gridKeyUp = function($event){
		$scope.shortcuts($event);
		if(document.activeElement.getAttribute('disabled') && document.activeElement.classList.contains('box')){
			console.log('pass ', document.activeElement);
			$scope.current_coor = document.activeElement;
		}
		if($scope.current_coor){
			let fnc = document.getElementById('fnc');
			$scope.current_coor_value = $event.target.value;
			fnc.value = $scope.current_coor_value;
		}
	}
	$scope.gridGetBoxValue = function(){
		if($scope.current_coor){
			let box = document.getElementById($scope.current_coor);
			box.onkeyup = function(e){
				$scope.current_coor_value = box.value;	
			}
		}
	}
	$scope.gridSelect = function(){
		gridManager.toggleSelectState();
		$scope.select_state = gridManager.state();
		let select_btn = document.getElementById('select_btn');
		let box = document.getElementsByClassName('box');
		let array = [];
		if($scope.select_state){
			gridManager.cont.onclick = (e)=>{
				if(e.target.getAttribute('disabled') == null && e.target.classList.contains('box')){
					gridManager.selectSingleBox();
				}
			}
			select_btn.classList += " btn_active";
		}else{
			for(var i = 0; i < box.length; i++){
				if(box[i].getAttribute('disabled') == null && box[i].classList.contains('selected')){
					array.push(box[i].getAttribute('id'));
					box[i].classList.remove('selected');
				}
			}
			$scope.coord = array;
			select_btn.classList.remove("btn_active");
		}
	}
	$scope.gridSelectPaste = function(){
		let current_box = document.getElementById($scope.current_coor);
		let coords = $scope.coord;
		if(current_box.getAttribute('disabled') == null && current_box.classList.contains('box')){
			current_box.innerHTML += coords;
		}
	}
	$scope.fncGetContent = function(){
		if($scope.current_coor){
			let fnc = document.getElementById('fnc');
			let box_value = document.getElementById($scope.current_coor).value;
			fnc.value = box_value;
			$scope.current_coor_value = box_value;
		}
	}
	$scope.fncSetContent = function($event){
			let box = document.getElementById($scope.current_coor);
			$scope.current_coor_value = $event.target.value;
			box.value = $scope.current_coor_value;
			box.innerHTML = $scope.current_coor_value;

			if($event.which == 70 && $event.isTrusted && $event.ctrlKey && $event.altKey){
				box.focus();
			}
	}
	$scope.shortcuts = function($event){
		if($event.which == 83 && $event.isTrusted && $event.altKey){
			$scope.gridSelect();
		}
		if($event.which == 37 && $event.isTrusted && $event.ctrlKey && $event.altKey){
			gridManager.mleft();
		}
		if($event.which == 38 && $event.isTrusted && $event.ctrlKey && $event.altKey){
			gridManager.mup();	
		}
		if($event.which == 39 && $event.isTrusted && $event.ctrlKey && $event.altKey){
			gridManager.mright();
		}
		if($event.which == 40 && $event.isTrusted && $event.ctrlKey && $event.altKey){
			gridManager.mdown();
		}
		if($event.which == 32 && $event.isTrusted && $event.ctrlKey && $event.altKey){
			gridManager.selectSingleBox();	
		}
		if($event.which == 86 && $event.isTrusted && $event.ctrlKey && $event.altKey){
			$scope.gridSelectPaste();	
		}
		if($event.which ==  70 && $event.isTrusted && $event.ctrlKey && $event.altKey){
			let fnc = document.getElementById('fnc');
			if(document.activeElement != fnc && $scope.current_coor){
				fnc.focus();
			}
		}
		if($event.which == 83 && $event.isTrusted && $event.ctrlKey && $event.shiftKey){
			$scope.gridSave();			
		}
		if($event.which == 82 && $event.isTrusted && $event.ctrlKey && $event.altKey){
			$scope.gridLoad();
		}
	}
}]);
