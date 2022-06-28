resource "kubernetes_deployment" "nginx" {
  metadata {
    name = random_string.name.result
    namespace = var.namespace
    labels = {
      App = random_string.name.result
    }
  }

  spec {
    replicas = 1
    selector {
      match_labels = {
        App = random_string.name.result
      }
    }
    template {
      metadata {
        labels = {
          App = random_string.name.result
        }
      }
      spec {
        container {
          image = "nginx:1.7.8"
          name = random_string.name.result

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
    name = random_string.name.result
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

