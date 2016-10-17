__CD__; 			// eslint-disable-line
__Backpack__; // eslint-disable-line
__Sherlock__; // eslint-disable-line
import $ from 'jquery';
import moment from 'moment';

import { BLOCK, USER_GAME_DATE } from './index.js';
import sha1 from 'sha1';
import './view.js';
import { getGameBoxScore, getGameID, GAME_SUMMARY } from './controller.js';

const secretKey = '91ebd5721e4aaae4242ddfe9f8281ad5';
const timestamp = new Date().getTime();
const partnerName = 'MovableInk_NYR-Newsletter';

const authValue = partnerName + '|' + timestamp + '|' + sha1(partnerName + timestamp + secretKey);

let statStore = {};

function postGameStats() {

}

function inGameStats() {

}

function preGameStats() {

	CD.getCORS('http://www.hockey-reference.com/teams/NYR/2017.html', function(raw) {
		const $doc = $(raw);
		const tableRows = $doc.find('td.right');

		console.log(tableRows)

		const thisStat = tableRows.filter(function(i, v) {
			console.log($(v).attr('data-stat'), i, v);
			if (v.attr('data-stat') === 'total_goals_per_game') {
				return true;
			} else {
				return false;
			}
		});

		console.log('finalizing pregame stats: ', tableRows, thisStat);

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
		console.log('in here')
		preGameStats();
	}
}


export { getData, statStore };