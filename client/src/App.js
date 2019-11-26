import React from 'react';
import './App.css';
import { connect } from 'react-redux';

import Toolbar from './components/Toolbar';
import LoginForm from './components/LoginForm';
import ForecastContainer from './components/ForecastContainer';
import Footer from './components/Footer';

class App extends React.Component {
    render() {
        let loginForm = null,
            forecastContainer = null;

        if (!this.props.user) {
            // Unless the user is logged in, render the login form
            loginForm = <LoginForm />;
        } else {
            // If the user is logged in, render the content
            forecastContainer = <ForecastContainer />;
        }

        return (
            <div className="App">
                <Toolbar />
                <div id="site-content" style={{flex: 1}}>
                    {loginForm}
                    {forecastContainer}
                </div>
                <Footer />
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        user: state.user
    }
}

export default connect(mapStateToProps)(App);
