# react-native-keys

Manage local **secure** and **unsecure** enviroment through react-native-keys supporting iOS and Android

**secure:** Secure enviroment use JNI to secure keys which we cannot easily decompile or hack
**public:** Public enviroment use native bridging which can be decomile or hack

## Installation

```sh
yarn add react-native-keys
```

## Basic Usage

Create a new file `keys.json` in the root of your React Native app and add keys in `secure` object for JNI and add keys in public for without jni usage like this:

```
{
  "secure": {
    "secure1": "secure1 value",
    "secure2": "secure2 value",
    "secure3": "secure3 value"
  },
  "public": {
    "APP_NAME": "RNKEYS",
    "public1": "numan",
    "public2": "usman",
    "APP_ID": "com.example.rnkeys"
  }
}
```

Then access variables defined there from your app:

## Javascript

### Public Keys

```js
import Keys from 'react-native-keys';

Keys.API_URL; // https://example.com'
Keys.URI_SCHEME; // fb://
```

### Secure Keys (JNI)

```js
import Keys from 'react-native-keys';

await Keys.secureFor('API_TOKEN '); // 'ABCSE#$DDSD
await Keys.secureFor('GOOGLE_API_KEY '); // 'ABCSE#$DDSD
await Keys.secureFor('SECRET_KEY'); // 'ABCSE#$DDSD
```

Keep in mind It's [basically impossible to prevent users from reverse engineering mobile app secrets](https://rammic.github.io/2015/07/28/hiding-secrets-in-android-apps/) but this librrary iis more secure.

## Setup

Install the package:

```
$ yarn add react-native-keys
```

Link the library:

