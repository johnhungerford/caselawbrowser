var stateUrl = '/state-cases';
var federalUrl = '/federal-cases';

console.log("hello?");

$('#key-field').focusout( function () {
	if($('#key-field').val() != '') {
		$('#key-field').hide();
		$('#key-val').text( $('#key-field').val() );
		$('#key-val').show();
	}
});

$('.key-text').click(function() {
	$('#key-val').hide();
	$('#key-field').val( $('#key-val').text() );
	$('#key-field').show();
	$('#key-field').focus();
});

$('.federal-link').click(function () {

	console.log("federal clicked!");

	var newFederalUrl = federalUrl;

	if ( $('#key-field').val() ) {
		newFederalUrl = newFederalUrl + '?key=' + $('#key-field').val();
	}

	window.location.href = newFederalUrl;

});

$('.state-link').click(function () {

	console.log("state clicked!");

	var newStateUrl = stateUrl;

	if ( $('#key-field').val() ) {
		newStateUrl = newStateUrl + '?key=' + $('#key-field').val();
	}

	window.location.href = newStateUrl;

});