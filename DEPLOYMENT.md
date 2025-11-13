# GitHub Pages Deployment Guide

## Quick Setup Steps (Recommended Method)

### 1. Enable GitHub Pages in Repository Settings

1. Go to your repository on GitHub: https://github.com/dishnawy/rally-game
2. Click on **Settings** (in the repository menu)
3. Scroll down to **Pages** in the left sidebar
4. Under **Source**, select:
   - **Source**: `Deploy from a branch`
   - **Branch**: `main`
   - **Folder**: `/ (root)`
5. Click **Save**

### 2. Wait for Deployment

- GitHub will build and deploy your site automatically
- This usually takes 1-2 minutes
- Once complete, your game will be live at:
  **https://dishnawy.github.io/rally-game/**

### 3. Important Notes

- **Repository must be public** for GitHub Pages to work on free accounts
- If your repo is private, you'll need to upgrade to GitHub Pro or make it public
- After making changes, push to `main` and wait a few minutes for the site to update

## Troubleshooting

### Getting 404 Error?

1. **Check if repository is public**: Go to Settings → scroll to bottom → check "Danger Zone" → if it says "Change visibility", your repo might be private
2. **Wait a few minutes**: First deployment can take 2-5 minutes
3. **Check the Pages settings**: Make sure branch is set to `main` and folder is `/ (root)`
4. **Verify the URL**: Should be `https://dishnawy.github.io/rally-game/` (note: `rally-game`, not `rally-x-game`)

### Alternative: GitHub Actions Method

If you prefer using GitHub Actions (already set up):

1. Go to **Settings** → **Pages**
2. Under **Source**, select **GitHub Actions**
3. The workflow will run automatically on the next push
4. Check the **Actions** tab to see deployment status

