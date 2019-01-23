const getCaseUrlBase = '/getcase/' + caseId;

if ( key != '' ) { $('#key-field').val(key) };

var refresh = function () {

	var getCaseUrl = getCaseUrlBase;

	if ( $('#key-field').val() ) {
		getCaseUrl = getCaseUrlBase + '?key=' + $('#key-field').val();
		console.log(getCaseUrl);
	}

	$.getJSON( getCaseUrl, { "full_text": true, "body_format": "html" }, function (data) {

		$('#case-title').empty();
		$('#case-info').empty();
		$('#case-text').empty();


		if(data.casebody.data) {
			$('#docx-box').append('<a href="/getcase/' + data.id + '/docx?key='+ $('#key-field').val()+'" id="docxlink">Download case as a word document</a>');
		}

		console.log("HELLO?? " + data.filename );
		
		$('#case-title').append(data.name_abbreviation);
		$('#case-info').append('<li>Citation: ' + data.citations[0].cite + '</li>');
		$('#case-info').append('<li>Decision Date: ' + data.decision_date + '</li>');
		$('#case-info').append('<li>Jurisdiction: ' + data.jurisdiction.name_long + '</li>');
		$('#case-info').append('<li>Court: ' + data.court.name + '</li>');

		var sourceText = data.reporter.full_name;
		if(data.volume.volume_number) { sourceText += ', Vol. ' + data.volume.volume_number };

		if( data.casebody ) {

			if( data.casebody.data ) {
				$('#case-text').append(data.casebody.data);
			} else {
				$('#case-text').append('<h2>You need a CAP API token to access the full case</h2>');
				$('#case-text').append('<p>You can obtain a token by registering with Harvard LIL. Registration is free. Each token can access up to 500 full cases per day.</p>');
				$('#case-text').append('<p><a href="https://case.law/user/register/">Click here to register with Harvard LIL</a></p>');
			}

		}

	});

	return;
}

refresh();

$('#key-field').change(function() {
	$('#case-title').empty();
	$('#case-info').empty();
	$('#front-matter').empty();
	$('#opinions').empty();

	refresh();
});