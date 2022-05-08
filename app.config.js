import 'dotenv/config';

export default {
  "expo": {
    "name": "Deep Chat",
    "slug": "deepchat",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/logo_android_foreground.png",
    "scheme": "myapp",
    "splash": {
      "image": "./assets/images/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "updates": {
      "fallbackToCacheTimeout": 0
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true,
      "icon": "./assets/images/logo_ios.png"
    },
    "android": {
      "icon": "./assets/images/logo_android.png",
      "userInterfaceStyle": "automatic",
      "adaptiveIcon": {
        "foregroundImage": "./assets/images/logo_android_foreground.png",
        "backgroundColor": "#ffffff"
      }
    },
    "web": {
      "favicon": "./assets/images/logo_ios.png"
    },
    "extra": {
      apiKey: process.env.API_KEY,
      authDomain: process.env.AUTH_DOMAIN,
      databaseURL: process.env.DATABASE_URL,
      projectId: process.env.PROJECT_ID,
      storageBucket: process.env.STORAGE_BUCKET,
      messagingSenderId: process.env.MESSAGING_SENDER_ID,
      appId: process.env.APP_ID,
      measurementId: process.env.MEASUREMENT_ID
    }
  }
}
