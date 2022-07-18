resource "local_file" "output" {
    content  = kubernetes_service.wordpress.spec[0].port[0].node_port 
    filename = "output.txt"
}