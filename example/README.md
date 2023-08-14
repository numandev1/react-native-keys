## Get started

To try the playground out for yourself, run the following commands:

```sh
git clone <https://github.com/numandev1/react-native-keys.git>
cd example
yarn
```

### iOS

1. Open the example/ios/KeysExample.xcworkspace file with Xcode
2. Change signing configuration to your developer account
3. Select your device in the devices drop-down
4. Hit run

### Android

1. Open the example/android/ folder with Android Studio
2. Select your device in the devices drop-down
3. Hit run

### Enable New Arch

#### Android

You will only need to update your android/gradle.properties file as follows:

```diff
# Use this property to enable support to the new architecture.
# This will allow you to use TurboModules and the Fabric render in
# your application. You should enable this flag either if you want
# to write custom TurboModules/Fabric components OR use libraries that
# are providing them.
- newArchEnabled=false
+ newArchEnabled=true
```

#### IOS

You will only need to reinstall your pods by running pod install with the right flag:

```sh
# Run pod install with the flag:
RCT_NEW_ARCH_ENABLED=1 bundle exec pod install
```
