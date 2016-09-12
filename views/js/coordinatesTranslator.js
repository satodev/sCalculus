app.factory("coord", ()=>{
	let c = {
		istr : "", 
		trans: (str)=>{
			if(c.hasCoord(str)){
				c.istr = str;
				let translate_str = "";
				let res = "";
				let n = c.recurse(str);
				return n;
			}else{
				return str;
			}
		},
		recurse : (str)=>{
			c.istr = str;
			let o = c.parse(c.istr);
			if(o && o.length > 0){
				if(o[0] && o[0].str.length >= 3 && c.vTarget(o[0].str)){
					let s = c.mutation(c.istr, o[0]);
					c.recurse(s);
				}
			}
			return c.istr;
		},
		hasCoord : (str)=>{
			if(str.indexOf(":") != -1 && str.length >= 3){
				return true;
			}else{
				return false;
			}
		},
		vTarget : (str)=>{
			let t = document.getElementById(str).getAttribute("data-func");
			return !c.hasCoord(t);
		},
		parse : (str)=>{
			let patt = /([0-9]*:[0-9]*)/gi;
			let res;
			let o = [];
			while((res = patt.exec(str)) !== null){
				let msg = res[0];
				let startI = res.index;
				let lastI = patt.lastIndex;
				o.push({str : msg, s: startI, e: lastI});
			}
			return o;
		},
		mutation : (str , o)=>{
			let c = o.str;
			let s = o.s;
			let e = o.e;
			let sv = (s != 0) ? str.substring(0, s) : "";
			let ev = (e != str.length) ? str.substring(e, str.length) : "";
			let func = document.getElementById(c).getAttribute("data-func");	
			let res = sv+""+func+""+ev;
			return res;
		},
	}
	return {
		translate : (str)=>{ return c.trans(str);}
	}
});
