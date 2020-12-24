#import "JniKeys.h"
#import "./crypto.cpp"
#import "./crypto.hpp"
@implementation JniKeys

RCT_EXPORT_MODULE();


RCT_EXPORT_METHOD(getKey:(NSString *) key
                getBasicWithResolver:(RCTPromiseResolveBlock)resolve
                rejecter:(RCTPromiseRejectBlock)reject)
{
    @try {
        NSString* stringfyData = [NSString stringWithCString:Crypto().getJniJsonStringyfyData().c_str() encoding:[NSString defaultCStringEncoding]];
        
       NSData *data = [stringfyData dataUsingEncoding:NSUTF8StringEncoding];

       NSError *err = nil;
       NSArray *jsonData = [NSJSONSerialization JSONObjectWithData:data options:NSJSONReadingAllowFragments error:&err];
        NSMutableDictionary *s = [NSJSONSerialization JSONObjectWithData:data options:0 error:NULL];
        NSString *value =[s objectForKey:key];
        resolve(value);
    }
    @catch (NSException *exception) {
        resolve(@"");
    }
    
}

@end
