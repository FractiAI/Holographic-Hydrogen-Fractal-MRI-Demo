# 🌐 Integration Guide - Mobile Module ↔ HHF-AI MRI Demo

## Overview

Connect the mobile module to the main HHF-AI MRI demo for real-time synchronized experiences. Mobile sensor data feeds into the SSANLattice, while the demo can send commands back to the mobile device.

---

## Architecture

```
┌──────────────────┐         WebSocket          ┌──────────────────┐
│                  │      ws://host:3000       │                  │
│  Mobile Module   │◄──────────────────────────►│  HHF-AI Demo     │
│  (Smartphone)    │                            │  (Web Browser)   │
│                  │                            │                  │
│  • Sensors       │                            │  • SSAN Lattice  │
│  • Haptics       │                            │  • Visualization │
│  • Display       │                            │  • Tesla AI      │
└──────────────────┘                            └──────────────────┘
        │                                               │
        │                                               │
        ▼                                               ▼
  User's Hand                                    Museum Display
  (Sensory Gateway)                              (Visual Output)
```

---

## Implementation Options

### Option 1: Direct WebSocket (Recommended for Development)

Add WebSocket server to main demo's backend.

#### Step 1: Install WebSocket Library

```bash
cd /Users/macbook/FractiAI/Holographic-Hydrogen-Fractal-MRI-Demo
npm install ws @types/ws
```

#### Step 2: Create WebSocket Server

Create `src/server/websocketServer.ts`:

```typescript
import { WebSocketServer, WebSocket } from 'ws';
import { HydrogenSpinState } from '../mobile-module/src/sensors/HydrogenSpinMapper';

export interface ConnectedDevice {
  ws: WebSocket;
  deviceId: string;
  lastUpdate: number;
}

export class HHFWebSocketServer {
  private wss: WebSocketServer;
  private devices: Map<string, ConnectedDevice> = new Map();
  private spinStateCallbacks: Set<(state: HydrogenSpinState, deviceId: string) => void> = new Set();

  constructor(port: number = 3000) {
    this.wss = new WebSocketServer({ port });
    this.setupServer();
    console.log(`✅ HHF-AI MRI WebSocket Server listening on port ${port}`);
  }

  private setupServer(): void {
    this.wss.on('connection', (ws: WebSocket) => {
      console.log('📱 New mobile device connected');

      ws.on('message', (data: Buffer) => {
        try {
          const message = JSON.parse(data.toString());
          this.handleMessage(ws, message);
        } catch (error) {
          console.error('Error parsing message:', error);
        }
      });

      ws.on('close', () => {
        // Remove device
        for (const [deviceId, device] of this.devices.entries()) {
          if (device.ws === ws) {
            this.devices.delete(deviceId);
            console.log(`📱 Device ${deviceId} disconnected`);
            break;
          }
        }
      });
    });
  }

  private handleMessage(ws: WebSocket, message: any): void {
    switch (message.type) {
      case 'calibration':
        if (message.payload.action === 'handshake') {
          this.devices.set(message.deviceId, {
            ws,
            deviceId: message.deviceId,
            lastUpdate: Date.now()
          });
          console.log(`✅ Device ${message.deviceId} registered`);
          
          // Send welcome
          this.sendToDevice(message.deviceId, {
            type: 'acknowledgment',
            payload: { status: 'connected', message: 'Welcome to HHF-AI MRI!' }
          });
        }
        break;

      case 'spin_state':
        // Forward spin state to all registered callbacks
        this.spinStateCallbacks.forEach(callback => {
          callback(message.payload, message.deviceId);
        });
        
        // Update device timestamp
        const device = this.devices.get(message.deviceId);
        if (device) {
          device.lastUpdate = Date.now();
        }
        break;
    }
  }

  public onSpinState(callback: (state: HydrogenSpinState, deviceId: string) => void): void {
    this.spinStateCallbacks.add(callback);
  }

  public sendToDevice(deviceId: string, message: any): void {
    const device = this.devices.get(deviceId);
    if (device && device.ws.readyState === WebSocket.OPEN) {
      device.ws.send(JSON.stringify({
        ...message,
        timestamp: Date.now(),
        deviceId: 'backend_server'
      }));
    }
  }

  public broadcastCommand(command: string): void {
    this.devices.forEach(device => {
      if (device.ws.readyState === WebSocket.OPEN) {
        device.ws.send(JSON.stringify({
          type: 'command',
          payload: { action: command },
          timestamp: Date.now(),
          deviceId: 'backend_server'
        }));
      }
    });
  }

  public getConnectedDevices(): string[] {
    return Array.from(this.devices.keys());
  }
}

export default HHFWebSocketServer;
```

