# 🐳 Docker Deployment Guide for Legal-AI

Complete guide to deploy the Legal-AI Assistant with Docker, including Frontend, Backend, Redis, and Ollama services.

## 📋 Prerequisites

1. **Docker Desktop**: Install Docker Desktop for Windows
   - Download from: https://www.docker.com/products/docker-desktop
   - Ensure Docker Desktop is running before deployment

2. **System Requirements**:
   - **RAM**: Minimum 8GB (16GB recommended for Ollama models)
   - **Disk Space**: At least 10GB free space for Docker images and Ollama models
   - **Ports**: Ensure ports 5173, 8000, 6379, and 11434 are available

3. **Optional - GPU Support** (for faster AI inference):
   - NVIDIA GPU with CUDA support
   - NVIDIA Container Toolkit installed
   - Uncomment GPU section in `docker-compose.yml`

## 🚀 Quick Start

### Option 1: One-Click Deployment (Recommended)

Simply double-click the `start_app.bat` file in the project root directory.

### Option 2: Manual Deployment

Open PowerShell in the project root (`Legal-AI`) and run:

```powershell
docker-compose up --build -d
```

This will:
- ✅ Build the Frontend (React/Vue + Nginx)
- ✅ Build the Backend (FastAPI)
- ✅ Start Redis cache
- ✅ Start Ollama AI server
- ✅ Create a dedicated network for all services

## 📦 Initial Setup - Installing AI Models

After starting the containers, you need to pull the AI models into Ollama:

```powershell
# Pull the required model (e.g., llama2, mistral, etc.)
docker exec -it legal-ai-ollama ollama pull llama2

# Or pull a specific model your backend uses
docker exec -it legal-ai-ollama ollama pull mistral
```

**Note**: Model downloads can be large (4-7GB). Ensure you have sufficient disk space and internet bandwidth.

## 🌐 Accessing the Application

Once all services are healthy:

- **Frontend (User Interface)**: http://localhost:5173
- **Backend API (Swagger Docs)**: http://localhost:8000/docs
- **Backend Health Check**: http://localhost:8000/health
- **Redis**: localhost:6379
- **Ollama API**: http://localhost:11434

## 🏗️ Architecture Overview

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│  Frontend   │─────▶│   Backend   │─────▶│   Ollama    │
│  (Nginx)    │      │  (FastAPI)  │      │  (AI Model) │
│  Port 5173  │      │  Port 8000  │      │  Port 11434 │
└─────────────┘      └──────┬──────┘      └─────────────┘
                            │
                            ▼
                     ┌─────────────┐
                     │    Redis    │
                     │  (Cache)    │
                     │  Port 6379  │
                     └─────────────┘
```

## 🔧 Configuration Details

### Frontend
- **Technology**: Static build served via Nginx
- **Build**: Multi-stage Docker build (Node.js → Nginx)
- **Port**: 80 (container) → 5173 (host)

### Backend
- **Technology**: FastAPI with Uvicorn
- **Port**: 8000
- **Environment Variables**:
  - `REDIS_HOST=redis`
  - `REDIS_PORT=6379`
  - `OLLAMA_HOST=http://ollama:11434`
- **Volumes**: 
  - `./Backened/document` - Persistent document storage
  - `backend_cache` - Application cache

### Redis
- **Image**: redis:alpine
- **Purpose**: Caching layer for improved performance
- **Persistence**: Data stored in `redis_data` volume

### Ollama
- **Image**: ollama/ollama:latest
- **Purpose**: AI model inference server
- **Persistence**: Models stored in `ollama_data` volume
- **GPU Support**: Uncomment GPU section in docker-compose.yml for NVIDIA GPUs

## 📊 Monitoring & Health Checks

All services include health checks:

```powershell
# Check status of all services
docker-compose ps

# View logs for all services
docker-compose logs -f

# View logs for specific service
docker-compose logs -f backend
docker-compose logs -f ollama
```

## 🛠️ Common Commands

```powershell
# Start services in detached mode
docker-compose up -d

# Stop all services
docker-compose down

# Stop and remove volumes (⚠️ deletes data)
docker-compose down -v

# Rebuild specific service
docker-compose up --build backend

# Restart a service
docker-compose restart backend

# View resource usage
docker stats
```

## 🐛 Troubleshooting

### Issue: Ollama models not found
**Solution**: Pull the required model:
```powershell
docker exec -it legal-ai-ollama ollama pull llama2
```

### Issue: Backend cannot connect to Ollama
**Solution**: 
1. Check Ollama health: `docker-compose ps`
2. Verify Ollama is responding: `curl http://localhost:11434/api/tags`
3. Check backend logs: `docker-compose logs backend`

### Issue: Port already in use
**Solution**: 
1. Find process using the port: `netstat -ano | findstr :5173`
2. Stop the process or change port in `docker-compose.yml`

### Issue: Services not starting (health check failed)
**Solution**:
1. Check logs: `docker-compose logs [service-name]`
2. Increase health check `start_period` in docker-compose.yml
3. Ensure sufficient system resources (RAM, CPU)

### Issue: Frontend shows "Cannot connect to backend"
**Solution**:
1. Verify backend is healthy: `docker-compose ps`
2. Check backend logs: `docker-compose logs backend`
3. Ensure backend health endpoint works: `curl http://localhost:8000/health`

## 🔒 Production Deployment

For production environments, consider:

1. **Environment Variables**: Use `.env` file for sensitive data
2. **SSL/TLS**: Add reverse proxy (Nginx/Traefik) with SSL certificates
3. **Resource Limits**: Add resource constraints in docker-compose.yml
4. **Backup Strategy**: Regular backups of volumes (redis_data, ollama_data)
5. **Monitoring**: Integrate with monitoring tools (Prometheus, Grafana)
6. **Logging**: Configure centralized logging (ELK stack, Loki)

### Example Production Configuration

```yaml
# Add to backend service
deploy:
  resources:
    limits:
      cpus: '2'
      memory: 4G
    reservations:
      cpus: '1'
      memory: 2G
```

## 📝 Notes

- **First startup** may take 5-10 minutes (building images + health checks)
- **Ollama models** are persisted in Docker volumes, so they don't need to be re-downloaded
- **Document uploads** are stored in `./Backened/document` directory
- All services auto-restart unless explicitly stopped

## 🆘 Getting Help

If you encounter issues:
1. Check the logs: `docker-compose logs -f`
2. Verify all services are healthy: `docker-compose ps`
3. Ensure system meets minimum requirements
4. Check Docker Desktop is running and has sufficient resources allocated

---

**Happy Deploying! 🚀**
