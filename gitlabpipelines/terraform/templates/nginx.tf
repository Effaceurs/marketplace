module "$MODULE_NAME" {
  source = "../../../modules/marketplace/$MODULE_NAME"
  namespace = "$NAMESPACE"
  replicas = "$REPLICAS"
  id = "$ID"
  appVersion = "$VERSION"
}

terraform {
  required_providers {
    kubernetes = {
      source = "hashicorp/kubernetes"
    }
  }

  backend "kubernetes" {
    config_path      = "/builds/root/marketplace/terraform/config"
    secret_suffix = "$ID"
    namespace = "$NAMESPACE"
  }
}

provider "kubernetes" {
    config_path    = "/builds/root/marketplace/terraform/config"
}