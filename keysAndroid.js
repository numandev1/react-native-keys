#! /usr/bin/env node
const SHA256 = require('crypto-js/sha256');
const {
  getKeys,
  makeFileInAndroidDir,
  makeFileInAndroidForBridgeJniDir,
  getAndroidEnviromentFile,
} = require('./src/util/common');
const {
  makeCppFileTemplateAndroid,
  makeHppFileTemplateAndroid,
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
  const isDoneCreatedAndroidCppFile = makeFileInAndroidDir(
    cppFileContent,
    'crypto.cpp'
  );

  const hppFileContent = makeHppFileTemplateAndroid();
  const isDoneCreatedAndroidHppFile = makeFileInAndroidDir(
    hppFileContent,
    'crypto.hpp'
  );

  const privateKey = SHA256(stringifyKeys).toString();
  const halfKey = privateKey.substr(privateKey.length / 2);
  const cryptographicModuleFileContent = makeCryptographicModuleTemplateAndroid(
    halfKey
  );
  const isDoneCreatedAndroidCryptographicModuleFile = makeFileInAndroidForBridgeJniDir(
    cryptographicModuleFileContent,
    'KeysModule.java'
  );

  console.log(
    'test',
    isDoneCreatedAndroidCppFile,
    isDoneCreatedAndroidHppFile,
    isDoneCreatedAndroidCryptographicModuleFile
  );
};
makeAndroidJnuFiles();
