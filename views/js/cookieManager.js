app.factory('cookieManager', ()=>{
	var cm = {
		acn: ['username', 'id','expires', 'date'],
		getCookie : ()=>{
			return document.cookie;
		},
		read : (acn)=>{
			let c = document.cookie;
			let val = c.slice(c.search(cm.acn[acn])).split(';')[0].split('=')[1];
			return val;
		},
		write : (numAcn, data)=>{
			document.cookie = cm.acn[numAcn]+'='+data+';'; 
		},
		setCookieExpires : ()=>{
			var d = new Date();
			d.setTime(d.getTime()+(10*24*60*60*1000));
			document.cookie +='expires='+d.toUTCString()+';';
		},
		del : (numAcn)=>{
			document.cookie = cm.acn[numAcn]+'=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
		}
	}
	return {
		gc : cm.getCookie(),
		st : cm.setCookieExpires(),
		array : cm.acn,
		r: (acn)=>{
			return cm.read(acn);
		},
		w: (acn, data)=>{
			cm.write(acn, data);
		},
		d:(acn)=>{
			cm.del(acn);
		}
	}
});
