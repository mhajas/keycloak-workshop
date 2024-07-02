import React from 'react';
import Requests from "../components/Requests";


const UserPage = () => {
    return (
        <div style={{margin: "15px"}}>
            <h1>Home page available to everyone</h1>
            <Requests />
        </div>
    );
};

export default UserPage;