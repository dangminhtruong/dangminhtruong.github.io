import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from './state/configureStore';
import rootSaga from './state/rootSaga';
import rootReducer from './state/rootReducer';
import LoadableComponent from './utils/loadable-component';
import 'antd/dist/antd.css';

const Home = LoadableComponent(() => import('./pages/Home/Home'));

if (module.hot) {
    module.hot.accept();
}

const initialState = {};
const store = configureStore(initialState, rootReducer);
store.runSaga(rootSaga);

const Root = () => (
    <Provider store={store}>
        <Home />
    </Provider>
);

ReactDOM.render(<Root />, document.getElementById('root'));