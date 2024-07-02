import React from "react";
import {NavLink} from "react-router-dom";
import {useKeycloak} from "@react-keycloak/web";

const Nav = () => {
    const { keycloak } = useKeycloak();

    return (
        <div style={{margin: "15px"}}>
            <NavLink style={{marginRight: "15px"}} to="/">
                <button>Home</button>
            </NavLink>
            {
                keycloak.hasRealmRole("admin")
                &&
                <NavLink style={{marginRight: "15px"}} to="/secured">
                    <button>Admin Page</button>
                </NavLink>
            }
            <button style={{marginRight: "15px"}} onClick={() => keycloak.updateToken(9999999999)}>Refresh token</button>
            <button style={{marginRight: "15px"}} onClick={() => keycloak.logout()}>Logout</button>
            <span>Logged in as {keycloak.idTokenParsed.preferred_username}</span>
            <hr/>
        </div>
    );
};

export default Nav;