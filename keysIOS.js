#! /usr/bin/env node
const {
  getKeys,
  makeFileInIosDir,
  makeFileInCPPDir,
  getIosEnvironmentFile,
  makeFileInProjectDirectoryIos,
  splitPrivateKeyInto3ChunksOfArray,
  makeCppFileTemplate,
  generatePassword,
  encrypt,
  genTSType,
} = require('./src/util/common');
const {
  makePrivateKeyTemplateIOS,
  makeXcConfigFIlle,
  makeGeneratedDotEnvTemplateIOS,
} = require('./src/util/keysFilesTemplateIos');

const makeIosJnuFiles = () => {
  const KEYS_FILE_NAME = getIosEnvironmentFile();
  const allKeys = getKeys(KEYS_FILE_NAME);
  const secureKeys = allKeys.secure;
  const publicKeys = allKeys.public;
  const stringifyKeys = JSON.stringify(secureKeys);
  const password = generatePassword();
  const privateKey = encrypt(stringifyKeys, password);
  const privateKeyIn3Chunks = splitPrivateKeyInto3ChunksOfArray(privateKey);
  const cppFileContent = makeCppFileTemplate(privateKeyIn3Chunks, password);
  const isDoneCryptoCppFile = makeFileInCPPDir(cppFileContent, 'crypto.cpp');

  const halfKey = privateKey.substr(privateKey.length / 2);
  const generatedPrivateKeyContent = makePrivateKeyTemplateIOS({
    privateKey: halfKey,
  });
  const isGeneratedPrivateKeyFile = makeFileInIosDir(
    generatedPrivateKeyContent,
    'privateKey.m'
  );

  const xcConfigFileContent = makeXcConfigFIlle(publicKeys);
  const isDoneCreatedXCodeConfigFile = makeFileInProjectDirectoryIos(
    xcConfigFileContent,
    'tmp.xcconfig'
  );

  const generatedDotEnvContent = makeGeneratedDotEnvTemplateIOS(publicKeys);
  const isGeneratedDotEnvFile = makeFileInIosDir(
    generatedDotEnvContent,
    'GeneratedDotEnv.m'
  );
  genTSType(allKeys);
  console.info('react-native-keys', {
    isDoneCryptoCppFile,
    isGeneratedPrivateKeyFile,
    isDoneCreatedXCodeConfigFile,
    isGeneratedDotEnvFile,
  });
};
makeIosJnuFiles();
