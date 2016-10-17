__CD__; 			// eslint-disable-line
import $ from 'jquery';
import moment from 'moment';

import { BLOCK, USER_GAME_DATE, TZ_OFFSET } from './index.js';
import { getData, statStore } from './model.js';
import { getGameBoxScore, getGameID, GAME_SUMMARY } from './controller.js';

function buildUpcoming(state, games) {
	console.log(games);

	let i = 1;
	for (let game in games) {
		let thisGame = games[game];
		let $context = $('#game' + i);
		$('.dow', $context).html(thisGame.date.slice(0,3));
		$('.month', $context).html(thisGame.date.slice(4,7));
		$('.day', $context).html(thisGame.date.slice(8,10))
		$('.opp', $context).append(thisGame.opponentTeamName);	
		i++;
	}

	var imagesToGet = 'http://projects.movableink.com/production/msg/nhl-rangers-prepostgame-oct16/build/img/upcominggames.png';
	CD.getImage(imagesToGet, function(img) {
		$('#upcoming').removeClass('hidden');
  	$('#mi_size_container').removeClass('hidden');
	})

}

function buildMatchup(state, stats) {

	if (state === 'pregame') {
		console.log(stats);
		CD.suspend(3000);
		$('#matchup #opponent').html(GAME_SUMMARY.oppName);

		const oppStats = {
			'Total Points': stats.opponent.points,
			'Goals For Per Game': stats.opponent.goalsForPerGame,
			'Shots For Per Game': stats.opponent.shotsForPerGame,
			'Penalty Kill %': stats.opponent.pkPctg	
		};

		const nyrStats = {
			'Total Points': stats.rangers.points,
			'Goals For Per Game': stats.rangers.goalsForPerGame,
			'Shots For Per Game': stats.rangers.shotsForPerGame,
			'Penalty Kill %': stats.rangers.pkPctg	
		};

		var i = 1;
		for (const s in oppStats) {
	  	var $context = $('#stat' + i);
	  	$('.nyr-stat', $context).html(nyrStats[s]);
			$('.stat-name', $context).html(s);
			$('.opp-stat', $context).html(oppStats[s]);
			i++;
		};

		CD.getImage('http://projects.movableink.com/production/msg/nhl-rangers-prepostgame-oct16/build/img/matchup.jpg', function(img) {
		  $('#matchup').removeClass('hidden');
		  $('#mi_size_container').removeClass('hidden');
		});

	} else {
		console.log(stats);

		$('#matchup #opponent').html(GAME_SUMMARY.oppName);

		const statType = ['goals', 'shots', 'saves', 'penalties'];
		for (var i = 0; i < 4; i++) {
	  	var $context = $('#stat' + (i+1));
	  	$('.nyr-stat', $context).html(stats.nyr[statType[i]]);
			$('.stat-name', $context).html(statType[i]);
			$('.opp-stat', $context).html(stats.opp[statType[i]]);
		}

		CD.getImage('http://projects.movableink.com/production/msg/nhl-rangers-prepostgame-oct16/build/img/matchup.jpg', function(img) {
		  $('#matchup').removeClass('hidden');
		  $('#mi_size_container').removeClass('hidden');
		});

	}

}

function getProperImage(abbrev) {
	var badAbbrevs = ['sjs'];
	if (badAbbrevs.indexOf(abbrev) > -1) {
		return abbrev.slice(0, 2);
	} else {
		return abbrev;
	}
}

function buildHeader(state, stats) {
	console.log('---- building header ----');
	console.log('header stats ', stats);

	CD.suspend(3000);

	var offset = parseInt(TZ_OFFSET / 100);
	console.log(offset) // 12 (-4) = 8

	if (state === 'pregame') {
		var title = 'PREGAME REPORT';
		var score = '0&nbsp;&nbsp;0';
	} else if (state === 'livegame') {
		var title = 'GAME REPORT';
		var score = stats.nyr.goals + '&nbsp;&nbsp;' + stats.opp.goals;
	} else if (state === 'postgame') {
		var title = 'POSTGAME REPORT';
		var score = stats.nyr.goals + '&nbsp;&nbsp;' + stats.opp.goals;
	}


	let dateOfGame = moment(GAME_SUMMARY.date).add(offset, 'hours').format('ddd, MMMM D - hP');

	$('#title').html(title);
	$('#date').html(dateOfGame);
	$('#score').html(score);
	$('#nyr-logo').html('<img src="http://a.espncdn.com/combiner/i?img=/i/teamlogos/nhl/500/nyr.png?w=100&h=100&transparent=true" />');
	const oppImageURL = 'http://a.espncdn.com/combiner/i?img=/i/teamlogos/nhl/500/' + getProperImage(GAME_SUMMARY.opponent.toLowerCase()) + '.png?w=100&h=100&transparent=true';
	$('#opp-logo').html('<img src="' + oppImageURL + '" />');

	var imagesToGet = ['http://a.espncdn.com/combiner/i?img=/i/teamlogos/nhl/500/nyr.png?w=100&h=100&transparent=true',
									'http://projects.movableink.com/production/msg/nhl-rangers-prepostgame-oct16/build/img/matchup.jpg', 
									oppImageURL];
	CD.getImage(imagesToGet, function(img) {
	  $('#header').removeClass('hidden');
	  $('#mi_size_container').removeClass('hidden');
	})

}

function buildPostGame(stats) {
	if (BLOCK === 'header') {
		buildHeader('postgame', stats);
	} else if (BLOCK === 'matchup') {
		buildMatchup('postgame', stats);
	} else if (BLOCK === 'upcoming') {
		buildUpcoming('postgame', GAME_SUMMARY.nextGames);
	}
}

function buildLiveGame(stats) {
	if (BLOCK === 'header') {
		buildHeader('livegame', stats);
	} else if (BLOCK === 'matchup') {
		buildMatchup('livegame', stats);
	} else if (BLOCK === 'upcoming') {
		buildUpcoming('livegame', GAME_SUMMARY.nextGames);
	}
}

function buildPreGame(stats) {
	if (BLOCK === 'header') {
		buildHeader('pregame', stats);
	} else if (BLOCK === 'matchup') {
		buildMatchup('pregame', stats);
	} else if (BLOCK === 'upcoming') {
		buildUpcoming('pregame', GAME_SUMMARY.nextGames);
	}
}

export { buildPreGame, buildLiveGame, buildPostGame, buildHeader, buildMatchup, buildUpcoming };