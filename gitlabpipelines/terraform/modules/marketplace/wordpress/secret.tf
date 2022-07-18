resource "kubernetes_secret" "mysql" {
  metadata {
    name = "pass${var.id}"
    namespace = var.namespace
  }

  data = {
    password = "mysql${var.id}"
  }
  type = "kubernetes.io/generic"
}