import React from 'react';
import { useSelector } from 'react-redux';

import CurrentWeather from './forecast/CurrentWeather';
import HourlyWeather from './forecast/HourlyWeather';
import './ForecastContainer.css';

function ForecastContainer() {
    let privileges = useSelector(
        state => state.user && state.user.privileges
    ) || {};

    return (
        <div className="ForecastContainer">
            <CurrentWeather />
            {privileges.canSeeLongTermForecast ? <HourlyWeather /> : null}
        </div>
    )
}

export default ForecastContainer;
// export default connect(mapStateToProps)(ForecastContainer);