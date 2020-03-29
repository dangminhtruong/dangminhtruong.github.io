import { combineReducers } from 'redux-immutable';
import Home from './modules/Home';

/**
 * Creates the root reducer with the asynchronously loaded ones
 */

export default function rootReducer(asyncReducers) {
    return combineReducers({
        Home,
        ...asyncReducers
    });
}
