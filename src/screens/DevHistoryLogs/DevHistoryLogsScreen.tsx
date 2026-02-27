import React from 'react';
import {useTranslation} from 'react-i18next';
import {ScrollView, Text, View} from 'native-base';
import Container from '~/components/Container';
import styles from './styles';
import {useAppSelector} from '~/redux/store/hooks';

const DevHistoryLogsScreen = () => {
  const {t} = useTranslation();
  const allHealthData = useAppSelector(state => state.health.allData);

  return (
    <Container
      title={t('devHistoryLogs.title')}
      containerStyle={styles.container}
      contentContainerStyle={styles.contentContainer}
      disableWrapper
      showBackIcon
      showDrawerIcon>
      <ScrollView
        bounces={false}
        style={styles.scrollContent}
        contentContainerStyle={styles.scrollContentContainer}>
        
        {allHealthData.length === 0 ? (
          <Text style={styles.value}>No historical health data available.</Text>
        ) : (
          allHealthData.slice().reverse().map((entry, index) => (
            <View key={index} style={{marginBottom: 20}}>
              <Text style={styles.label}>Entry #{index + 1}</Text>

              <Text style={styles.label}>Heart Rate:</Text>
              <Text style={styles.value}>{entry.heartRate ?? '-'}</Text>

              <Text style={styles.label}>Resting Heart Rate:</Text>
              <Text style={styles.value}>{entry.restingHeartRate ?? '-'}</Text>

              <Text style={styles.label}>Steps:</Text>
              <Text style={styles.value}>{entry.steps ?? '-'}</Text>

              <Text style={styles.label}>Total Steps:</Text>
              <Text style={styles.value}>{entry.totalSteps ?? '-'}</Text>

              <Text style={styles.label}>Heart Rate End Date:</Text>
              <Text style={styles.value}>
                {entry.heartRateEndDate && entry.heartRateEndDate > 0
                  ? new Date(entry.heartRateEndDate * 1000).toLocaleString()
                  : 'N/A'}
              </Text>

              <Text style={styles.label}>Resting Heart Rate End Date:</Text>
              <Text style={styles.value}>
                {entry.restingHeartRateEndDate && entry.restingHeartRateEndDate > 0
                  ? new Date(entry.restingHeartRateEndDate * 1000).toLocaleString()
                  : 'N/A'}
              </Text>

              <Text style={styles.label}>Steps End Date:</Text>
              <Text style={styles.value}>
                {entry.stepsEndDate && entry.stepsEndDate > 0
                  ? new Date(entry.stepsEndDate * 1000).toLocaleString()
                  : 'N/A'}
              </Text>

              <View style={{borderBottomWidth: 1, borderColor: '#ccc', marginVertical: 10}} />
            </View>
          ))
        )}
      </ScrollView>
    </Container>
  );
};

export default DevHistoryLogsScreen;
