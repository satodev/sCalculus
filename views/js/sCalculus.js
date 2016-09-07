app.factory('scalc', ()=>{
	scalc = {
		ops : [],
		array_op : [],
		prio : [],
		nums : [],
		ares : [],
		error : "",
		auth_ops : ["^", "*", "/", "%", "+", "-"],
		strtoArray : ()=>{
			let array = [];
			for(var i = 0 ; i < scalc.op.length ;i++){
				array.push(scalc.op[i]);	
			}
			scalc.array_op = array;
		},
		catchCurrentOp : (op)=>{
			scalc.op = op;	
		},
		init : (op)=>{
			(op)? scalc.catchCurrentOp(op) : null;
			console.log(op);
			let res = (op.status == 200) ? scalc.multipleOp(scalc.op) : (op.str.length > 0) ? scalc.singleOp(scalc.op) : null;
			return res;
		},
		multipleOp : (op)=>{
			for(let i in op.data[0].box){
				if(scalc.isValid(op.data[0].box[i], i)){
					scalc.initCalculate(op.data[0].box[i]);
				}	
			}
			return scalc.ares;
		},
		singleOp : (op)=>{
			let eq = op.str;
			let box = op.box;
			if(scalc.isValid(eq, box)){
				let res = scalc.initCalculate(eq);
				return res;
			}
		},
		initCalculate : (str)=>{
			scalc.op = (str) ?str :scalc.op;
			let res = null;
			let ops = scalc.detectOps(); //op | pos | pri
			let num = scalc.detectNumber();
			let gprth = scalc.detectAndGroupPrth();
			if(gprth.length > 0){
				let group = scalc.isolateGroupPrth(gprth); // return t[1,2,3] + index
				let prio_group = scalc.isolateOperation(group, gprth);
				let final_res = scalc.resolve(prio_group); //i : str_op_prio, r: res_str 
				console.log(final_res);
				res = final_res;
			}else if(ops.length > 0){
				let g = scalc.isolateGroup();
				res = scalc.resolve(g);
				console.log(res);
			}
			let res_ops = scalc.detectOps(res);
			if(res_ops.length != 0){ 
				console.log("recurse");
				scalc.initCalculate(res);
			}else{ 
				console.log("final res");
				scalc.ares.push(res);
				return true;
			}
		},
		resolve : (prio_group)=>{
			let eq = prio_group.obj[1];
			let op = prio_group.op["op"];
			let sp = eq.split(op);
			let sp1 = Number.parseFloat(sp[0]);
			let sp2 = Number.parseFloat(sp[1]);
			let res = null;
			switch(op){
				case "^" : 
					res = Math.pow(sp1, sp2);
					break;
				case "*" : 
					res = sp1*sp2;
					break;
				case "/" :
					res = sp1/sp2;
					break;
				case "%" :
					res = sp1%sp2;
					break;
				case "+" : 
					res = eval(eq);
					break;
				case "-" : 
					res = eval(eq);
					break;
			}
			//error handler
			let fres = [prio_group.obj[0] +""+ res, prio_group.obj[2]];
			return fres.join("");
		},
		isolateGroup : ()=>{
			console.log(scalc.op, scalc.detectOps(scalc.op));
			let i_ops = scalc.detectOps(scalc.op);
			let prio_ops = scalc.detectOps(scalc.op).sort((a,b)=>{return a.pri - b.pri});
			let po, o, no, spo, so, sno;
			for(var i = 0; i < i_ops.length; i++){
				if(prio_ops[0]["pos"] == i_ops[i]["pos"]){
					po = (i_ops[i-1])? i_ops[i-1] : "";
					o = i_ops[i];
					no = (i_ops[i+1])? i_ops[i+1] : "";
					break;
				}
			}
			spo = (po["pos"] > 0) ? scalc.op.substring(0, po["pos"]+1) : "";
			so = scalc.op.substring(po["pos"]+1, no["pos"]);
			sno = (no["pos"] > 0) ? scalc.op.substring(no["pos"], scalc.op.length): "";
			console.log(spo, so, sno);
			return {obj : [spo, so, sno], op: o}
		},
		isolateOperation: (group, gprth)=>{
			let g1 = group[0];
			let g2 = group[1];// subdevide into 3 group with the actual operation on index 1
			let g3 = group[2];
			let prio =[];
			let res_obj;
			console.log(g2, typeof g2);
			let sg2op = scalc.detectOps(g2).sort((a,b)=>{return a.pri - b.pri})[0];
			let g2op = scalc.detectOps(g2);
			let pop, op, nop;
			for(var i = 0; i < g2op.length; i++){
				if(g2op[i].pos == sg2op.pos){
					pop = (g2op[i-1]) ? g2op[i-1] : 0;
					op = g2op[i];
					nop = (g2op[i+1]) ? g2op[i+1] : g2.length;
					break;
				}
			}
			let p = pop;
			let pp = pop["pos"];
			let n = nop;
			let np = nop["pos"];
			if(g2op.length > 1){
				let p1 = (p && pp > 0) ? scalc.ss(g2, 0, pp+1) : (!p && g2op.length > 1) ? scalc.ss(g2, 0, 1) : (!p && g2op.length == 1) ? "" : console.log("p1 problem");
				//console.log(p1, pp, g2, g2op);
				let p2 = (p && pp>0 && n && np>0)? scalc.ss(g2, pp+1, np):(p && pp>0 && n.length != 0)? scalc.ss(g2, pp+1, g2.length-1):(!p && n && np>0)? scalc.ss(g2, 1, np):(!p && !n)? scalc.ss(g2, 1, g2.length-1) : console.log(p, pp, n, np);
				console.log(pop["pos"], nop["pos"]);
				console.log(n ,np, g2);
				let p3 = (n && np < g2.length) ? scalc.ss(g2, np, g2.length) : (n && !np ) ? scalc.ss(g2, g2.length-1, g2.length): (!n && np.length == 0)? alert("don't pass") : alert("problem"); 
				//group side subgroup
				let ng1 = g1.concat(p1);
				let ng2 = p2;
				let ng3 = p3 + "" + g3;
				console.log(p1, p2, p3, ng1, ng2, ng3);
				res_obj = {obj : [ng1, ng2, ng3], op : op}
			}else if(g2op.length == 1){
				console.log(pop, op, nop, g1, g2, g3);
				let p1 = g1;
				let p2 = g2.substring(1, g2.length -1);
				let p3 = g3;
				console.log(p1,p2,p3);
				res_obj = {obj : [p1,p2,p3], op : op};
			}
			return res_obj;
		},
		isolateGroupPrth : (gprth, string)=>{
			let str = (string) ? string : scalc.op;
			let g1 = (gprth[0]["s"]["i"]-1 >= 0)? str.substring(0, gprth[0]["s"]["i"]) : "";
			let g2 = str.substring(gprth[0]["s"]["i"], gprth[0]["e"]["i"]+1);
			let g3 = (gprth[0]["e"]["i"] != str.length) ? str.substring(gprth[0]["e"]["i"]+1, str.length) : "";
			let res = [g1, g2, g3];
			console.log(res);
			return [g1,g2,g3];
		},
		detectAndGroupPrth : (string)=>{
			let str = (string) ? string : scalc.op;
			let prth = scalc.detectPrth(str);
			let gprth = scalc.groupPrth(prth);
			return gprth;
		},
		groupPrth :(prth)=>{
			let gprth = [];
			for(var i = 0; i < prth.length; i++){
				if(prth[i]["op"] == "(" && prth[i+1]["op"] == ")"){
					gprth.push({s : prth[i], e : prth[i+1]});		
				}
			}
			return gprth;
		},
		detectPrth : (string)=>{
			let str = (string) ? string : scalc.op;
			let prths = [];
			for(var i = 0; i < str.length; i++){
				if(str[i] == "(" || str[i] == ")"){
					prths.push({op : str[i], i: i});
				}
			}
			return prths;
		},
		detectNumber : (string)=>{
			let num = [];
			let str = (string) ? string : scalc.op;
			for(var i = 0; i < str.length; i++){
				let nums = [];
				let pos = null;
				if(!isNaN(str[i])){
					pos = i;
					if(str[i-1] == "-" ){ //detect negativ number symbol
						if(!str[i-2] || isNaN(str[i-2])){
							pos--;
							nums.push(str[i-1]);
						}
					}
					while(!isNaN(str[i])){
						nums.push(str[i]);
						i++
					}
					num.push({num : nums.join(""), i : pos});
				}
			}
			scalc.nums = num;
		},
		detectOps : (string)=>{
			let c = [];
			str = (string) ? string : scalc.op;
			for(var i = 0; i < str.length; i++){
				if(isNaN(str[i]) && scalc.auth_ops.indexOf(str[i]) != -1){
					if(str[i] == "-" ){
						if(!str[i-1] || str[i-1] == "(" || str[i-1] == ")" || scalc.auth_ops.indexOf(str[i-1]) != -1 || str[i-1] == "e"){
							continue;
						}
					}
					if(str[i] == "+"){
						if(str[i-1] == "e"){
							continue;
						}
					}
					switch(str[i]){
						case "^" : 
							c.push({op: str[i], pos:i, pri : 1});
							break;
						case "*" : case "/" : case "%":
							c.push({op: str[i], pos:i, pri : 2});
							break;
						case "+" : case "-" :
							c.push({op:str[i], pos: i, pri: 3});
					}
				}
			}
			return c;
		},
		ss :(handler, start, end)=>{
			if(typeof handler == "string" && start.length != 0  && end.length != 0){
				let s = handler.substring(start, end);
				return s;
			}else{
				alert("ss error : not a string or, no valid entry points");
			}
		},
		isValid : (string, box)=>{
			let valid_num = false;
			let valid_prth = false;
			let op = scalc.detectOps(string);
			let prth = scalc.detectPrth(string);
			let b = document.getElementById(box);
			scalc.nums = "";
			scalc.detectNumber(string);
			if(scalc.nums && op){
				if(scalc.nums.length == op.length +1){
					valid_num = true;
				}
				if(prth.length > 0 ){
					if(prth.length % 2 == 0){
						valid_prth = true;
					}
				}else{
					valid_prth = true;
				}
			}
			if(valid_num && valid_prth){
				(b.classList.contains("e_syntax"))? b.classList.remove("e_syntax") : "";
				return true;
			}else{
				b.classList.add("e_syntax");
				return false;
			}
		},
	}
	return {
		init : (op)=>{ scalc.init(op);},
		isValidEq : (eq)=>{ return scalc.isValid(eq);},
		ares : scalc.ares,
	}
});
