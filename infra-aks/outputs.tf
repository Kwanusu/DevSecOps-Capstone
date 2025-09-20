output "resource_group" {
  value = aws_eks_cluster.eks.cluster_name
}

output "eks_name" {
  value = aws_eks_cluster.eks.name
}
