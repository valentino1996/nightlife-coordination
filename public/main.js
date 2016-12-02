var str="";
var id;
var info;
var loc="";
var array=[];
var going="NOT GOING";

$(document).ready(function(){
	
	$("#b").on("click", function(){
		loc=$("input").val();
		$.ajax({
			url:"/url",
			type:"POST",
			data:{
				loc: $("input").val()
			},
			success: function(data){
				
				if(data.error==1){
					$("#field").html("bad request");
					return;
				}
				
			info=data.key1;
			console.log(info);
			array=data.key2;
			str="";
			for (var i=0; i<info.businesses.length; i++){
				
				going="NOT GOING";
					
					for (var j=0; j<array.length; j++){
						if(array[j]==data.key1.businesses[i].name){
							going="GOING";
							break;
						}
					}
					
					str+='<div>'+'<img src="'+data.key1.businesses[i].image_url+'">'+'<p>'+data.key1.businesses[i].name+'</p>'+'<button class="btn" id="'+i+'">'+going+'</button>'+'<p>'+data.key1.businesses[i].snippet_text+'</p></div>';
					
			}
					
			$("#field").html(str);
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
				name: info.businesses[id].name,
			},
			success: function(obj){
				
				if(obj.a=="login"){
					window.location = "http://nightlife-coordination-vali.herokuapp.com/auth/twitter";
				}
				else if(obj.a==1){
					$("#"+id).html("GOING");
				}
				else{
					$("#"+id).html("NOT GOING");
				}
			}
		});
		
	});
	
});

$(window).on("load", function(){
		
	$.ajax({
		url:"/",
		type:"POST",
		success: function(data){
				
			info=data.key1;
			array=data.key2;
			str="";
			for (var i=0; i<data.key1.businesses.length; i++){
				
				going="NOT GOING";
					
					for (var j=0; j<array.length; j++){
						if(array[j]==data.key1.businesses[i].name){
							going="GOING";
							break;
						}
					}
					
					str+='<div>'+'<img src="'+data.key1.businesses[i].image_url+'">'+'<p>'+data.key1.businesses[i].name+'</p>'+'<button class="btn" id="'+i+'">'+going+'</button>'+'<p>'+data.key1.businesses[i].snippet_text+'</p></div>';
					
			}
					
			$("#field").html(str);
			}
		});
		
	});