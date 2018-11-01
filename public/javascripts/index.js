var stateUrl = '/state-cases';
var federalUrl = '/federal-cases';

$('.federal-link').click(function () {

	console.log("federal clicked!");

	var newFederalUrl = federalUrl;

	if ( $('.key-field').val() ) {
		newFederalUrl = newFederalUrl + '?key=' + $('.key-field').val();
	}

	window.location.href = newFederalUrl;

});

$('.state-link').click(function () {

	console.log("state clicked!");

	var newStateUrl = stateUrl;

	if ( $('.key-field').val() ) {
		newStateUrl = newStateUrl + '?key=' + $('.key-field').val();
	}

	window.location.href = newStateUrl;

});