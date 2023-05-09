module.exports.makeCppFileTemplateIOS = (data) => {
  return `
  #include "crypto.h"
  #include <string>
  #include "encrypt.h"

  using namespace std;

    Crypto::Crypto() {

    }


    std::string Crypto::getJniJsonStringyfyData(string key) {
      std::string jsonStringyfyData= "${data}";
        string hash;
        int len=jsonStringyfyData.length();
        char cahrtot[len+1];
        strcpy(cahrtot,jsonStringyfyData.c_str());
        hash=SHA256(cahrtot);
        string halfString=hash.substr(hash.length()/2);
        if(key==halfString)
        {
          return jsonStringyfyData;
        }
        else
        {
            return "";
        }
      
    }
  `;
};

module.exports.makeHppFileTemplateIOS = () => {
  return `
#ifndef CRYPTO_H
#define CRYPTO_H

#include <stdio.h>
#include <string>
using namespace std;

class Crypto
{
public:
  Crypto();
  string getJniJsonStringyfyData(string key);
};
#endif

  
  `;
};

module.exports.makeKeysPackageHTemplateIOS = () => {
  return `
  #import <Foundation/Foundation.h>
  #import <React/RCTBridgeModule.h>

  NS_ASSUME_NONNULL_BEGIN

  @interface Keys : NSObject <RCTBridgeModule>
  + (NSString *)secureFor: (NSString *)key;

  @end

  NS_ASSUME_NONNULL_END

  `;
};

module.exports.makeXcConfigFIlle = (keys) => {
  try {
    let env_keys = [];
    for (let [key, value] of Object.entries(keys)) {
      env_keys.push(`${key}=${value}`);
    }
    return env_keys.join('\n');
  } catch (error) {
    return '';
  }
};

module.exports.makeGeneratedDotEnvTemplateIOS = (keys) => {
  try {
    let env_keys = [];
    for (let [key, value] of Object.entries(keys)) {
      env_keys.push(`@"${key}":@"${value}"`);
    }
    const dotEnv = env_keys.join();
    return `#define DOT_ENV @{ ${dotEnv} };`;
  } catch (error) {
    return `#define DOT_ENV @{};`;
  }
};

module.exports.makePrivateKeyTemplateIOS = (keys) => {
  try {
    let env_keys = [];
    for (let [key, value] of Object.entries(keys)) {
      env_keys.push(`@"${key}":@"${value}"`);
    }
    const dotEnv = env_keys.join();
    return `#define PRIVATE_KEY @{ ${dotEnv} };`;
  } catch (error) {
    return `#define PRIVATE_KEY @{};`;
  }
};
