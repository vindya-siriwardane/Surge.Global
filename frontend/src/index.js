import React from "react";

import { usePromiseTracker } from "react-promise-tracker";

import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";
import Popup from 'react-popup';
// import Popup from 'reactjs-popup';
import {BounceLoader} from 'react-spinners';

// const Popup = require('react-popup');

const LoadingIndicator = props => {
	const { promiseInProgress } = usePromiseTracker();
	return (
		promiseInProgress &&
		<h1>Hey some async call in progress ! </h1>
	);
}


ReactDOM.render(
	<React.StrictMode>
		<BrowserRouter>
			<App />
		<BounceLoader loading = {false}/>
			<LoadingIndicator />
			<Popup />,
		</BrowserRouter>
	</React.StrictMode>,
	document.getElementById("root")
);
