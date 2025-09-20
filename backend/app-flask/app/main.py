# src/app.py
from flask import Flask, jsonify, request, g
from prometheus_client import Counter, Histogram, generate_latest, CONTENT_TYPE_LATEST
import time
import uuid

app = Flask(__name__)

# In-memory event store
EVENTS = {}

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
    return jsonify({"message": "Welcome to the Flask Dashboard with Events API!"})


@app.route("/healthz")
def health():
    return jsonify({"status": "ok"})


@app.route("/metrics")
def metrics():
    return generate_latest(), 200, {"Content-Type": CONTENT_TYPE_LATEST}


# -----------------------------
# Event Management Endpoints
# -----------------------------

@app.route("/events", methods=["GET"])
def list_events():
    """List all events"""
    return jsonify(list(EVENTS.values()))


@app.route("/events/<event_id>", methods=["GET"])
def get_event(event_id):
    """Get a single event"""
    event = EVENTS.get(event_id)
    if not event:
        return jsonify({"error": "Event not found"}), 404
    return jsonify(event)


@app.route("/events", methods=["POST"])
def create_event():
    """Create a new event"""
    data = request.json
    event_id = str(uuid.uuid4())
    new_event = {
        "id": event_id,
        "title": data.get("title"),
        "date": data.get("date"),
        "location": data.get("location"),
        "description": data.get("description")
    }
    EVENTS[event_id] = new_event
    return jsonify(new_event), 201


@app.route("/events/<event_id>", methods=["PUT"])
def update_event(event_id):
    """Update an existing event"""
    event = EVENTS.get(event_id)
    if not event:
        return jsonify({"error": "Event not found"}), 404
    
    data = request.json
    event.update({
        "title": data.get("title", event["title"]),
        "date": data.get("date", event["date"]),
        "location": data.get("location", event["location"]),
        "description": data.get("description", event["description"]),
    })
    return jsonify(event)


@app.route("/events/<event_id>", methods=["DELETE"])
def delete_event(event_id):
    """Delete an event"""
    if event_id not in EVENTS:
        return jsonify({"error": "Event not found"}), 404
    deleted = EVENTS.pop(event_id)
    return jsonify({"deleted": deleted})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
