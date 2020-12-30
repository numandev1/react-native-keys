#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>

NS_ASSUME_NONNULL_BEGIN

@interface JniKeys : NSObject <RCTBridgeModule>
+ (NSString *)getKeySync: (NSString *)key;

@end

NS_ASSUME_NONNULL_END
