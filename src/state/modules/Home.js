import { fromJS } from 'immutable'
import {put, call, takeLatest, all} from 'redux-saga/effects'
import { createAction, handleActions } from 'redux-actions'
import axios from '../../utils/axios'
import { message } from 'antd'

const PER_PAGE = 30

// Actions
export const FETCH_REPOSITORIES = 'FETCH_REPOSITORIES'
export const FETCH_REPOSITORIES_SUCCESSED = 'FETCH_REPOSITORIES_SUCCESSED'
export const LOAD_MORE_REPOSITORIES = 'LOAD_MORE_REPOSITORIES'
export const LOAD_MORE_REPOSITORIES_SUCCESSED = 'LOAD_MORE_REPOSITORIES_SUCCESSED'

// Action Creators

export const fetchData = createAction(FETCH_REPOSITORIES, payload => payload)
export const fetchDataSuccessed = createAction(FETCH_REPOSITORIES_SUCCESSED, payload => payload)
export const loadMore = createAction(LOAD_MORE_REPOSITORIES, payload => payload)
export const loadMoreSuccessed = createAction(LOAD_MORE_REPOSITORIES_SUCCESSED, payload => payload)

// Reducer

const initialData = fromJS({
    repositories: [],
    total: 0,
    currentPage: 0,
    lastPage: 0,
    loading: false,
    username: ''
});

const mergeData = (state, action) => {
    const {response, total, username} = action.payload
    const link = response.headers.link.split(',')[1]

    return state.merge(fromJS({
        currentPage: response.headers.link.match(/page=([^&]*)/)[1] - 1,
        repositories: response.data,
        lastPage: link.match(/page=([^&]*)/)[1],
        total: total
    })).setIn(['username'], username)
};

const updateMoreData = (state, action) => {
    const {repositories, currentPage} = action.payload
    return state.updateIn(['repositories'], list => list.merge(repositories)).setIn(['currentPage'], currentPage)
                
}

export default handleActions({
    [FETCH_REPOSITORIES_SUCCESSED] : mergeData,
    [LOAD_MORE_REPOSITORIES_SUCCESSED]: updateMoreData,
}, initialData);

// Selectors

export const selectRepositories = state => state.get('Home', ['repositories', 'total', 'lastPage', 'currentPage']) 

// Sagas

export function* homeSagas() {
    yield all([
        takeLatest(FETCH_REPOSITORIES, handleFetchData),
        takeLatest(LOAD_MORE_REPOSITORIES, handleLoadMore),
    ]);
}

function* handleFetchData(action) {
    try{
        const response = yield call(execFetchDataApi, action.payload)
        const total = yield call(execFetchTotalReposApi, action.payload)
        yield put(fetchDataSuccessed({response, total, username: action.payload.username}));
    }catch(err){
        message.error(`Oops, could not fetch user repositories!`)
    }
}

function* handleLoadMore(action) {
    try{
        const response = yield call(execFetchDataApi, action.payload);
        yield put(loadMoreSuccessed({repositories: response.data, currentPage: action.payload}))
    }catch(err){
        message.error(`Oops, could not fetch user repositories!`);
    }
}

// Api

export function execFetchDataApi({username, page}) {
    return axios.get(`users/${username}/repos?page=${page}&per_page=${PER_PAGE}`)
        .then(response => response)
        .catch(error => console.log(error))
}


export function execFetchTotalReposApi({username}) {
    return axios.get(`users/${username}/repos?page=1&per_page=1`)
        .then(response => {
            const link = response.headers.link.split(',')[1]
            return link.match(/page=([^&]*)/)[1]
        })
        .catch(error => console.log(error))
}

