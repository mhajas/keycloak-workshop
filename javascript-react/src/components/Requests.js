import React, {useState} from 'react';
import {useKeycloak} from "@react-keycloak/web";


const Requests = () => {
    const { keycloak } = useKeycloak();

    const [responses, setResponses] = useState([]);

    function loadResponse(url) {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.setRequestHeader('Authorization', 'Bearer ' + keycloak.token);
        xhr.onload = function() {
            if (xhr.status === 200) {
                setResponses(oldArray => [xhr.responseText,...oldArray])
            } else if (xhr.status === 403) {
                setResponses(oldArray => ["Request forbidden",...oldArray])
            }
        };
        xhr.send();
    }

    return (
        <div>
            <div>
                <button onClick={() => loadResponse('http://quarkus-oidc-extension.keycloak-namespace.192.168.49.2.nip.io/user')}>Load quarkus user endpoint</button>
                <button onClick={() => loadResponse('http://quarkus-oidc-extension.keycloak-namespace.192.168.49.2.nip.io/admin')}>Load quarkus admin endpoint</button>
            </div>
            {responses.length !== 0 ? <pre>{responses.join("\n")} </pre> : 'Press buttons above to see responses here...'}
        </div>
    );
};

export default Requests;