import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { browserHistory } from 'react-router';
import Routes from './routes';
import { init as firebaseInit } from './firebase';
import configureStore from './configureStore';

export default class Root extends Component {
    constructor(props) {        
        super(props);
        firebaseInit();
        this.store = configureStore();
    }
    render() {
        return (
            <Provider store={this.store}>
                <Routes history={browserHistory} />
            </Provider>
        )
    }
}