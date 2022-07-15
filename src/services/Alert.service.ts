import {Sound, resetAllSounds} from 'react-native-sound';

const playAlert = () => {
  setCategory('Alarm');
  const alarm = new Sound('alarm.mp3', Sound.MAIN_BUNDLE, error => {
    if (error) {
      return;
    }
    alarm.setNumberOfLoops(-1);
    alarm.play();
  });
};

const setCategory = (category: 'Alarm' | 'Playback') =>
  Sound.setCategory(category);

export default {playAlert, resetAllSounds, setCategory};
