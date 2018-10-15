import scores from './scores';
import { combineReducers } from 'redux';

//combine mutliple reducers
export default combineReducers({ scoresReducer: scores });