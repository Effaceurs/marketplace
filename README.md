# Marketplace 

## Trello:
https://trello.com/b/FsUKff8K/marketplace

## Table of contents: 
1. Description
2. Platforms
3. Schema
4. Deploy marketplace in your env
5. Walkthrough
6. Microservices Description


## 1. Description
Marketplace is a web-based application that levarege IAC apporoach to provision resources on different platforms by a simple click. 

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

## 5. Walkthrough. 
<img src="https://gitlab.com/effaceurs90/marketplace/-/raw/main/description/work.gif"/>

## 6. Microservices Description

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
