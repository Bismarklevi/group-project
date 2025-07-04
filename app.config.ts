import 'dotenv/config';

export default {
  expo: {
    name: 'streamio',
    slug: 'streamio',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'dark',
    splash: {
      image: './assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#000000'
    },
    assetBundlePatterns: [
      '**/*'
    ],
    ios: {
      supportsTablet: true
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#000000'
      }
    },
    web: {
      favicon: './assets/favicon.png'
    },
    extra: {
      tmdbApiKey: process.env.TMDB_API_KEY
    }
  }
}; 