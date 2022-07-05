import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";
import {BounceLoader} from 'react-spinners';



ReactDOM.render(
	<React.StrictMode>
		<BrowserRouter>
			<App />
		<BounceLoader loading = {false}/>

		</BrowserRouter>
	</React.StrictMode>,
	document.getElementById("root")
);
