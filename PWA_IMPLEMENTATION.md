# PWA (Progressive Web App) Implementation Guide

## Overview

Your Interview Coach now has full PWA support, allowing users to install the app on their devices (Android, iOS, Mac, and Windows) with offline functionality.

## What's Been Implemented

### 1. **Manifest File** (`/public/manifest.json`)

- Defines app metadata (name, icons, theme colors, etc.)
- Specifies the app start URL and display mode (standalone)
- Includes app icons for different devices
- Provides app shortcuts for quick access

### 2. **Service Worker** (`/public/service-worker.js`)

- Handles offline functionality through intelligent caching
- Caches static assets and the app shell
- Implements "cache first, network second" strategy for optimal performance
- Automatically updates when new versions are deployed
- Skips caching for API calls to always fetch fresh data

### 3. **PWA Install Prompt Component** (`/src/components/PWAInstallPrompt.tsx`)

- Automatically detects device platform (Android, iOS, Desktop)
- Shows a beautiful install prompt for Android and Desktop devices
- Provides iOS users with manual installation instructions
- Handles the `beforeinstallprompt` event
- Includes user consent flow (Install Now / Later buttons)

### 4. **Service Worker Registration** (`/src/components/ServiceWorkerRegister.tsx`)

- Registers the service worker on app load
- Checks for updates every 60 seconds
- Logs registration success/failure
- Handles service worker lifecycle events

### 5. **Updated Metadata** (`/src/app/layout.tsx`)

- Added PWA-specific meta tags
- Apple Web App configuration for iOS
- Microsoft Tile configuration for Windows
- Proper viewport and theme color settings

## Features

✅ **Android Installation**

- Native install prompt appears automatically
- App installable from home screen
- Full standalone app experience

✅ **iOS Installation**

- Manual install instructions shown
- "Share → Add to Home Screen" guidance
- Offline functionality included

✅ **Desktop (Windows/Mac) Installation**

- Install prompt in bottom-right corner
- One-click installation
- Desktop shortcuts support

✅ **Offline Support**

- Cached pages accessible offline
- API calls skip cache to ensure fresh data
- Graceful fallback for offline pages

✅ **Auto-Update**

- Checks for new versions periodically
- Seamless background updates
- User notified when new version is available

## Installation Flow

### For Android Users

1. User visits the website
2. Browser shows "Install" prompt
3. User taps "Install"
4. App appears on home screen
5. Launches in standalone mode (no browser UI)

### For iOS Users

1. User visits the website
2. App shows manual instruction banner
3. User taps Share → Add to Home Screen
4. App is available on home screen
5. Works as a web app in full screen

### For Desktop Users (Windows/Mac)

1. User visits the website
2. Install prompt appears in bottom-right corner
3. User clicks "Install Now"
4. App creates desktop shortcut or starts menu entry
5. Launches in app window (no address bar)

## Technical Details

### Cache Strategy

```javascript
- Static assets: Cache first (cached on first visit)
- Network requests: Network first
- Failed requests: Serve from cache
- API calls: Always fetch fresh
```

### Service Worker Scope

- Scope: `/` (entire app)
- Cache name: `yic-resume-analyzer-v1`
- Auto-cleanup of old caches on update

### Manifest Configuration

- Start URL: `/resume-analyzer`
- Display Mode: `standalone` (full screen app)
- Theme Color: `#2563eb` (Blue)
- Icons: 192x192px and 512x512px for different device sizes

## Browser Support

| Feature          | Chrome | Firefox | Safari | Edge |
| ---------------- | ------ | ------- | ------ | ---- |
| Service Worker   | ✅     | ✅      | ✅     | ✅   |
| Web App Manifest | ✅     | ✅      | ⚠️     | ✅   |
| Install Prompt   | ✅     | ✅      | ❌     | ✅   |
| Offline Support  | ✅     | ✅      | ✅     | ✅   |

## Testing PWA Locally

### Chrome DevTools

1. Open DevTools (F12)
2. Go to Application → Manifest
3. Verify manifest.json is loaded
4. Check Service Workers tab for registration
5. Test offline in Network tab

### Test Install Prompt

1. Visit http://localhost:3000/resume-analyzer
2. Chrome will show install prompt (on first visit)
3. Android emulator will trigger full install flow

### Test Offline

1. Register service worker
2. Open DevTools → Network
3. Enable "Offline" checkbox
4. Verify pages still load from cache

## Deployment Notes

### For Production

1. Ensure HTTPS is enabled (required for service workers)
2. Update manifest.json icons path if hosting in subdirectory
3. Test on actual devices before launch
4. Monitor service worker updates in analytics

### HTTPS Requirement

- Service workers only work over HTTPS
- Exception: localhost for development
- Install prompts only trigger on HTTPS

## Updating PWA

When you need to update the app:

1. Update manifest.json (change version in cache name)
2. Update service-worker.js cache key
3. Deploy to production
4. Users get prompted when new version is available
5. Update installs automatically in background

## Next Steps (Optional Enhancements)

- [ ] Add push notifications
- [ ] Implement app shortcuts for quick resume analysis
- [ ] Add background sync for offline uploads
- [ ] Create app-specific splash screens
- [ ] Add app usage analytics
- [ ] Implement share target for other apps

## Troubleshooting

### Install Prompt Not Showing

- Check if app meets PWA requirements:
  - Manifest.json exists and is valid
  - Service worker is registered
  - Using HTTPS (or localhost)
  - Icons are accessible and correct size

### Service Worker Not Updating

- Clear browser cache: Settings → Clear browsing data
- Unregister old service worker manually
- Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

### App Not Opening Offline

- Verify service worker is registered
- Check console for any cache errors
- Ensure static assets are being cached
- Test with DevTools offline mode

## Support

For issues or questions about the PWA implementation, check:

- PWA Checklist: https://web.dev/pwa-checklist/
- Service Worker Guide: https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API
