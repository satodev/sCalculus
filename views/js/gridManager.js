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
				if(str.indexOf('__') != -1){
					str = str.replace('__', 'e+');
				}
				let keys = Object.keys(strop);
				console.log(str, strop, keys);
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
							grid.splitSortSolve(str, strop, keys, priority);
							break;
						case 3 : 
							//multi
							grid.splitSortSolve(str,strop, keys, priority);
							break;
						case 4 : 
							//addi sous
							grid.splitSortSolve(str,strop, keys, priority);
							break;
					}
				}
				if(keys.length <= 1){
					res = grid.splitAndSolve(str, strop[keys]);
					console.log(res);
				}
				console.log(str, strop, res);
			}
		},
		splitSortSolve: (str, strop, keys, prio)=>{
			if(str && strop && keys && prio){
				let indexp = strop.indexOf('^');
				let indmult= strop.indexOf('*');
				let inddev = strop.indexOf('/');
				let indadd = strop.indexOf('+');
				let indsous = strop.indexOf('-');
				let calc = null;
				strop.map((cu, cin, car)=>{ 
					let prek = keys[keys.indexOf(cin.toString()) -1];
					let cuk = keys[keys.indexOf(cin.toString())];
					let nexk = keys[keys.indexOf(cin.toString()) + 1]
						let min = (prek) ? parseFloat(prek)+1 : 0;
					let max = (nexk) ? nexk : str.length;
					let c =  null;
					console.log(str, strop, keys, prio, prek, cuk, nexk, min, max, indexp, indmult, inddev, indadd, indsous);
					if(cuk == indexp && prio == 2){
						c = str.substring(min, max).split(strop[indexp]);
						c = Math.pow(c[0], c[1]);
						grid.assemble(c, str, min, max);
					}
					if(cuk == indmult && prio == 3){
						c = str.substring(min,max).split('*');
						c1 = parseFloat(c[0]);
						c2 = parseFloat(c[1]);
						console.log(min, max, c1, c2);
						c = c1*c2;
					}
					if(cuk == inddev && prio == 3){
						c = str.substring(min,max).split('/');
						c1 = parseFloat(c[0]);
						c2 = parseFloat(c[1]);
						c = c1/c2
					}
					if(cuk == indadd && prio == 4 ){
						getE = 	(keys[cuk-1] == 'e')? true : false;
						console.log('GETE : '+ getE);
						c = str.substring(min,max).split('+');
						c1 = parseFloat(c[0]);
						c2 = parseFloat(c[1]);
						c = c1+c2;
					}
					if(cuk == indsous && prio == 4){
						c = str.substring(min,max).split('-');
						c1 = parseFloat(c[0]);
						c2 = parseFloat(c[1]);
						c = c1-c2;
					}
					//	console.log(cu, cin,cuk,prek, nexk, c);
					grid.assemble(c, str, min, max);
				});
			}
		},
		assemble : (c, str, min, max)=>{
			if(c && Number.isInteger(c)){
				let start = str.substr(0, min);
				let end = str.substr(max, str.length);
				var res = start.concat(c, end);
				if(res.indexOf('e') != -1){
					console.log('transform e');
					calc = res.replace('e+', '__');	
				}else{
					calc = res;
				}
				console.log('pass', c, start, end , res, calc);
				grid.calculus(calc);
			}else if(c != null && !Number.isNaN(c)){
				console.log("NO PASS ", c);
			}

		},
		splitAndSolve : (pattern, operator)=>{
			if(pattern && operator){
				if(pattern.indexOf('e+') !=  -1){
					pattern = pattern.replace('e+', '__');
					let arr = pattern.split(operator);
					arr[0].replace('__', 'e+');
					arr[1].replace('__', 'e+');
					let a1 = parseFloat(arr[0]);
					let a2 = parseFloat(arr[1]);	
					console.log(pattern, arr, arr[0], arr[1], a1, a2);
					//sStop
				}else{
					var arr = pattern.split(operator);
					var a1 = parseFloat(arr[0]);
					var a2 = parseFloat(arr[1]);
				}
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
				if(kcu == 'e+'){
					priority.push(3);
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
