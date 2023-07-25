#! /usr/bin/env node
const {
  getKeys,
  makeFileInAndroidMainAssetsFolder,
  getAndroidEnviromentFile,
  generatePassword,
  encrypt,
  makeCppFileTemplate,
  splitPrivateKeyInto3ChunksOfArray,
  makeFileInCPPDir,
} = require('./src/util/common');
const {
  makeCryptographicModuleTemplateAndroid,
} = require('./src/util/keysFilesTemplateAndroid');

const makeAndroidJnuFiles = () => {
  const KEYS_FILE_NAME = getAndroidEnviromentFile();
  const allKeys = getKeys(KEYS_FILE_NAME);
  const secureKeys = allKeys.secure;
  const stringifyKeys = JSON.stringify(secureKeys);
  const password = generatePassword();
  const privateKey = encrypt(stringifyKeys, password);
  const privateKeyIn3Chunks = splitPrivateKeyInto3ChunksOfArray(privateKey);
  const cppFileContent = makeCppFileTemplate(privateKeyIn3Chunks, password);
  const isDoneCrypoCppFile = makeFileInCPPDir(cppFileContent, 'crypto.cpp');

  const halfKey = privateKey.substr(privateKey.length / 2);
  const cryptographicModuleFileContent =
    makeCryptographicModuleTemplateAndroid(halfKey);
  const isDoneAddedPrivateKey = makeFileInAndroidMainAssetsFolder(
    cryptographicModuleFileContent,
    'PrivateKey.java'
  );

  console.log('react-native-keys', {
    isDoneCrypoCppFile,
    isDoneAddedPrivateKey,
  });
};
makeAndroidJnuFiles();
