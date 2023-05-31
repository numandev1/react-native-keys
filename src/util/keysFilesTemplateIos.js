module.exports.makeCppFileTemplateIOS = (data) => {
  return `
   #include "crypto.h"
  #include <string>
  #include "decryptor.cpp"
  #include "decryptor.h"

  using namespace std;

  Crypto::Crypto() {

  }

  string Crypto::getJniJsonStringyfyData(string key) {
      std::string base64Secret = "${data}";
      std::string password = "asdf@1234";
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
