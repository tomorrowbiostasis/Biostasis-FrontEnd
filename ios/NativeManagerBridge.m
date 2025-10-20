//
//  NativeManagerBridge.m
//  Biostasis
//
//  Created by Paweł Kłosowicz on 18/10/2021.
//

#import <React/RCTBridgeModule.h>
#import "React/RCTEventEmitter.h"

@interface RCT_EXTERN_MODULE(NativeManager, NSObject)

RCT_EXTERN_METHOD(updateDataCollectionStatus)
RCT_EXTERN_METHOD(handleSilentPushNotification:(RCTResponseSenderBlock)callback)

+ (BOOL)requiresMainQueueSetup
{
  return NO;
}

@end