#### Step 3: Integrate with Main App

Update `src/App.tsx`:

```typescript
import { useEffect, useState } from 'react';
import HHFWebSocketServer from './server/websocketServer';

// Add at top level
const wsServer = new HHFWebSocketServer(3000);

function App() {
  const [connectedDevices, setConnectedDevices] = useState<string[]>([]);
  
  useEffect(() => {
    // Listen for mobile spin states
    wsServer.onSpinState((spinState, deviceId) => {
      console.log(`Received spin state from ${deviceId}:`, spinState);
      
      // Example: Update SSAN Lattice with mobile data
      // updateSSANWithMobileData(spinState);
      
      // Example: Trigger Tesla response
      if (spinState.coherence > 0.9) {
        wsServer.sendToDevice(deviceId, {
          type: 'command',
          payload: { action: 'tesla_pulse' }
        });
      }
    });
    
    // Update connected devices list
    const interval = setInterval(() => {
      setConnectedDevices(wsServer.getConnectedDevices());
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  // ... rest of app
}
```

---

### Option 2: Firebase Realtime Database

For production with multiple devices.

#### Setup

```bash
npm install firebase
```

#### Configuration

```typescript
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, onValue } from 'firebase/database';

const firebaseConfig = {
  // Your Firebase config
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Mobile writes spin state
set(ref(db, `devices/${deviceId}/spinState`), spinState);

// Demo listens for updates
onValue(ref(db, 'devices'), (snapshot) => {
  const devices = snapshot.val();
  // Process all device states
});
```

---

## Use Cases

### 1. **Museum Exhibit Integration**

**Setup:**
- Wall-mounted display runs main demo
- Visitors use their phones as "MRI controllers"
- Phone sensors manipulate 3D visualizations

**Implementation:**
```typescript
// In main demo
wsServer.onSpinState((spinState, deviceId) => {
  // Map phone tilt to camera angle
  const camera = sceneRef.current?.camera;
  if (camera) {
    camera.rotation.x = spinState.spinAngle * Math.PI / 180;
    camera.rotation.y = spinState.phase * Math.PI / 180;
  }
  
  // Phone's coherence controls particle count
  updateParticleSystem(spinState.coherence * 1000);
});
```

### 2. **Multi-Device Collaboration**

**Setup:**
- Multiple students use phones simultaneously
- Combined sensor data creates complex patterns

**Implementation:**
```typescript
const combinedCoherence = devices
  .map(d => d.spinState.coherence)
  .reduce((sum, c) => sum + c, 0) / devices.length;

// System responds to collective coherence
if (combinedCoherence > 0.8) {
  triggerGroupVisualization();
}
```

### 3. **Remote Participation**

**Setup:**
- Students at home connect via mobile
- Teacher controls main demo
- Everyone's sensors contribute

**Implementation:**
```typescript
// Cloud-based synchronization
devices.forEach(device => {
  const contribution = calculateContribution(device.spinState);
  updateGlobalField(contribution);
});
```

---

## Data Flow Examples

### Example 1: Phone → Demo (Sensor Control)

```typescript
// Mobile sends tilt data
{
  "type": "spin_state",
  "payload": {
    "magnetization": { "x": 0.3, "y": 0.2, "z": 0.95 },
    "spinAngle": 25.0
  }
}

// Demo receives and adjusts 3D scene
scene.rotation.x = spinAngle * Math.PI / 180;
```

