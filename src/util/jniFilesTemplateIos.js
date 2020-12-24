module.exports.makeCppFileTemplateIOS = (data) => {
  return `
  #include "crypto.hpp"
  #include <string>
  Crypto::Crypto() {

  }


  std::string Crypto::getJniJsonStringyfyData() {
    std::string jsonStringyfyData= ""; //Any chars will work
    return jsonStringyfyData;
  }
  `;
};

module.exports.makeHppFileTemplateIOS = () => {
  return `
  #ifndef crypto_hpp
  #define crypto_hpp

  #include <stdio.h>
  #include <string>

  class Crypto {
  public:Crypto();
    std::string getJniJsonStringyfyData();
  };
  #endif
  `;
};

module.exports.makeCryptographicPackageHTemplateIOS = () => {
  return `
  #import <Foundation/Foundation.h>
  #import <React/RCTBridgeModule.h>

  NS_ASSUME_NONNULL_BEGIN

  @interface CryptographicPackage : NSObject <RCTBridgeModule>

  @end

  NS_ASSUME_NONNULL_END
  `;
};

module.exports.makeCryptographicPackageMMTemplateIOS = () => {
  return `
  #import "CryptographicPackage.h"
  #import "crypto.hpp"

  @implementation CryptographicPackage

  RCT_EXPORT_MODULE();


  RCT_REMAP_METHOD(getBasicAuth,
                  getBasicWithResolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
  {
      NSString* newTitle = [NSString stringWithCString:Crypto().getBasicAuth().c_str() encoding:[NSString defaultCStringEncoding]];
      resolve(newTitle);
  }

  RCT_REMAP_METHOD(getGoogleMapAPIKey,
                  getGoogleMapAPIKeyWithResolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
  {
      NSString* newTitle = [NSString stringWithCString:Crypto().getGoogleMapAPIKey().c_str() encoding:[NSString defaultCStringEncoding]];
      resolve(newTitle);
  }

  RCT_REMAP_METHOD(getIV,
                  getIVWithResolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
  {
      NSString* newTitle = [NSString stringWithCString:Crypto().getIV().c_str() encoding:[NSString defaultCStringEncoding]];
      resolve(newTitle);
  }

  RCT_REMAP_METHOD(getKey,
                  getKeyWithResolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
  {
      NSString* newTitle = [NSString stringWithCString:Crypto().getKey().c_str() encoding:[NSString defaultCStringEncoding]];
      resolve(newTitle);
  }


  @end
  `;
};
