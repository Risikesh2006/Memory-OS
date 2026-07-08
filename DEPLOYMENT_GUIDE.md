# Legacy OS - Production Deployment Guide

## Prerequisites for Production

- Ubuntu Server 20.04+ (or similar Linux distribution)
- Docker (optional but recommended)
- SSL Certificate (from Let's Encrypt)
- Domain name

---

## Backend Deployment (Using Railway or AWS)

### Using Railway (Recommended for Beginners)

1. **Push to GitHub:**
```bash
git push origin main
```

2. **Connect Railway:**
- Go to railway.app
- Create new project
- Connect GitHub repository
- Select backend folder

3. **Add Environment Variables:**
In Railway dashboard, set:
```
DB_HOST: your_mysql_host
DB_USER: your_mysql_user
DB_PASSWORD: your_mysql_password
DB_NAME: legacy_os
JWT_SECRET: generate_a_strong_random_string
CLOUDINARY_CLOUD_NAME: your_cloud_name
CLOUDINARY_API_KEY: your_api_key
CLOUDINARY_API_SECRET: your_api_secret
```

4. **Deploy:**
Railway auto-deploys on push

---

## Frontend Deployment (Using Vercel)

### Deploy to Vercel

1. **Push to GitHub (if not already done):**
```bash
git push origin main
```

2. **Go to Vercel:**
- Visit vercel.com
- Import your project
- Select frontend folder

3. **Add Environment Variables:**
```
NEXT_PUBLIC_API_URL: https://your-backend-url/api
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET: your_preset
```

4. **Deploy:**
Vercel auto-deploys on push

---

## Database Deployment (Using Railway or AWS RDS)

### Using Railway MySQL

1. In Railway dashboard, add MySQL service
2. Copy connection string
3. Update backend `DB_*` variables with Railway MySQL credentials
4. Import schema:

```bash
mysql -h your_host -u your_user -p < schema.sql
```

---

## Docker Deployment (Optional)

### Backend Dockerfile

Create `backend/Dockerfile`:
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
```

### Build and Run
```bash
docker build -t legacy-os-backend .
docker run -p 5000:5000 \
  -e DB_HOST=db \
  -e DB_USER=root \
  -e DB_PASSWORD=password \
  legacy-os-backend
```

---

## Monitoring & Analytics

### Application Monitoring
- Enable Application Insights on Azure/AWS
- Set up error tracking (Sentry)
- Monitor database performance

### Performance Monitoring
- Use New Relic for APM
- Monitor API response times
- Set up alerts for errors

---

## Backup Strategy

### Database Backups

```bash
# Daily backup
0 2 * * * mysqldump -u root -p legacy_os > /backups/legacy_os_$(date +\%Y\%m\%d).sql

# Add to crontab
crontab -e
```

### Storage Backups
- Cloudinary automatically handles image/video redundancy
- Configure S3 as backup storage if needed

---

## SSL/TLS Configuration

### Using Let's Encrypt with Nginx

```bash
# Install certbot
sudo apt-get install certbot python3-certbot-nginx

# Generate certificate
sudo certbot certonly --nginx -d yourdomain.com

# Auto-renewal (cron runs automatically)
sudo systemctl enable certbot.timer
```

---

## Performance Optimization for Production

### Frontend
- Enable next.js image optimization
- Use CDN (Vercel CDN included)
- Minify and compress assets

### Backend
- Enable query caching
- Use Redis for session management
- Implement rate limiting
- Add database connection pooling

```javascript
// In production, add rate limiting
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

---

## Scaling Considerations

### Horizontal Scaling
- Load balancer (Nginx, HAProxy)
- Multiple backend instances
- Database replication

### Vertical Scaling
- Increase server resources
- Upgrade database plan
- Optimize slow queries

---

## Maintenance

### Regular Tasks
- Monitor error logs
- Review performance metrics
- Update dependencies monthly
- Backup database weekly
- Review security logs

### Health Checks
```bash
# Backend health
curl https://yourdomain.com/api/health

# Frontend check
curl https://yourdomain.com
```

---

## Rollback Procedure

If deployment fails:

```bash
# Revert to previous version
git revert HEAD
git push origin main

# Railway/Vercel will auto-redeploy
```

---

## Support Contacts

- Tech Support: support@legacyos.com
- Security Issues: security@legacyos.com
- Documentation: docs.legacyos.com

---

**For detailed deployment support, refer to respective platform documentation.**
