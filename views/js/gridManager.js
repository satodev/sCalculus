app.factory('gridManager', ($http)=>{
	var grid = {
		cont : document.getElementById('sCalculus'),
		content: {},
		selectState : false,
		boxSelect : [],
		build : (data)=>{
			if(data){
				let current_grid = data.data[0].box;
				for(let i in current_grid){
					let box = document.getElementById(i);
					box.innerHTML = current_grid[i];
				}
			}
		},
		create : ()=>{
			grid.shortcuts();
			let container = grid.cont;
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
		shortcuts : ()=>{
			document.onkeyup = (e)=>{
				let activeElem = document.activeElement;
				if(activeElem.getAttribute('disabled') == null && activeElem.classList[0] == 'box'){
					current_pos = activeElem.getAttribute('id');
					let arr = current_pos.split(':');
					if(e.which == 37 && e.isTrusted && e.ctrlKey && e.altKey){ //ctrl alt left
						if(arr[0] > 1 && arr[0] <= 25){
							arr[0]--;
						}
					}
					if(e.which == 38 && e.isTrusted && e.ctrlKey && e.altKey){ //ctrl alt top
						if(arr[1] > 1 && arr[1] <= 9){
							arr[1]--;
						}
					}
					if(e.which == 39 && e.isTrusted && e.ctrlKey && e.altKey){ //ctrl alt right
						if(arr[0] >=1 && arr[0] < 25){
							arr[0]++
						}
					}
					if(e.which == 40 && e.isTrusted && e.ctrlKey && e.altKey){ //ctrl alt bottom
						if(arr[1] >= 1 && arr[1] < 25){
							arr[1]++;
						}
					}
					var newElem = document.getElementById(arr[0]+':'+arr[1]);
					newElem.focus();
				}
				if(e.which == 83 && e.isTrusted && e.altKey){
					grid.select();
				}
			}
		},
		defineGridContent: ()=>{
			grid.content = {};
			let container = grid.cont;
			for(var i = 0; i < container.childNodes.length; i++){
				if(container.childNodes[i].classList.length == 1 
						&& container.childNodes[i].classList[0] == 'box' 
						&& container.childNodes[i].value != ''){
					grid.content[container.childNodes[i].getAttribute('id')] = container.childNodes[i].value;
				}
			}
		},
		del : ()=>{
			let cont = grid.cont;
			cont.innerHTML = '';	
			console.log('Delete Grid');
		},
		singleBoxSelect: (box)=>{
			if(box){
				if(grid.boxSelect.indexOf(box.getAttribute('id')) != -1){
					box.classList.remove("selected");
					grid.boxSelect.splice(grid.boxSelect.indexOf(box.getAttribute('id')),1);
				}else{
					box.classList += " selected";
					grid.boxSelect.push(box.getAttribute('id'));
				}
			}
		},
		selectStateManage: ()=>{
			let select_state = grid.selectState;
			let cont = grid.cont;
			if(cont.classList.length > 0){
				select_state = false;
				cont.classList.remove("select_mode");
			}else{
				select_state = true;
				cont.classList += "select_mode";
			}
			grid.selectState = select_state;
		},
		getCoor : ()=>{
			if(grid.boxSelect.length != 0){
				return grid.boxSelect;
			}
		},
		cleanSelect: ()=>{
			let cont = grid.cont.childNodes;
			for(var i = 0; i < cont.length; i++){
				if(cont[i].getAttribute('disabled') == null && cont[i].classList.length >=2){
					cont[i].classList.remove('selected');
					grid.boxSelect = [];
				}
			}
		},
		select: ()=>{
			let cont = grid.cont;
			let select_state = grid.selectStateManage();
			if(!select_state){
				grid.cleanSelect();
			}
			cont.onclick = (e)=>{
				if(select_state){
					if(e.target.getAttribute('disabled') == null && e.target.classList[0] =="box"){
						grid.singleBoxSelect(e.target);
					}
				}
			}
			var ac = document.activeElement;
			var box = document.getElementsByClassName('box');
			for(var i = 0 ; i < box.length; i++){
				if(box[i].getAttribute('disabled') == null){
					box[i].onkeyup = (e)=>{
						if(e.ctrlKey && e.which == 32 && e.isTrusted){
							grid.singleBoxSelect(e.target);
						}
					}
				}
			}
		},
		toggleSelectButton: ()=>{
			state = grid.selectState;
			if(state)? grid.selectState = false : grid.selectState = true;
		}
	}
	return {
		create : ()=>{grid.create();},
		state : ()=>{
			return grid.selectStateManage();
		},
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
		del: ()=>{
			grid.del();
		},
		toggleSelectButton : ()=>{
			grid.toggleSelectButton();
		},
		selection : ()=>{
			grid.select();
		},
		getCoor : ()=>{
			return grid.getCoor();
		}
	}
});
