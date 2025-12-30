# ✅ Legal-AI Docker Deployment Checklist

## Pre-Deployment Checklist

### System Requirements
- [ ] Docker Desktop installed and running
- [ ] Minimum 8GB RAM available (16GB recommended)
- [ ] At least 10GB free disk space
- [ ] Windows PowerShell available

### Port Availability
- [ ] Port 5173 available (Frontend)
- [ ] Port 8000 available (Backend)
- [ ] Port 6379 available (Redis)
- [ ] Port 11434 available (Ollama)

### Files Present
- [ ] `docker-compose.yml` exists
- [ ] `Frontend/Dockerfile` exists
- [ ] `Backened/Dockerfile` exists
- [ ] `Frontend/nginx.conf` exists
- [ ] `Backened/requirements.txt` exists

## Deployment Steps

### 1. Initial Setup
- [ ] Clone/download the repository
- [ ] Navigate to project root directory
- [ ] Verify Docker Desktop is running: `docker info`

### 2. Choose Deployment Method

#### Option A: Complete Deployment (Recommended)
- [ ] Run `deploy.bat`
- [ ] Select deployment type (Development/Production)
- [ ] Wait for services to build and start
- [ ] Select AI model to install
- [ ] Wait for model download to complete

#### Option B: Quick Start
- [ ] Run `start_app.bat`
- [ ] Wait for services to start
- [ ] Manually install AI model if needed

#### Option C: Manual Deployment
- [ ] Run `docker-compose up --build -d`
- [ ] Wait for services to start
- [ ] Install AI model: `docker exec -it legal-ai-ollama ollama pull llama2`

### 3. Verify Deployment

#### Check Service Status
- [ ] Run `docker-compose ps`
- [ ] Verify all services show as "healthy" or "running"
- [ ] Check no services are in "restarting" state

#### Test Endpoints
- [ ] Frontend accessible: http://localhost:5173
- [ ] Backend API docs: http://localhost:8000/docs
- [ ] Backend health: http://localhost:8000/health
- [ ] Ollama API: http://localhost:11434/api/tags

#### View Logs (if issues)
- [ ] Check frontend logs: `docker-compose logs frontend`
- [ ] Check backend logs: `docker-compose logs backend`
- [ ] Check ollama logs: `docker-compose logs ollama`
- [ ] Check redis logs: `docker-compose logs redis`

### 4. AI Model Setup
- [ ] Verify Ollama container is running
- [ ] Install required model (llama2, mistral, etc.)
- [ ] Test model: `docker exec -it legal-ai-ollama ollama list`
- [ ] Verify model appears in list

### 5. Application Testing
- [ ] Open frontend in browser
- [ ] Enter user name
- [ ] Submit a test legal query
- [ ] Verify AI responds correctly
- [ ] Test lawyer search functionality
- [ ] Check response caching (submit same query twice)

## Post-Deployment

### Monitoring
- [ ] Set up log monitoring: `view_logs.bat`
- [ ] Check resource usage: `check_status.bat`
- [ ] Monitor disk space for Docker volumes

### Backup (Recommended)
- [ ] Backup Ollama models volume
- [ ] Backup Redis data volume
- [ ] Backup document uploads directory

### Documentation
- [ ] Review [README_DOCKER.md](README_DOCKER.md)
- [ ] Bookmark [DOCKER_REFERENCE.md](DOCKER_REFERENCE.md)
- [ ] Save `.env.template` for future reference

## Production Deployment Additional Steps

### Security
- [ ] Create `.env.production` from template
- [ ] Set strong `SECRET_KEY` and `JWT_SECRET`
- [ ] Set Redis password
- [ ] Configure `ALLOWED_ORIGINS` for CORS
- [ ] Review and update all default passwords

### SSL/TLS (if applicable)
- [ ] Obtain SSL certificates
- [ ] Configure reverse proxy (Nginx/Traefik)
- [ ] Update ports to 80/443
- [ ] Test HTTPS access

### Resource Limits
- [ ] Configure CPU limits in docker-compose.prod.yml
- [ ] Configure memory limits
- [ ] Test under load

### Monitoring & Logging
- [ ] Set up centralized logging
- [ ] Configure monitoring alerts
- [ ] Set up health check monitoring
- [ ] Configure backup automation

### Performance
- [ ] Enable GPU support (if available)
- [ ] Optimize Docker Desktop resource allocation
- [ ] Configure Redis persistence
- [ ] Test response times

## Troubleshooting Checklist

### Services Won't Start
- [ ] Check Docker Desktop is running
- [ ] Verify ports are not in use
- [ ] Check disk space available
- [ ] Review docker-compose logs
- [ ] Try rebuilding: `docker-compose up --build`

### Ollama Issues
- [ ] Verify Ollama container is running
- [ ] Check Ollama logs
- [ ] Verify model is installed
- [ ] Test Ollama API endpoint
- [ ] Check available disk space for models

### Backend Connection Issues
- [ ] Verify backend health endpoint
- [ ] Check backend logs for errors
- [ ] Verify Redis connection
- [ ] Verify Ollama connection
- [ ] Check environment variables

### Frontend Issues
- [ ] Clear browser cache
- [ ] Check browser console for errors
- [ ] Verify backend is accessible
- [ ] Check nginx configuration
- [ ] Review frontend logs

### Performance Issues
- [ ] Check Docker Desktop resource allocation
- [ ] Monitor container resource usage
- [ ] Check if models are loaded in memory
- [ ] Verify Redis is caching properly
- [ ] Consider enabling GPU support

## Maintenance Checklist

### Daily
- [ ] Check service health: `docker-compose ps`
- [ ] Monitor disk space
- [ ] Review error logs

### Weekly
- [ ] Review application logs
- [ ] Check for Docker updates
- [ ] Verify backups are working
- [ ] Monitor resource usage trends

### Monthly
- [ ] Update Docker images: `docker-compose pull`
- [ ] Clean up unused resources: `docker system prune`
- [ ] Review and update AI models
- [ ] Test disaster recovery procedures
- [ ] Review security settings

## Quick Commands Reference

```powershell
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Check status
docker-compose ps

# Restart service
docker-compose restart [service-name]

# Rebuild service
docker-compose up --build [service-name]

# Install AI model
docker exec -it legal-ai-ollama ollama pull llama2

# View resource usage
docker stats
```

## Support Resources

- **Documentation**: README_DOCKER.md
- **Quick Reference**: DOCKER_REFERENCE.md
- **Main README**: README.md
- **Docker Compose**: docker-compose.yml
- **Production Config**: docker-compose.prod.yml

---

**Deployment Date**: _________________

**Deployed By**: _________________

**Environment**: [ ] Development  [ ] Production

**Notes**: 
_________________________________________________________________
_________________________________________________________________
_________________________________________________________________
