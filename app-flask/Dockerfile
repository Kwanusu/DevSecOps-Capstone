# Multi-stage build for smaller image
FROM python:3.12-slim AS builder
WORKDIR /app
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1
COPY requirements.txt .
RUN pip wheel --wheel-dir=/wheels -r requirements.txt

FROM python:3.12-slim
WORKDIR /app
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1
COPY --from=builder /wheels /wheels
COPY requirements.txt .
RUN pip install --no-index --find-links=/wheels -r requirements.txt \
    && adduser --disabled-password --gecos "" appuser

# Copy app code
COPY src/ .

USER appuser

# Flask app runs on port 5000
EXPOSE 5000

# Run Flask app
CMD ["python", "app.py"]