(Note: For React Native 0.60 or greater, [autolinking](https://reactnative.dev/blog/2019/07/03/version-60#native-modules-are-now-autolinked) is available)

(Note: For Windows, this module supports autolinking when used with `react-native-windows@0.63`
or later. For earlier versions you need to manually link the module.)

```
$ react-native link react-native-keys
```

if cocoapods are used in the project then pod has to be installed as well:

```
(cd ios; pod install)
```

- Manual Link (iOS)

  1.  In XCode, in the project navigator, right click `Libraries` ➜ `Add Files to [your project's name]`
  2.  Go to `node_modules` ➜ `react-native-keys` and add `Keys.xcodeproj`
  3.  Expand the `Keys.xcodeproj` ➜ `Products` folder
  4.  In the project navigator, select your project. Add `Keys.a` to your project's `Build Phases` ➜ `Link Binary With Libraries`
  5.  And go the Build Settings tab. Make sure All is toggled on (instead of Basic)
  6.  Look for Header Search Paths and add `$(SRCROOT)/../node_modules/react-native-keys/ios/**` as `non-recursive`

- Manual Link (Android)

  **android/settings.gradle**

  ```diff
  + include ':react-native-keys'
  + project(':react-native-keys').projectDir = new File(rootProject.projectDir, '../node_modules/react-native-keys/android')
  ```

  **android/app/build.gradle**

  ```diff
  dependencies {
  	implementation "com.facebook.react:react-native:+"  // From node_modules
  +	implementation project(':react-native-keys')
  }
  ```

  **MainApplication.java**

  ```diff
  + import com.rnkeys.KeysPackage;

  @Override
  protected List<ReactPackage> getPackages() {
  	   return Arrays.asList(
          		new MainReactPackage()
  +      		new KeysPackage()
      );
  }
  ```

## Native Usage

### Android

#### Public Keys

you can only read jni key into java file.like this

```java
URL url = new URL(BuildConfig.API_URL);  // https://example.com
```

You can also read them from your Gradle configuration:

```groovy
defaultConfig {
    applicationId project.env.get("APP_ID")
}
```

And use them to configure libraries in `AndroidManifest.xml` and others:

```xml
<meta-data
  android:name="io.branch.sdk.BranchKey.test"
  android:value="@string/BRANCH_KEY" />
```

All variables are strings, so you may need to cast them. For instance, in Gradle:

```
versionCode project.env.get("VERSION_CODE").toInteger()
```

#### Secure Keys (JNI)

```java
import static com.rnkeys.KeysModule.getSecureFor;

String secureValue=getSecureFor("BRANCH_KEY");   // key_test_omQ7YYKiq57vOqEJsdcsdfeEsiWkwxE
```

### iOS

#### Public Keys

Read variables declared in `keys.json` from your Obj-C classes like:

```objective-c
// import header
#import "Keys.h"

// then read individual keys like:
NSString *value = [Keys publicFor:@"API_URL"];   // https://example.com
```

#### Secure Keys (JNI)

```objective-c
// import header
#import "Keys.h"

// then read individual keys like:
NSString *value = [Keys secureFor:@"BRANCH_KEY"];   //key_test_omQ7YYKiq57vOqEJsdcsdfeEsiWkwxE
```

With one extra step environment values can be exposed to "Info.plist" and Build settings in the native project.

1. click on the file tree and create new file of type XCConfig
   ![img](./media/1.png)
   ![img](./media-pics/2.png)
2. save it under `ios` folder as "Config.xcconfig" with the following content:

```
#include? "tmp.xcconfig"
```

3. add the following to your ".gitignore":

```
# react-native-config codegen
ios/tmp.xcconfig

```

4. go to project settings
5. apply config to your configurations
   ![img](./media/3.png)
6. Go to _Edit scheme..._ -> _Build_ -> _Pre-actions_, click _+_ and select _New Run Script Action_. Paste below code which will generate "tmp.xcconfig" before each build exposing values to Build Settings and Info.plist. Make sure to select your target under _Provide build settings from_, so `$SRCROOT` environment variables is available to the script..

   ```
   "${SRCROOT}/../node_modules/react-native-keys/keysIOS.js"
   ```

   ![img](./media/4.png)

7. You can now access your env variables in the Info.plist, for example `$(MY_ENV_VARIABLE)`. If you face issues accessing variables, please open a new issue and provide as much details as possible so above steps can be improved.

- Go to _Edit scheme..._ -> _Build_ -> _Pre-actions_, click _+_ and select _New Run Script Action_. Paste below code which will generate KEYS keys on native ios side (into node*modules) Make sure to select your target under \_Provide build settings from*, so `$SRCROOT` environment variables is available to the script.

```
"${SRCROOT}/../node_modules/react-native-keys/keysIOS.js"
```

### Different environments

Save config for different environments in different files: `keys.staging.json`, `keys.production.json`, etc.

By default react-native-keys will read from `keys.json`, but you can change it when building or releasing your app.

The simplest approach is to tell it what file to read with an environment variable, like:

```
$ KEYSFILE=keys.staging.json react-native run-ios           # bash
$ SET KEYSFILE=keys.staging.json && react-native run-ios    # windows
$ env:KEYSFILE="keys.staging.json"; react-native run-ios    # powershell
```

This also works for `run-android`. Alternatively, there are platform-specific options below.

#### Android

The same environment variable can be used to assemble releases with a different config:

```
$ cd android && KEYSFILE=keys.staging.json ./gradlew assembleRelease
```

Alternatively, you can define a map in `build.gradle` associating builds with env files. Do it before the `apply from` call, and use build cases in lowercase, like:

```
project.ext.jniConfigFiles = [
  debug: "keys.json",
  release: "keys.staging.json",
]

apply from: project(':react-native-keys').projectDir.getPath() + "/RNKeys.gradle"
```

#### iOS

The basic idea in iOS is to have one scheme per environment file, so you can easily alternate between them.

Start by creating a new scheme:

- In the Xcode menu, go to Product > Scheme > Edit Scheme
- Click Duplicate Scheme on the bottom
- Give it a proper name on the top left. For instance: "Myapp (staging)"

Then edit the newly created scheme to make it use a different env file. From the same "manage scheme" window:

- Expand the "Build" settings on left
- Click "Pre-actions", and under the plus sign select "New Run Script Action"
- Where it says "Type a script or drag a script file", type:

```
"${SRCROOT}/../node_modules/react-native-keys/keysIOS.js"
```

Also ensure that "Provide build settings from", just above the script, has a value selected so that PROJECT_DIR is set.

## Meta

Created by [Numan.dev](https://numan.dev/).
