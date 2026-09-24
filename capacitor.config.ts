import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.ghinan.eksis',
  appName: 'EKSIS',
  webDir: 'dist',
  server: {
    // Memastikan seluruh aset lokal dilayani melalui skema HTTPS yang aman untuk production
    androidScheme: 'https',
    cleartext: false,
    allowNavigation: [
      'https://eksis-ghinan.ai.studio/*',
      '*.ai.studio',
      'api.whatsapp.com',
      'wa.me',
    ],
  },
  android: {
    allowMixedContent: false,
    captureInput: true,
    webContentsDebuggingEnabled: false, // Aman untuk Google Play Store Release
    backgroundColor: '#0f172a', // Slate 900 tema EKSIS
  },
  plugins: {
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#0f172a',
    },
  },
};

export default config;
