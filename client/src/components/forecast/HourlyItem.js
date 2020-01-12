import React from 'react';
import './HourlyItem.css';

function HourlyItem(props) {
    return (
        <div className="HourlyItem">
            <div
                className="HourlyItem-time"
                title={props.dateTime}>
                {props.formattedTime}
            </div>
            <img
                className="HourlyItem-icon"
                alt="weather icon"
                src={props.imgSrc}
                title={props.weatherDescription}
                width="50"
                height="50" />
            <div className="HourlyItem-temp">{props.temp + "°C"}</div>
        </div>
    )
}

export default HourlyItem;