# iOS App Installation Guide

Your game is now set up as a Progressive Web App (PWA) that can be installed on iOS devices!

## Quick Installation Steps

### Method 1: Install from Safari (Recommended)

1. **Open Safari on your iPhone/iPad** (not Chrome or other browsers)
2. **Navigate to your game**: `https://dishnawy.github.io/rally-game/`
3. **Tap the Share button** (square with arrow pointing up) at the bottom
4. **Scroll down and tap "Add to Home Screen"**
5. **Edit the name if desired** (default: "Rally-X")
6. **Tap "Add"** in the top right
7. **Done!** The app icon will appear on your home screen

### Method 2: Install from Home Screen Icon

Once installed, the app will:
- Open in fullscreen (no browser UI)
- Work offline (after first load)
- Look and feel like a native app
- Launch from your home screen like any other app

## Creating App Icons

You need to create two icon files for the app to look complete:

### Required Icons:
- `icon-192.png` (192x192 pixels)
- `icon-512.png` (512x512 pixels)

### How to Create Icons:

#### Option 1: Use an Online Tool
1. Go to https://www.favicon-generator.org/ or https://realfavicongenerator.net/
2. Upload a square image (at least 512x512)
3. Download the generated icons
4. Rename and place them in your project root

#### Option 2: Create Simple Icons
You can create simple icons using:
- **Canva** (free): https://www.canva.com/
- **Figma** (free): https://www.figma.com/
- **GIMP** (free): https://www.gimp.org/

Design tips:
- Use a simple car icon or game logo
- Use your game's color scheme (#4a9eff blue)
- Make it recognizable at small sizes
- Keep it simple and bold

#### Option 3: Use a Placeholder
For testing, you can create simple colored squares:
- Create a 192x192 blue square image → save as `icon-192.png`
- Create a 512x512 blue square image → save as `icon-512.png`

## Testing the PWA

1. **Test on your phone**:
   - Open Safari on iOS
   - Visit your GitHub Pages URL
   - Try installing it

2. **Check PWA features**:
   - Service Worker should cache files (check in Safari DevTools if possible)
   - App should work offline after first load
   - Should open in standalone mode (no browser UI)

## Troubleshooting

### Icon not showing?
- Make sure `icon-192.png` and `icon-512.png` exist in the root directory
- Clear Safari cache: Settings → Safari → Clear History and Website Data
- Try reinstalling the app

### App not installing?
- Make sure you're using Safari (not Chrome)
- Check that the manifest.json is accessible
- Verify the service worker is registered (check browser console)

### Offline not working?
- Service workers require HTTPS (GitHub Pages provides this)
- Make sure `sw.js` is in the root directory
- Check browser console for service worker errors

## Advanced: Submit to App Store (Optional)

If you want to submit to the App Store, you'll need to:

1. **Use a native wrapper**:
   - **Capacitor** (recommended): https://capacitorjs.com/
   - **Cordova**: https://cordova.apache.org/
   - These wrap your web app in a native iOS container

2. **Build process**:
   ```bash
   npm install -g @capacitor/cli
   npx cap init
   npx cap add ios
   npx cap sync
   npx cap open ios
   ```

3. **Submit to App Store**:
   - Build in Xcode
   - Follow Apple's App Store guidelines
   - Submit through App Store Connect

## Current Setup

Your app is configured as:
- ✅ PWA with manifest.json
- ✅ Service Worker for offline support
- ✅ iOS-specific meta tags
- ✅ Standalone display mode
- ⚠️ Icons needed (create `icon-192.png` and `icon-512.png`)

Once you add the icon files and push to GitHub, your app will be ready to install on iOS!

