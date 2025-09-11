# Monitoring Setup (Prometheus & Grafana)

Install kube-prometheus-stack via Helm:

```bash
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update
helm install monitoring prometheus-community/kube-prometheus-stack -n monitoring --create-namespace
```

Forward Grafana and login (default admin/prometheus, or per chart):
```bash
kubectl -n monitoring port-forward svc/monitoring-grafana 3001:80
```

Import the dashboard JSON in `dashboards/project-overview.json`.
