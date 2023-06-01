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
  const password = generatePassword();
  const privateKey = encrypt(stringifyKeys, password);
  const cppFileContent = makeCppFileTemplateIOS(privateKey, password);
  const isDoneCrypoCppFile = makeFileInIosDir(cppFileContent, 'crypto.cpp');

  const hFileContent = makeHppFileTemplateIOS();
  const isDoneCreatedHFile = makeFileInIosDir(hFileContent, 'crypto.h');

  const encryptionFileContent = makeEncryptionFile();
  const isDoneCreatedIosEncryptionFile = makeFileInIosDir(
    encryptionFileContent,
    'encrypt.h'
  );

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
