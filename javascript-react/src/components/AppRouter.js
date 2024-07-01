import Nav from "./Nav";
import {HashRouter, Route, Routes} from "react-router-dom";
import UserPage from "../pages/UserPage";
import AdminPage from "../pages/AdminPage";
import React from "react";
import {useKeycloak} from "@react-keycloak/web";

export const AppRouter = () => {
    const { keycloak, initialized } = useKeycloak();

    if (!initialized) {
        return <div>Loading...</div>;
    }

    return (
        <HashRouter>
            <Nav/>
            <Routes>
                <Route path="/secured" element={<AdminPage/>}/>
                <Route path="/" element={<UserPage/>}/>
            </Routes>
        </HashRouter>
    );
}
