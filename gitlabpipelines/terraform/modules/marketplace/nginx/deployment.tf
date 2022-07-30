resource "kubernetes_deployment" "nginx" {
  metadata {
    name = var.id
    namespace = var.namespace
    labels = {
      app = var.id
      version = var.appVersion
    }
  }

  spec {
    replicas = var.replicas
    selector {
      match_labels = {
        app = var.id
      }
    }
    template {
      metadata {
        labels = {
          app = var.id
          version = var.appVersion        
        }
      }
      spec {
        container {
          image = "nginx:${var.appVersion}"
          name = var.id
          port {
            container_port = 80
          }

          resources {
            limits = {
              cpu    = "125m"
              memory = "50Mi"
            }
            requests = {
              cpu    = "125m"
              memory = "50Mi"
            }
          }
        }
      }
    }
  }
}

resource "kubernetes_service" "nginx" {
  metadata {
    name = var.id
    namespace = var.namespace
  }
  spec {
    selector = {
      app = kubernetes_deployment.nginx.spec.0.template.0.metadata[0].labels.app
    }
    port {
      port        = 80
    }
    type = "NodePort"
  }
}

