/* JQuery */
$(document).ready(function(e){
	
	$("#fnd input").hide().animate({width:0,marginRight:-20});
	$("#fnd button").animate({width:150});
	$("#fnd").mouseenter(function(){
		$("#fnd input").animate({width:300},("slow")).show();
		$("#fnd button").animate({width:75});
	})
	$("#fnd").mouseleave(function(){
		$("#fnd input").animate({width:0,marginRight:-20});
		$("#fnd button").animate({width:150});
	})



/* LOGIN VALIDATION */

	$("#alert1").hide();
	$("#alert2").hide();
	$("#alert3").hide();
	$("#alert4").hide();
	$("#alert5").hide();

/*LOGIN BUTTON*/
	$("#logbtn").click(function(){
		if($("#username").val()=="" && $("#password").val()==""){
			$("#username,#password").addClass("animated shake").focus();
		}
		if($("#username").val()==""){
			$("#username").addClass("animated shake").focus();
		}else if($("#password").val()==""){
			$("#password").addClass("animated shake").focus();
		}
	});

/*LOGIN BUTTON*/

/*SIGNUP BUTTON*/

	$("#singupbtn").click(function(){
		if($("#signemail").val() == ""){
			$("#alert3").show("fast");
			$("#signemail").focus();
			$("#signemail").change(function(){
				$("#alert3").hide("fast");
			})

		}else if($("#signusername").val()==""){
			$("#alert4").show("fast");
			$("#signusername").focus();
			$("#signusername").change(function(){
				$("#alert4").hide("fast");
			})

		}else if($("#signpassword").val()==""){
			$("#alert5").show("fast");
			$("#signpassword").focus();
			$("#signpassword").change(function(){
				$("#alert5").hide("fast");
			})
		}
	});

/*SIGNUP BUTTON*/

/* LOGIN VALIDATION */



/*NAVIGATION BAR*/

	$("#m1").mouseenter(function(){
		$("#m11").slideDown(200);
	});
	$("#m11,#m1").mouseleave(function(){
		$("#m11").slideUp(150);
	});

	$("#m2").mouseenter(function(){
		$("#m22").slideDown(200);
	});
	$("#m22,#m2").mouseleave(function(){
		$("#m22").slideUp(150);
	});


/*NAVIGATION BAR*/


/*BOX DECORATION*/
	$("#box1").mouseenter(function(){
		$("#boxdec1").slideDown();
	});
	$("#box2").mouseenter(function(){
		$("#boxdec2").slideDown();
	});
	$("#box3").mouseenter(function(){
		$("#boxdec3").slideDown();
	});
	$("#box4").mouseenter(function(){
		$("#boxdec4").slideDown();
	});
	$("#box5").mouseenter(function(){
		$("#boxdec5").slideDown();
	});
	$("#box6").mouseenter(function(){
		$("#boxdec6").slideDown();
	});
	$("#box1,#box2,#box3,#box4,#box5,#box6").mouseleave(function(){
		$(".box-decoration").slideUp();
	});

/*BOX DECORATION*/

/*SCROLL*/

	$(window).scroll(function(){

		($(this).scrollTop()>=200) ? $("#scroll-top").show() : $("#scroll-top").hide(); 
	});

	$("#scroll-top").click(function(){
		$("html,body").animate({scrollTop:0},500)
	});

/*SCROLL*/


});
/* JQuery */
