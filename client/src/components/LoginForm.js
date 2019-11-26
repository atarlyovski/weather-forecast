import React from 'react';
import { connect } from 'react-redux';
import './LoginForm.css';
import '../css/button.css';

import store from '../redux/store';
import { setUser } from '../redux/actions';

class LoginForm extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            isInProgress: false,
            formData: {
                username: "",
                password: ""
            },
            validationMessages: {
                username: "",
                password: "",
                common: ""
            }
        }

        this.onLoginClick = this.onLoginClick.bind(this);
        this.onInputChange = this.onInputChange.bind(this);
    }

    async onLoginClick(event) {
        var loginUrl = "/api/user/login",
            response,
            result;

        event.preventDefault();

        this.setState({
            validationMessages: {
                username: "",
                password: "",
                common: ""
            }
        })

        if (!this.inputsAreValid(this.state.formData.username, this.state.formData.password)) {
            return;
        }

        let body = "username=" + encodeURIComponent(this.state.formData.username);
        body += "&password=" + encodeURIComponent(this.state.formData.password);

        this.setState({
            isInProgress: true
        });

        try {
            response = await fetch(this.props.serverHost + loginUrl, {
                method: 'POST',
                credentials: 'include',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: body
            })

            result = await response.json();

            this.setState({
                isInProgress: false
            });

            if (response.ok && result.success) {
                store.dispatch(setUser(result.user));
            } else if (!result.success) {
                this.setState({
                    validationMessages: {
                        common: "The user name or password is incorrect."
                    }
                })
            }
        } catch (err) {
            console.error(err);
        }
    }

    inputsAreValid(username, password) {
        var usernamePattern = /^[a-zA-Z0-9_]*$/,
            areAllValid = true;

        if (!username || !usernamePattern.test(username)) {
            this.setState(state => {
                let validationMessages = Object.create(state.validationMessages);
                validationMessages.username = "Please enter a username with only alphanumeric characters!";

                return { validationMessages }
            })

            areAllValid = false
        }

        if (!password) {
            this.setState(state => {
                let validationMessages = Object.create(state.validationMessages);
                validationMessages.password = "Please enter a password!"

                return { validationMessages }
            })

            areAllValid = false
        }

        return areAllValid;
    }

    onInputChange(event) {
        let formData = Object.create(this.state.formData);

        formData[event.target.getAttribute("name")] = event.target.value;

        this.setState({ formData });
    }

    render() {
        return (
            <form className="LoginForm">
                <div className="form-group">
                    <input
                        type="text"
                        name="username"
                        placeholder="User name"
                        onChange={this.onInputChange}/>
                </div>
                <div className="form-group">
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        onChange={this.onInputChange}/>
                </div>
                <div className="alert alert-danger">
                    {this.state.validationMessages.username}
                </div>
                <div className="alert alert-danger">
                    {this.state.validationMessages.password}
                </div>
                <div className="alert alert-danger">
                    {this.state.validationMessages.common}
                </div>
                <button
                    className="btn"
                    type="submit"
                    onClick={this.onLoginClick}
                    disabled={this.state.isInProgress}>
                        {this.state.isInProgress ? "Please wait..." : "Log in"}
                </button>
            </form>
        )
    }
}

function mapStateToProps(state) {
    return {
        serverHost: state.serverHost,
        user: state.user
    }
}

export default connect(mapStateToProps)(LoginForm);