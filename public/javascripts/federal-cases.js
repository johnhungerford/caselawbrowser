
var resultsPage = 0;
var pageSize = 100;

$('title').append(' - Federal');

var thisYear = (new Date()).getFullYear();

$('option', $('#court-select')).remove();
$($('#court-select')).append('<option value="none">All Federal Courts</option>');

$.getJSON( "/courts", { "slug": 'us' }, function (data) {
	console.log(data);
	for(var i = 0; i < data.length; i++) {
		var appendText = '<option value=' + data[i]["slug"] + '>' + data[i]["name"] + '</option>';
		$($('#court-select')).append(appendText);
	}
	return;
});

$('#min-date').change( function() {
	callSearch();
});

$('#max-date').change( function() {
	callSearch();
});

$('#court-select').change( function() {
	callSearch();
});

$('#search-terms').change( function() {
	callSearch();
});

$('#key-field').change( function() {
	callSearch();
});

$('#page-select').change( function() {
	callSearch();
});

var callSearch = function () {

	if( $('.page-info') ) { $('.page-info').empty() };
	$('.page-info').append('Searching...');

	var searchQuery = 'https://api.case.law/v1/cases/';
	var i = 0;

	if( $('#search-terms').val() ) {
		searchQuery += '?search=' + $('#search-terms').val();
		i++;
	}

	if( $( '#min-date' ).val() != '' ) {
		if ( i == 0 ) { searchQuery += '?' } else { searchQuery += '&' };
		searchQuery += 'decision_date_min=' + $( '#min-date' ).val();
		i++;
	}


	if( $( '#max-date' ).val() != '' ) {
		if ( i == 0 ) { searchQuery += '?' } else { searchQuery += '&' };
		searchQuery += 'decision_date_max=' + $( "#max-date" ).val();
		i++;
	}

	if ( $('#court-select').val() != 'none' ) {
		if ( i == 0 ) { searchQuery += '?' } else { searchQuery += '&' };
		searchQuery += 'court=' + $('#court-select').val();
		i++
	}

	if ( i == 0 ) { searchQuery += '?jurisdiction=us' } else { searchQuery += '&jurisdiction=us' };

	if ( $('#page-select').val() != 100 ) { searchQuery += '&page_size=' + $('#page-select').val(); }

	console.log(searchQuery);

	// Since this is a new search, set the page to zero
	resultsPage = 0;

	return getPage(encodeURI(searchQuery));

}

var getPage = function (page) {

	console.log( key );

	$.getJSON( "/cases", { "url": page }, function (data) {
		
		console.log(key);

		$('.cases-nav').empty();
		$('.cases-list').empty();

		// check error
		if ( data.error ) {
			$('.cases-nav').appendText( data.error );
			return false;
		} else {
			$('.cases-nav').append('<div class="col link-prev"></div>');
			$('.cases-nav').append('<div class="col page-info"></div>');
			$('.cases-nav').append('<div class="col link-next"></div>');
		}

		if( data.count != null ) {
			if ( data.count != 0 ) {
				$('.page-info').append('Page ' + (resultsPage+1) + ' of ' + Math.ceil(data.count/$('#page-select').val()) + 
					' (' + data.count + ' cases)');
			} else {
				$('.page-info').append('No results');
			}
		} else {
			$('.page-info').append('Too many results to count');
		}

		if (data.previous) {
			$('.link-prev').append('<a href="#">Previous</a>');
			$('.link-prev').click( function () {
				resultsPage--;
				getPage(data.previous);
				return;
			});
		}
		if (data.next) {
			$('.link-next').append('<a href="#">Next</a>');
			$('.link-next').click( function () {
				resultsPage++
				getPage(data.next);
				return;
			});
		}

		// deal with results
		for(var i = 0; i < data.results.length; i++) {
			$('#all-cases').append('<div class="case-result" id="res' + i + '"></div>');

			var caseLinkUrl = '/fullcase/' + data.results[i].id; 
			if( $('#key-field').val() ) { caseLinkUrl += '/?key=' + $('#key-field').val() };

			$('#res' + i).append('<span class="case-result-title"><a target="_blank" href="' + caseLinkUrl + '">' 
				+ data.results[i].name_abbreviation + '</a></span>');
			$('#res' + i).append('<ul class="case-result-data">');
			$('#res' + i).append('<li>Citation: ' + data.results[i].citations[0].cite + '</li>');
			$('#res' + i).append('<li>Decision Date: ' + data.results[i].decision_date + '</li>');
			$('#res' + i).append('<li>Jurisdiction: ' + data.results[i].jurisdiction.name_long + '</li>');
			$('#res' + i).append('<li>Court: ' + data.results[i].court.name + '</li>');

			var sourceText = data.results[i].reporter.full_name;
			if(data.results[i].volume.volume_number) { sourceText += ', Vol. ' + data.results[i].volume.volume_number };

			$('#res' + i).append('<li>Source: ' + sourceText + '</li>');
			$('#res' + i).append('</ul>');
		}
	});

}
