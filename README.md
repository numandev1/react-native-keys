# react-native-keys

secure keys through jni c++. **Note:** it is more secure than [react-native-config](https://github.com/luggit/react-native-config 'react-native-config')

## Installation

```sh
yarn add react-native-keys
```

## Basic Usage

Create a new file `.jnikeys.json` in the root of your React Native app and add keys in `secure` object like this:

```
{
  "secure":{
    "key1":"value1",
    "key2":"value2"
  }
}
```

Then access variables defined there from your app:

## React Native

```js
import JniKeys from 'react-native-keys';

const value = await JniKeys.getKey('key1'); //value1
```

Keep in mind It's [basically impossible to prevent users from reverse engineering mobile app secrets](https://rammic.github.io/2015/07/28/hiding-secrets-in-android-apps/) but we can more secure key than [react-native-config](https://github.com/luggit/react-native-config 'react-native-config'),

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
  2.  Go to `node_modules` ➜ `react-native-keys` and add `JniKeys.xcodeproj`
  3.  Expand the `JniKeys.xcodeproj` ➜ `Products` folder
  4.  In the project navigator, select your project. Add `JniKeys.a` to your project's `Build Phases` ➜ `Link Binary With Libraries`
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
  + import com.rnkeys.JniKeysPackage;

  @Override
  protected List<ReactPackage> getPackages() {
  	   return Arrays.asList(
          		new MainReactPackage()
  +      		new JniKeysPackage()
      );
  }
  ```

## Native Usage

### Android

you can only read jni key into java file.

```java
import com.rnkeys.JniKeysModule;

JniKeysModule.getKeySync("key1");   //value1
```

### iOS

Read variables declared in `.env` from your Obj-C classes like:

```objective-c
// import header
#import "JniKeys.h"

// then read individual keys like:
NSString *value = [JniKeys getKeySync:@"key1"];   //value1
```

- Go to _Edit scheme..._ -> _Build_ -> _Pre-actions_, click _+_ and select _New Run Script Action_. Paste below code which will generate JNI keys on native ios side (into node*modules) Make sure to select your target under \_Provide build settings from*, so `$SRCROOT` environment variables is available to the script.

```
"${SRCROOT}/../node_modules/react-native-keys/jniIOS.js"
```

#### Android

you have define in `build.gradle` like:

```
apply from: project(':react-native-keys').projectDir.getPath() + "/jniKeys.gradle"
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
"${SRCROOT}/../node_modules/react-native-keys/jniIOS.js"
```

Also ensure that "Provide build settings from", just above the script, has a value selected so that PROJECT_DIR is set.

## Meta

Created by Numan at [Numan.dev](https://numan.dev/).
