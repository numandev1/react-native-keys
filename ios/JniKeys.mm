#import "JniKeys.h"
#import "./crypto.cpp"
#import "./crypto.hpp"
@implementation JniKeys

RCT_EXPORT_MODULE();
string privateKey="";
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
