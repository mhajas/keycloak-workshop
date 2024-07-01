import './App.css';
import {ReactKeycloakProvider} from "@react-keycloak/web";
import keycloak from "./Keycloak";
import React from "react";
import {AppRouter} from "./components/AppRouter";

const App = () => {
    return (
        <ReactKeycloakProvider
            initOptions={{onLoad: 'login-required'}}
            authClient={keycloak}
        >
            <AppRouter />
        </ReactKeycloakProvider>
    );
}

export default App;
