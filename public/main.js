var str="";
var id;

$(document).ready(function(){
	
	$("#b").on("click", function(){
		
		$.ajax({
			url:"/url",
			type:"POST",
			data:{
				loc: $("input").val()
			},
			success: function(data){
				
				str="";
				
				for (var i=0; i<data.businesses.length; i++){
					
					str+='<div>'+'<img src="'+data.businesses[i].image_url+'">'+'<p>'+data.businesses[i].name+'</p>'+'<button class="btn" id="'+i+'">0 GOING</button>'+'<p>'+data.businesses[i].snippet_text+'</p></div>';
					
				}
					
				$("#field").html(str);
				//console.log(str);
			}
		});
		
	});
	
	$("div").on("click","button", function(){
		
		id = $(this).prop('id');
		console.log(id);
		
	});
	
})