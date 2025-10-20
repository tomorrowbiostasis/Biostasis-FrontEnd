//
//  NativeManagerSingleton.h
//  Biostasis
//
//  Created by Paweł Kłosowicz on 18/10/2021.
//

#import <Foundation/Foundation.h>

@interface NativeManagerSingleton : NSObject

+ (instancetype)shared;

- (void)updateDataCollectionStatus;
- (void)handleSilentPushNotificationWithCompletion:(void(^)(BOOL success))completion;

@end
