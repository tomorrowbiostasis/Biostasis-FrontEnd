import dayjs from 'dayjs';

export class TimeFormatService {
  time: Date | null;

  constructor(newTime: Date | null) {
    this.time = newTime;
  }

  format(is24HourClock: boolean | null) {
    return is24HourClock
      ? this.convertTo24HourFormat()
      : this.convertTo12HourFormat();
  }

  convertTo24HourFormat() {
    return dayjs(this.time).format('HH:mm');
  }

  convertTo12HourFormat() {
    return dayjs(this.time).format('hh:mm a');
  }

  static isValid(
    is24HourClock: boolean | null,
    timeToValidate: string,
    ampm: string,
  ) {
    if (timeToValidate.length < 5) {
      return false;
    }
    const dateSplited = timeToValidate.split(':');
    const hours = Number.parseInt(dateSplited[0], 10);
    const minutes = Number.parseInt(dateSplited[1], 10);

    if (!is24HourClock && (hours > 12 || minutes > 59)) {
      return false;
    }
    if (is24HourClock && (hours > 23 || minutes > 59)) {
      return false;
    }

    const calculateHours = () => {
      let calculated = hours;
      if (!is24HourClock && ampm === 'pm') {
        calculated = hours + 12;
      }
      return calculated;
    };

    const calculatedHours = calculateHours();

    const date = new Date();
    date.setHours(calculatedHours);
    date.setMinutes(minutes);
    return dayjs(date).isValid();
  }

  static createDate(
    is24HourClock: boolean | null,
    timeToValidate: string,
    ampm: string,
  ) {
    const dateSplited = timeToValidate.split(':');
    const hours = Number.parseInt(dateSplited[0], 10);
    const minutes = Number.parseInt(dateSplited[1], 10);

    const calculateHours = () => {
      let calculated = hours;
      if (!is24HourClock && ampm === 'pm') {
        calculated = hours + 12;
      }
      return calculated;
    };

    const calculatedHours = calculateHours();
    const date = new Date();
    date.setHours(calculatedHours);
    date.setMinutes(minutes);
    return date;
  }
}
