import React, { useEffect, useState } from 'react';
import { ScrollView, Text, View, Button } from 'native-base';
import Container from '~/components/Container';
import styles from './styles';
import { getPushLogs, clearPushLogs } from '~/services/PushLogger.service';

const DevPushLogsScreen = () => {
  const [logs, setLogs] = useState<any[]>([]);

  const loadLogs = async () => {
    const storedLogs = await getPushLogs();
    setLogs(storedLogs);
  };

  const handleClearLogs = async () => {
    await clearPushLogs();
    setLogs([]);
  };

  useEffect(() => {
    loadLogs();
  }, []);

  return (
    <Container
      title="Dev Push Logs"
      containerStyle={styles.container}
      contentContainerStyle={styles.contentContainer}
      disableWrapper
      showBackIcon
      showDrawerIcon
    >
      {/* <Button onPress={handleClearLogs} mb={4}>
        Clear Logs
      </Button> */}

      <ScrollView
        bounces={false}
        style={styles.scrollContent}
        contentContainerStyle={styles.scrollContentContainer}
      >
        {logs.length === 0 ? (
          <Text style={styles.value}>No push notifications logged yet.</Text>
        ) : (
          logs.map((log, index) => (
            <View key={index} style={{ marginBottom: 20 }}>
              <Text style={styles.label}>Log #{logs.length - index}</Text>

              <Text style={styles.label}>Timestamp:</Text>
              <Text style={styles.value}>{log.timestamp}</Text>

              <Text style={styles.label}>Source:</Text>
              <Text style={styles.value}>{log.event.source ?? '-'}</Text>

              <Text style={styles.label}>Type:</Text>
              <Text style={styles.value}>{log.event.data?.type ?? '-'}</Text>

              <Text style={styles.label}>Title:</Text>
              <Text style={styles.value}>{log.event.notification?.title ?? '-'}</Text>

              <Text style={styles.label}>Body:</Text>
              <Text style={styles.value}>{log.event.notification?.body ?? '-'}</Text>

              <Text style={styles.label}>Data:</Text>
              <Text style={styles.value}>
                {log.event.data ? JSON.stringify(log.event.data, null, 2) : '-'}
              </Text>

              <View style={{ borderBottomWidth: 1, borderColor: '#ccc', marginVertical: 10 }} />
            </View>
          ))
        )}
      </ScrollView>
    </Container>
  );
};

export default DevPushLogsScreen;
