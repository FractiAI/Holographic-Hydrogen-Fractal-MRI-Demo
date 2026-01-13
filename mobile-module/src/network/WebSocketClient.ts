/**
 * WebSocket Client
 * Real-time connection to HHF-AI MRI backend
 */

import { HydrogenSpinState } from '../sensors/HydrogenSpinMapper';

export interface BackendConfig {
  url: string;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
}

export interface HHFMessage {
  type: 'spin_state' | 'calibration' | 'command' | 'acknowledgment';
  payload: any;
  timestamp: number;
  deviceId: string;
}

export type MessageCallback = (message: HHFMessage) => void;

export class WebSocketClient {
  private ws: WebSocket | null = null;
  private config: BackendConfig;
  private reconnectAttempts = 0;
  private reconnectTimeout: any = null;
  private isConnecting = false;
  private callbacks: Set<MessageCallback> = new Set();
  private deviceId: string;
  
  constructor(config: BackendConfig) {
    this.config = {
      reconnectInterval: 3000,
      maxReconnectAttempts: 10,
      ...config
    };
    this.deviceId = this.generateDeviceId();
  }
  
  /**
   * Connect to backend
   */
  async connect(): Promise<void> {
    if (this.ws?.readyState === WebSocket.OPEN) {
      console.log('⚡ Already connected');
      return;
    }
    
    if (this.isConnecting) {
      console.log('⏳ Connection already in progress');
      return;
    }
    
    this.isConnecting = true;
    
    return new Promise((resolve, reject) => {
      try {
        console.log(`🔌 Connecting to ${this.config.url}...`);
        this.ws = new WebSocket(this.config.url);
        
        this.ws.onopen = () => {
          console.log('✅ WebSocket connected');
          this.isConnecting = false;
          this.reconnectAttempts = 0;
          
          // Send handshake
          this.send({
            type: 'calibration',
            payload: {
              action: 'handshake',
              deviceId: this.deviceId,
              capabilities: ['magnetometer', 'accelerometer', 'gyroscope', 'haptics']
            },
            timestamp: Date.now(),
            deviceId: this.deviceId
          });
          
          resolve();
        };
        
        this.ws.onmessage = (event) => {
          try {
            const message: HHFMessage = JSON.parse(event.data);
            this.callbacks.forEach(callback => {
              try {
                callback(message);
              } catch (error) {
                console.error('Error in message callback:', error);
              }
            });
          } catch (error) {
            console.error('Error parsing message:', error);
          }
        };
        
        this.ws.onerror = (error) => {
          console.error('❌ WebSocket error:', error);
          this.isConnecting = false;
          reject(error);
        };
        
        this.ws.onclose = () => {
          console.log('🔌 WebSocket closed');
          this.isConnecting = false;
          this.attemptReconnect();
        };
        
      } catch (error) {
        console.error('❌ Connection error:', error);
        this.isConnecting = false;
        reject(error);
      }
    });
  }
  
  /**
   * Disconnect from backend
   */
  disconnect(): void {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    
    console.log('🛑 Disconnected from backend');
  }
  
  /**
   * Send spin state to backend
   */
  sendSpinState(spinState: HydrogenSpinState): void {
    this.send({
      type: 'spin_state',
      payload: spinState,
      timestamp: Date.now(),
      deviceId: this.deviceId
    });
  }
  
  /**
   * Send message to backend
   */
  private send(message: HHFMessage): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      try {
        this.ws.send(JSON.stringify(message));
      } catch (error) {
        console.error('Error sending message:', error);
      }
    } else {
      console.warn('⚠️ Cannot send - WebSocket not connected');
    }
  }
  
  /**
   * Subscribe to messages
   */
  subscribe(callback: MessageCallback): () => void {
    this.callbacks.add(callback);
    return () => {
      this.callbacks.delete(callback);
    };
  }
  
  /**
   * Attempt reconnection
   */
  private attemptReconnect(): void {
    if (
      this.reconnectAttempts < (this.config.maxReconnectAttempts || 10) &&
      !this.isConnecting
    ) {
      this.reconnectAttempts++;
      console.log(
        `🔄 Reconnecting (${this.reconnectAttempts}/${this.config.maxReconnectAttempts})...`
      );
      
      this.reconnectTimeout = setTimeout(() => {
        this.connect().catch(error => {
          console.error('Reconnection failed:', error);
        });
      }, this.config.reconnectInterval);
    } else {
      console.log('❌ Max reconnection attempts reached');
    }
  }
  
  /**
   * Generate unique device ID
   */
  private generateDeviceId(): string {
    return `mobile_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  /**
   * Check connection status
   */
  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }
}

export default WebSocketClient;



