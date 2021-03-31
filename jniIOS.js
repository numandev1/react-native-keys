#! /usr/bin/env node
const SHA256 = require('crypto-js/sha256');
const {
  getJniKeys,
  makeFileInIosDir,
  makeEncryptionFile,
  getIosEnviromentFile,
  makeFileInProjectDirectoryIos,
} = require('./src/util/common');
const {
  makeCppFileTemplateIOS,
  makeHppFileTemplateIOS,
  makeJniKeysPackageMMTemplateIOS,
  makeXcConfigFIlle,
  makeGeneratedDotEnvTemplateIOS,
} = require('./src/util/jniFilesTemplateIos');

const makeIosJnuFiles = () => {
  const JNI_FILE_NAME = getIosEnviromentFile();
  const allKeys = getJniKeys(JNI_FILE_NAME);
  const secureKeys = allKeys.secure;
  const publicKeys = allKeys.public;
  const stringifyKeys = JSON.stringify(secureKeys);
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

  const privateKey = SHA256(stringifyKeys).toString();
  const halfKey = privateKey.substr(privateKey.length / 2);
  const jniKeysPackageMMFile = makeJniKeysPackageMMTemplateIOS(halfKey);
  const isDoneCreatedNniKeysPackageFile = makeFileInIosDir(
    jniKeysPackageMMFile,
    'JniKeys.mm'
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

  console.log(
    'test',
    isDoneCreatedIosCppFile,
    isDoneCreatedIosHppFile,
    isDoneCreatedIosEncryptionFile,
    isDoneCreatedNniKeysPackageFile,
    isDoneCreatedIosxcConfigFile,
    isGeneratedDotEnvFile
  );
};
makeIosJnuFiles();
