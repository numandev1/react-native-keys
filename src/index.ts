import { NativeModules, Platform } from 'react-native';
import type { KeyTurboSecuredType, KeyTurboType } from './type';

const LINKING_ERROR =
  `The package 'react-native-keys' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

// @ts-expect-error
const isTurboModuleEnabled = global.__turboModuleProxy != null;

// Keep this to sync auto install with the native code
const KeysModule = isTurboModuleEnabled
  ? require('./spec/NativeKeys').default
  : NativeModules.Keys;

const KeysTurboModule = KeysModule
  ? KeysModule
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );
const installed = KeysTurboModule.install();
if (!installed) {
  throw new Error(LINKING_ERROR);
}

const KeysTurbo: {
  secureFor(key: keyof KeyTurboSecuredType): string;
  publicKeys(): KeyTurboType;
} & KeyTurboType = global as any;

Object.assign(KeysTurbo, {
  ...(Platform.OS === 'android'
    ? JSON.parse(KeysTurbo.publicKeys() as unknown as string)
    : KeysTurbo.publicKeys()),
});

export default KeysTurbo;
