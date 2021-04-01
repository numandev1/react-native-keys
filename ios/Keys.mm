
  #import "Keys.h"
  #import "./crypto.cpp"
  #import "./crypto.hpp"
  #import "GeneratedDotEnv.m"
  @implementation Keys

  RCT_EXPORT_MODULE();
  string privateKey="781db1c63f175b3dd18324db8ba28048";
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
          NSString* value = [Keys getKeySync:key];
          resolve(value);
      }
      @catch (NSException *exception) {
          resolve(@"");
      }
      
  }

  @end
  