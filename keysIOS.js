#! /usr/bin/env node
import {
  getKeys,
  makeFileInIosDir,
  getIosEnvironmentFile,
  makeFileInProjectDirectoryIos,
  generatePassword,
  encrypt,
  genTSType,
  CPP_DIRECTORY_PATH,
} from './src/util/common.js';
import { generateHeaderFile } from './src/util/generate-header.js';

import {
  makePrivateKeyTemplateIOS,
  makeXcConfigFile,
  makeGeneratedDotEnvTemplateIOS,
} from './src/util/keysFilesTemplateIos.js';

const makeIosJnuFiles = () => {
  const KEYS_FILE_NAME = getIosEnvironmentFile();
  const allKeys = getKeys(KEYS_FILE_NAME);
  const secureKeys = allKeys.secure;
  const publicKeys = allKeys.public;
  const stringifyKeys = JSON.stringify(secureKeys);
  const password = generatePassword();
  const privateKey = encrypt(stringifyKeys, password);
  generateHeaderFile(CPP_DIRECTORY_PATH, privateKey, password);

  const halfKey = privateKey.substr(privateKey.length / 2);
  const generatedPrivateKeyContent = makePrivateKeyTemplateIOS({
    privateKey: halfKey,
  });
  const isGeneratedPrivateKeyFile = makeFileInIosDir(
    generatedPrivateKeyContent,
    'privateKey.m',
  );

  const xcConfigFileContent = makeXcConfigFile(publicKeys);
  const isDoneCreatedXCodeConfigFile = makeFileInProjectDirectoryIos(
    xcConfigFileContent,
    'tmp.xcconfig',
  );

  const generatedDotEnvContent = makeGeneratedDotEnvTemplateIOS(publicKeys);
  const isGeneratedDotEnvFile = makeFileInIosDir(
    generatedDotEnvContent,
    'GeneratedDotEnv.m',
  );
  genTSType(allKeys);
  console.info('react-native-keys', {
    isGeneratedPrivateKeyFile,
    isDoneCreatedXCodeConfigFile,
    isGeneratedDotEnvFile,
  });
};
makeIosJnuFiles();
