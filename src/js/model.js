__CD__; 			// eslint-disable-line
__Backpack__; // eslint-disable-line
__Sherlock__; // eslint-disable-line
import $ from 'jquery';
import moment from 'moment';

import { BLOCK, USER_GAME_DATE } from './index.js';
import sha1 from 'sha1';
import { buildPreGame, buildLiveGame, buildPostGame, buildHeader, buildMatchup, buildUpcoming } from './view.js';
import { getGameBoxScore, getGameID, GAME_SUMMARY } from './controller.js';

const secretKey = '';
const timestamp = new Date().getTime();
const partnerName = '';

const authValue = partnerName + '|' + timestamp + '|' + sha1(partnerName + timestamp + secretKey);

let statStore = {};

function inAndPostGameStats(state, game) {

	console.log('---- manipulating live or complete game stats from API ----')
	console.log(game);

	let nyr = {
		'goals' : 0,
		'shots' : 0,
		'saves' : 0,
		'penalties': 0
	};
	let opp = {
		'goals' : 0,
		'shots' : 0,
		'saves' : 0,
		'penalties': 0
	};


	// determine if this is a home or away game

	if (GAME_SUMMARY.location === 'home') {
		var home = nyr;
		var away = opp;
	} else {
		var away = nyr;
		var home = opp;		
	}

	// calculate goals
	for (let i = 0; i < game.goals.length; i++) {
		if (game.goals[i].ta === 'NYR') {
			nyr['goals']++;
		} else {
			opp['goals']++;
		}
	}

	// calculate shots
	away['shots'] = game.homeGoalieStats[0].totalShots;
	home['shots'] = game.awayGoalieStats[0].totalShots;

	// calculate saves
	home['saves'] = game.homeGoalieStats[0].totalSaves;
	away['saves'] = game.awayGoalieStats[0].totalSaves;

	// calculate penalties
	for (let i = 0; i < game.penalties.length; i++) {
		if (game.penalties[i].ta === 'NYR') {
			nyr['penalties']++;
		} else {
			opp['penalties']++;
		}
	}

	statStore = {
		'nyr' : nyr,
		'opp' : opp
	}

	console.log('location :', GAME_SUMMARY.location, ' state: ', state, statStore);

	(state === 'livegame') ? buildLiveGame(statStore) : buildPostGame(statStore);
}

function preGameStats() {

	CD.getCORS('http://www.nhl.com/stats/rest/individual/team/basic/season/teamsummary?cayenneExp=seasonId=20162017%20and%20gameTypeId=2&factCayenneExp=gamesPlayed%3E=1&sort=[{%22property%22:%22wins%22,%22direction%22:%22DESC%22},{%22property%22:%22points%22,%22direction%22:%22DESC%22}]', function(raw) {
		try {
			const listing = JSON.parse(raw);
			const teams = listing.data;

			for (let team in teams) {
				if (teams[team].teamAbbrev === 'NYR') {
					statStore['rangers'] = teams[team];
				} else if (teams[team].teamAbbrev.indexOf(GAME_SUMMARY.opponent)) {
					statStore['opponent'] = teams[team];
				}

			}

			buildPreGame(statStore);

		} catch(e) {
			console.log('no pregame stats');
			$('#mi_size_container').remove();
		}

	})
}

// getData takes in an unlimited number of arguments in the manner (request type, ID)
function getData() {
	if (arguments[0] === 'schedule') {
		console.log('---- Obtaining Team Schedule ----')
		CD.getCORS('http://www.nhl.com/feed/nhl/club/schedule.json?team=NYR&auth=' + authValue, getGameID);
	} else if (arguments[0] === 'gamescores') {
		console.log('---- Obtaining Game Box Score ----')
		CD.getCORS('http://www.nhl.com/feed/nhl/gamedata/boxscore.json?id=' + GAME_SUMMARY.id + '&auth=' + authValue, getGameBoxScore);		
	} else if (arguments[0] === 'pregame') {
		console.log('---- Obtaining Pre Game Stats ----')
		preGameStats();
	}
}


export { getData, inAndPostGameStats, statStore, authValue };