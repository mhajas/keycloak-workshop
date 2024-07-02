# Keycloak Kuberentes workshop

This workshop provides an example of how to deploy a Keycloak server on Kubernetes and use it to secure a Quarkus API, SpringBoot API and a React frontend.

It provides two ways on how to follow instructions:

##  Automated deployments

All steps are automated. This can be used to quickly setup the environment without any manual steps.

### Prerequisites

- Minikube ([Installation guide here](https://minikube.sigs.k8s.io/docs/start/?arch=%2Flinux%2Fx86-64%2Fstable%2Fbinary+download))
- Taskfile ([Installation guide here](https://taskfile.dev/#/installation)) 
- OpenSSL for creating certificates

## Manual deployment

All steps are done manually and are described in this guide.

### Prerequisites
- OpenSSL for creating certificates

## Workshop steps

Below you can find the steps of the workshop that contain both manual and automated steps.

### Prepare Kubernetes environment

This workshop requires Kubernetes environment that supports Ingress. 

#### Minikube setup

To start Minikube and enable Ingress, execute the following command:

[Automated]
```bash
task prepare-minikube
```

[Manual]
```bash
minikube start
minikube addons enable ingress
minikube addons enable ingress-dns
```

### Deploying Keycloak

This step deploys Keycloak operator, Postgres database, Keycloak server and a Keycloak realm names `riviera-dev-realm` with all necessary resources.

#### Automated deployment

```bash
task keycloak-deploy-all
```

#### Manual deployment


1. Create a namespace for Keycloak
    ```bash
    kubectl create namespace keycloak-namespace
    ```
2. Deploy Keycloak operator - this deploys Keycloak operator version 25.0.1
    ```bash
    kubectl -n keycloak-namespace apply -f https://raw.githubusercontent.com/keycloak/keycloak-k8s-resources/refs/tags/25.0.1/kubernetes/keycloaks.k8s.keycloak.org-v1.yml
    kubectl -n keycloak-namespace apply -f https://raw.githubusercontent.com/keycloak/keycloak-k8s-resources/refs/tags/25.0.1/kubernetes/keycloakrealmimports.k8s.keycloak.org-v1.yml
    kubectl -n keycloak-namespace apply -f https://raw.githubusercontent.com/keycloak/keycloak-k8s-resources/refs/tags/25.0.1/kubernetes/kubernetes.yml
    ```
3. Deploy Postgres database - this deploys PostgreSQL database that will be used as Keycloak storage 
    ```bash
    kubectl -n keycloak-namespace apply -f keycloak/k8s-resources/postgres.yaml
    ```
4. We will configure TLS for Keycloak and therefore, we need to create a Kubernetes Secret with a certificate and a key.
    1. Create a self-signed certificate using OpenSSL, for this step it is necessary to replace `KEYCLOAK_URL` and `KEYCLOAK_IP` with actual values. For Minikube the values are: `KEYCLOAK_URL`=`keycloak.keycloak-namespace.$(minikube ip).nip.io` and `KEYCLOAK_IP`=`$(minikube ip)`.
       ```bash
       openssl req -subj '/CN=KEYCLOAK_URL/O=Test Keycloak./C=US' -addext "subjectAltName = IP:KEYCLOAK_IP, DNS:KEYCLOAK_URL" -newkey rsa:2048 -nodes -keyout keycloak_key.pem -x509 -days 365 -out keycloak_certificate.pem
       ```
    2. Create a Kubernetes Secret with the certificate and key. Note that `keycloak-tls-secret` is the name of the secret that will be used in the Keycloak deployment later.
       ```bash
       kubectl -n keycloak-namespace create secret tls keycloak-tls-secret --cert=keycloak_certificate.pem --key=keycloak_key.pem
       ```
    3. Later in the workshop, we need to configure applications to trust this certificate, therefore we will prepare JKS truststore named `i-trust-keycloak.jks`. Note `KEYCLOAK_URL` is the same as in the previous step.
         ```bash
         openssl x509 -outform der -in keycloak_certificate.pem -out keycloak_certificate.der
         keytool -import -alias KEYCLOAK_URL -keystore i-trust-keycloak.jks -file keycloak_certificate.der -storepass password -noprompt
         ```
5. Deploy Keycloak server. File `keycloak/k8s-resources/keycloak.yaml` need to be changed to contain hostname that will be used for accessing Keycloak. It needs to be the same as the one specified when creating the certificate above. Look for the comment `# REPLACE WITH KEYCLOAK_URL`. Then execute the following command:
    ```bash
    kubectl -n keycloak-namespace apply -f keycloak/k8s-resources/keycloak.yaml
    ```
6. Wait until Keycloak is ready. You can use the following command that will do the waiting for you.
    ```bash
    kubectl -n keycloak-namespace wait --for=condition=Ready --timeout=180s keycloaks.k8s.keycloak.org/keycloak-riviera-dev
    ```
7. This workshop assumes there is no TLS termination on the proxy configured. At the moment, there seems to be a bug in Minikube and therefore we need to use a workaround to make Ingress advertise the correct certificate by the following command. Make sure you replace `KEYCLOAK_URL` the same way as in the previous steps.
    ```bash
    kubectl -n keycloak-namespace apply -f keycloak/k8s-resources/keycloak-ingress-tls-patch.yaml
    ```
8. Create Keycloak realm with all necessary resources. This step creates:
   - Realm `riviera-dev-realm`
   - Clients for all application we will use in this workshop
   - Roles `admin` and `user`
   - Users `admin` (with role `admin`) and `user` (with role `user`) with passwords `admin` and `user`.
   
   Keycloak needs to be aware of locations of each application it is securing, therefore the file `keycloak/k8s-resources/keycloak-realm-import.yaml` needs to be updated with the actual URLs (Note this step can be done later in the Keycloak admin console). Look for the comment `# REPLACE WITH APPLICATION_URL` and replace the URLs with actual values. Note in some cases you need to append `/*` to the URL. 
   Then execute the following command:
    ```bash
    kubectl -n keycloak-namespace apply -f keycloak/k8s-resources/keycloak-realm-import.yaml
    ```
   
#### Validate Keycloak deployment

Obtain the Keycloak URL and credentials by executing the following command (for [Automated] deployments this is printed automatically):
```bash
echo "Access Keycloak on https://$(kubectl -n keycloak-namespace get ingress/keycloak-riviera-dev-ingress -o jsonpath='{.spec.rules[0].host}')"
echo "Username:" $(kubectl -n keycloak-namespace get secrets keycloak-riviera-dev-initial-admin -o json | jq .data.username -r | base64 -d)
echo "Password:" $(kubectl -n keycloak-namespace get secrets keycloak-riviera-dev-initial-admin -o json | jq .data.password -r | base64 -d)
```

Access Keycloak on the printed URL and login with the printed credentials. You should be able to access Keycloak admin console and `riviera-dev-realm` should be available if created. 


