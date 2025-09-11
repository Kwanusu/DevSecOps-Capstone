# Manifests — GitOps (ArgoCD) for DevSecOps Capstone

This repo holds Kubernetes YAML (Kustomize) for environments and ArgoCD Application definitions.

## Structure
- `base/` — shared deployment, service, ingress, and kustomization
- `overlays/dev` and `overlays/prod` — environment-specific kustomization (image, replicas, ingress host)
- `argocd/` — ArgoCD Application CRDs that point to these overlays

## Notes
- The CI pipeline in the app repo bumps the image tag in the selected overlay’s `kustomization.yaml`.
- Set your domain/hosts and namespaces as needed.
