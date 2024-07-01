import Keycloak from 'keycloak-js'

const keycloakConfig = {
    url: 'https://keycloak.keycloak-namespace.192.168.49.2.nip.io/',
    realm: 'riviera-dev-realm',
    clientId: 'javascript-react',
}

const keycloak = new Keycloak(keycloakConfig)

export default keycloak