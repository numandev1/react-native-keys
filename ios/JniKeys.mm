
  #import "JniKeys.h"
  #import "./crypto.cpp"
  #import "./crypto.hpp"
  #import "GeneratedDotEnv.m"
  @implementation JniKeys

  RCT_EXPORT_MODULE();
  string privateKey="c8913b62407357b669fa6c0c27a1292d";
  + (NSString *)getKeySync: (NSString *)key {
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

  + (NSDictionary *)env {
    return (NSDictionary *)DOT_ENV;
  }

  + (NSString *)envFor: (NSString *)key {
      NSString *value = (NSString *)[self.env objectForKey:key];
      return value;
  }

  RCT_EXPORT_METHOD(getKey:(NSString *) key
                  getBasicWithResolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
  {
      @try {
          NSString* value = [JniKeys getKeySync:key];
          resolve(value);
      }
      @catch (NSException *exception) {
          resolve(@"");
      }
      
  }

  @end
  