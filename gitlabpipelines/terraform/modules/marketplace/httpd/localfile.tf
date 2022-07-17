resource "local_file" "output" {
    content  = kubernetes_service.httpd.spec[0].port[0].node_port 
    filename = "output.txt"
}