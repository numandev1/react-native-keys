const fs = require('fs-extra');
const path = require('path');
const PROJECT_ROOT_DIR_PATH = path.join(__dirname, '../../../../');
const IOS_DIR_PATH = path.join(PROJECT_ROOT_DIR_PATH, 'ios');
const ANDROID_DIR_PATH = path.join(
  PROJECT_ROOT_DIR_PATH,
  'node_modules',
  'react-native-jni-keys',
  'android',
  'src',
  'main',
  'java',
  'com',
  'reactnativejnikeys',
  'c'
);
console.log(ANDROID_DIR_PATH, 'PROJECT_ROOT_DIR_PATHPROJECT_ROOT_DIR_PATH');
const ANDROID_JNI_DIR_PATH = path.join(
  PROJECT_ROOT_DIR_PATH,
  'android',
  'app',
  'src',
  'main',
  'java',
  'com',
  'reactnativejnikeys'
);

module.exports.getJniKeys = () => {
  const jniJsonFilePath = `${PROJECT_ROOT_DIR_PATH}jnikeys.json`;
  const jnikeysJson = fs.readJSONSync(jniJsonFilePath);
  const secureKeys = jnikeysJson.secure;
  return secureKeys;
};

module.exports.makeFileInIosDir = (fileContent, fileName) => {
  try {
    const iosCppFilePath = path.join(IOS_DIR_PATH, fileName);
    fs.outputFileSync(iosCppFilePath, fileContent);
    return true;
  } catch (error) {
    return false;
  }
};

module.exports.makeFileInAndroidDir = (fileContent, fileName) => {
  try {
    const filePath = path.join(ANDROID_DIR_PATH, fileName);
    fs.outputFileSync(filePath, fileContent);
    return true;
  } catch (error) {
    return false;
  }
};

module.exports.makeFileInAndroidForBridgeJniDir = (fileContent, fileName) => {
  // try {
  //   const filePath=path.join(ANDROID_JNI_DIR_PATH,fileName);
  //   fs.outputFileSync(filePath,fileContent);
  //   return true;
  // } catch (error) {
  //   return false;
  // }
};
