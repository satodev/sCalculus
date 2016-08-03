app.factory("scalculus", ()=>{
	sca = {
		valid_op : ["^", "*", "/", "%", "+", "-"],
		pOps : [],
		pPth : [],
		initial_pattern : "",
		result_pattern : "",
		valid_pattern :true,
		pParse : ()=>{
			for(var i = 0; i < sca.initial_pattern.length; i++){
				if(sca.initial_pattern[i] == "(" || sca.initial_pattern[i] == ")"){
					sca.pPth.push({i: i, s: sca.initial_pattern[i]});
				}
				if(sca.valid_op.indexOf(sca.initial_pattern[i]) != -1){
					sca.pOps.push({i: i, s: sca.initial_pattern[i]});
				}
			}
			if(sca.pPth.length >= 1 && sca.pPth.length % 2 != 0){
				sca.valid_pattern = false;
				sca.result_pattern = "problem parenthesis";
			}
		},
		resetAllValues : ()=>{
			sca.pOps = [];
			sca.pPth = [];
			sca.valid_pattern = true;
		},
		Algebra : ()=>{
			console.log("start");
			if(sca.pOps.length != 0){
				pattern = sca.initial_pattern;
				order = [];
				let final_res = null;
				let res_str = sca.result_pattern;
				res = [];
				sca.pOps.map((cu, ci, car)=>{
					if(cu["s"] == "^"){
						order.push({i :1, obj : cu});
					}
					if(cu["s"] == "*" || cu["s"] == "/" || cu["s"] == "%"){
						order.push({i: 2, obj : cu});	
					}
					if(cu["s"] == "+" || cu["s"] == "-"){
						order.push({i: 3, obj : cu});
					}
				});
				order.sort((a,b)=>{
					return a["i"] - b["i"];
				});
				order.map((cu,ci,car)=>{
					cu_obj = cu["obj"];
					let pre_obj = null;
					let nex_obj = null;
					let s, p, n = "";
					let res_pat_op = [];
					//get obj that current_index minus next or previous index is the lesser
					for(var i = 0; i< sca.pOps.length; i++){
						if(sca.pOps[i]["i"] == cu["obj"]["i"]){
							pre_obj = (sca.pOps[i-1]) ? sca.pOps[i-1]["i"]+1 : 0;		
							nex_obj = (sca.pOps[i+1]) ? sca.pOps[i+1]["i"] : pattern.length;
						}
					}
					if(sca.result_pattern.length == 0){
						s = pattern.substring(pre_obj, nex_obj).split(cu_obj["s"]);
						p = pattern.substring(0, pre_obj);
						n = pattern.substring(nex_obj+1, pattern.length);
						sca.result_pattern = p.concat(sca.calcul(s[0], s[1], cu_obj["s"]), n);
					}else{
						if(sca.result_pattern.substring(pre_obj, nex_obj) == pattern.substring(pre_obj, nex_obj)){
							s = sca.result_pattern.substring(pre_obj, nex_obj).split(cu_obj["s"]);
							p = sca.result_pattern.substring(0, pre_obj);
							n = sca.result_pattern.substring(nex_obj, sca.result_pattern.length);
							sca.result_pattern = p.concat(sca.calcul(s[0], s[1], cu_obj["s"]), n);
							console.log(s,cu_obj["s"], p,n, sca.result_pattern);
						}else{
							let c = sca.result_pattern.search(pattern.substring(pre_obj, nex_obj));
							c = sca.result_pattern[c];
							console.log(c);
						}
					}
					for(var j = 0; j < sca.result_pattern.length; j++){
						if(sca.valid_op.indexOf(sca.result_pattern[j]) != -1){
							res_pat_op.push(sca.result_pattern[j]);
						}
					}
					console.log(pre_obj, nex_obj, s, p, n, res_pat_op);
					if(res_pat_op.length > 1){
						console.log(cu, ci, car, cu_obj, pre_obj, nex_obj, res_str, s,p,n);
						console.log(sca.result_pattern);
						//	sca.solvePattern(sca.result_pattern);

					}else if(res_pat_op.length == 1){
						s = sca.result_pattern.split(res_pat_op[0]);
						calc = sca.calcul(s[0],s[1], res_pat_op[0]);
						final_res = calc;
						sca.initial_pattern = null;
					}
				});
				return final_res;
			}
		},
		pAlgebra: ()=>{
			//recursive group parenthesis and solve
			if(sca.pPth.length != 0){
				//note start and end of string modification
				pattern = sca.initial_pattern;
				sca.pPth.map((cu, i, ar)=>{
					if(ar[i]['s'] == "(" && ar[i+1]["s"] == ")"){
						console.log('pas');
						let start = ar[i]["i"];
						let end = ar[i+1]["i"]+1;
						let pa = pattern.slice(0, start);
						let process = sca.patternRouter(pattern.slice(start, end));
						//sStop
						console.log(process);
						let cur = process.toString();
						let pb = pattern.slice(end, pattern.length);
						let res_pat = pa.concat(cur, pb);
						sca.initial_pattern = res_pat;
						console.log(start, end, pa,cur, pb, res_pat);
					}
				});
			}else{
				return res;
			}
		},
		patternRouter : (pattern)=>{
			if(pattern){
				let p_op = [];
				let solve = null;
				for(var i = 0; i< pattern.length; i++){
					if(sca.valid_op.indexOf(pattern[i]) != -1){
						console.log(pattern[i]);
						p_op.push({i: i, s:pattern[i]});
					}
				}
				if(p_op.length == 1){
					pattern = pattern.slice(1, pattern.length-1);
					console.log(pattern);
					let split = pattern.split(p_op[0]["s"]);	
					let sa =parseFloat(split[0]);
					let sb =parseFloat(split[1]);
					console.log(sa, sb, p_op[0]["s"]);
					//do sca.calcul method instead of switch
					switch(p_op[0]["s"]){
						case "^" : 
							solve = Math.pow(sa, sb);	
							break;
						case "*" : 
							solve = sa * sb;
							break;
						case "/" : 
							solve = sa / sb;
							break;
						case "%" : 
							solve = sa % sb;
							break;
						case "+" : 
							solve = sa + sb;
							break;
						case "-" : 
							solve = sa - sb;
							break;
					}
				}
				if(p_op.length > 1){

				}
				if(solve != null){
					return solve;
				}else{
					return "";
				}
			}
		},
		solvePattern: (p)=>{
			sca.resetAllValues();	
			sca.initial_pattern = (sca.initial_pattern)? sca.initial_pattern : p;
			sca.pParse();
			if(sca.pPth.length != 0 || sca.pOps.length != 0){
				console.log(sca.initial_pattern, sca.pPth, sca.pOps);
			}
			if(sca.pPth.length == 0){
				let res = sca.Algebra();
				console.log(res);
			}else{
				let res = sca.pAlgebra();
			}
			//return the result of the operations
			if(!sca.valid_pattern){
				console.log(sca.result_pattern);
			}else{
				return sca.result_pattern;
			}
		},
		calcul : (a, b, op)=>{
			let res = null;
			switch(op){
				case "^" :
					res = sca.pow(a,b);
					break;
				case  "*" :
					res = sca.mult(a,b);
					break;
				case  "/" : 
					res = sca.devi(a,b);
					break;
				case  "%": 
					res = sca.modulo(a,b);
					break;
				case  "+":
					res = sca.add(a,b);
					break;
				case  "-":
					res = sca.sub(a,b);
					break;
			}
			return res;
		},
		add : (a, b)=>{
			a = sca.parseFloat(a);
			b = sca.parseFloat(b);
			return a+b;
		},
		sub : (a, b)=>{
			a = sca.parseFloat(a);
			b = sca.parseFloat(b);
			return a-b;
		},
		mult : (a, b)=>{
			a = sca.parseFloat(a);
			b = sca.parseFloat(b);
			return a*b;
		},
		devi : (a, b)=>{
			a = sca.parseFloat(a);
			b = sca.parseFloat(b);
			return a/b;	
		},
		modulo : (a, b)=>{
			a = sca.parseFloat(a);
			b = sca.parseFloat(b);
			return a%b;
		},
		pow : (a, b)=>{
			a = sca.parseFloat(a);
			b = sca.parseFloat(b);
			return Math.pow(a,b);
		},
		parseFloat : (e)=>{
			return Number.parseFloat(e);
		}
	};
	return {
		solvePattern: (p)=>{
			return sca.solvePattern(p);	
		}
	}
});
