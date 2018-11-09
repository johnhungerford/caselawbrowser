const getCaseUrlBase = '/getcase/' + caseId;

if ( key != '' ) { $('.key-field').val(key) };

var refresh = function () {

	var getCaseUrl = getCaseUrlBase;

	if ( $('.key-field').val() ) {
		getCaseUrl = getCaseUrlBase + '?key=' + $('.key-field').val();
	}

	$.getJSON( getCaseUrl, { "full_text": true }, function (data) {

		if(data.filename) {
			$('#docx-box').append('<a href="/' + data.filename + '" id="docxlink">Download case as a word document</a>');
		}

		console.log("HELLO??");
		
		$('#case-title').append(data.name_abbreviation);
		$('#case-info').append('<li>Citation: ' + data.citations[0].cite + '</li>');
		$('#case-info').append('<li>Decision Date: ' + data.decision_date + '</li>');
		$('#case-info').append('<li>Jurisdiction: ' + data.jurisdiction.name_long + '</li>');
		$('#case-info').append('<li>Court: ' + data.court.name + '</li>');

		var sourceText = data.reporter.full_name;
		if(data.volume.volume_number) { sourceText += ', Vol. ' + data.volume.volume_number };

		if( data.casebody ) {

			/*if( data.casebody.data ) {

				var casedata = data.casebody.data;
				if (casedata.parties) { 
					var parties = casedata.parties.join(", ");
					$('#case-info').append('<li>Parties: ' + parties + '</li>');
				}
				if (casedata.judges) { 
					var judges = casedata.judges.join(", ");
					$('#case-info').append('<li>Judges: ' + judges + '</li>');
				}
				if (casedata.attorneys) {
					var attorneys = casedata.attorneys.join(", ");
					$('#case-info').append('<li>Attorneys: ' + attorneys + '</li>');
				}

				$('#front-matter').append('<h2>' + data.name + '</h2>');
				var frontMatterParas = casedata.head_matter.split('\n');
				var frontMatterHTML = '';
				for (var j = 0; j < frontMatterParas.length; j ++) {
					frontMatterHTML += '<p class="front-matter-para">' + frontMatterParas[j] + '</p>';
				}
				if( casedata.head_matter ) { $('#front-matter').append( frontMatterHTML ) };

				var opinions = casedata.opinions;

				for( var i = 0; i < opinions.length; i++ ) {
					$('#opinions').append($('<div>', {
						id: 'opinion' + i,
						class: 'opinion',
					}));

					var opinionParas = opinions[i].text.split('\n');
					var opinionHTML = '';
					for (var j = 0; j < opinionParas.length; j ++) {
						opinionHTML += '<p class="opinion-para">' + opinionParas[j] + '</p>';
					}
					$('#opinion' + i).append('<h3>' + opinions[i].author + ': ' + opinions[i].type + '</h2>');
					$('#opinion' + i).append( opinionHTML );
				}	

			} else {
				$('#front-matter').append('<h2>You need a CAP API token to access the full case</h2>');
				$('#front-matter').append('<p>You can obtain a token by registering with Harvard LIL. Registration is free. Each token can access up to 500 full cases per day.</p>');
				$('#front-matter').append('<p><a href="https://case.law/user/register/">Click here to register with Harvard LIL</a></p>');
			}*/

		}

	});

	return;
}

refresh();

$('.key-field').change(function() {
	$('#case-title').empty();
	$('#case-info').empty();
	$('#front-matter').empty();
	$('#opinions').empty();

	refresh();
});