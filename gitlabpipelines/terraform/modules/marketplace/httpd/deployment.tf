resource "kubernetes_deployment" "httpd" {
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
          image = "httpd:${var.appVersion}"
          name = var.id
          port {
            container_port = 80
          }
        }
      }
    }
  }
}

resource "kubernetes_service" "httpd" {
  metadata {
    name = var.id
    namespace = var.namespace
  }
  spec {
    selector = {
      app = kubernetes_deployment.httpd.spec.0.template.0.metadata[0].labels.app
    }
    port {
      port        = 80
    }
    type = "NodePort"
  }
}

