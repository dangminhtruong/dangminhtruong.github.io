import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import createSagaMiddleware, { END } from 'redux-saga';
import { fromJS } from 'immutable';

const sagaMiddleware = createSagaMiddleware();

export default function configureStore(initialState = {}, rootReducer) {
    const middlewares = [
        sagaMiddleware
    ];

    const store = createStore(
        rootReducer(),
        fromJS(initialState),
        composeWithDevTools(applyMiddleware(...middlewares))
    );

    store.runSaga = sagaMiddleware.run;
    store.close = () => store.dispatch(END);

    return store;
}