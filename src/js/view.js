__CD__; 			// eslint-disable-line
__Backpack__; // eslint-disable-line
__Sherlock__; // eslint-disable-line
import $ from 'jquery';
import moment from 'moment';


function whichBuild() {
	if (BLOCK === 'header') {
		buildHeader();
	} else if (BLOCK === 'matchup') {
		getData('matchup');
	} else if (BLOCK === 'upcominggames') {
	}
}

function buildLiveGame(game) {
	whichBuild()
}

function buildPreGame(raw) {
	const $doc = $(raw);
	console.log($doc.prop('outerHTML'));
	const rows = $doc.find('.standard-row');

	for (let row in rows) {
		console.log($(rows[row]))
		if ($(rows[row]).children('.extrawide.left').text().indexOf('New York Rangers') > -1) {
			console.log(row[rows]);
		}
	}
}