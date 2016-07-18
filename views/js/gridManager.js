app.factory('gridManager', ($http)=>{
	var grid = {
		content: {},
		build : (data)=>{
			if(data){
				let current_grid = data.data[0].box;
				for(let i in current_grid){
					let box = document.getElementById(i);
					box.innerHTML = current_grid[i];
					console.log(current_grid[i], i);						
				}
			}
		},
		create : ()=>{
			let container = document.getElementById('sCalculus');
			for(var i = 0; i < 10; i++){
				for(var j = 0; j < 26; j++){
					if(i == 0 && j == 0){
						container.innerHTML += '<textarea class="box display disable reduce" id="'+i+'" disabled>x:y</textarea>';		
					}else if(j == 0){
						container.innerHTML += '<textarea class="box display disable reduce" id="'+i+'" disabled>'+i+'</textarea>';
					}else if(i == 0){
						container.innerHTML += '<textarea class="box display disable" id="'+i+'" disabled>'+j+'</textarea>';		
					}else{
						container.innerHTML += '<textarea class="box" id="'+j+':'+i+'" ng-model="'+j+':'+i+'"></textarea>';
					}
				}
				container.innerHTML += '<br />';
			}
		},
		defineGridContent: ()=>{
			grid.content = {};
			let container = document.getElementById('sCalculus');
			for(var i = 0; i < container.childNodes.length; i++){
				if(container.childNodes[i].classList.length == 1 
				&& container.childNodes[i].classList[0] == 'box' 
				&& container.childNodes[i].value != ''){
					grid.content[container.childNodes[i].getAttribute('id')] = container.childNodes[i].value;
				}
			}
		},
		del : ()=>{
			let cont = document.getElementById('sCalculus');
			cont.innerHTML = '';	
			console.log('Delete Grid');
		}
	}
	return {
		create : ()=>{grid.create();},
		getContent :()=>{
			grid.defineGridContent();
		},
		build : (data)=>{
			grid.build(data);
		},
		save : (uid)=>{
			return $http.post('/grid', {method:'save', id_user : uid, content: grid.content});
		},
		gen :(uid)=>{
			return $http.post('/grid', {method:'load', id_user: uid});
		}, 
		del: ()=>{grid.del()}
	}
});
