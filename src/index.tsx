import { NativeModules } from 'react-native';

const { Keys } = NativeModules;
export default {
  ...Keys.getConstants(),
  ...Keys,
};
