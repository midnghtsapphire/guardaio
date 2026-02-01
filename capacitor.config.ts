import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.7cfb769f672d44b286db9ddcc712f9eb',
  appName: 'DeepGuard - AI Deepfake Detection',
  webDir: 'dist',
  server: {
    url: 'https://7cfb769f-672d-44b2-86db-9ddcc712f9eb.lovableproject.com?forceHideBadge=true',
    cleartext: true,
  },
  ios: {
    contentInset: 'automatic',
    preferredContentMode: 'mobile',
  },
  android: {
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: true,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: '#0a0a0f',
      showSpinner: true,
      spinnerColor: '#8b5cf6',
    },
    StatusBar: {
      style: 'Dark',
      backgroundColor: '#0a0a0f',
    },
    Keyboard: {
      resize: 'body',
      style: 'dark',
    },
  },
};

export default config;
