import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import reducers from './reducers'

//middleware for any additional tasks 
export default () => {
    let middlewares = [thunk];
    let store = createStore(reducers, applyMiddleware(...middlewares));
    return store;
}