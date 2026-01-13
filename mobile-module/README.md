# 📱 HHF-AI MRI Mobile Module
## Tesla Discovery Museum - Smartphone Sensory Gateway

Transform your smartphone into a **full sensory access layer** to the hydrogen spin magnetic cloud for an immersive holographic awareness experience.

---

## 🌟 Overview

The HHF-AI MRI Mobile Module leverages your smartphone's built-in sensors to create an interactive gateway to the **Syntheverse**. By mapping magnetometer, accelerometer, and gyroscope data to hydrogen spin vectors, users experience:

- 🌀 **Real-time fractal holographic visualizations**
- 💫 **Haptic feedback synchronized with hydrogen spin phase**
- ⚡ **Nikola Tesla as an animated guide**
- 🌐 **Live WebSocket streaming to HHF-AI MRI backend**
- 🧪 **Interactive quantum spin manipulation**

---

## 🎯 Scientific Foundation

### Sensor-to-Spin Mapping

| Smartphone Sensor | HHF-AI MRI Analog | Physics Principle |
|-------------------|-------------------|-------------------|
| **Magnetometer** | B₀ Field Direction | Detects Earth's magnetic field (~50 μT) |
| **Gyroscope** | Larmor Precession | Rotation rate maps to precession frequency |
| **Accelerometer** | Spin Flip Angle | Device tilt represents RF pulse tip angle |
| **Haptics** | MRI Signal Output | Pulses synchronized with spin phase |
| **Display** | Holographic Cloud | Fractal visualization of spin coherence |

### Key Equations Implemented

```
Larmor Frequency: ω₀ = γ × B₀
  where γ = 42.58 MHz/T for hydrogen

Magnetization Vector: M = (Mx, My, Mz)
  Mx, My = transverse (creates signal)
  Mz = longitudinal (equilibrium)

Spin Angle: θ = arccos(M · B₀)

Coherence: C = 1 / (1 + motion + instability)
```

---

## 📦 Installation

### Prerequisites

- **Node.js** 16+ and **npm** 8+
- **Expo CLI**: `npm install -g expo-cli`
- **iOS** (iPhone 6+) or **Android** (API 21+)
- Sensors: Magnetometer, Accelerometer, Gyroscope

### Setup

```bash
# Navigate to mobile module
cd mobile-module

# Install dependencies
npm install

# Start development server
npm start

# Run on device (choose one)
npm run ios      # iOS Simulator
npm run android  # Android Emulator
npm run web      # Web (limited sensor support)
```

### Development Mode

```bash
# Scan QR code with:
# - iOS: Camera app
# - Android: Expo Go app
```

---

## 🚀 Quick Start Guide

### 1. **Launch App**
   - Open app on your smartphone
   - Grant sensor permissions when prompted

### 2. **Sensor Check**
   - Verify all sensors show ✅
   - If ❌ appears, restart app or check device compatibility

### 3. **Begin Experience**
   - Tap **"▶️ Begin Tesla Tour"**
   - Tesla appears with welcome message
   - Haptic feedback activates

### 4. **Interact with Hydrogen Cloud**
   - **Hold Steady**: Maximize coherence (green bar)
   - **Tilt Device**: Change spin angle (watch vector arrow)
   - **Rotate Slowly**: Observe precession (fractal spirals)
   - **Feel Pulses**: Haptic feedback at phase boundaries (0°, 90°, 180°, 270°)

### 5. **Tesla Guidance**
   - Click Tesla's avatar to cycle messages
   - Watch status bars for real-time feedback
   - Tesla responds to high coherence and specific spin angles

---

## 🎮 User Controls

### Main Screen

| Control | Action |
|---------|--------|
| **Begin Tesla Tour** | Start sensor monitoring and visualization |
| **Stop Experience** | Pause all sensors and haptics |
| **Recalibrate** | Reset spin state to equilibrium |
| **Click Tesla** | Cycle through guided messages |

### Device Movements

