import _ from 'lodash';
import actionType from '../constants';

//reduce state 
let initialState = {
    scores: [],
    score: 0
}

export default (state = initialState, action) => {
    let newState = _.merge({}, state);
    switch (action.type) {
        case actionType.LOAD_SCORES_SUCCESS:
            newState.scores = action.payload;
            return newState;
        case actionType.LOAD_SCORE_SUCCESS:
            newState.score = action.payload;
            return newState;
        default:
            return state;
    }
}
