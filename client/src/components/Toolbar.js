import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import './Toolbar.css';

import store from '../redux/store';
import { setUser, logOut } from '../redux/actions';

function Toolbar() {
    let { location, user, serverHost } = useSelector(state => state);
    let isLoggedIn = user ? true : false;

    let logOutButton = <button
            onClick={logOutUser}
            className="btn">
        Log Out
    </button>

    useEffect(() => {
        async function fetchData() {
            var user,
                response,
                userDataUrl = '/api/user/userData';

            try {
                response = await fetch(serverHost + userDataUrl, {
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

        fetchData();
    }, [serverHost])

    function logOutUser() {
        store.dispatch(logOut());
    }

    return (
        <div className="Toolbar">
            <h1>{location}</h1>
            <div className="Toolbar-user">
                <div>{isLoggedIn ? user.username : <i>Not logged in</i>}</div>
                {isLoggedIn ? logOutButton : null}
            </div>
        </div>
    )
}

export default Toolbar;