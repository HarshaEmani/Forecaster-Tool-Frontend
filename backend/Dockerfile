# backend/Dockerfile

# 1. Base image w/ Python
FROM python:3.11-slim

WORKDIR /app

# install system deps + curl for healthcheck
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# 2. Install deps
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 3. Copy code
COPY . .

# 4. Expose the port Uvicorn will listen on
EXPOSE 8000

# 5. Launch Uvicorn
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
