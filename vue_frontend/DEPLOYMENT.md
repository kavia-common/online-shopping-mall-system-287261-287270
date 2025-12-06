# Deployment Checklist

## Pre-Deployment Verification

### ✅ Build & Quality Checks
- [x] `npm run build` completes successfully
- [x] `npm run lint` passes with no errors
- [x] `npm run type-check` passes with no errors
- [x] All TypeScript types are properly defined
- [x] No console errors in development mode

### ✅ Code Quality
- [x] All ESLint rules passing
- [x] No unused imports or variables
- [x] Proper error handling in all API calls
- [x] Loading states for all async operations
- [x] Form validation implemented
- [x] Public interfaces documented

### ✅ Functionality
- [x] User registration works
- [x] User login works
- [x] Product browsing works
- [x] Add to cart functionality
- [x] Checkout process complete
- [x] Order history accessible
- [x] Admin dashboard accessible (admin users)
- [x] Product management (CRUD)
- [x] Order management
- [x] User management

### ✅ Responsive Design
- [x] Mobile layout (< 576px)
- [x] Tablet layout (576px - 968px)
- [x] Desktop layout (> 968px)
- [x] All interactive elements are touch-friendly
- [x] Navigation works on all screen sizes

### ✅ Security
- [x] No hardcoded credentials
- [x] Environment variables used for configuration
- [x] JWT tokens stored in localStorage (consider httpOnly cookies for production)
- [x] API calls use HTTPS in production
- [x] CORS configured on backend
- [x] Input validation and sanitization

## Environment Configuration

### Development
```bash
VITE_API_BASE_URL=https://vscode-internal-28250-beta.beta01.cloud.kavia.ai:3001/api
```

### Production
```bash
VITE_API_BASE_URL=https://your-backend-domain.com/api
```

## Deployment Steps

### 1. Update Environment Variables
```bash
# Create production .env file
cp .env.example .env.production

# Edit .env.production with production values
nano .env.production
```

### 2. Build for Production
```bash
npm run build
```

This creates an optimized production build in the `dist/` directory.

### 3. Test Production Build Locally
```bash
npm run preview
```

Access at `http://localhost:4173` and verify all functionality.

### 4. Deploy to Hosting Platform

#### Option A: Static Hosting (Netlify, Vercel, etc.)
```bash
# Deploy dist/ folder
netlify deploy --prod --dir=dist
# or
vercel --prod
```

#### Option B: CDN (AWS S3 + CloudFront, etc.)
```bash
# Upload dist/ contents to S3 bucket
aws s3 sync dist/ s3://your-bucket-name --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id YOUR_ID --paths "/*"
```

#### Option C: Docker
```dockerfile
# Dockerfile example
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 5. Configure Web Server

#### Nginx Configuration
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /usr/share/nginx/html;
    index index.html;

    # Enable gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # Handle Vue Router (SPA)
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

## Post-Deployment Verification

### Smoke Tests
- [ ] Homepage loads correctly
- [ ] Login functionality works
- [ ] Product catalog displays
- [ ] Cart functionality works
- [ ] Checkout process completes
- [ ] Admin panel accessible (for admin users)
- [ ] All routes resolve correctly
- [ ] API calls succeed

### Performance Checks
- [ ] Page load time < 3 seconds
- [ ] Time to Interactive < 5 seconds
- [ ] Lighthouse score > 90
- [ ] No console errors or warnings
- [ ] Images load properly

### Browser Compatibility
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile browsers (iOS Safari, Chrome Mobile)

## Monitoring & Maintenance

### Recommended Tools
1. **Error Tracking**: Sentry, Rollbar
2. **Analytics**: Google Analytics, Plausible
3. **Performance**: Lighthouse CI, WebPageTest
4. **Uptime**: Pingdom, UptimeRobot

### Health Checks
```bash
# Verify site is accessible
curl -I https://your-domain.com

# Check API connectivity
curl https://your-backend-domain.com/api/products
```

## Rollback Plan

If issues occur after deployment:

1. **Immediate Rollback**
   ```bash
   # Redeploy previous version
   git checkout previous-tag
   npm run build
   # Deploy dist/
   ```

2. **Investigate Issues**
   - Check browser console
   - Review server logs
   - Check API connectivity
   - Verify environment variables

3. **Fix and Redeploy**
   - Apply fixes
   - Test locally
   - Deploy with confidence

## Performance Optimization

### Already Implemented
- [x] Code splitting by route
- [x] Lazy loading for admin routes
- [x] CSS extraction and minification
- [x] Asset optimization
- [x] Tree shaking

### Additional Optimizations (Optional)
- [ ] Implement service worker for offline support
- [ ] Add image lazy loading
- [ ] Implement virtual scrolling for large lists
- [ ] Add CDN for static assets
- [ ] Implement HTTP/2 server push

## Security Hardening

### Production Recommendations
1. **Content Security Policy (CSP)**
   ```html
   <meta http-equiv="Content-Security-Policy" 
         content="default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline';">
   ```

2. **Security Headers**
   ```nginx
   add_header X-Frame-Options "SAMEORIGIN" always;
   add_header X-Content-Type-Options "nosniff" always;
   add_header X-XSS-Protection "1; mode=block" always;
   add_header Referrer-Policy "no-referrer-when-downgrade" always;
   ```

3. **HTTPS Only**
   - Enforce HTTPS redirect
   - Use HSTS header
   - Valid SSL certificate

## Backup & Recovery

### What to Backup
- Source code (Git repository)
- Environment configuration
- Build artifacts (optional)
- Deployment scripts

### Recovery Process
1. Clone repository
2. Install dependencies
3. Configure environment
4. Build and deploy

## Support Contacts

- **Frontend Issues**: [Your team contact]
- **Backend API Issues**: [Backend team contact]
- **Infrastructure**: [DevOps contact]
- **Emergency**: [On-call rotation]

## Deployment Completion Checklist

- [ ] Production build created
- [ ] Environment variables configured
- [ ] Application deployed to hosting
- [ ] DNS configured (if applicable)
- [ ] SSL certificate installed
- [ ] Smoke tests passed
- [ ] Performance verified
- [ ] Error tracking configured
- [ ] Team notified of deployment
- [ ] Documentation updated

---

## Quick Deploy Commands

```bash
# Complete deployment workflow
npm install
npm run lint
npm run build
npm run preview  # Test locally

# If all looks good, deploy!
# (deployment command depends on your platform)
```

**Status**: Application is production-ready! 🚀
