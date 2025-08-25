# Deployment Guide

## Overview

This guide covers the deployment of BetterBeingWEB to various environments including staging, production, and containerized deployments.

## Prerequisites

### Server Requirements

- **Operating System**: Ubuntu 20.04+ or CentOS 8+
- **Node.js**: Version 18.x or higher
- **PostgreSQL**: Version 15 or higher
- **Memory**: Minimum 2GB RAM (4GB recommended for production)
- **Storage**: Minimum 20GB available disk space
- **Network**: Ports 80, 443, and 3001 available

### Required Software

- Git
- PM2 (Process Manager)
- Nginx (Reverse Proxy)
- SSL Certificate (for production HTTPS)

## Environment Setup

### 1. Server Preparation

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 globally
sudo npm install -g pm2

# Install Nginx
sudo apt install nginx -y

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib -y
```

### 2. Database Setup

```bash
# Create database user and database
sudo -u postgres psql
CREATE USER betterbeingweb_user WITH PASSWORD 'secure_password';
CREATE DATABASE betterbeingweb OWNER betterbeingweb_user;
GRANT ALL PRIVILEGES ON DATABASE betterbeingweb TO betterbeingweb_user;
\q
```

### 3. Application Deployment

```bash
# Create deployment directories
sudo mkdir -p /var/www/betterbeingweb-production
sudo mkdir -p /var/www/betterbeingweb-staging
sudo mkdir -p /var/log/pm2

# Set permissions
sudo chown -R $USER:$USER /var/www/betterbeingweb-production
sudo chown -R $USER:$USER /var/www/betterbeingweb-staging

# Clone repository
git clone https://github.com/your-username/BetterBeingWEB.git /var/www/betterbeingweb-production
cd /var/www/betterbeingweb-production

# Install dependencies
npm ci
cd server && npm ci && cd ..

# Build application
npm run build
```

### 4. Environment Configuration

Create production environment file:

```bash
# /var/www/betterbeingweb-production/.env
NODE_ENV=production
PORT=3001
DATABASE_URL=postgresql://betterbeingweb_user:secure_password@localhost:5432/betterbeingweb
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
FRONTEND_URL=https://your-domain.com
```

Create staging environment file:

```bash
# /var/www/betterbeingweb-staging/.env.staging
NODE_ENV=staging
PORT=3002
DATABASE_URL=postgresql://betterbeingweb_user:secure_password@localhost:5432/betterbeingweb_staging
JWT_SECRET=your_staging_jwt_secret
FRONTEND_URL=https://staging.your-domain.com
```

## Deployment Methods

### Method 1: Traditional Server Deployment

#### Initialize Database

```bash
cd /var/www/betterbeingweb-production/server
node src/config/migrate.js
```

#### Start Application with PM2

```bash
# Copy PM2 ecosystem config
cp ecosystem.config.js /var/www/betterbeingweb-production/

# Start application
pm2 start ecosystem.config.js --env production

# Save PM2 configuration
pm2 save
pm2 startup
```

#### Configure Nginx

```bash
# Create Nginx configuration
sudo cp nginx.conf /etc/nginx/sites-available/betterbeingweb
sudo ln -s /etc/nginx/sites-available/betterbeingweb /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### Method 2: Docker Deployment

#### Prerequisites

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

#### Environment Setup

Create `.env` file for Docker Compose:

```bash
# .env
DB_PASSWORD=secure_database_password_123
JWT_SECRET=your_super_secret_jwt_key_for_production
```

#### Deploy with Docker Compose

```bash
# Build and start services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f
```

#### Database Migration (Docker)

```bash
# Run migrations
docker-compose exec app node server/src/config/migrate.js
```

## CI/CD Pipeline Configuration

### GitHub Repository Setup

1. **Repository Variables** (Settings → Secrets and variables → Actions → Variables):
   - `STAGING_URL`: https://staging.your-domain.com
   - `STAGING_API_URL`: https://api-staging.your-domain.com
   - `PRODUCTION_URL`: https://your-domain.com  
   - `PRODUCTION_API_URL`: https://api.your-domain.com

2. **Repository Secrets** (Settings → Secrets and variables → Actions → Secrets):
   - `STAGING_HOST`: staging-server.your-domain.com
   - `STAGING_USERNAME`: deploy
   - `STAGING_SSH_KEY`: (Private SSH key for staging server)
   - `PRODUCTION_HOST`: production-server.your-domain.com
   - `PRODUCTION_USERNAME`: deploy  
   - `PRODUCTION_SSH_KEY`: (Private SSH key for production server)
   - `PRODUCTION_DATABASE_URL`: Full production database connection string

### SSH Key Setup

Generate SSH key for deployment:

```bash
# Generate SSH key pair
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/github_deploy_key

# Copy public key to servers
ssh-copy-id -i ~/.ssh/github_deploy_key.pub deploy@staging-server.your-domain.com
ssh-copy-id -i ~/.ssh/github_deploy_key.pub deploy@production-server.your-domain.com

# Add private key to GitHub Secrets
cat ~/.ssh/github_deploy_key
```

### Branch Strategy