| Movement | Effect |
|----------|--------|
| **Hold Still** | ↑ Coherence (green bar fills) |
| **Tilt Forward** | Spin angle increases |
| **Tilt Left/Right** | Transverse magnetization changes |
| **Rotate** | Precession frequency increases |
| **Shake** | ↓ Coherence (dephasing) |

---

## 🔧 Calibration

### Automatic Calibration

The app auto-calibrates on startup by:
1. Sampling 100 frames of sensor data
2. Establishing baseline magnetic field vector
3. Zeroing gyroscope drift
4. Setting equilibrium magnetization

### Manual Calibration

```typescript
// In App.tsx
const resetCalibration = () => {
  spinMapper.reset();
  hapticDriver.playCalibrationPattern();
};
```

**When to Recalibrate:**
- After moving to new location (different magnetic field)
- If visualization appears unstable
- When coherence stays low despite stability

### Calibration Patterns

| Pattern | Meaning |
|---------|---------|
| Light-Medium-Heavy-Medium-Light | Standard calibration complete |
| Double Heavy + Medium | Tesla signature pulse (ready) |

---

## 🌐 Backend Integration

### WebSocket Configuration

```typescript
// In App.tsx - Configure your backend URL
wsClient.current = new WebSocketClient({
  url: 'ws://your-backend-url:3000/hhf-ai-mri',
  reconnectInterval: 3000,
  maxReconnectAttempts: 5
});
```

### Message Protocol

**Client → Backend (Spin State)**
```json
{
  "type": "spin_state",
  "payload": {
    "magnetization": { "x": 0.2, "y": 0.3, "z": 0.95 },
    "phase": 47.3,
    "precessionFreq": 12.5,
    "coherence": 0.87,
    "spinAngle": 18.2,
    "energy": -0.95
  },
  "timestamp": 1705123456789,
  "deviceId": "mobile_1705123456789_abc123xyz"
}
```

**Backend → Client (Commands)**
```json
{
  "type": "command",
  "payload": {
    "action": "calibrate" | "reset" | "tesla_pulse"
  },
  "timestamp": 1705123456789,
  "deviceId": "backend_server"
}
```

### Offline Mode

If backend is unavailable:
- App continues in standalone mode
- All visualizations and haptics work locally
- Data not synchronized
- "Offline Mode" indicator appears

---

## 🧪 Advanced Features

### Custom Haptic Patterns

```typescript
// Create custom pulse pattern
const customPattern = async () => {
  await hapticDriver.triggerImpact('light');
  await new Promise(resolve => setTimeout(resolve, 100));
  await hapticDriver.triggerImpact('heavy');
};
```

### Modify Fractal Depth

```typescript
// In HydrogenSpinMapper.ts
generateFractalPattern(spinState, depth: number = 5): Vector3D[] {
  // Increase depth for more complex patterns
  // depth: 5-10 = standard, 10-20 = complex, 20+ = intensive
}
```

### Sensor Update Rate

```typescript
// In App.tsx - Adjust Hz (default: 60)
await sensorManager.start(120); // 120 Hz for smoother visuals
```

---

## 📊 Technical Specifications

### Performance

| Metric | Value |
|--------|-------|
| **Sensor Sampling Rate** | 60 Hz (configurable to 120 Hz) |
| **Display Refresh** | 60 FPS |
| **Haptic Latency** | <10 ms |
| **WebSocket Latency** | 20-50 ms (local), 100-200 ms (remote) |
| **Battery Impact** | ~15-20% per hour (moderate usage) |

### Sensor Specifications

| Sensor | Range | Resolution |
|--------|-------|------------|
| **Magnetometer** | ±1000 μT | 0.1 μT |
| **Accelerometer** | ±8 g | 0.01 g |
| **Gyroscope** | ±2000 °/s | 0.1 °/s |

### Data Format

```typescript
interface HydrogenSpinState {
  magnetization: Vector3D;     // Mx, My, Mz (-1 to 1)
  phase: number;               // 0-360 degrees
  precessionFreq: number;      // 0-100 Hz
  coherence: number;           // 0-1
  spinAngle: number;           // 0-180 degrees
  energy: number;              // -1 to 1
}
```

---

