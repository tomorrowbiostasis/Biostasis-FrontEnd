import {BucketUnit} from 'react-native-google-fit';
import {IHealthData} from './BioCheck.types';

export interface IGoogleFitConfig {
  startDate: string;
  endDate: string;
  bucketUnit: BucketUnit;
  bucketInterval: number;
}

export interface IBioData {
  pulseData: IHealthData;
  restingPulseData: IHealthData;
  movementData: IHealthData;
}

export const TIME_FORMAT_OPTION: object = {
  hour12: false,
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
};
