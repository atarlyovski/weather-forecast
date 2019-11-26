import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import './HourlyWeather.css';

import store from '../../redux/store';
import { requestWeather } from '../../redux/actions';
import HourlyItem from './HourlyItem';

class HourlyWeather extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            lastRefresh: null
        }

        this.containerID = "hourlyWeather";
        this.updateIntervalMs = 1 * 60 * 60 * 1000;

        // Set up a refresh interval every 1 hour
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

    getHourlyItems() {
        let hourlyItems = null,
            weather = this.props.weather;

        if (weather && weather.list) {
            hourlyItems = weather.list.slice(0);

            // Filter-out any past date-times
            hourlyItems = hourlyItems.filter(
                item => moment(item.dt * 1000).isAfter(moment()))
            
            hourlyItems = hourlyItems.map(hourlyData => {
                let momentOfItem = moment(hourlyData.dt * 1000);

                return <HourlyItem
                    key={hourlyData.dt}
                    temp={Math.round(hourlyData.main.temp - 273.15)}
                    weatherDescription={hourlyData.weather[0].description}
                    imgSrc={this.props.serverHost + `/api/dashboard/icon?icon=${hourlyData.weather[0].icon}`}

                    formattedTime={
                        momentOfItem.isSame(moment(), "day") ?
                        momentOfItem.format("H[h]") :
                        momentOfItem.format("ddd H[h]")}

                    dateTime={momentOfItem.toDate().toLocaleString()}
                />
            });
        }

        return hourlyItems;
    }

    render() {
        let hourlyItems = this.getHourlyItems();

        return (
            <div className="weather-container" id={this.containerID}>
                <h2>Hourly Weather</h2>
                <div id={this.containerID + "-items"}>
                    {hourlyItems}
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        serverHost: state.serverHost,
        weather: state.hourlyWeather
    }
}

export default connect(mapStateToProps)(HourlyWeather);