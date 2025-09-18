# src/app.py
from flask import Flask, jsonify
from prometheus_client import Counter, Histogram, generate_latest, CONTENT_TYPE_LATEST
import time
from flask import g, request

app = Flask(__name__)

# Metrics definitions
REQUEST_COUNT = Counter(
    "flask_http_request_total", "Total HTTP requests", ["method", "endpoint", "http_status"]
)
REQUEST_LATENCY = Histogram(
    "flask_http_request_duration_seconds", "Request latency", ["endpoint"]
)


@app.before_request
def start_timer():
    
    g.start = time.time()


@app.after_request
def record_metrics(response):
    
    latency = time.time() - g.start
    REQUEST_LATENCY.labels(request.path).observe(latency)
    REQUEST_COUNT.labels(request.method, request.path, response.status_code).inc()
    return response


@app.route("/")
def home():
    return jsonify({"message": "Welcome to the flask dashboard!"})


@app.route("/healthz")
def health():
    return jsonify({"status": "ok"})


@app.route("/metrics")
def metrics():
    return generate_latest(), 200, {"Content-Type": CONTENT_TYPE_LATEST}


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
