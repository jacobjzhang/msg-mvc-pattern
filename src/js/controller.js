__CD__; 			// eslint-disable-line

import $ from 'jquery';
import moment from 'moment';

import { BLOCK, USER_GAME_DATE } from './index.js';
import { getData, inAndPostGameStats, statStore, authValue } from './model.js';
import { buildPreGame, buildLiveGame, buildPostGame, buildHeader, buildMatchup, buildUpcoming } from './view.js';

let GAME_SUMMARY = {};

function getGameBoxScore(game) {
	try {
		game = JSON.parse(game);
		let gState = parseInt(game.gameState);

		if (gState < 3) {
			getData('pregame');
		} else if (gState >= 3 && gState < 7) {
			inAndPostGameStats('livegame', game);
		} else if (gState === 7) {
			console.log('in getGameBoxScore, game is complete')
			inAndPostGameStats('postgame', game);
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
		let nextGames;
		let game = 0;

		let userDate = moment(USER_GAME_DATE, 'MM/DD/YYYY');

		for (game in allGames) {
			let gameDate = moment(allGames[game].date, 'ddd MMM DD HH:mm:ss z YYYY');
			console.log('user inputted date: ' + userDate)
			console.log('actual game date: ' + gameDate)

			if (gameDate.isSame(userDate, 'day')) {
				selectedGame = allGames[game];

				console.log(selectedGame)

				let index = parseInt(game);
				nextGames = {
					'upcoming1' : allGames[index + 1],
					'upcoming2' : allGames[index + 2],
					'upcoming3' : allGames[index + 3]
				}
				console.log(nextGames)
				break;
			}
		}

		GAME_SUMMARY = {
			'id' : selectedGame.gameId,
			'date' : selectedGame.date,
			'oppName' : selectedGame.opponentTeamName,
			'opponent' : selectedGame.abbreviation,
			'nextGames' : nextGames,
			'location' : selectedGame.location
		}

		getData('gamescores');

	} catch(e) {
		$('#mi_size_container').remove();
		console.log('No game on this date ');
	}

};

export { getGameBoxScore, getGameID, GAME_SUMMARY };
