# Multi-stage, Rootless Production Dockerfile
# Stage 1: Build & Dependency Resolution
FROM python:3.11-slim AS builder

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir --user -r requirements.txt

# Stage 2: Final Rootless Execution Image
FROM python:3.11-slim

WORKDIR /app

# Create non-root user
RUN groupadd -r meduser && useradd -r -g meduser meduser

# Copy installed wheels from builder
COPY --from=builder /root/.local /home/meduser/.local
ENV PATH=/home/meduser/.local/bin:$PATH

COPY . .
RUN chown -R meduser:meduser /app

USER meduser

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:5000/healthz')" || exit 1

CMD ["python", "run_server.py"]
