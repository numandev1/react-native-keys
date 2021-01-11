#! /usr/bin/env node
const SHA256 = require('crypto-js/sha256');
const {
  getJniKeys,
  makeFileInAndroidDir,
  makeFileInAndroidForBridgeJniDir,
} = require('./src/util/common');
const {
  makeCppFileTemplateAndroid,
  makeHppFileTemplateAndroid,
  makeCryptographicModuleTemplateAndroid,
} = require('./src/util/jniFilesTemplateAndroid');

const makeAndroidJnuFiles = () => {
  const secureKeys = getJniKeys();
  const stringifyKeys = JSON.stringify(secureKeys);
  const cppFileContent = makeCppFileTemplateAndroid(
    stringifyKeys.replace(/(\")/g, '\\"')
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
    'JniKeysModule.java'
  );

  console.log(
    'secureKeys',
    isDoneCreatedAndroidCppFile,
    isDoneCreatedAndroidHppFile,
    isDoneCreatedAndroidCryptographicModuleFile
  );
};
makeAndroidJnuFiles();
