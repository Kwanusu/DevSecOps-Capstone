# =========================
# 1. Builder stage
# =========================
FROM python:3.12-slim AS builder

WORKDIR /app
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

# Install build deps (only for building wheels)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
 && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip wheel --wheel-dir=/wheels -r requirements.txt


# =========================
# 2. Runtime stage
# =========================
FROM python:3.12-slim

WORKDIR /app
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PATH="/home/appuser/.local/bin:$PATH"

# Create non-root user
RUN groupadd --system appgroup \
 && useradd --system --gid appgroup --create-home appuser

# Copy prebuilt dependencies
COPY --from=builder /wheels /wheels
COPY requirements.txt .
RUN pip install --no-cache-dir --no-index --find-links=/wheels -r requirements.txt

# Copy application code
COPY src ./src

# Fix permissions
RUN chown -R appuser:appgroup /app
USER appuser

# Expose Flask/Gunicorn port
EXPOSE 8000

# Run with Gunicorn for production
# src.app:app → path.to.file:Flask_instance
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "src.app:app", "--workers=4", "--threads=2", "--timeout=60"]

