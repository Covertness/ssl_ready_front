import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import thunkMiddleware from 'redux-thunk'
import './index.css';
import App from './containers/SSLReadyApp';
import rootReducer from './reducers';
import registerServiceWorker from './registerServiceWorker';

const store = createStore(
    rootReducer,
    applyMiddleware(
        thunkMiddleware
    ))

ReactDOM.render(<Provider store={store}>
    <App />
</Provider>, document.getElementById('root'));
// registerServiceWorker();
