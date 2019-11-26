import React from 'react';
import './HourlyItem.css';

class HourlyItem extends React.Component {
    render() {
        return (
            <div className="HourlyItem">
                <div
                    className="HourlyItem-time"
                    title={this.props.dateTime}>
                    {this.props.formattedTime}
                </div>
                <img
                    className="HourlyItem-icon"
                    alt="weather icon"
                    src={this.props.imgSrc}
                    title={this.props.weatherDescription}
                    width="50"
                    height="50" />
                <div className="HourlyItem-temp">{this.props.temp + "°C"}</div>
            </div>
        )
    }
}

export default HourlyItem;