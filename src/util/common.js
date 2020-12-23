const fs=require('fs-extra');
const path=require('path');
const PROJECT_ROOT_DIR_PATH=path.join(__dirname,"../../../../");

module.exports.getJniKeys=()=>{
  const jniJsonFilePath=`${PROJECT_ROOT_DIR_PATH}jnikeys.json`;
  const jnikeysJson=fs.readJSONSync(jniJsonFilePath)
  const secureKeys=jnikeysJson.secure;
  return secureKeys;
}

module.exports.makeFileInIosDir=(fileContent,fileName)=>{
  try {
    const iosDirPath=path.join(PROJECT_ROOT_DIR_PATH,"ios");
    const iosCppFilePath=path.join(iosDirPath,fileName);
    fs.outputFileSync(iosCppFilePath,fileContent);
    return true;
  } catch (error) {
    return false;
  }
}