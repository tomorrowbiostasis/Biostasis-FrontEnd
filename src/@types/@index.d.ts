declare module '@voximplant/react-native-foreground-service' {
  export default class VIForegroundService {
    public createNotificationChannel(
      channelConfig: NotificationChannelConfig,
    ): Promise<any>;
    public startService(notificationConfig: NotificationConfig): Promise<any>;
    public stopService(): Promise<any>;
    static getInstance(): VIForegroundService;
  }
}

type NotificationChannelConfig = {
  id: string;
  name: string;
  description?: string;
  importance?: number;
  enableVibration?: boolean;
};

type NotificationConfig = {
  channelId: string;
  id: number;
  title: string;
  text: string;
  icon: string;
  priority?: number;
};
