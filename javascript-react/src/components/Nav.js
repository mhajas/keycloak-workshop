import React from "react";
import {NavLink} from "react-router-dom";
import keycloak from "../Keycloak";

const Nav = () => {
    return (
        <div>
            <NavLink to="/">
                <button>Home</button>
            </NavLink>
            {
                keycloak.hasRealmRole("admin")
                &&
                <NavLink to="/secured">
                    <button>Admin Page</button>
                </NavLink>
            }
            <button onClick={() => keycloak.logout()}>Logout</button>
            <span>Logged in as {keycloak.idTokenParsed.preferred_username}</span>
            <hr/>
        </div>
    );
};

export default Nav;