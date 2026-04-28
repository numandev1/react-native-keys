#import "Keys.h"
#import <React/RCTBridge+Private.h>
#import <React/RCTLog.h>
#import <React/RCTUtils.h>
#import <ReactCommon/RCTTurboModule.h>
#import <jsi/jsi.h>
#import "YeetJSIUtils.h"
#import "GeneratedDotEnv.m"
#import "crypto.h"
#import "privateKey.m"

using namespace facebook;
using namespace jsi;
using namespace std;

template <typename Lambda>
void CreateFunction(jsi::Runtime &rt, const char* name, int count, Lambda &&callback) {
  auto fn = Function::createFromHostFunction(rt, jsi::PropNameID::forAscii(rt, name), count, callback);
  rt.global().setProperty(rt, name, move(fn));
}

#define CREATE_FUNCTION(name, argumentsCount, body) \
CreateFunction(jsiRuntime, name, argumentsCount, [](Runtime &runtime, const Value &thisValue, const Value *arguments, size_t count) -> Value {    \
body    \
})

@implementation Keys
@synthesize bridge = _bridge;


- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
(const facebook::react::ObjCTurboModule::InitParams &)params
{
  return std::make_shared<facebook::react::NativeKeysSpecJSI>(params);
}

+ (NSString *)moduleName
{
  return @"Keys";
}

+ (BOOL)requiresMainQueueSetup {
  
  return YES;
}

- (nonnull NSNumber *)install {
  RCTCxxBridge* cxxBridge = (RCTCxxBridge*)_bridge;
  if (cxxBridge == nil) {
    return @NO;
  }
  
  auto jsiRuntime = (jsi::Runtime*) cxxBridge.runtime;
  if (jsiRuntime == nil) {
    return @NO;
  }
  
  
  RCTBridge *bridge = [RCTBridge currentBridge];
  
  install(*(jsi::Runtime *)jsiRuntime);
  return @YES;
}

static void install(jsi::Runtime &jsiRuntime) {
  CREATE_FUNCTION("publicKeys", 0, {
    NSDictionary *s = [Keys public_keys];
    return Value(runtime, convertNSDictionaryToJSIObject(runtime, s));
  });
  
  CREATE_FUNCTION("secureFor", 1, {
    NSString *key = convertJSIStringToNSString(runtime, arguments[0].getString(runtime));
    NSString *value = [Keys secureFor:key];
    return Value(runtime, convertNSStringToJSIString(runtime, value));
  });
}
+ (NSString *)secureFor: (NSString *)key {
  @try {
    NSDictionary *privatesKeyEnv = PRIVATE_KEY;
    NSString *privateKey = [privatesKeyEnv objectForKey:@"privateKey"];
    NSString* stringfyData = [NSString stringWithCString:Crypto().getJniJsonStringifyData([privateKey cStringUsingEncoding:NSUTF8StringEncoding]).c_str() encoding:[NSString defaultCStringEncoding]];
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

@end
