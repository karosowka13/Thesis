import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { createStore, applyMiddleware, compose, combineReducers } from "redux";
import thunk from "redux-thunk";

import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import authReducer from "./store/reducers/auth";
import traininglogReducer from "./store/reducers/traininglog";
import chartReducer from "./store/reducers/chart";
import statisticsReducer from "./store/reducers/statistics";
import dateReducer from "./store/reducers/date";
import profileReducer from "./store/reducers/profile";
import { BrowserRouter } from "react-router-dom";

const composeEnhancers =
	(window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ &&
		window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
			trace: true,
			traceLimit: 25,
		})) ||
	compose;

const rootReducer = combineReducers({
	auth: authReducer,
	loadTraininglog: traininglogReducer,
	chart: chartReducer,
	statistics: statisticsReducer,
	date: dateReducer,
	profile: profileReducer,
});

const store = createStore(
	rootReducer,
	composeEnhancers(applyMiddleware(thunk))
);

ReactDOM.render(
	<React.StrictMode>
		<Provider store={store}>
			<BrowserRouter>
				<App />
			</BrowserRouter>
		</Provider>
	</React.StrictMode>,
	document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
//serviceWorker.register();
