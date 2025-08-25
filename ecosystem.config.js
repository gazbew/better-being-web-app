module.exports = {
  apps: [
    {
      name: 'betterbeingweb-production',
      script: 'server/src/index.js',
      cwd: '/var/www/betterbeingweb-production',
      instances: 2, // Run 2 instances for load balancing
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3001
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3001
      },
      // Logging
      log_file: '/var/log/pm2/betterbeingweb-production.log',
      out_file: '/var/log/pm2/betterbeingweb-production-out.log',
      error_file: '/var/log/pm2/betterbeingweb-production-error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      
      // Auto restart configuration
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      
      // Health monitoring
      min_uptime: '10s',
      max_restarts: 10,
      
      // Environment variables from .env file
      env_file: '.env'
    },
    {
      name: 'betterbeingweb-staging',
      script: 'server/src/index.js',
      cwd: '/var/www/betterbeingweb-staging',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'staging',
        PORT: 3002
      },
      env_staging: {
        NODE_ENV: 'staging',
        PORT: 3002
      },
      // Logging
      log_file: '/var/log/pm2/betterbeingweb-staging.log',
      out_file: '/var/log/pm2/betterbeingweb-staging-out.log',
      error_file: '/var/log/pm2/betterbeingweb-staging-error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      
      // Auto restart configuration
      autorestart: true,
      watch: false,
      max_memory_restart: '300M',
      
      // Health monitoring
      min_uptime: '10s',
      max_restarts: 5,
      
      // Environment variables from .env file
      env_file: '.env.staging'
    }
  ],

  // Deployment configuration
  deploy: {
    production: {
      user: 'deploy',
      host: ['your-production-server.com'],
      ref: 'origin/main',
      repo: 'https://github.com/your-username/BetterBeingWEB.git',
      path: '/var/www/betterbeingweb-production',
      'post-deploy': 'npm install && npm run build && pm2 reload ecosystem.config.js --env production',
      'pre-setup': 'git clone https://github.com/your-username/BetterBeingWEB.git /var/www/betterbeingweb-production'
    },
    staging: {
      user: 'deploy',
      host: ['your-staging-server.com'],
      ref: 'origin/develop',
      repo: 'https://github.com/your-username/BetterBeingWEB.git', 
      path: '/var/www/betterbeingweb-staging',
      'post-deploy': 'npm install && npm run build:dev && pm2 reload ecosystem.config.js --env staging',
      'pre-setup': 'git clone https://github.com/your-username/BetterBeingWEB.git /var/www/betterbeingweb-staging'
    }
  }
};
