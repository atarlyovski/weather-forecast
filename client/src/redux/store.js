import thunkMiddleware from 'redux-thunk';
import { createStore, applyMiddleware, compose } from "redux";
import rootReducer from "./reducers";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const initialState = {
    user: null,
    serverHost: "//localhost:3001",
    location: "Sofia, BG",
    currentWeather: {
        isValid: false
    },
    hourlyWeather: {
        isValid: false
    }
};

export default createStore(
    rootReducer,
    initialState,
    composeEnhancers(
        applyMiddleware(thunkMiddleware)
    )
    //window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);