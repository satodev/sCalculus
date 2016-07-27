app.factory('gridManager', ($http)=>{
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
					var result = grid.calculus(current_grid[i]);
					box.setAttribute('data-func', result);
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
		calculus : (string)=>{
			let op = ["+","-","/","*","^","(",")"];
			let str = string.trim();
			let stra = grid.str2array(str);
			let strviable = grid.isViable(stra);
			let res = null;
			if(strviable){
				let strop = grid.getOperators(stra, op);
				let keys = Object.keys(strop);
				if(keys.length > 1){
					let priority = grid.getPriority(strop);
					switch(priority){
						case 1 :
							//parentheses
							//get parenthese content ( ... )
							// if parenthese in parenthese get inner parenthese content
							break;
						case 2 : 
							//expo
							//solve and recursive
							grid.splitSortSolve(str, strop, keys, priority)
							break;
						case 3 : 
							//multi
							break;
						case 4 : 
							//addi sous
							break;
					}
					console.log(priority);
				}
				if(keys.length <= 1){
					res = grid.splitAndSolve(str, strop[keys]);
				}
				console.log(str, strop, res);
			}
		},
		splitSortSolve: (str, strop, keys, prio)=>{
			if(str && strop && keys && prio){
				console.log(str, strop, keys, prio);
				if(prio == 2){
					//get index of exp
					let indexp = strop.indexOf('^');
					let calc = null;
					console.log(indexp, keys);
					strop.map((cu, cin, car)=>{ 
						if(cin == indexp){
						// sStop		
						}
						console.log(cin, car[cin]);
					});
				}
				//split and sort then solve
				strop.map((opcu, opin, opar)=>{
					console.log(opcu, opin, opar);
					var prev = keys[keys.indexOf(opin.toString()) -1];
					var current  = keys[keys.indexOf(opin.toString())];
					var next = keys[keys.indexOf(opin.toString()) +1];
				});
			}
		},
		splitAndSolve : (pattern, operator)=>{
			if(pattern && operator){
				var arr = pattern.split(operator);
				var a1 = parseFloat(arr[0]);
				var a2 = parseFloat(arr[1]);
				var result = null;
				switch(operator){
					case '/' : result = a1 / a2; break;
					case '*' : result = a1 * a2; break;
					case '+' : result = a1 + a2; break;
					case '-' : result = a1 - a2; break;
					case '^' : result = Math.pow(a1, a2); break;
				}
				return result;
			}
		},
		str2array : (str)=>{
			let stra = [];
			for(var i = 0; i < str.length; i++){
				stra.push(str[i]);
			}
			return stra;
		},
		isViable : (stra)=>{
			return stra.some((scu, sin, sarr)=>{
				if(parseFloat(scu) || parseInt(scu)){
					return true;
				}else{
					return false;
				}
			});
		},
		getOperators : (stra, op)=>{
			let strop = [];
			stra.some((stcu, stin, star)=>{
				op.map((op, oi, oar)=>{
					if(stcu == op){
						strop[stin] = op;
					}
				});
			});
			return strop;
		},
		getPriority : (strop)=>{
			let priority = [];
			strop.map((kcu, kin, karr)=>{
				if(kcu == '(' || kcu == ')'){
					priority.push(1);
				}
				if(kcu == '^'){
					priority.push(2);
				}
				if(kcu == '*' || kcu == '/'){
					priority.push(3);
				}
				if(kcu == '+' || kcu == '-'){
					priority.push(4);
				}
			});
			return priority.sort()[0];
		}
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
