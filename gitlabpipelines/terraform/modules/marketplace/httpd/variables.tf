variable "namespace" {
  type = string
  default = "default"
}

variable "replicas" {
  type = number
  default = 1
}

variable "id" {
  type = string
}

variable "appVersion" {
  type = string
}
