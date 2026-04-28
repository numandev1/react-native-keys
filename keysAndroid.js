#! /usr/bin/env node
import {
  getKeys,
  makeFileInAndroidMainAssetsFolder,
  getAndroidEnvironmentFile,
  generatePassword,
  encrypt,
  genTSType,
  CPP_DIRECTORY_PATH,
} from './src/util/common.js';
import { generateHeaderFile } from './src/util/generate-header.js';
import { makeCryptographicModuleTemplateAndroid } from './src/util/keysFilesTemplateAndroid.js';

const makeAndroidJnuFiles = () => {
  const KEYS_FILE_NAME = getAndroidEnvironmentFile();
  const allKeys = getKeys(KEYS_FILE_NAME);
  const secureKeys = allKeys.secure;
  const stringifyKeys = JSON.stringify(secureKeys);
  const password = generatePassword();
  const privateKey = encrypt(stringifyKeys, password);
  generateHeaderFile(CPP_DIRECTORY_PATH, privateKey, password);

  const halfKey = privateKey.substr(privateKey.length / 2);
  const cryptographicModuleFileContent =
    makeCryptographicModuleTemplateAndroid(halfKey);
  const isDoneAddedPrivateKey = makeFileInAndroidMainAssetsFolder(
    cryptographicModuleFileContent,
    'PrivateKey.kt',
  );
  genTSType(allKeys);
  console.info('react-native-keys', {
    isDoneAddedPrivateKey,
  });
};
makeAndroidJnuFiles();
