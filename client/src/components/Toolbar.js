import React from 'react';
import { connect } from 'react-redux';
import './Toolbar.css';

import store from '../redux/store';
import { setUser, logOut } from '../redux/actions';

class Toolbar extends React.Component {
    constructor(props) {
        super(props)

        this.logOut = this.logOut.bind(this);
    }

    async componentDidMount() {
        var user,
            response,
            userDataUrl = '/api/user/userData';

        try {
            response = await fetch(this.props.serverHost + userDataUrl, {
                credentials: "include",
                mode: 'cors'
            });

            if (response.ok) {
                user = await response.json();

                if (!user || !user.username) {
                    user = null;
                }
            } else {
                user = null;
            }
        } catch (err) {
            console.error(err);
            return;
        }

        store.dispatch(setUser(user));
    }

    logOut() {
        store.dispatch(logOut());
    }

    render() {
        let isLoggedIn = this.props.user ? true : false;

        let logOutButton = <button
                onClick={this.logOut}
                className="btn">
            Log Out
        </button>

        return (
            <div className="Toolbar">
                <h1>{this.props.location}</h1>
                <div className="Toolbar-user">
                    <div>{isLoggedIn ? this.props.user.username : <i>Not logged in</i>}</div>
                    {isLoggedIn ? logOutButton : null}
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        serverHost: state.serverHost,
        location: state.location,
        user: state.user
    }
}

export default connect(mapStateToProps)(Toolbar);