import {
    SET_USER,
    INVALIDATE_WEATHER,
    SET_WEATHER,
    SET_FETCHING_FLAG
} from './actions';

import { initialState } from './store';

export default function rootReducer(state = initialState, action) {
    switch (action.type) {
        case SET_USER:
            return Object.assign({}, state, { user: action.user });

        case INVALIDATE_WEATHER:
            return Object.assign({}, state, {
                [action.containerID]: {
                    isValid: false
                }});

        case SET_WEATHER:
            return Object.assign({}, state, {
                [action.containerID]: Object.assign({
                    isValid: true
                }, action.weatherData)});

        case SET_FETCHING_FLAG:
            return Object.assign({}, state, {
                [action.containerID]: {
                    isFetching: action.isFetching
                }});

        default:
            break;
    }

    return state;
}