import './App.css';
import {ReactKeycloakProvider} from "@react-keycloak/web";
import keycloak from "./Keycloak";
import React, {useCallback, useState} from "react";
import {AppRouter} from "./components/AppRouter";

const App = () => {
    const [, setTokenUpdateCount] = useState(0);

    const onUpdateToken = useCallback(() => {
        setTokenUpdateCount((value) => value + 1);
    }, []);

    return (
        <ReactKeycloakProvider
            initOptions={{onLoad: 'login-required'}}
            authClient={keycloak}
            onTokens={onUpdateToken}
        >
            <AppRouter />
        </ReactKeycloakProvider>
    );
}

export default App;
