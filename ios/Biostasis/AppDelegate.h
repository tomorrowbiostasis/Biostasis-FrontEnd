#import <React/RCTBridgeDelegate.h>
#import <UIKit/UIKit.h>
#import "Biostasis-Swift.h"

@interface AppDelegate : UIResponder <UIApplicationDelegate, RCTBridgeDelegate>

@property (nonatomic, strong) UIWindow *window;

@property (nonatomic, strong) NativeManager *nativeManager;

@end
