# Complete Deployment Guide - Grid Zenith Flow

## Production Deployment Options

### Option 1: Cloud Deployment (Recommended)

#### AWS Deployment
```bash
# 1. Create requirements.txt
pip freeze > requirements.txt

# 2. Build frontend
npm run build

# 3. Deploy to AWS EC2/ECS
# Backend: Use AWS Elastic Beanstalk or ECS
# Frontend: Deploy to S3 + CloudFront
# Database: RDS for production data
```

#### Docker Deployment
```dockerfile
# Dockerfile.backend
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 5000
CMD ["python", "api_server.py"]

# Dockerfile.frontend  
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 8082
CMD ["npm", "run", "preview"]
```

```yaml
# docker-compose.yml
version: '3.8'
services:
  backend:
    build: 
      context: .
      dockerfile: Dockerfile.backend
    ports:
      - "5000:5000"
    volumes:
      - ./models:/app/models
      - ./data:/app/data
    
  frontend:
    build:
      context: .
      dockerfile: Dockerfile.frontend
    ports:
      - "8082:8082"
    depends_on:
      - backend
```

### Option 2: Local Production Setup

#### Production Backend Setup
```bash
# 1. Install production WSGI server
pip install gunicorn

# 2. Create production config
# gunicorn_config.py
bind = "0.0.0.0:5000"
workers = 4
worker_class = "sync"
timeout = 300
keepalive = 2

# 3. Start production server
gunicorn --config gunicorn_config.py api_server:app
```

#### Production Frontend Setup
```bash
# 1. Build for production
npm run build

# 2. Install serve globally
npm install -g serve

# 3. Serve production build
serve -s dist -l 8082
```

### Option 3: Complete Server Deployment

#### Ubuntu/Linux Server Setup
```bash
# 1. Update system
sudo apt update && sudo apt upgrade -y

# 2. Install Python and Node.js
sudo apt install python3 python3-pip nodejs npm nginx -y

# 3. Clone project
git clone <your-repo-url>
cd grid-zenith-flow

# 4. Setup Python environment
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# 5. Train models
python train_model.py

# 6. Build frontend
npm install
npm run build

# 7. Configure Nginx
sudo nano /etc/nginx/sites-available/grid-zenith-flow
```

#### Nginx Configuration
```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        root /path/to/grid-zenith-flow/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

#### Systemd Service Setup
```bash
# Create backend service
sudo nano /etc/systemd/system/grid-zenith-backend.service
```

```ini
[Unit]
Description=Grid Zenith Flow Backend
After=network.target

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/path/to/grid-zenith-flow
Environment=PATH=/path/to/grid-zenith-flow/venv/bin
ExecStart=/path/to/grid-zenith-flow/venv/bin/gunicorn --config gunicorn_config.py api_server:app
Restart=always

[Install]
WantedBy=multi-user.target
```

```bash
# Enable and start service
sudo systemctl enable grid-zenith-backend
sudo systemctl start grid-zenith-backend
sudo systemctl enable nginx
sudo systemctl start nginx
```

## Environment Configuration

### Production Environment Variables
```bash
# .env.production
FLASK_ENV=production
FLASK_DEBUG=False
API_HOST=0.0.0.0
API_PORT=5000
MODEL_PATH=/app/models/
DATA_PATH=/app/data/
```

### Security Configuration
```python
# api_server.py - Add security headers
from flask import Flask
from flask_cors import CORS

app = Flask(__name__)

# Production CORS settings
CORS(app, origins=['https://your-domain.com'])

# Security headers
@app.after_request
def after_request(response):
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['X-Frame-Options'] = 'DENY'
    response.headers['X-XSS-Protection'] = '1; mode=block'
    return response
```

## Database Setup (Optional)

### PostgreSQL for Production Data
```bash
# Install PostgreSQL
sudo apt install postgresql postgresql-contrib

# Create database
sudo -u postgres createdb grid_zenith_db
sudo -u postgres createuser grid_zenith_user

# Configure connection
pip install psycopg2-binary
```

## Monitoring & Logging

### Application Monitoring
```python
# Add to api_server.py
import logging
from datetime import datetime

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s %(levelname)s %(message)s',
    handlers=[
        logging.FileHandler('app.log'),
        logging.StreamHandler()
    ]
)

@app.before_request
def log_request():
    logging.info(f"Request: {request.method} {request.url}")
```

### System Monitoring
```bash
# Install monitoring tools
sudo apt install htop iotop nethogs

# Monitor services
sudo systemctl status grid-zenith-backend
sudo journalctl -u grid-zenith-backend -f
```

## SSL/HTTPS Setup

### Let's Encrypt SSL
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

## Backup Strategy

### Automated Backups
```bash
#!/bin/bash
# backup.sh
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/grid-zenith-$DATE"

mkdir -p $BACKUP_DIR
cp -r /path/to/grid-zenith-flow/models $BACKUP_DIR/
cp -r /path/to/grid-zenith-flow/data $BACKUP_DIR/
tar -czf $BACKUP_DIR.tar.gz $BACKUP_DIR
rm -rf $BACKUP_DIR

# Keep only last 7 backups
find /backups -name "grid-zenith-*.tar.gz" -mtime +7 -delete
```

## Performance Optimization

### Frontend Optimization
```bash
# Build with optimization
npm run build -- --mode production

# Enable gzip in Nginx
gzip on;
gzip_types text/css application/javascript application/json;
```

### Backend Optimization
```python
# Add caching
from flask_caching import Cache

cache = Cache(app, config={'CACHE_TYPE': 'simple'})

@app.route('/api/optimize', methods=['POST'])
@cache.cached(timeout=300)  # Cache for 5 minutes
def run_optimization():
    # ... existing code
```

## Deployment Checklist

- [ ] Install all dependencies
- [ ] Train AI models
- [ ] Configure environment variables
- [ ] Set up database (if needed)
- [ ] Configure web server (Nginx)
- [ ] Set up SSL certificates
- [ ] Configure monitoring and logging
- [ ] Set up automated backups
- [ ] Test all endpoints
- [ ] Configure firewall rules
- [ ] Set up domain DNS
- [ ] Test production deployment

## Quick Deploy Commands

```bash
# Complete deployment script
#!/bin/bash
set -e

echo "Deploying Grid Zenith Flow..."

# Backend
source venv/bin/activate
pip install -r requirements.txt
python train_model.py
gunicorn --config gunicorn_config.py api_server:app &

# Frontend
npm install
npm run build
serve -s dist -l 8082 &

echo "Deployment complete!"
echo "Frontend: http://localhost:8082"
echo "Backend: http://localhost:5000"
```

## Troubleshooting

**Common Issues:**
- Port conflicts: Change ports in configuration
- Permission errors: Check file permissions and user access
- Model loading failures: Ensure models directory exists and is accessible
- CORS errors: Update CORS configuration for production domain
- SSL issues: Verify certificate installation and renewal