### Example 2: Demo → Phone (Haptic Feedback)

```typescript
// Demo detects high coherence in SSAN lattice
if (ssanMetrics.globalCoherence > 0.9) {
  wsServer.broadcastCommand('tesla_pulse');
}

// Mobile receives and triggers haptic
hapticDriver.playTeslaPulse();
```

### Example 3: Bidirectional (Interactive Loop)

```typescript
// Phone tilts (90° pulse)
mobile sends: { spinAngle: 90 }

// Demo visualizes flip
→ animate spin flip in 3D

// Demo sends confirmation
demo sends: { command: 'heavy' haptic }

// Phone vibrates
→ user feels the "pulse"
```

---

## Synchronization Strategies

### Time Sync

```typescript
// Server timestamp
const serverTime = Date.now();

// Client adjusts for latency
const latency = (Date.now() - message.timestamp) / 2;
const syncedTime = serverTime - latency;
```

### State Buffering

```typescript
// Buffer recent states for smooth interpolation
const stateBuffer: SpinState[] = [];
stateBuffer.push(newState);
if (stateBuffer.length > 10) stateBuffer.shift();

// Interpolate between states
const interpolated = lerp(stateBuffer[0], stateBuffer[stateBuffer.length-1], t);
```

---

## Testing Integration

### Local Network Test

```bash
# Terminal 1: Start main demo
cd /Users/macbook/FractiAI/Holographic-Hydrogen-Fractal-MRI-Demo
npm run dev

# Terminal 2: Start mobile module
cd mobile-module
npm start

# Phone: Connect to http://YOUR_LOCAL_IP:3000
# Should see connection in Terminal 1
```

### Verify Connection

```typescript
// In mobile App.tsx
useEffect(() => {
  if (wsClient.current?.isConnected()) {
    console.log('✅ Connected to backend');
    hapticDriver.playTeslaPulse(); // Confirmation pulse
  }
}, [isConnected]);
```

---

## Performance Optimization

### Throttle Updates

```typescript
// Only send updates at most 30 Hz
let lastSent = 0;
const throttleMs = 33; // ~30 Hz

if (Date.now() - lastSent > throttleMs) {
  wsClient.sendSpinState(spinState);
  lastSent = Date.now();
}
```

### Compress Data

```typescript
// Send only changed values
const delta = {
  phase: Math.abs(spinState.phase - lastPhase) > 1 ? spinState.phase : null,
  coherence: Math.abs(spinState.coherence - lastCoherence) > 0.05 ? spinState.coherence : null
};
```

---

## Security Considerations

### Authentication

```typescript
// Simple token-based auth
const token = generateDeviceToken();

wsClient.send({
  type: 'auth',
  payload: { token }
});

// Server validates
if (!isValidToken(token)) {
  ws.close(4001, 'Unauthorized');
}
```

### Rate Limiting

```typescript
// Limit messages per second
const rateLimiter = new Map<string, number>();

if ((rateLimiter.get(deviceId) || 0) > 60) {
  console.warn(`Rate limit exceeded for ${deviceId}`);
  return;
}
```

---

## Deployment Checklist

- [ ] Configure production WebSocket URL
- [ ] Set up SSL/TLS for wss://
- [ ] Implement authentication
- [ ] Add rate limiting
- [ ] Test on real network (not localhost)
- [ ] Monitor connection stability
- [ ] Handle reconnection gracefully
- [ ] Log errors for debugging

---

## Future Enhancements

1. **Multi-User Visualization** - Show all connected phones as nodes
2. **Collaborative Experiments** - Sync actions across devices
3. **AR Integration** - Use camera for spatial mapping
4. **Audio Resonance** - Microphone detects ambient frequency
5. **ML Integration** - Predict spin states with TensorFlow.js

---

**⚡ Build the connected Syntheverse experience! ⚡**

