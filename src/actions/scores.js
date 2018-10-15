import { getScoresDB, addScore } from '../firebase';
import actionType from '../constants';

export const loadScores = () => {
    return dispatch => {
        dispatch({
            type: actionType.LOAD_SCORES_REQUEST
        });
        getScoresDB()
            .then(scores => {
                dispatch({
                    type: actionType.LOAD_SCORES_SUCCESS,
                    payload: scores.val()
                })
            })
            .catch(error => {
                dispatch({
                    type: actionType.LOAD_SCORES_FAILED,
                    payload: error
                })
            });
    }
}
export const createScore = (name, time) => {
    return (dispatch) => {
        dispatch({
            type: actionType.ADD_SCORE_REQUEST
        });
        addScore(name, time)
            .then(res => {
                loadScores()(dispatch) //refresh the data
                dispatch({
                    type: actionType.ADD_SCORE_SUCCESS
                })
            })
            .catch(error => {
                dispatch({
                    type: actionType.ADD_SCORE_FAILED,
                    payload: error
                })
            });
    }
}
export const loadScore = (score) => {
    return dispatch => {
        dispatch({
            type: actionType.LOAD_SCORE_REQUEST
        });
        dispatch({
            type: actionType.LOAD_SCORES_SUCCESS,
            payload: score
        });
    }
}