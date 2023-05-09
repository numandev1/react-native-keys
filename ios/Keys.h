#import <React/RCTBridgeModule.h>

@interface Keys : NSObject <RCTBridgeModule>

@property (nonatomic, assign) BOOL setBridgeOnMainQueue;

+ (NSString *)secureFor:(NSString *)key;
+ (NSDictionary *)public_keys;
+ (NSString *)publicFor:(NSString *)key;

@end
