# Infra — AKS via Terraform (DevSecOps Capstone)

Creates an Azure Kubernetes Service (AKS) cluster with Terraform. Update variables and backend config to your environment.

## Prereqs
- Azure subscription and `az login`
- Terraform >= 1.6
- An Azure resource group
- (Optional) Remote state storage (Azure Storage)

## Usage
```bash
terraform init
terraform plan -var-file=vars.tfvars
terraform apply -var-file=vars.tfvars
```

Outputs include kubeconfig and cluster details.
