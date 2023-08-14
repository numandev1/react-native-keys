#! /usr/bin/env node
const {
  getKeys,
  makeFileInAndroidMainAssetsFolder,
  getAndroidEnvironmentFile,
  generatePassword,
  encrypt,
  makeCppFileTemplate,
  splitPrivateKeyInto3ChunksOfArray,
  makeFileInCPPDir,
  genTSType,
} = require('./src/util/common');
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
  const privateKeyIn3Chunks = splitPrivateKeyInto3ChunksOfArray(privateKey);
  const cppFileContent = makeCppFileTemplate(privateKeyIn3Chunks, password);
  const isDoneCryptoCppFile = makeFileInCPPDir(cppFileContent, 'crypto.cpp');

  const halfKey = privateKey.substr(privateKey.length / 2);
  const cryptographicModuleFileContent =
    makeCryptographicModuleTemplateAndroid(halfKey);
  const isDoneAddedPrivateKey = makeFileInAndroidMainAssetsFolder(
    cryptographicModuleFileContent,
    'PrivateKey.java'
  );
  genTSType(allKeys);
  console.info('react-native-keys', {
    isDoneCryptoCppFile,
    isDoneAddedPrivateKey,
  });
};
makeAndroidJnuFiles();
