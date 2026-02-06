# Folyo Deployment Plan

## Executive Summary

This document outlines the deployment strategy for the Folyo portfolio builder platform. The application consists of a Next.js 14 frontend with an Express.js backend server, MongoDB database, and optional Redis caching.

---

## 1. Architecture Overview

### Current Stack
```
Frontend: Next.js 14 (App Router) + TypeScript + Tailwind CSS
Backend:  Express.js API Server (server.js)
Database: MongoDB 7.0
Cache:    Redis 7 (optional)
AI:       OpenAI API integration
```

### Infrastructure Components
```
                    ┌─────────────────┐
                    │   Cloudflare    │
                    │   (CDN + DNS)   │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │     Nginx       │
                    │ (Reverse Proxy) │
                    │   :80 / :443    │
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
     ┌────────▼────┐  ┌──────▼──────┐  ┌────▼────┐
     │   Next.js   │  │   Express   │  │ Static  │
     │    :3000    │  │    :5000    │  │  Files  │
     └──────┬──────┘  └──────┬──────┘  └─────────┘
            │                │
            └───────┬────────┘
                    │
         ┌──────────▼──────────┐
         │      MongoDB        │
         │       :27017        │
         └─────────────────────┘
```

---

## 2. Environment Variables Required

### Required for Production

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `production` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://user:pass@host:27017/db` |
| `NEXTAUTH_SECRET` | NextAuth encryption key | `<random-32-char-string>` |
| `NEXTAUTH_URL` | Application URL | `https://folyo.com` |
| `NEXT_PUBLIC_APP_URL` | Public app URL | `https://folyo.com` |
| `JWT_SECRET` | JWT signing key | `<random-32-char-string>` |

### Optional / Feature-Specific

| Variable | Description | Default |
|----------|-------------|---------|
| `OPENAI_API_KEY` | OpenAI API key for AI features | (disabled if missing) |
| `REDIS_URL` | Redis connection URL | (falls back to no cache) |
| `NEXT_PUBLIC_MAIN_DOMAIN` | Main domain for subdomains | `folyo.com` |
| `PORT` | Express server port | `5000` |
| `RATE_LIMIT_WINDOW` | Rate limit window (minutes) | `15` |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | `100` |
| `SKIP_DB` | Skip database connection | `false` |
| `MONGO_ROOT_PASSWORD` | MongoDB root password | (Docker only) |

---

## 3. Pre-Deployment Checklist

### Code Preparation

- [ ] Run production build locally: `npm run build`
- [ ] Run all tests: `npm run test:all`
- [ ] Check for TypeScript errors: `npx tsc --noEmit`
- [ ] Audit dependencies: `npm audit`
- [ ] Update dependencies if needed: `npm update`

### Security Audit

- [ ] Review CORS settings in `server.js` (line 39-45)
- [ ] Verify rate limiting configuration
- [ ] Check all API routes for authentication
- [ ] Ensure no secrets in code (search for hardcoded values)
- [ ] Review Helmet.js security headers

### Infrastructure Preparation

- [ ] Provision MongoDB Atlas cluster or self-hosted MongoDB
- [ ] Set up Redis instance (optional but recommended)
- [ ] Configure DNS records
- [ ] Obtain SSL certificates
- [ ] Set up monitoring and logging

---

## 4. Hardcoded Localhost References (To Fix)

The following files contain hardcoded localhost references that need environment variable substitution:

### Critical (Must Fix Before Deployment)

| File | Line | Current Value | Fix |
|------|------|--------------|-----|
| `next.config.js` | 8 | `http://localhost:5000` | Use internal Docker network or env var |
| `app/builder/page.tsx` | 292-293 | `http://localhost:3000` | Use `NEXT_PUBLIC_APP_URL` |
| `components/ui/QRCodeDisplay.tsx` | 24 | `http://localhost:5000` | Use `NEXT_PUBLIC_API_URL` |

