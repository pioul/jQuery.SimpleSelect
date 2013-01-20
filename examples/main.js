$(document).bind("ready", function(){
	$("select")
		.simpleselect()
		.bind("change.simpleselect", function(){
			console.log('change; new value='+ $(this).val());
		});
});