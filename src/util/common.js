const fs = require('fs-extra');
const path = require('node:path');
const CryptoJS = require('crypto-js');

const isExample = process.env.IS_EXAMPLE === 'TRUE';
const DEFAULT_FILE_NAME = 'keys.development.json';

const expoExampleDirName = 'exampleExpo';
const exampleDirName =
  process.cwd().includes(expoExampleDirName) ||
  process.env?.SRCROOT?.includes(expoExampleDirName)
    ? expoExampleDirName
    : 'example';

const PROJECT_ROOT_DIR_PATH = path.join(
  __dirname,
  isExample ? `../../${exampleDirName}/` : '../../../../',
);
const PACKAGE_ROOT_DIR_PATH = path.join(__dirname, '../../');
const RN_KEYS_PATH = path.join('node_modules', 'react-native-keys');
const KEYS_IOS_PATH = path.join(RN_KEYS_PATH, 'ios');
const KEYS_ANDROID_PATH = path.join(RN_KEYS_PATH, 'android');
const KEYS_SRC_PATH = path.join(RN_KEYS_PATH, 'src');
const KEYS_SRC_EXAMPLE_PATH = path.join('../', 'src');
const KEYS_IOS_EXAMPLE_PATH = path.join('../', 'ios');
const KEYS_ANDROID_EXAMPLE_PATH = path.join('../', 'android');

const IOS_DIR_PATH = path.join(
  PROJECT_ROOT_DIR_PATH,
  isExample ? KEYS_IOS_EXAMPLE_PATH : KEYS_IOS_PATH,
);

module.exports.CPP_DIRECTORY_PATH = path.join(
  PROJECT_ROOT_DIR_PATH,
  isExample ? '../' : RN_KEYS_PATH,
  'cpp',
);

const _ANDROID_DIR_PATH = path.join(
  PROJECT_ROOT_DIR_PATH,
  isExample ? KEYS_ANDROID_EXAMPLE_PATH : KEYS_ANDROID_PATH,
  'cpp',
);

const SRC_PATH = path.join(
  PROJECT_ROOT_DIR_PATH,
  isExample ? KEYS_SRC_EXAMPLE_PATH : KEYS_SRC_PATH,
);
const ANDROID_KEYS_DIR_PATH = path.join(
  PACKAGE_ROOT_DIR_PATH,
  'android',
  'src',
  'main',
  'java',
  'com',
  'reactnativekeysjsi',
);

const PROJECT_DIRECTORY_IOS_PATH = path.join(PROJECT_ROOT_DIR_PATH, 'ios');

module.exports.getKeys = (KEYS_FILE_NAME) => {
  const jniJsonFilePath = `${PROJECT_ROOT_DIR_PATH}${KEYS_FILE_NAME}`.trim();
  const keysJson = fs.readJSONSync(jniJsonFilePath);
  const secureKeys = keysJson;
  return secureKeys;
};

module.exports.genTSType = (allKeys) => {
  let result =
    '// this file is auto generate, please do not modify\nexport type KeyTurboType = {';
  Object.keys(allKeys?.public ?? {}).forEach((key) => {
    result += `\n  ${key}: string;`;
  });
  if (!allKeys?.public) {
    result += '\n [key: string]: string;\n};\n\n';
  } else {
    result += '\n};\n\n';
  }
  result += 'export type KeyTurboSecuredType = {';
  Object.keys(allKeys?.secure ?? {}).forEach((key) => {
    result += `\n  ${key}: string;`;
  });
  if (!allKeys?.secure) {
    result += '\n [key: string]: string;\n};\n\n';
  } else {
    result += '\n};\n\n';
  }
  fs.outputFileSync(path.join(SRC_PATH, 'type.ts'), result);
};

module.exports.makeFileInCPPDir = (fileContent, fileName) => {
  try {
    const iosCppFilePath = path.join(CPP_DIRECTORY_PATH, fileName);
    fs.outputFileSync(iosCppFilePath, fileContent);
    return true;
  } catch (_error) {
    return false;
  }
};

module.exports.makeFileInIosDir = (fileContent, fileName) => {
  try {
    const iosCppFilePath = path.join(IOS_DIR_PATH, fileName);
    fs.outputFileSync(iosCppFilePath, fileContent);
    return true;
  } catch (_error) {
    return false;
  }
};

module.exports.makeFileInProjectDirectoryIos = (fileContent, fileName) => {
  try {
    const iosCppFilePath = path.join(PROJECT_DIRECTORY_IOS_PATH, fileName);
    fs.outputFileSync(iosCppFilePath, fileContent);
    return true;
  } catch (_error) {
    return false;
  }
};

module.exports.getIosEnvironmentFile = () => {
  try {
    const KEYS_FILE_NAME = process.env.KEYSFILE;
    if (KEYS_FILE_NAME) {
      return KEYS_FILE_NAME;
    } else if (process.env.DEFAULT_FILE_NAME) {
      return process.env.DEFAULT_FILE_NAME;
    } else if (
      process.env.DEBUG_KEYSFILE &&
      process.env.CONFIGURATION === 'Debug'
    ) {
      const debugFile = process.env.DEBUG_KEYSFILE;
      return debugFile;
    } else if (
      process.env.RELEASE_KEYSFILE &&
      process.env.CONFIGURATION === 'Release'
    ) {
      const debugFile = process.env.RELEASE_KEYSFILE;
      return debugFile;
    }
    return DEFAULT_FILE_NAME;
  } catch (_error) {
    return DEFAULT_FILE_NAME;
  }
};

module.exports.getAndroidEnvironmentFile = () => {
  try {
    const KEYS_FILE_NAME = process.env.KEYSFILE;
    if (KEYS_FILE_NAME) {
      return KEYS_FILE_NAME;
    } else if (process.env.DEFAULT_FILE_NAME) {
      return process.env.DEFAULT_FILE_NAME;
    }
    return DEFAULT_FILE_NAME;
  } catch (_error) {
    return DEFAULT_FILE_NAME;
  }
};

module.exports.makeFileInAndroidMainAssetsFolder = (fileContent, fileName) => {
  try {
    const filePath = path.join(ANDROID_KEYS_DIR_PATH, fileName);
    fs.outputFileSync(filePath, fileContent);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

module.exports.splitPrivateKeyInto3ChunksOfArray = (string) => {
  var regex = RegExp(`.{1,${Math.ceil(string.length / 3)}}`, 'g');
  return string.match(regex);
};

module.exports.generatePassword = (length = 30) => {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let password = '';

  for (let i = 0; i < length; i++) {
    const randomBytes = CryptoJS.lib.WordArray.random(1);
    const randomIndex = Math.abs(randomBytes.words[0]) % chars.length;
    password += chars[randomIndex];
  }

  return password;
};

module.exports.encrypt = (message, password, _iv) => {
  const encrypted = CryptoJS.AES.encrypt(message, password, {
    iv: _iv,
  });

  const base64Secret = encrypted.toString();

  return base64Secret;
};
