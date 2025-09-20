# App — Flask Sample (DevSecOps Capstone)

A minimal Flask app with Prometheus metrics, Trivy and SonarQube scans, and a GitHub Actions CI pipeline that builds and pushes to GHCR, then updates the GitOps manifests repo.

## Endpoints
- `/` – Hello World
- `/healthz` – Liveness/Readiness
- `/metrics` – Prometheus metrics

## Local run
```bash
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
flask --app app.main run --host 0.0.0.0 --port 3000
```

## Docker build
```bash
docker build -t ghcr.io/<YOUR_GH_ORG>/<YOUR_APP_REPO>:dev .
```

## GitHub Actions: Required Secrets
- `SONAR_HOST_URL` — e.g., https://sonarcloud.io or your SonarQube URL
- `SONAR_TOKEN`
- `CONTAINER_REGISTRY` — e.g., ghcr.io
- `REGISTRY_USERNAME` — usually your GitHub username (for GHCR, can use `${{ github.actor }}`)
- `REGISTRY_PASSWORD` — a PAT with `write:packages` scope or `${{ secrets.GITHUB_TOKEN }}` for GHCR
- `MANIFESTS_REPO` — `owner/repo` of your GitOps repo (e.g., `your-org/manifests`)
- `MANIFESTS_REPO_PAT` — PAT with `repo` scope to push tag bumps to the manifests repo
- `KUSTOMIZE_PATH` — path to the overlay you want to update (e.g., `overlays/dev`)

## Sonar
`sonar-project.properties` is set up for a Python project. Adjust `sonar.organization` and `sonar.projectKey` as needed.
