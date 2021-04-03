
  #import "Keys.h"
  #import "./crypto.cpp"
  #import "./crypto.hpp"
  #import "GeneratedDotEnv.m"
  @implementation Keys

  RCT_EXPORT_MODULE();
  string privateKey="9784bc9a5c0aa6943cdfc2ce3dd4caf7";
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

  - (NSDictionary *)constantsToExport {
    return (NSDictionary *)DOT_ENV;
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
  