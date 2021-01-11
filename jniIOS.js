#! /usr/bin/env node
const SHA256 = require("crypto-js/sha256");
const { getJniKeys, makeFileInIosDir, makeEncryptionFile } = require('./src/util/common');
const {
  makeCppFileTemplateIOS,
  makeHppFileTemplateIOS,
  makeJniKeysPackageMMTemplateIOS,
} = require('./src/util/jniFilesTemplateIos');

const makeIosJnuFiles = () => {
  const secureKeys = getJniKeys();
  const stringifyKeys=JSON.stringify(secureKeys);
  const cppFileContent = makeCppFileTemplateIOS(
    stringifyKeys.replace(/(\")/g, '\\"')
  );
  const isDoneCreatedIosCppFile = makeFileInIosDir(
    cppFileContent,
    'crypto.cpp'
  );

  const hppFileContent = makeHppFileTemplateIOS();
  const isDoneCreatedIosHppFile = makeFileInIosDir(
    hppFileContent,
    'crypto.hpp'
  );
  
  const encryptionFileContent = makeEncryptionFile();
  const isDoneCreatedIosEncryptionFile = makeFileInIosDir(
    encryptionFileContent,
    'encrypt.h'
  );
  
  const privateKey=SHA256(stringifyKeys).toString();
  const halfKey=privateKey.substr(privateKey.length/2);
  const jniKeysPackageMMFile = makeJniKeysPackageMMTemplateIOS(halfKey);
  const isDoneCreatedNniKeysPackageFile = makeFileInIosDir(
    jniKeysPackageMMFile,
    'JniKeys.mm'
  );

  console.log(
    'secureKeys',
    isDoneCreatedIosCppFile,
    isDoneCreatedIosHppFile,
    isDoneCreatedIosEncryptionFile,
    isDoneCreatedNniKeysPackageFile
  );
};
makeIosJnuFiles();
