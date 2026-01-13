# 🚀 Quick Setup Guide - HHF-AI MRI Mobile Module

## 5-Minute Quickstart

### Step 1: Install Dependencies (2 min)

```bash
cd mobile-module
npm install
```

### Step 2: Start Development Server (1 min)

```bash
npm start
```

This will:
- ✅ Start Expo Dev Server
- ✅ Generate QR code
- ✅ Open browser dashboard

### Step 3: Run on Your Phone (2 min)

#### For iOS:
1. Install **Expo Go** from App Store
2. Open Camera app
3. Scan QR code from terminal
4. App opens in Expo Go

#### For Android:
1. Install **Expo Go** from Play Store
2. Open Expo Go app
3. Scan QR code from terminal
4. App opens in Expo Go

### Step 4: Grant Permissions

When app launches:
- ✅ Allow sensor access
- ✅ Allow vibration/haptics
- ✅ (Optional) Allow camera
- ✅ (Optional) Allow microphone

### Step 5: Begin Experience

1. Tap **"▶️ Begin Tesla Tour"**
2. Hold phone steady
3. Watch fractal patterns emerge
4. Feel haptic pulses
5. Follow Tesla's guidance!

---

## First Time Setup Checklist

### Prerequisites
- [ ] Node.js 16+ installed
- [ ] npm 8+ installed
- [ ] Expo CLI installed (`npm install -g expo-cli`)
- [ ] Smartphone with sensors
- [ ] Expo Go app installed on phone

### Configuration
- [ ] Review `app.json` for app settings
- [ ] Check `package.json` dependencies
- [ ] Configure backend WebSocket URL in `App.tsx` (line 72)
- [ ] Test sensor availability

### Backend Setup (Optional)

If you want live backend sync:

```bash
# In main demo directory
cd ..
npm run dev

# Backend will listen on ws://localhost:3000/hhf-ai-mri
```

Then update `App.tsx`:

```typescript
wsClient.current = new WebSocketClient({
  url: 'ws://YOUR_COMPUTER_IP:3000/hhf-ai-mri', // Use local IP, not localhost
  reconnectInterval: 3000,
  maxReconnectAttempts: 5
});
```

**Find your local IP:**
- **Mac/Linux**: `ifconfig | grep "inet "` 
- **Windows**: `ipconfig`
- Look for 192.168.x.x or 10.0.x.x

---

## Common Setup Issues

### Issue: "Cannot find module 'expo'"

**Solution:**
```bash
npm install expo
```

### Issue: QR code not scanning

**Solution:**
- Ensure phone and computer on same Wi-Fi
- Try manual URL entry in Expo Go
- Use tunnel mode: `expo start --tunnel`

### Issue: Sensors not working

**Solution:**
- Grant all permissions
- Restart app
- Check device has required sensors
- Try on different device

### Issue: Haptics not working

**Solution:**
- Disable silent/vibrate mode
- Check system haptics enabled
- iOS: Settings > Sounds & Haptics
- Android: Settings > Sound > Vibration

---

## Development Tips

### Hot Reload
- Shake device to open dev menu
- Enable Fast Refresh for instant updates
- No need to rebuild for code changes

### Debugging
- Use `console.log()` - appears in terminal
- Shake device → "Debug Remote JS"
- Use React Native Debugger

### Testing Sensors
```typescript
// Add to App.tsx for debugging
useEffect(() => {
  const interval = setInterval(() => {
    console.log('Sensor Data:', sensorManager.getLatestData());
  }, 1000);
  return () => clearInterval(interval);
}, []);
```

---

## Building Standalone App

### For Testing (Development Build)

```bash
# iOS (requires Mac + Xcode)
eas build --platform ios --profile development

# Android
eas build --platform android --profile development
```

### For Production

```bash
# iOS
eas build --platform ios --profile production

# Android
eas build --platform android --profile production
```

---

## Project Structure Quick Reference

```
mobile-module/
├── App.tsx                    ← Main app (start here)
├── src/
│   ├── sensors/
│   │   ├── HydrogenSpinMapper.ts   ← Physics engine
│   │   └── SensorManager.ts        ← Sensor API
│   ├── network/
│   │   └── WebSocketClient.ts      ← Backend sync
│   └── components/
│       ├── FractalHolographicDisplay.tsx  ← Visuals
│       ├── HapticFeedbackDriver.ts        ← Haptics
│       └── TeslaAvatar.tsx                ← Guide
└── README.md                  ← Full documentation
```

---

## Next Steps

1. ✅ Get app running (this guide)
2. 📚 Read full README.md
3. 🎨 Customize visuals in `FractalHolographicDisplay.tsx`
4. 🔧 Adjust physics in `HydrogenSpinMapper.ts`
5. 🌐 Connect to backend (optional)
6. 🚀 Share with friends!

---

**⚡ Ready to explore the Syntheverse! ⚡**

Questions? Email: info@fractiai.com

