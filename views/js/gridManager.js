app.factory('gridManager', ($http)=>{
	var grid = {
		cont : document.getElementById('sCalculus'),
		content: {},
		select_state : false,
		boxSelect : [],
		activeElem : null,
		res_calculus : null,
		build : (data)=>{
			if(data){
				let current_grid = data.data[0].box;
				for(let i in current_grid){
					let box = document.getElementById(i);
					grid.calc(current_grid[i]);
					//grid.calculus(current_grid[i]);
					box.setAttribute('data-func', grid.res_calculus);
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
				if(keys.length <= 1){
					res = grid.splitAndSolve(str, strop[keys]);
					grid.res_calculus = res;
					console.log(res);
				}
				console.log(str, strop, keys);
				if(keys.length > 1 && res == null){
					let priority = grid.getPriority(strop);
					switch(priority){
						case 1 :
							//parentheses
							//get parenthese content ( ... )
							// if parenthese in parenthese get inner parenthese content
							grid.splitToGroup(str, strop, keys, priority);
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
			}else{
				grid.res_calculus = null;
			}
		},
		splitSortSolve: (str, strop, keys, prio)=>{
			if(str && strop && keys && prio){
				console.log(str, strop, keys, prio);
				let indexp = strop.indexOf('^');
				let indmult= strop.indexOf('*');
				let inddev = strop.indexOf('/');
				let indadd = strop.indexOf('+');
				let indsous = strop.indexOf('-');
				let calc = null;
				strop.map((cu, cin, car)=>{ 
					console.log(cu, cin, car);
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
						grid.assemble(c, str, keys, min, max);
					}
					if(cuk == indmult && prio == 3){
						c = str.substring(min,max).split('*');
						c1 = parseFloat(c[0]);
						c2 = parseFloat(c[1]);
						console.log(min, max, c1, c2);
						c = c1*c2;
						grid.assemble(c, str, keys, min, max);
					}
					if(cuk == inddev && prio == 3){
						c = str.substring(min,max).split('/');
						c1 = parseFloat(c[0]);
						c2 = parseFloat(c[1]);
						c = c1/c2
						grid.assemble(c, str, keys, min, max);
					}
					if(cuk == indadd && prio == 4 ){
						c = str.substring(min,max).split('+');
						c1 = parseFloat(c[0]);
						c2 = parseFloat(c[1]);
						c = c1+c2;
						grid.assemble(c, str, keys, min, max);
					}
					if(cuk == indsous && prio == 4){
						c = str.substring(min,max).split('-');
						c1 = parseFloat(c[0]);
						c2 = parseFloat(c[1]);
						c = c1-c2;
						grid.assemble(c, str, keys, min, max);
					}
					//	console.log(cu, cin,cuk,prek, nexk, c);
				});
			}
		},
		assemble : (c, str, keys, min, max)=>{
			let start = str.substr(0, min);
			let end = str.substr(max, str.length);
			let res = start.concat(c, end);
			if(c && Number.isInteger(c)){
				if(res.indexOf('e') != -1){
					calc = res.replace('e+', '__');	
				}else{
					calc = res;
				}
				console.log('pass', c, start, end , res, calc);
				grid.calculus(calc);
			}else if(c != null && !Number.isNaN(c)){
				grid.calculus(res);
			}else{
				console.log('NO PASS');
			}
		},
		splitAndSolve : (pattern, operator)=>{
			if(pattern && operator){
				let arr, a1, a2, result  = null;
				if(pattern.indexOf('e+') !=  -1){
					pattern = pattern.replace('e+', '__');
					arr = pattern.split(operator);
					arr[0] = (arr[0].indexOf('__') != -1) ? arr[0].replace('__', 'e+') : arr[0];
					arr[1] = (arr[1].indexOf('__') != -1) ? arr[1].replace('__', 'e+') : arr[1];
					a1 = parseFloat(arr[0]);
					a2 = parseFloat(arr[1]);	
				}else{
					arr = pattern.split(operator);
					a1 = parseFloat(arr[0]);
					a2 = parseFloat(arr[1]);
				}
				console.log(pattern, operator, arr, arr[0], arr[1], a1, a2, a1 + a2);
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
		},
		calc :(str)=>{
			var obj = {
				str : null, 
				par: [],
				symb:[],
				calc : null,
				setStr : (str)=>{
					obj.str = str.trim();
				},
				defineProperties:()=>{
					operator = ['*', '/', '+', '-', '%', '^'];
					p = ['(',')'];
					for(var i = 0; i< obj.str.length; i++){
						if(Number.isNaN(Number.parseFloat(obj.str[i]))){  
							if(operator.indexOf(obj.str[i]) != -1){
								obj.symb.push({index:i, symbol: obj.str[i]});
							}
							if(p.indexOf(obj.str[i]) != -1){
								obj.par.push({index: i, symbol : obj.str[i]});
							}
						}
					}
				},
				parseStr:(str)=>{
					str = (str) ? str : obj.str;
					if(obj.par.length >= 1){
						obj.par.map((cu, ci, carr)=>{
							var prev = (carr[ci -1]) ? carr[ci-1]["index"] : 0;
							var next = (carr[ci + 1]) ? carr[ci + 1] : str.length;	
							if(cu['symbol'] == "(" && next["symbol"] == ")"){
								console.log('create group between : '+ cu['index'] + ":" + next["index"]);	
								obj.createGroup(cu["index"],next["index"]);
							}
							console.log(obj.str, cu["index"], ci, carr, prev, next);
						});
					}
					if(obj.symb.length >= 1){
						obj.symb.map((cu,ci,carr)=>{
							console.log(obj.str, cu, ci ,carr);
						});	
					}		
				},
				createGroup: (start, end)=>{
					let s = obj.str[start];
					let e = obj.str[end];
					let op = [];
					let res = "";
					console.log(start, end, s, e);
					obj.symb.map((cu, ci, carr)=>{
						//console.log(cu, ci, carr, cu["index"]);
						if(cu["index"] < end && cu["index"] > start){
							console.log(cu["index"]);
							op.push(cu);	
						}
					});
					str = obj.str.substring(start+1, end);
					//console.log(op, op[0]['index'], op[0]['symbol'], op.length);
					if(op.length <= 1){
						res = obj.solvePattern(start+1, end, op[0]);
						let prePartialString = obj.str.substring(start, end+1);
						let str = obj.str.replace(prePartialString, res);
						//recursive here
						// obj.parseStr(str);
						//sStop
						console.log(res, start+1, end , op[0], prePartialString);
					}
				},
				solvePattern : (start, end, op)=>{
					console.log(start, end, op);
					let str = "";
					let res = 0;
					str = obj.str.substring(start, end);
					str = str.split(op['symbol']);
					console.log(str);
					let a1 = parseFloat(str[0]);
					let a2 = parseFloat(str[1]);
					switch(op['symbol']){
						case '*' :
							res = a1 * a2;
						break;
						case '/' : 
							res = a1 / a2;
						break;
						case '+':
							res = a1 + a2;
						break;
						case '-':	
							res = a1 - a2;
						break;
						case '%':
							res = a1 % a2;
						break;
						case '^':
							res = Math.pow(a1, a2);
						break;
							
					}
					console.log(a1,op['symbol'], a2, '=', res);
					return res;
				}
			}	
			obj.setStr(str);
			obj.defineProperties();
			obj.parseStr();
			//console.log(obj.str, obj.symb, obj.par);
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
