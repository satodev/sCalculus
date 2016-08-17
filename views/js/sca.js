app.factory("scalculus", ()=>{
	sca = {
		input : document.getElementById("in"),
		res : document.getElementById("res"),
		fres : document.getElementById("final_res"),
		stat : document.getElementById("status"),
		str : "",
		viable_value : false,
		viable_pairs : false,
		viable_num : false,
		viable_op : false,
		op_permit : ["^","*","/","%","+","-", "(", ")"],
		initEnter : (input)=>{
			if(input){
				let value = sca.parse(input);
				return value;
			}
		},
		parse : (str)=>{
			sca.str = str;
			sca.viableValue();
			sca.viablePairs();
			sca.viableNums();
			let res = sca.eval();
			return res;
		},
		eval: ()=>{
			if(sca.viable_value && sca.viable_pairs && sca.viable_num ){
				let al = [];
				let res = 0;
				for(var i = 0; i < sca.str.length; i++){
					for(var j = 0; j < sca.viable_num.length; j++){
						if(sca.viable_num[j]["i"] == i){
							al.push(sca.viable_num[j]["num"]);
						}
					}
					for(var k = 0; k < sca.viable_op.length; k++){
						if(sca.viable_op[k]["i"] == i){
							al.push(sca.viable_op[k]["op"]);
						}
					}
				}
				if(al.indexOf("^") != -1){
					pa = al.indexOf("^")-1;
					ca = al.indexOf("^");
					na = al.indexOf("^")+1;
					al[pa] = Math.pow(al[pa], al[na]).toString();	
					al.splice(ca, 2);
				}
				let r = sca.cal(al.join(" "));
				return r;
			}else{
				//get error
			}
		},
		cal : (cal)=>{
			try{
				var res = eval(cal);
				return res;
			}catch(err){
				console.log('error');
			}
		},
		getOperators : (str)=>{
			op_count = [];
			if(str){
				for(var i = 0; i < str.length; i++){
					if(sca.op_permit.indexOf(str[i]) != -1){
						if(str[i] == "^"){
							op_count.push({p: 1, pos:i, d: str[i]});
						}
						if(str[i] == "*" || str[i] == "/" || str[i] == "%"){
							op_count.push({p: 2, pos:i, d: str[i]});
						}
						if(str[i] == "+" || str[i] == "-"){
							op_count.push({p: 3, pos:i, d: str[i]});
						}
					}
				}
			}
			return op_count;
		},
		viableValue: ()=>{
			let v = [];
			for(var i = 0; i < sca.str.length; i++){
				if(!isNaN(Number.parseFloat(sca.str[i])) || sca.str[i] == "e" || sca.str[i] == "." || sca.op_permit.indexOf(sca.str[i]) != -1){
					v.push(true);
				}else{
					v.push(false);
				}
			}
			if(v.indexOf(false) != -1){
				sca.viable_value = false;
			}else{
				sca.viable_value = true;
			}
		},
		viablePairs: ()=>{
			pairsl = [];
			pairsr = [];
			for(var i = 0; i < sca.str.length; i++){
				if(sca.str[i] == "("){ 
					pairsl.push({i: i, s: sca.str[i]});
				}
				if(sca.str[i] == ")"){
					pairsr.push({i: i, s: sca.str[i]});
				}
			}
			mod = pairsr.length+pairsl.length;
			if(pairsl.length == pairsr.length && mod % 2 == 0){
				pairs = pairsl.concat(pairsr).sort((a,b)=>{return a["i"] - b["i"]});
				sca.viable_pairs = pairs;
			}else{
				sca.viable_pairs = false;
			}
		},
		viableNums : ()=>{
			let nums = [];
			let ops = [];
			let num = "";
			for(var i = 0; i < sca.str.length; i++){
				while(!isNaN(Number.parseFloat(sca.str[i])) || sca.str[i] == "."){
					num += sca.str[i];
					i++;
				}
				if(isNaN(Number.parseFloat(sca.str[i]))){
					if(num.length > 0){
						nums.push({i : i - num.length, num : num});
					}
					ops.push({i : i, op : sca.str[i]}); 
					num = "";
				}
			}
			if(nums.length > 0){
				sca.viable_num = nums;
				sca.viable_op = ops;
			}else{
				sca.viable_num = false;
			}
		}
	}
	return {
		inite :(input)=>{ return sca.initEnter(input);}
	}
});
