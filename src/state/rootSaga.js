import { all, fork } from 'redux-saga/effects';
import { homeSagas } from './modules/Home';

export default function* rootSaga() {
    yield all([
        fork(homeSagas),
    ]);
}