- **main**: Production deployments
- **develop**: Staging deployments  
- **feature/***: Development branches

## SSL Configuration

### Let's Encrypt (Recommended)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Obtain SSL certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Auto-renewal (add to crontab)
echo "0 12 * * * /usr/bin/certbot renew --quiet" | sudo crontab -
```

### Manual SSL Setup

1. Obtain SSL certificates from your provider
2. Copy certificates to `/etc/ssl/certs/`
3. Update Nginx configuration with SSL settings
4. Test configuration: `sudo nginx -t`
5. Reload Nginx: `sudo systemctl reload nginx`

## Monitoring and Logging

### Application Logs

```bash
# PM2 logs
pm2 logs betterbeingweb-production

# Nginx logs  
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Application-specific logs
tail -f /var/log/pm2/betterbeingweb-production.log
```

### Health Monitoring

```bash
# Check application health
curl -f http://localhost:3001/api/health

# Check PM2 status
pm2 status

# Check database connectivity
psql -h localhost -U betterbeingweb_user -d betterbeingweb -c "SELECT NOW();"
```

### Performance Monitoring

```bash
# Install PM2 monitoring
pm2 install pm2-server-monit

# System monitoring with htop
sudo apt install htop
htop
```

## Maintenance Tasks

### Database Backups

```bash
# Create backup script
cat > /usr/local/bin/backup-db.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/var/backups/postgresql"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR

pg_dump -h localhost -U betterbeingweb_user betterbeingweb | gzip > $BACKUP_DIR/betterbeingweb_$TIMESTAMP.sql.gz

# Keep only last 7 days of backups
find $BACKUP_DIR -name "betterbeingweb_*.sql.gz" -mtime +7 -delete
EOF

chmod +x /usr/local/bin/backup-db.sh

# Add to crontab (daily at 2 AM)
echo "0 2 * * * /usr/local/bin/backup-db.sh" | crontab -
```

### Application Updates

```bash
# Update application
cd /var/www/betterbeingweb-production
git pull origin main
npm ci
cd server && npm ci && cd ..
npm run build
pm2 reload betterbeingweb-production
```

### Security Updates

```bash
# System updates
sudo apt update && sudo apt upgrade -y

# npm security audit
npm audit fix

# Update Node.js (if needed)
sudo npm install -g n
sudo n stable
```

## Troubleshooting

### Common Issues

1. **Application won't start**:
   ```bash
   # Check PM2 status
   pm2 status
   pm2 logs betterbeingweb-production
   
   # Check port availability
   sudo netstat -tlnp | grep 3001
   ```

2. **Database connection issues**:
   ```bash
   # Test database connection
   psql -h localhost -U betterbeingweb_user -d betterbeingweb
   
   # Check PostgreSQL status
   sudo systemctl status postgresql
   ```

3. **Nginx configuration errors**:
   ```bash
   # Test configuration
   sudo nginx -t
   
   # Check error logs
   sudo tail -f /var/log/nginx/error.log
   ```

4. **SSL certificate issues**:
   ```bash
   # Check certificate status
   sudo certbot certificates
   
   # Renew certificates
   sudo certbot renew --dry-run
   ```

### Recovery Procedures

#### Database Recovery

```bash
# Restore from backup
gunzip -c /var/backups/postgresql/betterbeingweb_YYYYMMDD_HHMMSS.sql.gz | psql -h localhost -U betterbeingweb_user betterbeingweb
```

#### Application Recovery

```bash
# Restart services
pm2 restart all
sudo systemctl restart nginx

# Reset to last known good state
git reset --hard HEAD~1
pm2 reload betterbeingweb-production
```

## Security Considerations

### Server Hardening

1. **Firewall Configuration**:
   ```bash
   sudo ufw allow ssh
   sudo ufw allow 80
   sudo ufw allow 443
   sudo ufw enable
   ```

2. **Fail2Ban Setup**:
   ```bash
   sudo apt install fail2ban -y
   sudo systemctl enable fail2ban
   ```

3. **Regular Updates**:
   - Enable automatic security updates
   - Monitor security advisories
   - Keep dependencies updated

### Application Security

1. **Environment Variables**: Never commit secrets to repository
2. **JWT Secrets**: Use strong, unique secrets for each environment
3. **Database Security**: Use strong passwords and limit access
4. **HTTPS**: Always use SSL/TLS in production
5. **Rate Limiting**: Implement API rate limiting via Nginx

## Performance Optimization

### Application Optimization

1. **PM2 Clustering**: Use multiple instances for load balancing
2. **Database Optimization**: Regular VACUUM and index maintenance
3. **Caching**: Implement Redis for session storage and caching
4. **Static Assets**: Use CDN for static file delivery

### Server Optimization

1. **Nginx Tuning**: Optimize worker processes and connections
2. **Database Tuning**: Configure PostgreSQL for your workload
3. **System Resources**: Monitor and adjust memory/CPU allocation
4. **Log Rotation**: Implement log rotation to manage disk space

This deployment guide provides comprehensive coverage of deploying BetterBeingWEB in various environments with proper security, monitoring, and maintenance procedures.
