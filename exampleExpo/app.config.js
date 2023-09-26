const APP_VARIANT = process.env.APP_VARIANT || 'development';

const data = {
  development: {
    appName: 'dev app',
    bundleIdentifier: 'com.keys.development',
    package: 'com.keys.development',
  },
  staging: {
    appName: 'staging app',
    bundleIdentifier: 'com.keys.staging',
    package: 'com.keys.staging',
  },
  production: {
    appName: 'prod app',
    bundleIdentifier: 'com.keys.production',
    package: 'com.keys.production',
  },
};

export default {
  expo: {
    name: data[APP_VARIANT].appName,
    slug: 'example',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'automatic',
    splash: {
      image: './assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true,
      bundleIdentifier: data[APP_VARIANT].bundleIdentifier,
    },
    android: {
      package: data[APP_VARIANT].package,
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
    },
    web: {
      favicon: './assets/favicon.png',
    },
    plugins: [
      [
        '../app.plugin.js',
        {
          android: {
            defaultKeyFile: 'keys.production.json',
          },
          ios: {
            defaultKeyFile: 'keys.production.json',
          },
          IS_EXAMPLE: true,
        },
      ],
    ],
  },
};
