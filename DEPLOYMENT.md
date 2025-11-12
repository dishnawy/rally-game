# GitHub Pages Deployment Guide

## Quick Setup Steps

### 1. Commit and Push the Workflow
The GitHub Actions workflow has been created. Commit and push it:

```bash
git add .github/workflows/deploy.yml
git commit -m "Add GitHub Pages deployment workflow"
git push
```

### 2. Enable GitHub Pages in Repository Settings

1. Go to your repository on GitHub: https://github.com/dishnawy/rally-game
2. Click on **Settings** (in the repository menu)
3. Scroll down to **Pages** in the left sidebar
4. Under **Source**, select:
   - **Source**: `GitHub Actions` (not "Deploy from a branch")
5. Click **Save**

### 3. Wait for Deployment

- After pushing, GitHub Actions will automatically deploy your site
- You can check the deployment status in the **Actions** tab of your repository
- Once complete, your game will be live at:
  **https://dishnawy.github.io/rally-game/**

### 4. Automatic Future Deployments

Every time you push changes to the `main` branch, GitHub Actions will automatically:
- Build and deploy your site
- Make it available at the same URL

## Troubleshooting

- If deployment fails, check the **Actions** tab for error messages
- Make sure `index.html` is in the root directory (✓ it is)
- The workflow uses the modern GitHub Pages deployment method (GitHub Actions)

## Manual Deployment (Alternative)

If you prefer manual deployment instead of automatic:

1. Go to **Settings** → **Pages**
2. Under **Source**, select **Deploy from a branch**
3. Choose branch: `main` and folder: `/ (root)`
4. Click **Save**

Note: With manual deployment, you'll need to push changes and wait a few minutes for GitHub to rebuild the site.

