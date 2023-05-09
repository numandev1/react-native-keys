#! /usr/bin/env node
const SHA256 = require('crypto-js/sha256');
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
  const cppFileContent = makeCppFileTemplateAndroid(
    stringifyKeys.replace(/(")/g, '\\"')
  );
  const isDoneCrypoCppFile = makeFileInCppAndroidDirectory(
    cppFileContent,
    'crypto.cpp'
  );

  const hFileContent = makeHFileTemplateAndroid();
  const isDoneCreatedHFile = makeFileInCppAndroidDirectory(
    hFileContent,
    'crypto.h'
  );

  const privateKey = SHA256(stringifyKeys).toString();
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
