# 🚀 Deployment Checklist

## Pre-Deployment Tasks

### ✅ Environment Setup
- [ ] Create `.env.local` file with production Supabase credentials
- [ ] Verify all environment variables are set correctly
- [ ] Test environment variables work in development

### ✅ Code Quality
- [ ] Run `npm run lint` and fix any issues
- [ ] Run `npm run build` successfully
- [ ] Test all major user flows in development
- [ ] Remove any console.log statements
- [ ] Remove any hardcoded test data

### ✅ Database & Backend
- [ ] Run Supabase migrations in production
- [ ] Verify Row Level Security (RLS) policies are active
- [ ] Test authentication flows
- [ ] Verify all API endpoints work correctly

### ✅ UI/UX
- [ ] Test responsive design on mobile/tablet/desktop
- [ ] Verify all images and assets load correctly
- [ ] Check for any broken links
- [ ] Test form validations
- [ ] Verify error handling and user feedback

### ✅ Performance
- [ ] Run Lighthouse audit
- [ ] Optimize images if needed
- [ ] Check bundle size
- [ ] Verify lazy loading works

## Deployment Steps

### For Vercel:
1. [ ] Install Vercel CLI: `npm i -g vercel`
2. [ ] Run `vercel` in project directory
3. [ ] Set environment variables in Vercel dashboard
4. [ ] Configure custom domain (optional)
5. [ ] Test deployed application

### For Netlify:
1. [ ] Connect repository to Netlify
2. [ ] Set build command: `npm run build`
3. [ ] Set publish directory: `dist`
4. [ ] Set environment variables in Netlify dashboard
5. [ ] Configure custom domain (optional)
6. [ ] Test deployed application

### For Static Hosting:
1. [ ] Run `npm run build:prod`
2. [ ] Upload `dist` folder to hosting provider
3. [ ] Configure SPA routing (redirect to index.html)
4. [ ] Set environment variables if supported
5. [ ] Test deployed application

## Post-Deployment Verification

### ✅ Functionality Tests
- [ ] User registration and login
- [ ] Service booking flow
- [ ] Payment integration (if applicable)
- [ ] Search and filtering
- [ ] User profile management

### ✅ Security Tests
- [ ] Verify HTTPS is enabled
- [ ] Test authentication redirects
- [ ] Check for exposed sensitive data
- [ ] Verify CORS settings

### ✅ Performance Tests
- [ ] Page load times
- [ ] API response times
- [ ] Mobile performance
- [ ] Core Web Vitals

### ✅ SEO & Analytics
- [ ] Verify meta tags are correct
- [ ] Test social media sharing
- [ ] Set up Google Analytics (if needed)
- [ ] Verify sitemap (if applicable)

## Monitoring & Maintenance

### ✅ Monitoring Setup
- [ ] Set up error tracking (Sentry, etc.)
- [ ] Configure uptime monitoring
- [ ] Set up performance monitoring
- [ ] Configure backup strategy

### ✅ Documentation
- [ ] Update README with deployment info
- [ ] Document environment variables
- [ ] Create runbook for common issues
- [ ] Document rollback procedures

## Emergency Procedures

### Rollback Plan
- [ ] Keep previous deployment version ready
- [ ] Document rollback commands
- [ ] Test rollback procedure

### Contact Information
- [ ] List key team members and contact info
- [ ] Document escalation procedures
- [ ] Set up incident response plan

---

**Last Updated**: [Date]
**Deployed By**: [Name]
**Version**: [Version Number] 