FROM registry.access.redhat.com/ubi8/openjdk-17 AS BUILDER
RUN mkdir -p /home/jboss/work/
COPY . /home/jboss/work/
WORKDIR /home/jboss/work/
ARG MINIKUBE_IP=0
ARG NAMESPACE=keycloak-namespace
RUN mvn -B install -DskipTests -Dminikube.ip=${MINIKUBE_IP} -Dnamespace=${NAMESPACE}

FROM registry.access.redhat.com/ubi8/openjdk-17:1.19

ENV LANGUAGE='en_US:en'


COPY --from=BUILDER --chown=185 /home/jboss/work/target/spring-security-1.0.0-SNAPSHOT.jar /deployments/

EXPOSE 8080
USER 185
WORKDIR /deployments

ENV JAVA_OPTS="-Dserver.address=0.0.0.0"
ARG MINIKUBE_IP=0
ENV MINIKUBE_IP=${MINIKUBE_IP}
ARG NAMESPACE=keycloak-namespace
ENV NAMESPACE=${NAMESPACE}
ENTRYPOINT [ "java", "-jar" , "/deployments/spring-security-1.0.0-SNAPSHOT.jar"]

