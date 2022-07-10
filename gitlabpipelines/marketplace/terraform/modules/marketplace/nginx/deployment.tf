resource "kubernetes_deployment" "nginx" {
  metadata {
    name = var.id
    namespace = var.namespace
    labels = {
      App = var.id
    }
  }

  spec {
    replicas = var.replicas
    selector {
      match_labels = {
        App = var.id
      }
    }
    template {
      metadata {
        labels = {
          App = var.id
        }
      }
      spec {
        container {
          image = "nginx:1.7.8"
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
      App = kubernetes_deployment.nginx.spec.0.template.0.metadata[0].labels.App
    }
    port {
      port        = 80
    }
    type = "NodePort"
  }
}


resource "kubernetes_namespace" "nginx" {
  metadata {
    annotations = {
      name = var.namespace
    }
    name = var.namespace
  }
}

