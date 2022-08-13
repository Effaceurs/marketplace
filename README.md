# Marketplace 

## Trello:
https://trello.com/b/FsUKff8K/marketplace

## Services:
Ensure you patched deployed services in order to change the service type to NodePort.
> kubectl patch service ${servicename} -n ${service_namespace} -p '{"spec": {"type": "NodePort"}}'
* MongoDB - PORT:32000
* ArgoCD  - PORT: HTTP-32723;HTTPS-32733
* Grafana - PORT:30714
* Prometheus - PORT:30714
* RabbitMQ - PORT:32222


## Table of contents: 
1. Description
2. Platforms
3. Schema
4. Deploy marketplace in your env
5. CICD
6. Walkthrough
7. Microservices Description


## 1. Description
Marketplace is a web-based application that leverage IAC approach  to provision resources on different platforms by a simple click. 

## 2. Platforms:
* Kubernetes
* Yandex Cloud - not implemented yet

## 3. Schema
<img src="https://gitlab.com/effaceurs90/marketplace/-/raw/main/description/Untitled Diagram.jpg"/>

## 4. Deploy marketplace in your env. 

### Kubernetes:
- Deploy a k8s cluster using any tool you want: RKE, kind, kubeadm
- ensure to use --pod-network-cidr=10.244.0.0/16

### Persistent Volumes:
- on each k8s nodes create dirs: ['/data/mongo','/data/rabbit']

### CNI:
- kubectl apply -f ./flannel
### Message broker

- helm install mu-rabbit stable/rabbitmq --namespace rabbit
- kubectl apply -f ./rabbit-mq

### DB
- kubectl apply -f ./mongodb

### Roles
- kubectl apply -f kubernetes_cluster/status-checker

### Service mesh
- // plan to move to Consul

### CICD
- Deploy gitlab

### Fix configs

* app/config/keys.js
    - amq: replace connection string 
    - mongiURI: replace connection string 
    - jwt: replace to a random string
* /backends/deletion/config/keys.js
    - amq: replace connection string 
    - gitlabpipelinetoken: 
    - gitlabtoken:
    - gitlaburl
    - gitlabpipeline
* /backends/deployment/config/keys.js
    - amq: replace connection string 
    - gitlabpipelinetoken: 
    - gitlabtoken:
    - gitlaburl
    - gitlabpipeline
 * /backends/putStatus/config/keys.js
    - amq: replace connection string 
    - gitlabpipelinetoken: 
    - gitlabtoken:
    - gitlaburl
    - gitlabpipeline   
    - mongiURI: replace connection string 
 * /backends/putStatus/config/ca.crt
    -  replace with k8s api crt
 * /backends/putStatus/config/keys.js
    - TOKEN: token of a service account created in kubernetes_cluster/status-checker
    - kubernetesAPI: replace to your k8s api endpoint   
    - mongiURI: replace connection string 

## 5. Deploy marketplace in your env. 
CI/CD is managed by Gitlab. Deploy your local instance of gitlab.
There are 5 repositories with monobranch - main

marketplace
see dir local_gitlab\repo with repo contents
marketplace-be-deletion
marketplace-be-deployment
marketplace-be-putstatus
marketplace-be-statuschecker

env variables:
KUBE_CONFIG - base64 kube config file with rights to deploy to the k8s cluster.


## 6. Walkthrough. 
<img src="https://gitlab.com/effaceurs90/marketplace/-/raw/main/description/work.gif"/>

### 1. Login Page
Page to log in into your account

### 2. Registration
Click on registration button and provide a valid email + password. 
No email confirmation yet implemented

### 3. Log in into your account
Fill in the gaps with your email and password. Passwords are stored in the DB in encrypted format.

### 4. My applications page
There are no yet any applications running in your account.

### 5. Catalogue page
The list of application that you can provision for your need.

### 6. Add a new application to a catalogue (in development)
The page where you can add a new application into your catalogue list. Make sure that the backed is ready for it. The name of the app/platform should correspond to the backend implementation.

### 7-8. Deploy an app
Click on button and select options for your app. App versions are fetched from the DB, there are only tested versions of apps. 
Click on deploy and check pop up messages about your deployment.

### 9. My applications page
See that the item has been added and having status pending (in yellow). Connection string is not yet identified. 

### 10. Pipeline page (only for admins)
See the stages that the request should go through before deploying and being available for use.

### 11. My applications page
See that the item has green status running and have a link to connect to it. 

### 12. Application
The requested nginx server has been deployed. 

### 13. Check what resources have been created (only for admins)
For each registered users with at least 1 app ever requested there is a namespace. 
tfstate for each requested app is stored in a detached k8s secret.

### 14. Delete an app
Select apps that you want to delete and click on bucket button. Then confirm the operation by typing 'delete' and click delete.

### 15. My applications page
The deletion has been started

### 16. Pipeline page (only for admins)
The pipeline for deletion operation.

### 17. Check what resources have been deleted (only for admins)
See that there are no more resources in users's namespace.

## 7. Microservices Description

### Put status
- Input: 
- Output
- Goal: to update of a status of a resource in the DB (running,down,deleted,deleting,pending)

### Workload monitoring
- Input: 
- Output
- Goal: each 10 seconds does healthchecks against all values in collection `applications` 

### Delete app
- Input: 
- Output
- Goal: delete application by running a gitlab pipeline with specific variables. 

### Deploy app
- Input: 
- Output
- Goal: deploy application by running a gitlab pipeline with specific variables. 

### GitLab CI/CD
- Input: 
- Output
- Goal: includes several stages 
  - checkProviderKubernetes: checks whether namespaces created or not
  - preflight: check if requested module exists and substitute values according to a request.
  - delete: perform terraform destroy command
  - build: perform terraform apply command
  - push: save artifact file with port that app is running
- Runner: 1 as docker container

### Terraform
- Input: 
- Output
- Goal: provision or delete a resource
- Providers:
   - k8s
   - Yandex cloud (in development)
- Backend:
   - as k8s secret
- Namespaces: each user has its own namespace for resources

### k8s
- Input: 
- Output
- Goal: run customer and platform related resources
- Platform resources: MongoDB

### RabbitMQ
- Input: 
- Output
- Goal: message broker
- Queues:
  - applicationDeletionRequest
  - applicationDeploymentRequest
  - applicationPutStatus
