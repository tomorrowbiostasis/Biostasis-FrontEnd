#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(DeviceSignalsManager, NSObject)

RCT_EXTERN_METHOD(isFocusActive:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

+ (BOOL)requiresMainQueueSetup
{
  return NO;
}

@end
