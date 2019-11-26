import React from 'react';
import './Footer.css';

class Footer extends React.Component {
    render() {
        return (
            <footer>
                Weather data provided by&ensp;
                <a href="https://openweathermap.org/">OpenWeatherMap</a>.
            </footer>
        )
    }
}

export default Footer;