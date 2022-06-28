variable "namespace" {
  type = string
  default = "default"
}

resource "random_string" "name" {
  length           = 16
  lower            = true
  upper            = false
  special          = false
  numeric          = false
}