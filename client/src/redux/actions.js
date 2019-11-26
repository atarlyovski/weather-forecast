export const SET_USER = "SET_USER";
export const INVALIDATE_WEATHER = "INVALIDATE_WEATHER";
export const REQUEST_WEATHER = "REQUEST_WEATHER";
export const SET_WEATHER = "SET_WEATHER";
export const SET_FETCHING_FLAG = "SET_FETCHING_FLAG";

export const setUser = user => ({
    type: SET_USER,
    user
})

export const logOut = containerID => {
    return async function (dispatch, getState) {
        let host = getState().serverHost;
        let url = host + "/api/user/logout";
        let response;

        try {
            response = await fetch(url, {
                method: "POST",
                mode: 'cors',
                credentials: "include"
            });

            if (!response.ok) {
                throw new Error("Response status: " + response.status);
            }

            dispatch(setUser(null));
        } catch (err) {
            console.error(err);
            return;
        }
    }
}

export const invalidateWeather = containerID => ({
    type: INVALIDATE_WEATHER,
    containerID
})

export const requestWeather = containerID => {
    return async function (dispatch, getState) {
        let host = getState().serverHost;
        let url = host + "/api/dashboard/" + containerID;
        let response;

        try {
            response = await fetch(url, {mode: 'cors', credentials: "include"});
            response = await response.json();
        } catch (err) {
            console.error(err);
            return;
        }

        dispatch(setWeather(containerID, response));
    }
}

export const setWeather = (containerID, weatherData) => ({
    type: SET_WEATHER,
    containerID,
    weatherData
})

export const setFetchingFlag = (containerID, isFetching) => ({
    type: SET_WEATHER,
    containerID,
    isFetching
})