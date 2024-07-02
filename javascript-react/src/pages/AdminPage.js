import React from 'react';
import Requests from "../components/Requests";
import {useKeycloak} from "@react-keycloak/web";


const AdminPage = () => {
    const {keycloak} = useKeycloak();

    return (
        <div style={{margin: "15px"}}>
            <h1>A page available to admin</h1>
            <Requests />
            <h1>Visible only for admin</h1>
            <h3>Access token</h3>
            <pre>{JSON.stringify(keycloak.tokenParsed, null, 2)}</pre>
            <h3>ID Token</h3>
            <pre>{JSON.stringify(keycloak.idTokenParsed, null, 2)}</pre>
            <h3>Refresh Token</h3>
            <pre>{JSON.stringify(keycloak.refreshTokenParsed, null, 2)}</pre>

        </div>
    );
};

export default AdminPage;