$(document).ready(function() {

	var select = $("#example-select").simpleselect(),
		newOptionInput = $("#add-option"),
		newOptionAutoSelectionCheckbox = $("#should-select-option"),
		newOption;

	$("#add-option-form").on("submit", function(e) {
		e.preventDefault();

		newOption = $("<option>").text(newOptionInput.val());
		if (newOptionAutoSelectionCheckbox.prop("checked")) newOption.prop("selected", true);

		select
			.append(newOption)
			.simpleselect("refreshContents")
			.simpleselect("setActive");
	});

});