import * as firebase from 'firebase';
import scoreModel from './models/score';

let database;

export const init = () => {
    let config = {
        apiKey: "AIzaSyBG-_g6PUikAk_CYK4SPE2t2xkiZtAA3Rg",
        authDomain: "minesweeper-750.firebaseapp.com",
        databaseURL: "https://minesweeper-750.firebaseio.com",
        projectId: "minesweeper-750",
        storageBucket: "minesweeper-750.appspot.com",
        messagingSenderId: "849580120536"
    }
    firebase.initializeApp(config);
    database = firebase.database();    
}

// retrieve from firebase
// return promise object
export const getScoresDB = () => {
    return database.ref('/').once('value');
}
// get specified score
//export const getScoreDB = (scoreId) => {
//    return database.ref('/${id}').once('value');
//}
// add new score
export const addScore = (name, score) => {
    console.log(score);
    let key = database.ref('/').push().key;
    let model = scoreModel(key, name, score, firebase.database.ServerValue.TIMESTAMP);
    return database.ref('/' + key).set(model);
}
