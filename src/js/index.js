__CD__; 			// eslint-disable-line
__Backpack__; // eslint-disable-line
__Sherlock__; // eslint-disable-line
import $ from 'jquery';
import moment from 'moment';

import { getData, statStore } from './model.js';
import authValue from './view.js';
import './controller.js';

const ITEM_INDEX = CD.param('mi_item_index') || '0';
const BLOCK = CD.param('mi_block') || 'header';
const USER_GAME_DATE = CD.param('mi_date');

(function init(){
	getData('schedule');

	$('#mi_size_container').append('http://www.nhl.com/feed/nhl/club/schedule.json?team=NYR' + authValue);

  $('#mi_size_container').removeClass('hidden').append(`ITEM_INDEX is: ${ITEM_INDEX}`);

})();

export { BLOCK, USER_GAME_DATE, GAME_SUMMARY };