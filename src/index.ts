//@ts-ignore we want to ignore everything
// else in global except what we need to access.
// Maybe there is a better way to do this.
import { NativeModules, Platform } from 'react-native';

// Installing JSI Bindings

//@ts-ignore
const KeysModule: {
  secureFor(key: string): string;
  publicKeys(): string;
  [key: string]: any;
} = global;

export function isLoaded() {
  return typeof KeysModule.secureFor === 'function';
}

if (!isLoaded()) {
  const result = NativeModules.Keys?.install();
  if (!result && !isLoaded())
    throw new Error('JSI bindings were not installed for: Keys Module');

  if (!isLoaded()) {
    throw new Error('JSI bindings were not installed for: Keys Module');
  }
}

Object.assign(KeysModule, {
  ...(Platform.OS === 'android'
    ? JSON.parse(KeysModule.publicKeys())
    : KeysModule.publicKeys()),
});

export default KeysModule;
