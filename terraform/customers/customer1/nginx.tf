module "nginx" {
  source = "../../modules/marketplace/nginx"
  namespace = "mysupernamespace"
}

output "node_port" {
    value = "${module.nginx.service_node_port}"
}