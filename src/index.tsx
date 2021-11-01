import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import store from "./store/store";
import {Provider} from "react-redux";
import {BrowserRouter} from "react-router-dom";

//@ts-ignore
window.st = store.getState();
ReactDOM.render(
    <BrowserRouter>
        <Provider store={store}>
            <App/>
        </Provider>
    </BrowserRouter>
    ,
    document.getElementById('root')
);