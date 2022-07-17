output "service_node_port" {
  value = kubernetes_service.httpd.spec[0].port[0].node_port
}