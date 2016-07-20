app.factory('gridManager', ($http)=>{
	var grid = {
		content: {},
		boxSelect : {},
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
		shortcuts : ()=>{
			document.onkeyup = (e)=>{
				let activeElem = document.activeElement;
				if(activeElem.classList.length == 1 && activeElem.classList[0] == 'box'){
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
		},
		singleBoxSelec: (box, time)=>{
			if(box && time){
				if(grid.boxSelect[box.getAttribute('id')]){
					box.classList += "selected";
					delete grid.boxSelect[box.getAttribute('id')];
				}else{
					box.classList.remove("selected");
					grid.boxSelect[box.getAttribute('id')] = time;	
				}
			}
		},
		multipleBoxSelect : (boxes, times)=>{

		},
		select: ()=>{
			let cont = document.getElementById('sCalculus');
			let select_state = false;
			let acc = [];
			if(cont.classList.length > 0){
				select_state = false;
				cont.classList.remove("select_mode");
			}else{
				select_state = true;
				cont.classList += "select_mode";
			}
			let timestamp = 0;
			cont.onclick = (e)=>{
				if(timestamp == 0){
					timestamp = e.timeStamp;
				}
				if(select_state){
					if(e.target.classList.length == 1 && e.target.classList[0] =="box"){
						console.log('single click');
						grid.singleBoxSelect(e.target, e.timeStamp);
					}
				}else{
					e.stopPropagation();
				}
			}
			cont.onkeydown = (ev)=>{
				cont.onclick = (e)=>{
					if(timestamp == 0){
						timestamp = e.timeStamp;
					}
					if(select_state){
						if(ev.which == 18 && e.target.classList.length == 1 && e.target.classList[0] == 'box'){
							console.log('rangedoubleclick');
						}
//							if(timestamp == e.timeStamp){
//								firstbox = document.getElementById(e.target.getAttribute('id'));
//								console.log('f'+firstbox, timestamp);
//							}
//							if(timestamp != e.timeStamp){
//								secondbox = document.getElementById(e.target.getAttribute('id'));	
//								console.log('s'+secondbox, timestamp);
//								timestamp = 0;	
//							}
					}else{
						e.stopPropagation();
					}
				}
			}
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
		del: ()=>{
			grid.del();
		},
		select : ()=>{
			grid.select();
		}
	}
});