### Already Using Fallbacks (OK)

| File | Note |
|------|------|
| `lib/database.js` | Falls back to localhost if `MONGODB_URI` not set |
| `lib/qrcode.js` | Falls back to localhost if `NEXT_PUBLIC_APP_URL` not set |
| `models/CV.js` | Falls back to localhost if `NEXT_PUBLIC_APP_URL` not set |
| `server.js` | Uses `process.env.NODE_ENV` for CORS |

---

## 5. Deployment Options

### Option A: Docker Compose (Recommended)

**Pros**: Easy setup, consistent environments, includes all services
**Cons**: Requires Docker host

```bash
# Production deployment
docker-compose --profile production up -d

# Required secrets
export MONGO_ROOT_PASSWORD=<secure-password>
export NEXTAUTH_SECRET=<random-secret>
export JWT_SECRET=<random-secret>
export NEXT_PUBLIC_APP_URL=https://folyo.com
```

### Option B: Vercel + External Services

**Pros**: Zero infrastructure management, automatic scaling
**Cons**: Requires external MongoDB, may need separate API hosting

1. Deploy Next.js to Vercel
2. Use MongoDB Atlas for database
3. Deploy Express API to Railway/Render/Fly.io
4. Configure environment variables in Vercel dashboard

### Option C: VPS/Cloud VM

**Pros**: Full control, cost-effective at scale
**Cons**: Manual setup and maintenance

