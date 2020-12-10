import { NativeModules } from 'react-native';

type JniKeysType = {
  multiply(a: number, b: number): Promise<number>;
};

const { JniKeys } = NativeModules;

export default JniKeys as JniKeysType;
