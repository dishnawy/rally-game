# GitHub Setup Instructions

Your game is ready to be connected to GitHub! Follow these steps:

## Option 1: Create a New Repository on GitHub

1. Go to [GitHub.com](https://github.com) and sign in
2. Click the "+" icon in the top right, then select "New repository"
3. Name your repository (e.g., "rally-x-game")
4. **Do NOT** initialize with README, .gitignore, or license (we already have these)
5. Click "Create repository"

## Option 2: Connect to Existing Repository

If you already have a repository on GitHub:

1. Go to your repository on GitHub
2. Copy the repository URL (HTTPS or SSH)

## Connect Your Local Repository

Run these commands in your terminal (replace `YOUR_USERNAME` and `YOUR_REPO_NAME` with your actual values):

```bash
cd /Users/dish/rally-x-game
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

Or if using SSH:
```bash
git remote add origin git@github.com:YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

## Deploy to GitHub Pages (Optional)

To make your game playable online:

1. Go to your repository on GitHub
2. Click "Settings" → "Pages"
3. Under "Source", select "main" branch
4. Click "Save"
5. Your game will be available at: `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/`

Note: Make sure your `index.html` is in the root directory (which it is).

## Future Updates

After making changes to your game:

```bash
git add .
git commit -m "Description of your changes"
git push
```

