import React, {useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {ScrollView, Text} from 'native-base';
import Container from '~/components/Container';
import styles from './styles';
import {useAppSelector} from '~/redux/store/hooks';
import Geolocation from 'react-native-geolocation-service';

const DevLogsScreen = () => {
  const {t} = useTranslation();
  const healthData = useAppSelector(state => state.health.data);
  const allHealthData = useAppSelector(state => state.health.allData);
  const latestRecord = allHealthData?.[allHealthData.length - 1] || null;

  useEffect(() => {
  (async() => {
    console.log("📍 Fetching Geo Position...");
    try {
      
      // let geoPosition = await getLocation(20000, false);
      Geolocation.getCurrentPosition(
  (pos) => console.log("Position from simple call:", pos),
  (err) => console.error("Error from simple call:", err),
  { enableHighAccuracy: true, timeout: 10000 }
);

    } catch (error) {
      console.error("Error fetching geo position:", error);
    }

    // console.log("📍 Current Geo Position:", geoPosition);
  })();
}, []);

  return (
     <Container
      title={t('devLogs.title')}
      containerStyle={styles.container}
      contentContainerStyle={styles.contentContainer}
      disableWrapper
      showBackIcon
      showDrawerIcon>
      <ScrollView
        bounces={false}
        style={styles.scrollContent}
        contentContainerStyle={styles.scrollContentContainer}>
          <Text style={styles.label}>Heart Rate:</Text>
          <Text style={styles.value}>{healthData?.heartRate ?? '-'}</Text>

          <Text style={styles.label}>Resting Heart Rate:</Text>
          <Text style={styles.value}>{healthData?.restingHeartRate ?? '-'}</Text>

          <Text style={styles.label}>Steps:</Text>
          <Text style={styles.value}>{healthData?.steps ?? '-'}</Text>

           <Text style={styles.label}>Total Steps:</Text>
          <Text style={styles.value}>{latestRecord?.totalSteps ?? '-'}</Text>

          <Text style={styles.label}>Heart Rate End Date:</Text>
          <Text style={styles.value}>
            {healthData?.heartRateEndDate && healthData.heartRateEndDate > 0
              ? new Date(healthData.heartRateEndDate * 1000).toLocaleString()
              : 'N/A'}
          </Text>

          <Text style={styles.label}>Resting Heart Rate End Date:</Text>
          <Text style={styles.value}>
            {healthData?.restingHeartRateEndDate && healthData.restingHeartRateEndDate > 0
              ? new Date(healthData.restingHeartRateEndDate * 1000).toLocaleString()
              : 'N/A'}
          </Text>

          <Text style={styles.label}>Steps End Date:</Text>
          <Text style={styles.value}>
            {healthData?.stepsEndDate && healthData.stepsEndDate > 0
              ? new Date(healthData.stepsEndDate * 1000).toLocaleString()
              : 'N/A'}
          </Text>

      </ScrollView>
    </Container>
  );
}

export default DevLogsScreen;