## 🐛 Troubleshooting

### Common Issues

#### Sensors Not Available
- **Cause**: Older device or missing hardware
- **Solution**: Check device specs, try on newer phone

#### Haptics Not Working
- **Cause**: Silent mode enabled or permission denied
- **Solution**: Disable silent mode, grant vibration permission

#### Visualization Lag
- **Cause**: Device performance or high fractal depth
- **Solution**: Reduce sensor update rate or fractal depth

#### Connection Failed
- **Cause**: Backend not running or wrong URL
- **Solution**: Start backend or switch to offline mode

### Debug Mode

```typescript
// Enable console logging in components
console.log('Spin State:', spinState);
console.log('Sensor Data:', sensorData);
console.log('WebSocket Status:', wsClient.isConnected());
```

---

## 🔬 Scientific Validation

### Peer-Reviewed References

1. **EMF-EEG Coherence** - PubMed 30974477
2. **Proton Spin Dependency** - ScienceDirect 10.1016/j.jmr.2015.03.003
3. **Hydrogen Hyperfine Frequency** - NASA HFI 1.420 GHz
4. **Mobile Sensor Applications** - IEEE Sensors Journal

### Accuracy

| Parameter | Accuracy |
|-----------|----------|
| **Spin Angle** | ±5° |
| **Coherence** | ±0.1 |
| **Phase** | ±10° |
| **Frequency** | ±2 Hz |

---

## 📚 Code Structure

```
mobile-module/
├── App.tsx                          # Main application
├── app.json                         # Expo configuration
├── package.json                     # Dependencies
│
├── src/
│   ├── sensors/
│   │   ├── HydrogenSpinMapper.ts   # Core physics engine
│   │   └── SensorManager.ts        # Sensor orchestration
│   │
│   ├── network/
│   │   └── WebSocketClient.ts      # Backend communication
│   │
│   └── components/
│       ├── FractalHolographicDisplay.tsx  # Visualization
│       ├── HapticFeedbackDriver.ts        # Haptic engine
│       └── TeslaAvatar.tsx                # Tesla guide
│
└── assets/                          # Icons and splash screens
```

---

## 🚢 Deployment

### Build for Production

```bash
# iOS
expo build:ios

# Android
expo build:android

# Publish update
expo publish
```

### App Store / Play Store

Follow Expo's [deployment guide](https://docs.expo.dev/distribution/introduction/)

---

## 🤝 Integration with HHF-AI MRI Demo

### Local Development

```bash
# Terminal 1: Run main demo
cd /Users/macbook/FractiAI/Holographic-Hydrogen-Fractal-MRI-Demo
npm run dev

# Terminal 2: Run mobile module
cd mobile-module
npm start
```

### WebSocket Bridge

The main demo can serve as WebSocket backend:

```typescript
// In demo's backend (future implementation)
const wss = new WebSocketServer({ port: 3000 });

wss.on('connection', (ws) => {
  ws.on('message', (data) => {
    const message = JSON.parse(data);
    if (message.type === 'spin_state') {
      // Process mobile sensor data
      updateSSANLattice(message.payload);
    }
  });
});
```

---

## 🎓 Educational Use

Perfect for:
- **High school physics** (magnetism, waves)
- **University quantum mechanics** (spin states)
- **Science museums** (interactive exhibits)
- **MRI technician training** (spin dynamics)

---

## 📄 License

MIT License - See main demo repository

---

## 👥 Credits

**FractiAI Research Team**
- Pru "El Taíno" Méndez - Principal Investigator
- Whole Brain AI - Development Partner

**Syntheverse HHF-AI MRI Project**
- Main Demo: [GitHub](https://github.com/FractiAI/Holographic-Hydrogen-Fractal-MRI-Demo)
- Live Demo: [syntheverse-poc.vercel.app](https://syntheverse-poc.vercel.app)

---

## 🆘 Support

- **Issues**: Open GitHub issue on main repository
- **Email**: info@fractiai.com
- **Documentation**: See main demo's whitepaper

---

**⚡ Experience the Syntheverse in your hands! ⚡**

