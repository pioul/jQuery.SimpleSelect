$(document).ready(function() {

	var select = $("#example-select").simpleselect();

	$("#disable-select").on("click", function() {
		select.prop("disabled", true);
	});

	$("#enable-select").on("click", function() {
		select.prop("disabled", false);
	});

	$("#refresh-simpleselect-state").on("click", function() {
		select.simpleselect("refreshState");
	});

	$("#disable-simpleselect").on("click", function() {
		select.simpleselect("disable");
	});

	$("#enable-simpleselect").on("click", function() {
		select.simpleselect("enable");
	});

});