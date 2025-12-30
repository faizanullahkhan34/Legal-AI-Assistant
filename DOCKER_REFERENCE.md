# 🚀 Legal-AI Docker Quick Reference

## Quick Start Commands

```powershell
# Complete deployment (recommended)
.\deploy.bat

# Simple start (development)
.\start_app.bat

# Stop all services
.\stop_app.bat

# View logs
.\view_logs.bat

# Check status
.\check_status.bat

# Install AI model
.\install_model.bat
```

## Docker Compose Commands

```powershell
# Development
docker-compose up -d                    # Start services
docker-compose down                     # Stop services
docker-compose logs -f [service]        # View logs
docker-compose ps                       # Check status
docker-compose restart [service]        # Restart service

# Production
docker-compose -f docker-compose.prod.yml up -d
docker-compose -f docker-compose.prod.yml down
```

## Service Management

### Check Service Health
```powershell
docker-compose ps
```

### View Logs
```powershell
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f ollama
docker-compose logs -f redis
```

### Restart Services
```powershell
# Restart all
docker-compose restart

# Restart specific service
docker-compose restart backend
```

## Ollama Model Management

### List Installed Models
```powershell
docker exec -it legal-ai-ollama ollama list
```

### Pull New Model
```powershell
docker exec -it legal-ai-ollama ollama pull [model-name]

# Examples:
docker exec -it legal-ai-ollama ollama pull llama2
docker exec -it legal-ai-ollama ollama pull mistral
docker exec -it legal-ai-ollama ollama pull codellama
```

### Remove Model
```powershell
docker exec -it legal-ai-ollama ollama rm [model-name]
```

### Test Model
```powershell
docker exec -it legal-ai-ollama ollama run llama2 "Hello, how are you?"
```

## Troubleshooting

### Services Won't Start
```powershell
# Check Docker is running
docker info

# Check logs for errors
docker-compose logs

# Rebuild from scratch
docker-compose down -v
docker-compose up --build
```

### Port Conflicts
```powershell
# Find what's using a port
netstat -ano | findstr :5173
netstat -ano | findstr :8000

# Kill process by PID
taskkill /PID [pid] /F
```

### Ollama Connection Issues
```powershell
# Check Ollama is running
docker ps | findstr ollama

# Test Ollama API
curl http://localhost:11434/api/tags

# Restart Ollama
docker-compose restart ollama
```

### Backend Connection Issues
```powershell
# Check backend health
curl http://localhost:8000/health

# View backend logs
docker-compose logs -f backend

# Restart backend
docker-compose restart backend
```

### Clear All Data (⚠️ Destructive)
```powershell
# Stop and remove everything including volumes
docker-compose down -v

# Remove all unused Docker resources
docker system prune -a --volumes
```

## Resource Management

### View Resource Usage
```powershell
docker stats
```

### Limit Resources (edit docker-compose.yml)
```yaml
deploy:
  resources:
    limits:
      cpus: '2'
      memory: 4G
```

## Backup & Restore

### Backup Volumes
```powershell
# Backup Redis data
docker run --rm -v legal-ai_redis_data:/data -v %cd%:/backup alpine tar czf /backup/redis_backup.tar.gz -C /data .

# Backup Ollama models
docker run --rm -v legal-ai_ollama_data:/data -v %cd%:/backup alpine tar czf /backup/ollama_backup.tar.gz -C /data .
```

### Restore Volumes
```powershell
# Restore Redis data
docker run --rm -v legal-ai_redis_data:/data -v %cd%:/backup alpine tar xzf /backup/redis_backup.tar.gz -C /data

# Restore Ollama models
docker run --rm -v legal-ai_ollama_data:/data -v %cd%:/backup alpine tar xzf /backup/ollama_backup.tar.gz -C /data
```

## Network Commands

### Inspect Network
```powershell
docker network inspect legal-ai_legal-ai-network
```

### Test Connectivity
```powershell
# From backend to ollama
docker exec legal-ai-backend curl http://ollama:11434/api/tags

# From backend to redis
docker exec legal-ai-backend redis-cli -h redis ping
```

## URLs

- **Frontend**: http://localhost:5173
- **Backend API Docs**: http://localhost:8000/docs
- **Backend Health**: http://localhost:8000/health
- **Ollama API**: http://localhost:11434
- **Redis**: localhost:6379

## Environment Variables

Create `.env.production` from `.env.template`:
```powershell
copy .env.template .env.production
notepad .env.production
```

## Production Deployment

```powershell
# Use production compose file
docker-compose -f docker-compose.prod.yml up -d

# With environment file
docker-compose -f docker-compose.prod.yml --env-file .env.production up -d
```

## GPU Support (NVIDIA)

1. Install NVIDIA Container Toolkit
2. Uncomment GPU section in docker-compose.yml:
```yaml
deploy:
  resources:
    reservations:
      devices:
        - driver: nvidia
          count: 1
          capabilities: [gpu]
```

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| "Port already in use" | Check with `netstat -ano \| findstr :[port]` and kill process |
| "Cannot connect to Docker" | Start Docker Desktop |
| "Ollama model not found" | Run `docker exec -it legal-ai-ollama ollama pull llama2` |
| "Backend unhealthy" | Check logs: `docker-compose logs backend` |
| "Out of disk space" | Run `docker system prune -a` |
| "Out of memory" | Increase Docker Desktop memory limit in settings |

## Performance Tuning

### Increase Docker Resources
1. Open Docker Desktop
2. Settings → Resources
3. Increase CPU and Memory allocation
4. Apply & Restart

### Optimize Build Cache
```powershell
# Use BuildKit for faster builds
set DOCKER_BUILDKIT=1
docker-compose build
```

---

For detailed documentation, see [README_DOCKER.md](README_DOCKER.md)
