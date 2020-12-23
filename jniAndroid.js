#! /usr/bin/env node

const {
  getJniKeys,
  makeFileInAndroidDir,
  makeFileInAndroidForBridgeJniDir,
} = require('./src/util/common');
const {
  makeCppFileTemplateAndroid,
  makeHppFileTemplateAndroid,
  makeCMakeListsTemplateAndroid,
  makeMediatorTemplateAndroid,
  makeCLibControllerTemplateAndroid,
  makeCryptographicModuleTemplateAndroid,
  makeCryptographicPackageTemplateAndroid,
} = require('./src/util/jniFilesTemplateAndroid');

const makeAndroidJnuFiles = () => {
  const secureKeys = getJniKeys();
  const cppFileContent = makeCppFileTemplateAndroid(
    JSON.stringify(secureKeys).replace(/(\")/g, '\\"')
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

  const cMakeListsFileContent = makeCMakeListsTemplateAndroid();
  const isDoneCreatedAndroidCMakeListsFile = makeFileInAndroidDir(
    cMakeListsFileContent,
    'CMakeLists.txt'
  );

  const mediatorFileContent = makeMediatorTemplateAndroid();
  const isDoneCreatedAndroidMediatoreFile = makeFileInAndroidDir(
    mediatorFileContent,
    'mediator.cpp'
  );

  // for jni
  // const cLibControllerFileContent=makeCLibControllerTemplateAndroid();
  // const isDoneCreatedAndroidCLibControllerFile=makeFileInAndroidForBridgeJniDir(cLibControllerFileContent,"CLibController.java");

  // const cryptographicModuleFileContent=makeCryptographicModuleTemplateAndroid();
  // const isDoneCreatedAndroidCryptographicModuleFile=makeFileInAndroidForBridgeJniDir(cryptographicModuleFileContent,"CryptographicModule.java");

  // const cryptographicPackageFileContent=makeCryptographicPackageTemplateAndroid();
  // const isDoneCreatedAndroidCryptographicPackageFile=makeFileInAndroidForBridgeJniDir(cryptographicPackageFileContent,"CryptographicPackage.java");

  console.log(
    'secureKeys',
    isDoneCreatedAndroidCppFile,
    isDoneCreatedAndroidHppFile,
    isDoneCreatedAndroidCMakeListsFile,
    isDoneCreatedAndroidMediatoreFile
    // ,isDoneCreatedAndroidCLibControllerFile
    // ,isDoneCreatedAndroidCryptographicModuleFile,
    // isDoneCreatedAndroidCryptographicPackageFile
  );
};
makeAndroidJnuFiles();
