# Deploy ARC to Vercel – Quick Guide

Follow these steps to publish your Alternatives AI Ready Catalog to Vercel.

---

## **Prerequisites**

- [ ] Git installed (you already have this ✅)
- [ ] GitHub account
- [ ] Vercel account (free tier is fine)

---

## **Step 1: Push Your Code to GitHub**

### 1a. Initialize Git (if not already done)

Open your terminal in the project folder and run:

```powershell
git init
git add .
git commit -m "Initial commit: FEV ARC project"
```

### 1b. Create a GitHub Repository

1. Go to [https://github.com/new](https://github.com/new)
2. **Repository name**: `fev-arc` (or your preferred name)
3. **Visibility**: Private (recommended) or Public
4. **Do NOT** initialize with README (your project already has files)
5. Click **"Create repository"**

### 1c. Push to GitHub

Copy the commands GitHub shows you (they'll look like this):

```powershell
git remote add origin https://github.com/YOUR_USERNAME/fev-arc.git
git branch -M main
git push -u origin main
```

**Replace `YOUR_USERNAME`** with your actual GitHub username, then run the commands.

---

## **Step 2: Deploy to Vercel**

### 2a. Sign Up / Log In to Vercel

1. Go to [https://vercel.com/signup](https://vercel.com/signup)
2. **Sign up with GitHub** (easiest option—authorizes access automatically)

### 2b. Import Your Project

1. Once logged in, click **"Add New..."** → **"Project"**
2. Vercel will show your GitHub repositories
3. Find `fev-arc` (or whatever you named it) and click **"Import"**

### 2c. Configure Project Settings

Vercel will auto-detect Next.js. You'll see:

- **Framework Preset**: Next.js ✅
- **Root Directory**: `./` ✅
- **Build Command**: `pnpm run build` (or `npm run build`)
- **Output Directory**: `.next` ✅

**Important:** Click **"Environment Variables"** and add:

| Key | Value |
|-----|-------|
| `USE_MOCK_DATA` | `true` |
| `DATABASE_URL` | *(leave blank or use your Neon URL if you want real DB)* |
| `OPENAI_API_KEY` | *(leave blank for demo mode, or add real key for AI chat)* |

### 2d. Deploy!

1. Click **"Deploy"**
2. Vercel will build and deploy your site (takes 2-3 minutes)
3. When done, you'll see: **"Congratulations! 🎉"**
4. Your site is live at: `https://fev-arc.vercel.app` (or similar)

---

## **Step 3: Test Your Live Site**

Click the **"Visit"** button Vercel shows you, or go to your deployment URL.

**Test checklist:**
- [ ] Homepage loads
- [ ] Browse data sources works
- [ ] AI Assistant returns results (if you added `OPENAI_API_KEY`, or uses mock mode)
- [ ] Insights page shows published analytics
- [ ] "Subscribe" modal shows "FEV ML Workbench" option

---

## **Step 4: Share with UC Berkeley Endowment**

Your live URL is now shareable! For the demo:

1. **Custom Domain (Optional)**: Go to Vercel project settings → **Domains** → Add `arc.fevanalytics.com` (requires DNS setup)
2. **Password Protection (Optional)**: Vercel Pro plan allows you to add a password to the site
3. **Send Link**: Share `https://fev-arc.vercel.app` (or your custom domain) in your meeting invite

---

## **Making Updates Later**

Every time you push to GitHub, Vercel auto-deploys:

```powershell
# Make changes to your code
git add .
git commit -m "Update insights data"
git push
```

Vercel will automatically rebuild and redeploy in ~2 minutes. No need to manually redeploy!

---

## **Troubleshooting**

### ❌ **Build fails with "DATABASE_URL not found"**
- Make sure you added `USE_MOCK_DATA=true` in Vercel environment variables

### ❌ **AI chat returns errors**
- Either add a real `OPENAI_API_KEY` or ensure `USE_MOCK_DATA=true` is set (chat falls back to mock mode)

### ❌ **Site looks broken / missing styles**
- Check Vercel build logs for errors
- Make sure `pnpm run build` works locally first

---

## **Cost**

- **Vercel Free Tier**: 100 GB bandwidth/month, unlimited deployments – perfect for demos
- **Upgrade to Pro ($20/month)** for: custom domains, password protection, more bandwidth

---

**Your site is now live! 🚀**

For the UC Berkeley demo, test the live URL thoroughly before the meeting. Good luck!

