//
//  NativeManagerBridge.m
//  Biostasis
//
//  Created by Paweł Kłosowicz on 18/10/2021.
//

#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(NativeManager, NSObject)

RCT_EXTERN_METHOD(updateDataCollectionStatus)

+ (BOOL)requiresMainQueueSetup
{
  return NO;
}

@end
