# Deploying FEV's Alternatives AI Ready Catalog (ARC)

This guide walks you through deploying your ARC application so others can access it online.

## Deployment Options

### Option 1: Vercel (Recommended - Easiest)

Vercel is made by the creators of Next.js and offers the simplest deployment experience.

#### Steps:

1. **Create a GitHub Repository** (if you haven't already)
   - Go to [GitHub](https://github.com/new)
   - Create a new repository (e.g., `fev-arc-catalog`)
   - In your project folder, run:
     ```bash
     git init
     git add .
     git commit -m "Initial commit: FEV's ARC"
     git branch -M main
     git remote add origin https://github.com/YOUR_USERNAME/fev-arc-catalog.git
     git push -u origin main
     ```

2. **Deploy to Vercel**
   - Go to [Vercel](https://vercel.com)
   - Click "Sign Up" and sign in with your GitHub account
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js settings

3. **Configure Environment Variables**
   - In the Vercel project settings, go to "Environment Variables"
   - Add these variables:
     ```
     USE_MOCK_DATA=true
     NODE_ENV=production
     ```
   - Optional (if you want chat to work with AI):
     ```
     OPENAI_API_KEY=your-actual-key-here
     ```
   - Optional (if you want to connect a real database):
     ```
     DATABASE_URL=your-neon-connection-string
     USE_MOCK_DATA=false
     ```

4. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes for the build to complete
   - Your app will be live at: `https://your-project-name.vercel.app`

5. **Custom Domain (Optional)**
   - In Vercel project settings → Domains
   - Add your custom domain (e.g., `arc.fevanalytics.com`)
   - Follow DNS configuration instructions

#### Automatic Updates:
Every time you push to GitHub, Vercel will automatically redeploy!

---

### Option 2: Netlify

Another excellent free hosting option for Next.js apps.

#### Steps:

1. **Push to GitHub** (same as Step 1 above)

2. **Deploy to Netlify**
   - Go to [Netlify](https://netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect your GitHub repository
   - Build settings:
     - Build command: `pnpm build` (or `npm run build`)
     - Publish directory: `.next`

3. **Configure Environment Variables**
   - Go to Site settings → Environment variables
   - Add the same variables as Vercel above

4. **Deploy**
   - Click "Deploy site"
   - Your app will be live at: `https://your-site-name.netlify.app`

---

### Option 3: Docker + Any Cloud Provider

For more control, you can containerize the app and deploy to AWS, Azure, GCP, etc.

#### Steps:

1. **Create a Dockerfile** (save as `Dockerfile` in your project root):
   ```dockerfile
   FROM node:20-alpine AS base

   # Install dependencies
   FROM base AS deps
   RUN apk add --no-cache libc6-compat
   WORKDIR /app
   COPY package.json pnpm-lock.yaml* ./
   RUN corepack enable pnpm && pnpm install --frozen-lockfile

   # Build the application
   FROM base AS builder
   WORKDIR /app
   COPY --from=deps /app/node_modules ./node_modules
   COPY . .
   ENV NEXT_TELEMETRY_DISABLED=1
   ENV USE_MOCK_DATA=true
   RUN corepack enable pnpm && pnpm build

   # Production image
   FROM base AS runner
   WORKDIR /app
   ENV NODE_ENV=production
   ENV NEXT_TELEMETRY_DISABLED=1
   ENV USE_MOCK_DATA=true

   RUN addgroup --system --gid 1001 nodejs
   RUN adduser --system --uid 1001 nextjs

   COPY --from=builder /app/public ./public
   COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
   COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

   USER nextjs
   EXPOSE 3000
   ENV PORT=3000

   CMD ["node", "server.js"]
   ```

2. **Build and run locally to test**:
   ```bash
   docker build -t fev-arc .
   docker run -p 3000:3000 fev-arc
   ```

3. **Deploy to your cloud provider**:
   - AWS ECS/Fargate
   - Google Cloud Run
   - Azure Container Instances
   - DigitalOcean App Platform

---

### Option 4: Traditional VPS (e.g., DigitalOcean, AWS EC2)

If you prefer managing your own server:

#### Steps:

1. **Set up a Linux server** (Ubuntu 22.04 recommended)

2. **Install Node.js and pnpm**:
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs
   npm install -g pnpm pm2
   ```

3. **Clone your repository**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/fev-arc-catalog.git
   cd fev-arc-catalog
   ```

4. **Install dependencies and build**:
   ```bash
   pnpm install
   pnpm build
   ```

5. **Create `.env.local`** with your environment variables

6. **Start with PM2** (keeps app running):
   ```bash
   pm2 start npm --name "arc-app" -- start
   pm2 startup
   pm2 save
   ```

7. **Set up Nginx as reverse proxy**:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

8. **Install SSL certificate** (optional but recommended):
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d your-domain.com
   ```

---

## Post-Deployment Checklist

✅ Test all pages and features
✅ Verify mock data is loading correctly
✅ Test chat functionality
✅ Check FEV Analytics logo link works
✅ Test on mobile devices
✅ Set up analytics (optional)
✅ Configure custom domain (optional)

---

## Sharing the App

Once deployed, share your URL:
- **Vercel**: `https://your-project.vercel.app`
- **Netlify**: `https://your-site.netlify.app`
- **Custom Domain**: `https://arc.fevanalytics.com`

Anyone with the link can access the app!

---

## Troubleshooting

**Build fails on deployment:**
- Check that all environment variables are set
- Verify `package.json` has all required dependencies
- Review build logs for specific error messages

**App loads but no data shows:**
- Verify `USE_MOCK_DATA=true` is set in environment variables
- Check browser console for API errors

**Chat doesn't work:**
- This is expected if `OPENAI_API_KEY` is not set
- The app will show a fallback mock search instead

---

## Cost Estimates

- **Vercel Free Tier**: Free for hobby projects (unlimited bandwidth for non-commercial)
- **Netlify Free Tier**: Free (100GB bandwidth/month)
- **Docker on Cloud Run**: ~$5-20/month depending on usage
- **VPS (DigitalOcean)**: $6-12/month for basic droplet

For a demo/internal tool, Vercel or Netlify's free tiers are perfect!

---

## Need Help?

- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Documentation](https://docs.netlify.com)
- [Next.js Deployment Docs](https://nextjs.org/docs/deployment)
- [FEV Analytics](https://fevanalytics.com/)

