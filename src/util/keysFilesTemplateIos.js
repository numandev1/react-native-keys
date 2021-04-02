module.exports.makeCppFileTemplateIOS = (data) => {
  return `
  #include "crypto.hpp"
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
  #ifndef crypto_hpp
  #define crypto_hpp

  #include <stdio.h>
  #include <string>
  using namespace std;

  class Crypto {
  public:Crypto();
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

module.exports.makeKeysPackageMMTemplateIOS = (key) => {
  return `
  #import "Keys.h"
  #import "./crypto.cpp"
  #import "./crypto.hpp"
  #import "GeneratedDotEnv.m"
  @implementation Keys

  RCT_EXPORT_MODULE();
  string privateKey="${key}";
  + (NSString *)secureFor: (NSString *)key {
      @try {
          NSString* stringfyData = [NSString stringWithCString:Crypto().getJniJsonStringyfyData(privateKey).c_str() encoding:[NSString defaultCStringEncoding]];
          NSLog(stringfyData);
          NSData *data = [stringfyData dataUsingEncoding:NSUTF8StringEncoding];
          NSMutableDictionary *s = [NSJSONSerialization JSONObjectWithData:data options:0 error:NULL];
          NSString *value =[s objectForKey:key];
          return value;
      }
      @catch (NSException *exception) {
          return @"";
      }
  }

  + (NSDictionary *)public_keys {
    return (NSDictionary *)DOT_ENV;
  }

  + (NSString *)publicFor: (NSString *)key {
      NSString *value = (NSString *)[self.public_keys objectForKey:key];
      return value;
  }

  RCT_EXPORT_METHOD(secureFor:(NSString *) key
                  getBasicWithResolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
  {
      @try {
          NSString* value = [Keys secureFor:key];
          resolve(value);
      }
      @catch (NSException *exception) {
          resolve(@"");
      }
      
  }

  @end
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
