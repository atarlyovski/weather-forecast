import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import './CurrentWeather.css';
import '../../css/weatherContainer.css';

import store from '../../redux/store';
import { requestWeather } from '../../redux/actions';

class CurrentWeather extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            lastRefresh: null
        }

        this.containerID = "currentWeather";
        this.updateIntervalMs =  10 * 60 * 1000;

        // Set up a refresh interval every 10 minutes
        this.refreshInterval = setInterval(this.refresh.bind(this), this.updateIntervalMs);
    }

    componentDidMount() {
        try {
            this.refresh();
        } catch (err) {
            console.error(err);
            return;
        }
    }

    componentWillUnmount() {
        clearInterval(this.refreshInterval);
    }

    refresh() {
        let now = moment();
        
        if (!this.state.lastRefresh ||
                this.state.lastRefresh.isBefore(now.subtract(this.updateIntervalMs, "ms"))) {
            store.dispatch(requestWeather(this.containerID));
        }
    }

    render() {
        return (
            <div className="weather-container" id={this.containerID}>
                <h2>Current Weather</h2>
                <div id={this.containerID + "-temp"}>
                    {this.props.temperature + "°C"}
                </div>
                <div className="CurrentWeather-icon-container">
                    <div className="table-row">
                        <img
                            height="100"
                            width="100"
                            alt="weather icon"
                            src={this.props.iconSrc}/>
                        <span>{this.props.title}</span>
                    </div>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    var iconSrc = "",
        temperature = "-",
        title = "N/A";

    let weatherInfo = state.currentWeather.isValid ?
        state.currentWeather.weather[0] : null;
    
    if (state.currentWeather.main && weatherInfo) {
        temperature = Math.round(state.currentWeather.main.temp - 273.15);
        iconSrc = state.serverHost + `/api/dashboard/icon?icon=${weatherInfo.icon}`
        title = weatherInfo.main;
    }

    return {
        temperature: temperature,
        iconSrc: iconSrc,
        title: title
    }
}

export default connect(mapStateToProps)(CurrentWeather);