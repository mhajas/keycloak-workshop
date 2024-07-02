import React, {useEffect, useState} from 'react';
import {useKeycloak} from "@react-keycloak/web";


const Requests = () => {
    const { keycloak } = useKeycloak();

    const [responseMap, setResponseMap] = useState(new Map());

    const list = [
        { url: process.env.REACT_APP_QUARKUS_URL + '/user', name: 'Quarkus user endpoint'},
        { url: process.env.REACT_APP_QUARKUS_URL + '/admin', name: 'Quarkus admin endpoint'},
        { url: process.env.REACT_APP_SPRINGBOOT_URL + '/', name: 'SpringBoot user endpoint'},
        { url: process.env.REACT_APP_SPRINGBOOT_URL + '/protected/premium', name: 'SpringBoot admin endpoint'},
    ]

    useEffect(() => {
        const headers = { 'Authorization': 'Bearer ' + keycloak.token };

        const fetchDataForPosts = async (item) => {
            try {
                const response = await fetch(item.url, { headers });
                const data = await response.text();
                setResponseMap(new Map(responseMap.set(item.name, {status: response.status + " - " + response.statusText, data})))
                console.log(responseMap)
            } catch (err) {
                setResponseMap(new Map(responseMap.set(item.name, err)));
            }
        };

        list.forEach((item) => {
            fetchDataForPosts(item).then(r => console.log(r)).catch(e => console.error(e));
        });
    }, [keycloak.token]);

    return (
        <div>
            {responseMap.size === 0 ? 'Loading...'
                : list.map((value) => {
                return (
                    <div style={{display: "inline-block", borderStyle: "solid", borderRadius: "5px", borderColor: "grey", marginRight: "15px", marginBottom: "15px", padding: "15px"}}>
                        <h2>{value.name}</h2>
                        <hr />
                        <pre>{JSON.stringify(responseMap.get(value.name))}</pre>
                    </div>
                )
            })}
        </div>
    );
};

export default Requests;