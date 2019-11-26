import React from 'react';
import { connect } from 'react-redux';

import CurrentWeather from './forecast/CurrentWeather';
import HourlyWeather from './forecast/HourlyWeather';
import './ForecastContainer.css';

class ForecastContainer extends React.Component {
    render() {
        let privileges = this.props.privileges || {};

        return (
            <div className="ForecastContainer">
                <CurrentWeather />
                {privileges.canSeeLongTermForecast ? <HourlyWeather /> : null}
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        privileges: state.user && state.user.privileges
    }
}

export default connect(mapStateToProps)(ForecastContainer);