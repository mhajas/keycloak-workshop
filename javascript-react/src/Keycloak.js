import Keycloak from 'keycloak-js'

const keycloakConfig = {
    url: process.env.REACT_APP_KEYCLOAK_URL,
    realm: 'riviera-dev-realm',
    clientId: 'javascript-react',
}

const keycloak = new Keycloak(keycloakConfig)

export default keycloak