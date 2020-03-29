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
export const SET_LOADING = 'SET_LOADING'
export const LOAD_STARTGAZERS = 'LOAD_STARTGAZERS'
export const LOAD_STARTGAZERS_SUCESSED = 'LOAD_STARTGAZERS_SUCESSED'

// Action Creators

export const fetchData = createAction(FETCH_REPOSITORIES, payload => payload)
export const fetchDataSuccessed = createAction(FETCH_REPOSITORIES_SUCCESSED, payload => payload)
export const loadMore = createAction(LOAD_MORE_REPOSITORIES, payload => payload)
export const loadMoreSuccessed = createAction(LOAD_MORE_REPOSITORIES_SUCCESSED, payload => payload)
export const setLoading = createAction(SET_LOADING, payload => payload)
export const loadStargazers = createAction(LOAD_STARTGAZERS, payload => payload)
export const loadStargazersSuccessed = createAction(LOAD_STARTGAZERS_SUCESSED, payload => payload)

// Reducer

const initialData = fromJS({
    repositories: [],
    total: 0,
    currentPage: 0,
    lastPage: 0,
    loading: true,
    username: ''
});

const mergeData = (state, action) => {
    const {response, total, username} = action.payload
    let lastPage = 1, currentPage = 1
    
    if(response.headers.link){
        const link = response.headers.link.split(',')[1]
        lastPage = link.match(/page=([^&]*)/)[1]
        currentPage = response.headers.link.match(/page=([^&]*)/)[1] - 1
    }

    return state.merge(fromJS({
        currentPage,
        repositories: response.data,
        lastPage,
        total: total
    })).setIn(['username'], username)
};

const updateLoading = (state, action) => state.setIn(['loading'], action.payload)

const updateMoreData = (state, action) => {
    const {repositories, currentPage} = action.payload
    return state.updateIn(['repositories'], list => list.merge(repositories)).setIn(['currentPage'], currentPage)
                
}

const updateStargazers = (state, action) => {
    return state.updateIn(['repositories'], repos => {
        let id = repos.findIndex(item => item.get('id') === action.payload.repoId)

        if(repos.get(id).toJS().stargazers){
            return repos.updateIn([id, 'stargazers'], item => item.merge(fromJS(action.payload.data)))
        }

        return repos.updateIn([id], item => item.merge(fromJS({'stargazers': action.payload.data})))
    })
}

export default handleActions({
    [FETCH_REPOSITORIES_SUCCESSED] : mergeData,
    [LOAD_MORE_REPOSITORIES_SUCCESSED]: updateMoreData,
    [SET_LOADING]: updateLoading,
    [LOAD_STARTGAZERS_SUCESSED]: updateStargazers
}, initialData)

// Selectors

export const selectData = state => state.get('Home', ['repositories', 'total', 'lastPage', 'currentPage', 'loading'])

// Sagas

export function* homeSagas() {
    yield all([
        takeLatest(FETCH_REPOSITORIES, handleFetchData),
        takeLatest(LOAD_MORE_REPOSITORIES, handleLoadMore),
        takeLatest(LOAD_STARTGAZERS, handleLoadStargazers),
    ]);
}

function* handleFetchData(action) {
    try{
        yield put(setLoading(true))
        const response = yield call(execFetchDataApi, action.payload)
        const total = yield call(execFetchTotalReposApi, action.payload)
        yield put(fetchDataSuccessed({response, total, username: action.payload.username}));
    }
    catch(err){
        message.error(`Oops, could not fetch user repositories!`)
    }
    finally{
        yield put(setLoading(false))
    }
}

function* handleLoadStargazers(action) {
    try{
        yield put(setLoading(true))
        const {data} = yield call(execLoadStargazersaApi, action.payload)
        yield put(loadStargazersSuccessed({data, repoId: action.payload.repoId}));
    }
    catch(err){
        message.error(`Oops, could not fetch user repositories!`)
    }
    finally{
        yield put(setLoading(false))
    }
}

function* handleLoadMore(action) {
    try{
        yield put(setLoading(true))
        const response = yield call(execFetchDataApi, action.payload);
        yield put(loadMoreSuccessed({repositories: response.data, currentPage: action.payload}))
    }
    catch(err){
        message.error(`Oops, could not fetch user repositories!`);
    }
    finally{
        yield put(setLoading(false))
    }
}

// Api

export function execFetchDataApi({username, page}) {
    return axios.get(`users/${username}/repos?page=${page}&per_page=${PER_PAGE}`)
        .then(response => response)
        .catch(error => console.log(error))
}

export function execLoadStargazersaApi({url}) {
    return axios.get(url)
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

