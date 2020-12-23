#! /usr/bin/env node

const { getJniKeys, makeFileInIosDir } = require('./src/util/common');
const {
  makeCppFileTemplateIOS,
  makeHppFileTemplateIOS,
  makeCryptographicPackageHTemplateIOS,
  makeCryptographicPackageMMTemplateIOS,
} = require('./src/util/jniFilesTemplateIos');

const makeIosJnuFiles = () => {
  const secureKeys = getJniKeys();
  const cppFileContent = makeCppFileTemplateIOS(JSON.stringify(secureKeys));
  const isDoneCreatedIosCppFile = makeFileInIosDir(
    cppFileContent,
    'crypto.cpp'
  );

  const hppFileContent = makeHppFileTemplateIOS();
  const isDoneCreatedIosHppFile = makeFileInIosDir(
    hppFileContent,
    'crypto.hpp'
  );

  const cryptographicPackageHFileContent = makeCryptographicPackageHTemplateIOS();
  const isDoneCreatedIosCryptographicPackageHFile = makeFileInIosDir(
    cryptographicPackageHFileContent,
    'CryptographicPackage.h'
  );

  const cryptographicPackageMMFileContent = makeCryptographicPackageMMTemplateIOS();
  const isDoneCreatedIosCryptographicPackageMMFile = makeFileInIosDir(
    cryptographicPackageMMFileContent,
    'CryptographicPackage.mm'
  );

  console.log(
    'secureKeys',
    isDoneCreatedIosCppFile,
    isDoneCreatedIosHppFile,
    isDoneCreatedIosCryptographicPackageHFile,
    isDoneCreatedIosCryptographicPackageMMFile
  );
};
makeIosJnuFiles();
