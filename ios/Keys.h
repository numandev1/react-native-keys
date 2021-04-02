#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>

NS_ASSUME_NONNULL_BEGIN

@interface Keys : NSObject <RCTBridgeModule>
+ (NSString *)secureFor:(NSString *)key;
+ (NSDictionary *)public_keys;
+ (NSString *)publicFor:(NSString *)key;

@end

NS_ASSUME_NONNULL_END
