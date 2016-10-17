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
const TZ_OFFSET = CD.param('mi_tzoffset') || '-400';

(function init(){
	getData('schedule');
})();

export { BLOCK, USER_GAME_DATE, GAME_SUMMARY, TZ_OFFSET };