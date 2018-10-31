
var resultsPage = 0;
var pageSize = 100;
var token = null;

$('#court-select').attr('disabled',true);

var thisYear = (new Date()).getFullYear();

$( ".slider" ).slider({
	range: true,
	min: 1789,
	max: thisYear,
	values: [ 1789, thisYear],
	"slide": function( event, ui ) {
        $( "#year-range" ).val( ui.values[ 0 ] + " - " + ui.values[ 1 ] );
    },
    "change": function( event, ui) {
    	callSearch();
    }
});

$( "#year-range" ).val( $( "#year-slider" ).slider( "values", 0 ) + " - " + $( "#year-slider" ).slider( "values", 1 ) );

$('option', $('#state-select')).remove();
$($('#state-select')).append('<option value="none">All States</option>');

$.getJSON( "/states", function (data) {

	console.log(data);
	for(var i = 0; i < data.length; i++) {

		if(data[i]["slug"] != "us") {
			var appendText = '<option value=' + data[i]["slug"] + '>' + data[i]["name_long"] + '</option>';
			$($('#state-select')).append(appendText);
		} else {
			console.log("United States!!!");
		}
		console.log(data[i]["slug"] + ": " + data[i]["name_long"]);
	}
});


$('#state-select').change( function () {

	if($('#state-select').val() == 'none') {
		$('option', $('#court-select')).remove();
		$($('#court-select')).append('<option value="none">All Courts</option>');
		$('#court-select').attr('disabled',true);
		return true;
	}

	$('#search-terms').attr('disabled',false);

	$('option', $('#court-select')).remove();
	var allCourtsText = '<option value="none">All ' + $('#state-select option:selected').text() + ' Courts</option>';
	$($('#court-select')).append(allCourtsText);

	$.getJSON( "/courts", { "slug": $('#state-select').val() }, function (data) {
		console.log(data);
		for(var i = 0; i < data.length; i++) {
			var appendText = '<option value=' + data[i]["slug"] + '>' + data[i]["name"] + '</option>';
			$($('#court-select')).append(appendText);
		}
	});

	$('#court-select').attr('disabled',false);


	callSearch();
});

$('#court-select').change( function() {
	callSearch();
});

$('#search-terms').change( function() {
	callSearch();
});

$('#token').change( function () {
	if($('#token').val()) { token = $('#token').val() };
	callSearch();
});

var callSearch = function () {

	var searchQuery = 'https://api.case.law/v1/cases/';
	var i = 0;

	if( $('#search-terms').val() ) {
		searchQuery += '?search=' + $('#search-terms').val();
		i++;
	}

	if( i == 0 ) { 
		searchQuery += '?';
	} else {
		searchQuery += '&';
	}

	searchQuery += 'decision_date_min=' + $( "#year-slider" ).slider( "values", 0 ) 
		+ '-12-31&decision_date_max=' + $( "#year-slider" ).slider( "values", 1 ) + '-01-01';

	if ( $('#state-select').val() != 'none' ) {
		searchQuery += '&jurisdiction=' + $('#state-select').val();
		if ( $('#court-select').val() != 'none' ) {
			searchQuery += '&court=' + $('#court-select').val();
		}
	}

	// Since this is a new search, set the page to zero
	resultsPage = 0;

	return getPage(encodeURI(searchQuery));

}

var getPage = function (page) {

	console.log( token );

	$.getJSON( "/cases", { "url": page }, function (data) {
		
		console.log(token);

		$('#results').empty();

		// check error
		if ( data.error ) {
			$('#results').appendText( data.error );
			return false;
		}

		// OTHERWISE: deal with page layout
		$('#results').append('<div class="navigation" id="nav-header"></div>');
		$('#results').append('<div id="all-results"></div>');
		$('#results').append('<div class="navigation" id="nav-footer"></div>');

		if(data.count) {
			$('.navigation').append('<span>Page ' + (resultsPage+1) + ' of ' + Math.ceil(data.count/pageSize) + 
				' (' + data.count + ' cases)' + '</span>');
		} else {
			$('.navigation').append('<span>Too many results to count</span>');
		}

		if (data.previous) {
			$('.navigation').prepend('<span class="link-prev"><a href="#">Previous</a></span>');
			$('.link-prev').click( function () {
				resultsPage--;
				getPage(data.previous);
				return;
			});
		}
		if (data.next) {
			$('.navigation').append('<span class="link-next"><a href="#">Next</a></span>');
			$('.link-next').click( function () {
				resultsPage++
				getPage(data.next);
				return;
			});
		}

		// deal with results
		for(var i = 0; i < data.results.length; i++) {
			$('#all-results').append('<div class="case-result" id="res' + i + '"></div>');

			var caseLinkUrl = '/fullcase/' + data.results[i].id; 
			if(token) { caseLinkUrl += '/?token=' + token };

			$('#res' + i).append('<h3><a target="_blank" href="' + caseLinkUrl + '">' 
				+ data.results[i].name_abbreviation + '</a></h3>');
			$('#res' + i).append('<ul>');
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
