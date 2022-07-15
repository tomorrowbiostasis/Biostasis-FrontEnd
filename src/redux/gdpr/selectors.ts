import {RootState} from '../store';
import {IGDPRState} from './gdpr.slice';

export const gdprSelector = (state: RootState): IGDPRState => state.gdpr;
