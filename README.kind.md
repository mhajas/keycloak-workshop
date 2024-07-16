# Keycloak K8s Workshop in [KinD](https://kind.sigs.k8s.io/)

## Pre-Requisits

- kubectl ([Installation guide here](https://kubernetes.io/docs/tasks/tools/#kubectl))
- Linux or WSL:
    - Docker or Podman inside the WSL
    - KIND ([Installation guide here](https://github.com/kubernetes-sigs/kind/releases))
- Windows
    - Podman Desktop ([Install and add a Podman node and a KIND setup](https://podman-desktop.io/))
    - Configure Podman Desktop ([See documentation](https://podman-desktop.io/docs/kind))
- jq ([Installation guide here](https://jqlang.github.io/jq/))
- Taskfile ([Installation guide here](https://taskfile.dev/installation/))
- OpenSSL for creating certificates (this could be done in docker too)

## Validating Setup
```sh
> which kind
> which kubectl
> which task
> which jq
> which openssl
```

## Automated Setup

```sh
> task -t Taskfile.kind.yaml prepare-kind
> task -t Taskfile.kind.yaml keycloak-deploy-all
> task -t Taskfile.kind.yaml quarkus-deploy-all
> task -t Taskfile.kind.yaml spring-security-deploy
```

## Debugging

```sh
kubectl -n keycloak-namespace exec --stdin --tty <pod-name> -- /bin/bash
```

## TODO
- [ ] Spring does not connect to Keycloak just yet. Debug environment variables
- [ ] generate certificates in docker
- [ ] test running in powershell / replace linux only substitutions
