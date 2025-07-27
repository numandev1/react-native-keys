#! /usr/bin/env node
const {
  getKeys,
  makeFileInAndroidMainAssetsFolder,
  getAndroidEnvironmentFile,
  generatePassword,
  encrypt,
  genTSType,
  CPP_DIRECTORY_PATH
} = require('./src/util/common');
const { generateHeaderFile } = require('./src/util/generate-header')
const {
  makeCryptographicModuleTemplateAndroid,
} = require('./src/util/keysFilesTemplateAndroid');

const makeAndroidJnuFiles = () => {
  const KEYS_FILE_NAME = getAndroidEnvironmentFile();
  const allKeys = getKeys(KEYS_FILE_NAME);
  const secureKeys = allKeys.secure;
  const stringifyKeys = JSON.stringify(secureKeys);
  const password = generatePassword();
  const privateKey = encrypt(stringifyKeys, password);
  generateHeaderFile(CPP_DIRECTORY_PATH, privateKey, password)

  const halfKey = privateKey.substr(privateKey.length / 2);
  const cryptographicModuleFileContent =
    makeCryptographicModuleTemplateAndroid(halfKey);
  const isDoneAddedPrivateKey = makeFileInAndroidMainAssetsFolder(
    cryptographicModuleFileContent,
    'PrivateKey.java'
  );
  genTSType(allKeys);
  console.info('react-native-keys', {
    isDoneAddedPrivateKey,
  });
};
makeAndroidJnuFiles();
