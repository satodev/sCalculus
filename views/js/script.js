var app = angular.module('scalculus', []);
app.controller('sCalCtrl', ['$scope', '$http',($scope, $http)=>{
	$scope.subscribe = function(){
		console.log($scope.userName, $scope.userPwd, $scope.vuserPwd);
	}
	$scope.login = function(){
		if($scope.logUser == "Sato" && $scope.logPwd == "pwd"){
			$scope.loginStatus = "true";
		}else{
			$scope.loginStatus = "false";
		}
	}
	var grid = document.getElementById('grid');
	grid.innerHTML = "Hello, i've been catched";
}]);
