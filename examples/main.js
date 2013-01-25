$(document).bind("ready", function(){
	$("select")
		.simpleselect()
		.bind("change.simpleselect", function(){
			console.log('change; new value='+ $(this).val());
		});
	
	$("#toggle-disabled").bind("click", function(e){
		e.preventDefault();
		var select = $(this).closest(".select-container").find("select");
		if(select.prop("disabled")) select.simpleselect("enable");
			else select.simpleselect("disable");
	});
});