1. Provision Ubuntu 22.04 LTS server
2. Install Docker and Docker Compose
3. Clone repository
4. Configure environment variables
5. Run Docker Compose
6. Set up Nginx with SSL (Let's Encrypt)

---

## 6. GitHub Actions CI/CD Pipeline

The existing `.github/workflows/deploy.yml` includes:

### Stages
1. **Test**: Lint, test, build
2. **Build & Push**: Docker image to GHCR
3. **Deploy Staging**: SSH deploy to staging server
4. **Deploy Production**: SSH deploy to production server
5. **Notify**: Slack notification

### Required GitHub Secrets

| Secret | Description |
|--------|-------------|
| `STAGING_HOST` | Staging server hostname |
| `STAGING_USERNAME` | SSH username |
| `STAGING_SSH_KEY` | SSH private key |
| `PRODUCTION_HOST` | Production server hostname |
| `PRODUCTION_USERNAME` | SSH username |
| `PRODUCTION_SSH_KEY` | SSH private key |
| `SLACK_WEBHOOK` | Slack notification webhook |

---

## 7. Recommended Deployment Architecture

### For MVP / Small Scale

```
Hosting: DigitalOcean Droplet ($24/mo)
- 4GB RAM, 2 vCPU
- Docker Compose (all services)
- Let's Encrypt SSL

Database: MongoDB Atlas M0 (Free tier)
- 512MB storage
- Shared cluster
```

### For Production / Medium Scale

```
Hosting:
- Vercel Pro ($20/mo) for Next.js frontend
- Railway Starter ($5/mo) for Express API
- MongoDB Atlas M10 ($57/mo)

CDN: Cloudflare (Free tier)
```

### For Enterprise / Large Scale

```
Hosting: AWS/GCP Kubernetes
- EKS/GKE managed cluster
- Horizontal pod autoscaling
- Multi-region deployment

Database: MongoDB Atlas M30+
- Dedicated cluster
- Automated backups
- VPC peering
```

---

## 8. Deployment Steps (Docker Compose)

### Step 1: Server Preparation

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo apt install docker-compose-plugin

# Add user to docker group
sudo usermod -aG docker $USER
```

### Step 2: Clone and Configure

```bash
# Clone repository
git clone https://github.com/your-repo/kiki.git
cd kiki/cv-builder

# Create environment file
cat > .env << 'EOF'
NODE_ENV=production
MONGODB_URI=mongodb://admin:YOUR_SECURE_PASSWORD@mongodb:27017/cv-builder?authSource=admin
MONGO_ROOT_PASSWORD=YOUR_SECURE_PASSWORD
NEXTAUTH_SECRET=YOUR_RANDOM_32_CHAR_SECRET
NEXTAUTH_URL=https://your-domain.com
JWT_SECRET=YOUR_RANDOM_JWT_SECRET
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_MAIN_DOMAIN=your-domain.com
OPENAI_API_KEY=sk-your-openai-key
EOF
```

### Step 3: Deploy

```bash
# Build and start all services
docker-compose --profile production up -d

# Verify health
docker-compose ps
curl http://localhost:5000/api/health
```

### Step 4: Configure Nginx and SSL

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Configure Nginx (use provided docker/nginx/nginx.conf as template)
```

---

## 9. Post-Deployment Verification

### Health Checks

```bash
# API Health
curl https://your-domain.com/api/health

# Expected response:
# {"status":"OK","timestamp":"...","database":"connected","ai":"enabled"}
```

### Functional Tests

- [ ] Homepage loads correctly
- [ ] Can create new portfolio
- [ ] Can preview portfolio
- [ ] Can save portfolio (if DB connected)
- [ ] QR code generation works
- [ ] PDF export works
- [ ] Theme switching works
- [ ] Subdomain routing works (if configured)

---

## 10. Monitoring and Maintenance

### Recommended Tools

- **Uptime**: UptimeRobot (free) or Pingdom
- **Logs**: Docker logs + Papertrail or Datadog
- **APM**: New Relic or Sentry
- **Analytics**: Plausible or Google Analytics

### Backup Strategy

```bash
# MongoDB backup (daily cron)
0 2 * * * docker exec cv-builder-mongodb mongodump --archive=/backup/$(date +%Y%m%d).gz --gzip
```

### Update Strategy

```bash
# Pull latest changes
git pull origin main

# Rebuild and restart
docker-compose pull
docker-compose up -d --build

# Verify health
docker-compose logs -f app
```

---

## 11. Rollback Procedure

```bash
# If deployment fails, rollback to previous version
git checkout <previous-commit>
docker-compose up -d --build

# Or use Docker image tags
docker-compose pull app:previous-tag
docker-compose up -d
```

---

## 12. Cost Estimation

### Minimum Viable (Hobby)
- VPS: $5-10/mo (DigitalOcean/Hetzner)
- MongoDB Atlas: Free (M0)
- Domain: $12/year
- **Total: ~$7/mo**

### Small Business
- VPS: $24/mo (4GB RAM)
- MongoDB Atlas: $57/mo (M10)
- Cloudflare: Free
- **Total: ~$81/mo**

### Production Scale
- Vercel Pro: $20/mo
- Railway: $20/mo
- MongoDB Atlas: $57/mo
- Cloudflare Pro: $20/mo
- Monitoring: $30/mo
- **Total: ~$147/mo**

---

## 13. Security Considerations

### Before Going Live

1. **Change all default passwords**
2. **Enable MongoDB authentication**
3. **Configure firewall** (only ports 80, 443 exposed)
4. **Enable HTTPS** (Let's Encrypt)
5. **Set secure cookies** (NextAuth config)
6. **Enable rate limiting** (already configured)
7. **Review CORS origins** for production domains

### Ongoing

1. Monitor security advisories
2. Update dependencies regularly
3. Review access logs
4. Rotate secrets periodically

---

## Appendix: Quick Reference Commands

```bash
# View logs
docker-compose logs -f app

# Restart services
docker-compose restart

# Stop all services
docker-compose down

# Full rebuild
docker-compose down && docker-compose up -d --build

# Database shell
docker exec -it cv-builder-mongodb mongosh -u admin -p

# Check disk usage
docker system df

# Clean unused images
docker system prune -a
```

---

*Document Version: 1.0*
*Last Updated: December 2024*
