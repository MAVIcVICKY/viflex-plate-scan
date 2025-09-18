import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.71fcb856f56340f8b1b06a79dd171860',
  appName: 'viflex-plate-scan',
  webDir: 'dist',
  server: {
    url: 'https://71fcb856-f563-40f8-b1b0-6a79dd171860.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    Camera: {
      permissions: ['camera', 'photos']
    }
  }
};

export default config;