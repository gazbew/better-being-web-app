# BetterBeing Web Application - Deployment Guide

## 🚀 Deploying to Vercel

This guide will help you deploy your BetterBeing web application to Vercel.

### Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository**: Your code should be pushed to GitHub
3. **Environment Variables**: Set up your database and API keys

### Quick Deploy

1. **Connect Repository**:
   - Go to [vercel.com/new](https://vercel.com/new)
   - Connect your GitHub repository
   - Vercel will automatically detect the configuration

2. **Configure Environment Variables**:
   In your Vercel dashboard, go to Project Settings → Environment Variables and add:

   ```env
   # Database Configuration
   DATABASE_URL=your_neon_database_url_here

   # JWT Configuration
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRES_IN=15m
   JWT_REFRESH_SECRET=your_jwt_refresh_secret_key_here
   JWT_REFRESH_EXPIRES_IN=7d

   # Bcrypt Configuration
   BCRYPT_ROUNDS=12

   # Server Configuration
   PORT=3003
   NODE_ENV=production

   # Frontend Configuration
   VITE_API_URL=https://your-app.vercel.app/api
   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key

   # Payment Configuration (optional)
   STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
   STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key

   # Paystack Configuration (optional)
   PAYSTACK_PUBLIC_KEY=pk_test_your_paystack_public_key
   PAYSTACK_SECRET_KEY=sk_test_your_paystack_secret_key
   ```

3. **Deploy**:
   - Click "Deploy"
   - Vercel will build and deploy your application
   - Your app will be live at `https://your-app.vercel.app`

### File Structure

The deployment includes:

- **Frontend**: React + Vite application (served from `/`)
- **Backend**: Node.js + Express API (served from `/api/*`)
- **Database**: Neon PostgreSQL with Drizzle ORM
- **Authentication**: JWT with secure HTTP-only cookies

### Build Configuration

- **Build Command**: `npm run vercel-build`
- **Output Directory**: `dist` (frontend) and serverless functions (backend)
- **Node Version**: Latest LTS (automatically detected)

### Database Setup

1. **Create Neon Database**:
   - Sign up at [neon.tech](https://neon.tech)
   - Create a new project
   - Copy the connection string

2. **Run Migrations**:
   ```bash
   cd server
   npm run migrate
   ```

3. **Seed Database** (optional):
   ```bash
   cd server
   npm run seed
   ```

### Troubleshooting

**Build Failures**:
- Check that all environment variables are set
- Ensure database URL is correct
- Verify Node.js dependencies are installed

**Runtime Errors**:
- Check server logs in Vercel dashboard
- Verify database connectivity
- Ensure JWT secrets are properly set

**Authentication Issues**:
- Verify JWT secrets match between deployments
- Check cookie settings for production
- Ensure CORS is properly configured

### Production Checklist

- [ ] Database is set up and migrated
- [ ] Environment variables are configured
- [ ] Domain is set up (optional)
- [ ] SSL certificate is active (automatic)
- [ ] Monitoring is enabled (optional)

### Support

If you encounter issues:
1. Check Vercel deployment logs
2. Review this documentation
3. Check server logs for API errors
4. Verify database connectivity

### Cost Optimization

- **Vercel**: Free tier includes generous limits
- **Neon**: Free tier includes 512MB database
- **Stripe/Paystack**: Only pay per transaction

Your application is now ready for production deployment! 🎉