#! /usr/bin/env node
const CryptoJS = require('crypto-js');

const generatePassword = () => {
  var length = 12,
    charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
    retVal = '';
  for (var i = 0, n = charset.length; i < length; ++i) {
    retVal += charset.charAt(Math.floor(Math.random() * n));
  }
  return retVal;
};

const encrypt = (message, password, _iv) => {
  const encrypted = CryptoJS.AES.encrypt(message, password, {
    iv: _iv,
  });

  const base64Secret = encrypted.toString();

  return base64Secret;
};

const {
  getKeys,
  makeFileInCppAndroidDirectory,
  makeFileInAndroidMainAssetsFolder,
  getAndroidEnviromentFile,
} = require('./src/util/common');
const {
  makeCppFileTemplateAndroid,
  makeHFileTemplateAndroid,
  makeCryptographicModuleTemplateAndroid,
} = require('./src/util/keysFilesTemplateAndroid');

const makeAndroidJnuFiles = () => {
  const KEYS_FILE_NAME = getAndroidEnviromentFile();
  const allKeys = getKeys(KEYS_FILE_NAME);
  const secureKeys = allKeys.secure;
  const stringifyKeys = JSON.stringify(secureKeys);
  const password = generatePassword();
  const privateKey = encrypt(stringifyKeys, password);
  const cppFileContent = makeCppFileTemplateAndroid(privateKey, password);
  const isDoneCrypoCppFile = makeFileInCppAndroidDirectory(
    cppFileContent,
    'crypto.cpp'
  );

  const hFileContent = makeHFileTemplateAndroid();
  const isDoneCreatedHFile = makeFileInCppAndroidDirectory(
    hFileContent,
    'crypto.h'
  );

  const halfKey = privateKey.substr(privateKey.length / 2);
  const cryptographicModuleFileContent =
    makeCryptographicModuleTemplateAndroid(halfKey);
  const isDoneAddedPrivateKey = makeFileInAndroidMainAssetsFolder(
    cryptographicModuleFileContent,
    'PrivateKey.java'
  );

  console.log('react-native-keys', {
    isDoneCrypoCppFile,
    isDoneCreatedHFile,
    isDoneAddedPrivateKey,
  });
};
makeAndroidJnuFiles();
