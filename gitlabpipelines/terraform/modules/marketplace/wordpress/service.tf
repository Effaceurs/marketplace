resource "kubernetes_service" "wordpress_mysql" {
  metadata {
    name = "mysql${var.id}"
    namespace = var.namespace
    labels = {
      app = kubernetes_deployment.wordpress_mysql.spec.0.template.0.metadata[0].labels.app
    }
  }
  spec {
    selector = {
      app = kubernetes_deployment.wordpress_mysql.spec.0.template.0.metadata[0].labels.app
    }
    port {
      port        = 3306
    }
  }
}

resource "kubernetes_service" "wordpress" {
  metadata {
    name = "wp${var.id}"
    namespace = var.namespace
    labels = {
      app = kubernetes_deployment.wordpress.spec.0.template.0.metadata[0].labels.app
    }
  }
  spec {
    selector = {
      app = kubernetes_deployment.wordpress.spec.0.template.0.metadata[0].labels.app
    }
    port {
      port        = 80
    }
    type = "NodePort"
  }
}
