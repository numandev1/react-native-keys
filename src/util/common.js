const fs = require('fs-extra');
const path = require('path');
const CryptoJS = require('crypto-js');

const isExample = process.env.IS_EXAMPLE === 'TRUE';
const DEFAULT_FILE_NAME = 'keys.development.json';
const PROJECT_ROOT_DIR_PATH = path.join(
  __dirname,
  isExample ? '../../example/' : '../../../../'
);
const PACKAGE_ROOT_DIR_PATH = path.join(__dirname, '../../');
const RN_KEYS_PATH = path.join('node_modules', 'react-native-keys');
const KEYS_IOS_PATH = path.join(RN_KEYS_PATH, 'ios');
const KEYS_ANDROID_PATH = path.join(RN_KEYS_PATH, 'android');
const KEYS_IOS_EXAMPLE_PATH = path.join('../', 'ios');
const KEYS_ANDROID_EXAMPLE_PATH = path.join('../', 'android');
const IOS_DIR_PATH = path.join(
  PROJECT_ROOT_DIR_PATH,
  isExample ? KEYS_IOS_EXAMPLE_PATH : KEYS_IOS_PATH
);
const CPP_DIRECTORY_PATH = path.join(
  PROJECT_ROOT_DIR_PATH,
  isExample ? '../' : RN_KEYS_PATH,
  'cpp'
);
const ANDROID_DIR_PATH = path.join(
  PROJECT_ROOT_DIR_PATH,
  isExample ? KEYS_ANDROID_EXAMPLE_PATH : KEYS_ANDROID_PATH,
  'cpp'
);
const ANDROID_KEYS_DIR_PATH = path.join(
  PACKAGE_ROOT_DIR_PATH,
  'android',
  'src',
  'main',
  'java',
  'com',
  'reactnativekeysjsi'
);

const PROJECT_DIRECTORY_IOS_PATH = path.join(PROJECT_ROOT_DIR_PATH, 'ios');

module.exports.getKeys = (KEYS_FILE_NAME) => {
  const jniJsonFilePath = `${PROJECT_ROOT_DIR_PATH}${KEYS_FILE_NAME}`;
  const keysJson = fs.readJSONSync(jniJsonFilePath);
  const secureKeys = keysJson;
  return secureKeys;
};

module.exports.makeFileInCPPDir = (fileContent, fileName) => {
  try {
    const iosCppFilePath = path.join(CPP_DIRECTORY_PATH, fileName);
    fs.outputFileSync(iosCppFilePath, fileContent);
    return true;
  } catch (error) {
    return false;
  }
};

module.exports.makeFileInIosDir = (fileContent, fileName) => {
  try {
    const iosCppFilePath = path.join(IOS_DIR_PATH, fileName);
    fs.outputFileSync(iosCppFilePath, fileContent);
    return true;
  } catch (error) {
    return false;
  }
};

module.exports.makeFileInProjectDirectoryIos = (fileContent, fileName) => {
  try {
    const iosCppFilePath = path.join(PROJECT_DIRECTORY_IOS_PATH, fileName);
    fs.outputFileSync(iosCppFilePath, fileContent);
    return true;
  } catch (error) {
    return false;
  }
};

module.exports.getIosEnviromentFile = () => {
  try {
    let KEYS_FILE_NAME = process.env.KEYSFILE;
    if (KEYS_FILE_NAME) {
      return KEYS_FILE_NAME;
    } else if (process.env.CONFIGURATION === 'Debug') {
      const debugFile = process.env.DEBUG_KEYSFILE || DEFAULT_FILE_NAME;
      return debugFile;
    } else if (process.env.CONFIGURATION === 'Release') {
      const debugFile = process.env.RELEASE_KEYSFILE || DEFAULT_FILE_NAME;
      return debugFile;
    }
    return DEFAULT_FILE_NAME;
  } catch (error) {
    return DEFAULT_FILE_NAME;
  }
};

module.exports.getAndroidEnviromentFile = () => {
  try {
    let KEYS_FILE_NAME = process.env.KEYSFILE;
    if (KEYS_FILE_NAME) {
      return KEYS_FILE_NAME;
    }
    return DEFAULT_FILE_NAME;
  } catch (error) {
    return DEFAULT_FILE_NAME;
  }
};

module.exports.makeFileInAndroidMainAssetsFolder = (fileContent, fileName) => {
  try {
    const filePath = path.join(ANDROID_KEYS_DIR_PATH, fileName);
    fs.outputFileSync(filePath, fileContent);
    return true;
  } catch (error) {
    return false;
  }
};

module.exports.splitPrivateKeyInto3ChunksOfArray = (string) => {
  var regex = RegExp('.{1,' + Math.ceil(string.length / 3) + '}', 'g');
  return string.match(regex);
};

module.exports.makeCppFileTemplate = (privateKeyIn3Chunks, password) => {
  return `
   #include "crypto.h"
  #include <string>
  #include "decryptor.h"

  using namespace std;

  Crypto::Crypto() {

  }

  string Crypto::getJniJsonStringifyData(string key) {
      std::string base64Secret1 = "${privateKeyIn3Chunks[0]}";
      std::string base64Secret2 = "${privateKeyIn3Chunks[1]}";
      std::string base64Secret3 = "${privateKeyIn3Chunks[2]}";
      std::string base64Secret = base64Secret1 + base64Secret2 + base64Secret3;
       std::string password = "${password}";
      bool binary = false;
      std::string plaintext = decryptor::dec(base64Secret, password,binary);

      string hash;
      string halfString=base64Secret.substr(base64Secret.length()/2);
      if(key==halfString)
      {
          return plaintext;
      }
      else
      {
          return "";
      }
  }
  `;
};

module.exports.generatePassword = () => {
  var length = 12,
    charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
    retVal = '';
  for (var i = 0, n = charset.length; i < length; ++i) {
    retVal += charset.charAt(Math.floor(Math.random() * n));
  }
  return retVal;
};
module.exports.encrypt = (message, password, _iv) => {
  const encrypted = CryptoJS.AES.encrypt(message, password, {
    iv: _iv,
  });

  const base64Secret = encrypted.toString();

  return base64Secret;
};
