app.factory('gridManager', ($http)=>{
	var grid = {
		create : ()=>{
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
						container.innerHTML += '<textarea class="box" id="'+i+'">'+j+':'+i+'</textarea>';
					}
				}
				container.innerHTML += '<br />';
			}
		},
		gen: ()=>{
			console.log('Generate grid');
		},
		del : ()=>{
			console.log('Delete Grid');
		}
	}
	return {
		create : ()=>{grid.create();},
		gen :()=>{grid.gen()},
		del: ()=>{grid.del()}
	}
});
