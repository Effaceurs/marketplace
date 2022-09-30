# Marketplace 

## Table of contents:  
1. [Description](#Description)
2. [Backlog](#Backlog)
3. [Repositories](#Repositories)
4. [Platforms](#Platforms)
5. [Overview schema](#Overview_schema)
6. [Marketplace components CI/CD](#Marketplace_components_CI/CD)
7. [Deploy marketplace in your env](#Deploy_marketplace_in_your_env)
8. [Walkthrough](#Walkthrough)

## 1. Description
<a name="Description"></a>
Marketplace is a web-based application that leverage IAC approach  to provision resources on different platforms by a simple click. 

## 2. Backlog:
<a name="Backlog"></a>
* [backlog](https://gitlab.com/effaceurs90/marketplace/-/issues)

## 3. Repositories:
<a name="Repositories"></a>
* [marketplace-be-api](https://gitlab.com/effaceurs90/marketplace-be-api)
* [marketplace-be-deletion](https://gitlab.com/effaceurs90/marketplace-be-deletion)
* [marketplace-be-deployment](https://gitlab.com/effaceurs90/marketplace-be-deployment)
* [marketplace-be-pipelines](https://gitlab.com/effaceurs90/marketplace-be-pipelines)
* [marketplace-be-putstatus](https://gitlab.com/effaceurs90/marketplace-be-putstatus)
* [marketplace-be-statuschecker](https://gitlab.com/effaceurs90/marketplace-be-statuschecker)
* [marketplace-fe-portal](https://gitlab.com/effaceurs90/marketplace-fe-portal)


## 4. Platforms:
<a name="Platforms"></a>
* Kubernetes
* Yandex Cloud - not implemented yet

## 5. Overview schema
<a name="Overview_schema"></a>
<img src="https://gitlab.com/effaceurs90/marketplace/-/raw/main/description/app.jpg"/>

## 6. Marketplace components CI/CD
<a name="Marketplace_components_CI/CD"></a>
<img src="https://gitlab.com/effaceurs90/marketplace/-/raw/main/description/deployment.jpg"/>
* 1. Dev pushes a new version of marketplace component to repo
* 2. Trigger gitlab pipeline
* 3. Unit test
* 4. Build docker image with a release
* 5. Push release to a container registry
* 6. Using kustomize update manifest to match a new version of a release
* 7. k8s manifest tests
* 8. Push a new release manifest to the repo
* 9. ArgoCD watches '${repo}\manifests\release' dir and sync application to match a new version
* 10. Argo deploys the app to k8s cluster

## 7. Deploy marketplace in your env.
<a name="Deploy_marketplace_in_your_env"></a>

### Kubernetes:
- Deploy a k8s cluster using any tool you want: RKE, kind, kubeadm
- ensure to use --pod-network-cidr=10.244.0.0/16

### Persistent Volumes:
- on each k8s nodes create dirs: ['/data/mongo','/data/rabbit']

### CNI:
- kubectl apply -f kubernetes_cluster/flannel/

### Message broker

- helm install mu-rabbit stable/rabbitmq --namespace rabbit
- kubectl apply -f kubernetes_cluster/rabbit-mq/

### DB
- kubectl apply -f kubernetes_cluster/mongodb/

### Roles
- kubectl apply -f kubernetes_cluster/status-checker/

### Service mesh
- // plan to move to Consul

### CICD
- Deploy gitlab (https://docs.gitlab.com/ee/install/docker.html)

### CICD
- Deploy argocd (read README kubernetes_cluster/argocd)

### DNS (for ingress)
- kubectl apply -f kubernetes_cluster/bind/

### Ingress
- Deploy bind (read README kubernetes_cluster/ingress-controller)

### Fix configs


* REPO marketplace-fe-portal
  * app/config/keys.js 
    - amq: replace connection string 
    - mongiURI: replace connection string 
    - jwt: replace to a random string
* REPO marketplace-be-deletion
  * config/keys.js
    - amq: replace connection string 
    - gitlabpipelinetoken: 
    - gitlabtoken:
    - gitlaburl
    - gitlabpipeline
* REPO marketplace-be-deployment
  * config/keys.js
    - amq: replace connection string 
    - gitlabpipelinetoken: 
    - gitlabtoken:
    - gitlaburl
    - gitlabpipeline
* REPO marketplace-be-putstatus
  * config/keys.js ()
    - amq: replace connection string 
    - gitlabpipelinetoken: 
    - gitlabtoken:
    - gitlaburl
    - gitlabpipeline   
    - mongiURI: replace connection string 
    * config/ca.crt
    -  replace with k8s api crt
* repo marketplace-be-statuschecker
  * config/keys.js 
    - TOKEN: token of a service account created in kubernetes_cluster/status-checker
    - kubernetesAPI: replace to your k8s api endpoint   
    - mongiURI: replace connection string 

## 8. Walkthrough. 
<a name="Walkthrough"></a>
<img src="https://gitlab.com/effaceurs90/marketplace/-/raw/main/description/work.gif"/>

### 1. Login Page
Page to log in into your account

### 2. Registration
Click on registration button and provide a valid email, username and password. 
No email confirmation yet implemented.
Upon creation of user there is a group with the same username is created.

### 3. Log in into your account
Fill in the gaps with your email and password. Passwords are stored in the DB in encrypted format.

### 4. My applications page
There are no yet any applications running neither in your account or in accounts with whom you share a group membership. 
for instance if you are a member of group MYGROUP and account USER is also a member of group MYGROUP, then you both can see and manage applications that have been deployed within both accounts.

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

