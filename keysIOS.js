#! /usr/bin/env node
const SHA256 = require('crypto-js/sha256');
const {
  getKeys,
  makeFileInIosDir,
  makeEncryptionFile,
  getIosEnviromentFile,
  makeFileInProjectDirectoryIos,
} = require('./src/util/common');
const {
  makeCppFileTemplateIOS,
  makeHppFileTemplateIOS,
  makePrivateKeyTemplateIOS,
  makeXcConfigFIlle,
  makeGeneratedDotEnvTemplateIOS,
} = require('./src/util/keysFilesTemplateIos');

const makeIosJnuFiles = () => {
  const KEYS_FILE_NAME = getIosEnviromentFile();
  const allKeys = getKeys(KEYS_FILE_NAME);
  const secureKeys = allKeys.secure;
  const publicKeys = allKeys.public;
  const stringifyKeys = JSON.stringify(secureKeys);
  const cppFileContent = makeCppFileTemplateIOS(
    stringifyKeys.replace(/(")/g, '\\"')
  );
  const isDoneCrypoCppFile = makeFileInIosDir(cppFileContent, 'crypto.cpp');

  const hFileContent = makeHppFileTemplateIOS();
  const isDoneCreatedHFile = makeFileInIosDir(hFileContent, 'crypto.h');

  const encryptionFileContent = makeEncryptionFile();
  const isDoneCreatedIosEncryptionFile = makeFileInIosDir(
    encryptionFileContent,
    'encrypt.h'
  );

  const privateKey = SHA256(stringifyKeys).toString();
  const halfKey = privateKey.substr(privateKey.length / 2);
  const generatedPrivateKeyContent = makePrivateKeyTemplateIOS({
    privateKey: halfKey,
  });
  const isGeneratedPrivateKeyFile = makeFileInIosDir(
    generatedPrivateKeyContent,
    'privateKey.m'
  );

  const xcConfigFileContent = makeXcConfigFIlle(publicKeys);
  const isDoneCreatedIosxcConfigFile = makeFileInProjectDirectoryIos(
    xcConfigFileContent,
    'tmp.xcconfig'
  );

  const generatedDotEnvContent = makeGeneratedDotEnvTemplateIOS(publicKeys);
  const isGeneratedDotEnvFile = makeFileInIosDir(
    generatedDotEnvContent,
    'GeneratedDotEnv.m'
  );

  console.log('react-native-keys', {
    isDoneCrypoCppFile,
    isDoneCreatedHFile,
    isDoneCreatedIosEncryptionFile,
    isGeneratedPrivateKeyFile,
    isDoneCreatedIosxcConfigFile,
    isGeneratedDotEnvFile,
  });
};
makeIosJnuFiles();
