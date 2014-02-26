$(document).ready(function() {

	var select = $("#example-select"),
		catBreedDisplay = $("#cat-breed-display");

	select
		.simpleselect()
		.on("change", function() {
			catBreedDisplay.text(select.val());
		});

});