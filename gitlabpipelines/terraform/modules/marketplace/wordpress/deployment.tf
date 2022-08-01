resource "kubernetes_deployment" "wordpress_mysql" {
  metadata {
    name = "mysql${var.id}"
    namespace = var.namespace
    labels = {
      app = "mysql${var.id}"
      version = var.appVersion
    }
  }
  spec {
    replicas = 1
    selector {
      match_labels = {
        app = "mysql${var.id}"
      }
    }
    template {
      metadata {
        labels = {
          app = "mysql${var.id}"
          version = var.appVersion        
        }
      }
      spec {
        container {
          image = "mysql:5.6"
          name = "mysql${var.id}"
          port {
            container_port = 3306
          }
          env {
            name = "MYSQL_ROOT_PASSWORD"
            value_from  {
              secret_key_ref {
                name = kubernetes_secret.mysql.metadata[0].name
                key  = "password"
              }
              }
          }
          }
        }
      }
    }
  }

resource "kubernetes_deployment" "wordpress" {
  metadata {
    name = "wp${var.id}"
    namespace = var.namespace
    labels = {
      app = "wp${var.id}"
      version = var.appVersion
    }
  }
  spec {
    replicas = 1
    selector {
      match_labels = {
        app = "wp${var.id}"
      }
    }
    template {
      metadata {
        labels = {
          app = "wp${var.id}"
          version = var.appVersion        
        }
      }
      spec {
        container {
          image = "wordpress:${var.appVersion}"
          name = "wp${var.id}"
          port {
            container_port = 80
          }
          env {
            name = "WORDPRESS_DB_PASSWORD"
            value_from {
              secret_key_ref {
                name = kubernetes_secret.mysql.metadata[0].name
                key  = "password"
              }
            }
          }

          env {
            name = "WORDPRESS_DB_HOST"
            value = "mysql${var.id}.${var.namespace}.svc.cluster.local"
          }
          }
        }
      }
    }
  }







