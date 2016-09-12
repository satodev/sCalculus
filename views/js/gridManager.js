app.factory('gridManager', ($http, scalc, coord)=>{
	var grid = {
		cont : document.getElementById('sCalculus'),
		content: {},
		select_state : false,
		boxSelect : [],
		activeElem : null,
		build : (data)=>{
			if(data){
				let current_grid = data.data[0].box;
				for(let i in current_grid){
					let box = document.getElementById(i);
					let res = scalc.init({str : current_grid[i], box : i});
					//console.log(scalc.ares);
					let current_box_res;
					scalc.ares.map((cu)=>{if(cu.box == i){current_box_res = cu}});
					//console.log(current_box_res);
					box.setAttribute('data-res', current_box_res.res);
					box.setAttribute('data-func', current_grid[i]);
					box.innerHTML = current_grid[i];
					box.value = current_grid[i];
				}
			}
		},
		create : ()=>{
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
		setActiveElem : ()=>{
			if(document.activeElement.getAttribute('disabled') == null && document.activeElement.classList[0] == 'box'){
				grid.activeElem = document.activeElement;	
			}else{
				var oneone = document.getElementById('1:1');
				oneone.focus();
			}
		},
		mleft : ()=>{
			grid.setActiveElem();
			if(grid.activeElem != 0){
				let current_pos = grid.activeElem.getAttribute('id');
				let arr = current_pos.split(':');
				if(arr[0] > 1 && arr[0] <= 25){
					arr[0] --;
					grid.mfocus(arr[0], arr[1]);		
				}
			}
		},
		mup : ()=>{
			grid.setActiveElem();
			if(grid.activeElem != 0){
				let current_pos = grid.activeElem.getAttribute('id');
				let arr = current_pos.split(':');
				if(arr[1] > 1 && arr[1] <= 9){
					arr[1]--;
					grid.mfocus(arr[0], arr[1]);
				}
			}
		},
		mright: ()=>{
			grid.setActiveElem();
			if(grid.activeElem != 0){
				let current_pos = grid.activeElem.getAttribute('id');
				let arr = current_pos.split(':');
				if(arr[0] >=1 && arr[0] < 25){
					arr[0]++
					grid.mfocus(arr[0], arr[1]);
				}
			}
		},
		mdown : ()=>{
			grid.setActiveElem();
			if(grid.activeElem != 0){
				let current_pos = grid.activeElem.getAttribute('id');
				let arr = current_pos.split(':');
				if(arr[1] >= 1 && arr[1] < 9){
					arr[1]++;
					grid.mfocus(arr[0], arr[1]);
				}
			}
		},
		mfocus : (posx, posy)=>{
			let newElem = document.getElementById(posx+':'+posy);
			newElem.focus();
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
			let boxes = grid.cont.getElementsByClassName('box');
			for(var i = 0 ; i < boxes.length; i++){
				if(boxes[i].getAttribute('disabled') == null && boxes[i].value.length > 0){
					boxes[i].innerHTML = '';
					boxes[i].value = '';
				}
			}
		},
		singleBoxSelect: ()=>{
			if(grid.select_state){
				let box = document.activeElement;
				if(box.classList.contains('selected')){
					box.classList.remove("selected");
				}else{
					box.classList += " selected";
				}
			}
		},
		toggleSelectState : ()=>{
			grid.select_state ? grid.select_state = false : grid.select_state = true;
		},
	}
	return {
		cont : grid.cont,
		create : ()=>{ grid.create(); },
		state : ()=>{ return grid.select_state},
		getContent :()=>{ grid.defineGridContent(); },
		build : (data)=>{ grid.build(data); },
		save : (uid)=>{ return $http.post('/grid', {method:'save', id_user : uid, content: grid.content}); },
		gen :(uid)=>{ return $http.post('/grid', {method:'load', id_user: uid}); }, 
		del: ()=>{ grid.del(); },
		toggleSelectState : ()=>{ grid.toggleSelectState(); },
		selectSingleBox : ()=>{ grid.singleBoxSelect();},
		mleft : ()=>{ grid.mleft(); },
		mup : ()=>{ grid.mup(); },
		mright : ()=>{ grid.mright(); },
		mdown : ()=>{ grid.mdown(); }
	}
});
