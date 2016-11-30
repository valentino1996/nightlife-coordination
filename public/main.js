var str="";
var id;
var info;

$(document).ready(function(){
	
	$("#b").on("click", function(){
		
		$.ajax({
			url:"/url",
			type:"POST",
			data:{
				loc: $("input").val()
			},
			success: function(data){
				
				info=data;
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
		console.log(info);
		
		$.ajax({
			url: "/places",
			type:"POST",
			dataType: "json",
			data:{
				name: id
			},
			success:{
				
			}
		});
		
	});
	
})