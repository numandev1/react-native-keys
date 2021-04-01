 #import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>

NS_ASSUME_NONNULL_BEGIN

@interface Keys : NSObject <RCTBridgeModule>
+ (NSString *)getKeySync:(NSString *)key;
+ (NSDictionary *)env;
+ (NSString *)envFor:(NSString *)key;

@end

NS_ASSUME_NONNULL_END
