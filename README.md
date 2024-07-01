Steps to deploy:

1. `task deploy-keycloak`
2. Keycloak realm creation is not yet automated. I used `riviera-dev-realm` and `quarkus-oidc-extension`. In this version they need to be create manually
3. `task deploy-quakus-api`
4. `task deploy-spa-frontend`

Test deployment:
1. Obtain Keycloak token for the created realm
2. Call `curl http://api.keycloak-namespace.192.168.59.100.nip.io/api/users/me --header "Authorization: Bearer $TOKEN"` 
3. If the user has a realm role `user`, the response is: `{"userName":"admin"}%`
4. The frontend app should be available at `http://frontend.keycloak-namespace.192.168.59.100.nip.io`
