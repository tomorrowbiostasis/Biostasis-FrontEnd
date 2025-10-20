#import "AppDelegate.h"
#import <Firebase.h>
#import "RNNotifications.h"
#import "RNSplashScreen.h"

#import <React/RCTBundleURLProvider.h>

#import <React/RCTLinkingManager.h>

// @class NativeManagerSingleton;
#import "NativeManagerSingleton.h"

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
   [FIRApp configure];
   [RNNotifications startMonitorNotifications];
  //  [RNSplashScreen show];


   
  self.moduleName = @"Biostasis";
  // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.
  self.initialProps = @{};

  // return [super application:application didFinishLaunchingWithOptions:launchOptions];
  [super application:application didFinishLaunchingWithOptions:launchOptions];
  [RNSplashScreen show];
  return YES;
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
  return [self bundleURL];
}

- (NSURL *)bundleURL
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

-(void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken {
  [RNNotifications didRegisterForRemoteNotificationsWithDeviceToken:deviceToken];
}

-(void)application:(UIApplication *)application didFailToRegisterForRemoteNotificationsWithError:(NSError *)error {
  [RNNotifications didFailToRegisterForRemoteNotificationsWithError:error];
}

// - (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo fetchCompletionHandler:(void (^)(UIBackgroundFetchResult result))completionHandler {
//   [RNNotifications didReceiveBackgroundNotification:userInfo withCompletionHandler:completionHandler];
// }
// - (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo fetchCompletionHandler:(void (^)(UIBackgroundFetchResult result))completionHandler {
  
//   // Check if this is a silent push notification
//   NSNumber *contentAvailable = userInfo[@"content-available"];
//   if (contentAvailable && [contentAvailable boolValue]) {
//     // This is a silent push notification
//     NSLog(@"🔔 Silent push notification received");
    
//     // Call the background health checker
//     [[NativeManagerSingleton shared] handleSilentPushNotificationWithCompletion:^(BOOL success) {
//       if (success) {
//         completionHandler(UIBackgroundFetchResultNewData);
//       } else {
//         completionHandler(UIBackgroundFetchResultNoData);
//       }
//     }];
//   } else {
//     // Regular push notification - handle with existing logic
//     [RNNotifications didReceiveBackgroundNotification:userInfo withCompletionHandler:completionHandler];
//   }
// }

// - (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo fetchCompletionHandler:(void (^)(UIBackgroundFetchResult result))completionHandler {
  
//   // Check if this is a silent push notification
//   NSNumber *contentAvailable = userInfo[@"content-available"];
//   if (contentAvailable && [contentAvailable boolValue]) {
//     // This is a silent push notification
//     NSLog(@"🔔 Silent push notification received");
    
//     // Call the background health checker
//     [[NativeManagerSingleton shared] handleSilentPushNotificationWithCompletion:^(BOOL success) {
//       if (success) {
//         completionHandler(UIBackgroundFetchResultNewData);
//       } else {
//         completionHandler(UIBackgroundFetchResultNoData);
//       }
//     }];
//   } else {
//     // Regular push notification - handle with existing logic
//     [RNNotifications didReceiveBackgroundNotification:userInfo withCompletionHandler:completionHandler];
//   }
// }

// - (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo fetchCompletionHandler:(void (^)(UIBackgroundFetchResult result))completionHandler {
//   // Check if this is a silent push notification
//   NSNumber *contentAvailable = userInfo[@"content-available"];
//   if (contentAvailable && [contentAvailable boolValue]) {
//     // This is a silent push notification
//     NSLog(@"🔔 Silent push notification received");
    
//     // Call the background health checker using the correct Swift method name
//     [NativeManagerSingleton.shared handleSilentPushNotificationWithCompletion:^(BOOL success) {
//       if (success) {
//         completionHandler(UIBackgroundFetchResultNewData);
//       } else {
//         completionHandler(UIBackgroundFetchResultNoData);
//       }
//     }];
//   } else {
//     // Regular push notification - handle with existing logic
//     [RNNotifications didReceiveBackgroundNotification:userInfo withCompletionHandler:completionHandler];
//   }
// }

-(void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo fetchCompletionHandler:(void (^)(UIBackgroundFetchResult result))completionHandler {
  
  // Check if this is a silent push notification (prefer aps["content-available"]) 
  NSDictionary *aps = userInfo[@"aps"];
  NSNumber *contentAvailable = aps[@"content-available"] ?: userInfo[@"content-available"];
  if (contentAvailable && [contentAvailable boolValue]) {
    NSLog(@"[AppDelegate] aps.content-available == 1");
    // This is a silent push notification
    NSLog(@"🔔 Silent push notification received");
    
    // Call the background health checker
    [NativeManagerSingleton.shared handleSilentPushNotificationWithCompletion:^(BOOL success) {
      if (success) {
        completionHandler(UIBackgroundFetchResultNewData);
      } else {
        completionHandler(UIBackgroundFetchResultNoData);
      }
    }];
  } else {
    // Regular push notification - handle with existing logic
    [RNNotifications didReceiveBackgroundNotification:userInfo withCompletionHandler:completionHandler];
  }
}


  /// linking
- (BOOL)application:(UIApplication *)application
   openURL:(NSURL *)url
   options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options
{
  return [RCTLinkingManager application:application openURL:url options:options];
}
@end
