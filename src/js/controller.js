__CD__; 			// eslint-disable-line
__Backpack__; // eslint-disable-line
__Sherlock__; // eslint-disable-line
import $ from 'jquery';
import moment from 'moment';

import { BLOCK, USER_GAME_DATE } from './index.js';
import { getData, statStore } from './model.js';
import authValue from './view.js';
import './controller.js';

let GAME_SUMMARY = {};

function getGameBoxScore(game) {
	try {
		game = JSON.parse(game);
		let gState = parseInt(game.gameState);

		console.log(game);

		if (gState < 3) {
			getData('pregame');
		} else if (gState >= 3 && gState < 7) {
			buildLiveGame(game);
		} else if (gState === 7) {
			buildPostGame(game);
		}

	} catch(e) {
		$('#mi_size_container').remove();
	}
}

function getGameID(raw) {
	try {
		raw = JSON.parse(raw);
		var allGames = raw.games;

		let selectedGame;
		let game = 0;

		let userDate = moment(USER_GAME_DATE, 'MM/DD/YYYY');

		for (game in allGames) {
			let gameDate = moment(allGames[game].date);
			if (gameDate.isSame(userDate, 'day')) {
				selectedGame = allGames[game];
			}
		}

		GAME_SUMMARY = {
			'id' : selectedGame.gameId,
			'date' : selectedGame.date,
			'opponentTeamName' : selectedGame.opponentTeamName
		}

		getData('gamescores');

	} catch(e) {
		console.log('No game on this date ', e);
	}

};

export { getGameBoxScore, getGameID, GAME_SUMMARY };
