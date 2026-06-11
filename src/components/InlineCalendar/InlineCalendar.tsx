import React, {FC, useMemo, useState, useCallback} from 'react';
import {Pressable, Text, View} from 'react-native';
import dayjs from 'dayjs';

import styles from './styles';

type Mode = 'days' | 'years';

interface InlineCalendarProps {
  value: Date | null;
  onChange: (date: Date) => void;
  maxDate?: Date;
  minDate?: Date;
}

const DOW = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const YEARS_PER_PAGE = 18;
const YEAR_COLUMNS = 3;

const monthLabel = (d: dayjs.Dayjs) => d.format('MMMM YYYY');

const buildDayMatrix = (viewMonth: dayjs.Dayjs): (number | null)[][] => {
  const firstOfMonth = viewMonth.startOf('month');
  const daysInMonth = viewMonth.daysInMonth();
  const leadingBlanks = firstOfMonth.day();

  const cells: (number | null)[] = [];
  for (let i = 0; i < leadingBlanks; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  const rows: (number | null)[][] = [];
  for (let r = 0; r < cells.length; r += 7) rows.push(cells.slice(r, r + 7));
  return rows;
};

const InlineCalendar: FC<InlineCalendarProps> = ({
  value,
  onChange,
  maxDate,
  minDate,
}) => {
  const today = useMemo(() => dayjs(), []);
  const initial = useMemo(
    () => (value ? dayjs(value) : maxDate ? dayjs(maxDate) : today),
    [value, maxDate, today],
  );

  const [viewMonth, setViewMonth] = useState<dayjs.Dayjs>(initial.startOf('month'));
  const [mode, setMode] = useState<Mode>('days');
  const [yearWindowStart, setYearWindowStart] = useState<number>(
    initial.year() - 6,
  );

  const max = maxDate ? dayjs(maxDate).endOf('day') : null;
  const min = minDate ? dayjs(minDate).startOf('day') : null;

  const isOutOfRange = useCallback(
    (d: dayjs.Dayjs) =>
      (max && d.isAfter(max)) || (min && d.isBefore(min)) || false,
    [max, min],
  );

  const isYearOutOfRange = useCallback(
    (year: number) => {
      if (max && year > max.year()) return true;
      if (min && year < min.year()) return true;
      return false;
    },
    [max, min],
  );

  const handlePrev = useCallback(() => {
    if (mode === 'days') setViewMonth(prev => prev.subtract(1, 'month'));
    else setYearWindowStart(prev => prev - YEARS_PER_PAGE);
  }, [mode]);

  const handleNext = useCallback(() => {
    if (mode === 'days') setViewMonth(prev => prev.add(1, 'month'));
    else setYearWindowStart(prev => prev + YEARS_PER_PAGE);
  }, [mode]);

  const handleMonthLabelPress = useCallback(() => {
    if (mode === 'days') {
      setYearWindowStart(viewMonth.year() - 6);
      setMode('years');
    } else {
      setMode('days');
    }
  }, [mode, viewMonth]);

  const handleDayPress = useCallback(
    (day: number) => {
      const date = viewMonth.date(day);
      if (isOutOfRange(date)) return;
      onChange(date.toDate());
    },
    [viewMonth, isOutOfRange, onChange],
  );

  const handleYearPress = useCallback(
    (year: number) => {
      if (isYearOutOfRange(year)) return;
      setViewMonth(prev => prev.year(year));
      setMode('days');
    },
    [isYearOutOfRange],
  );

  const dayMatrix = useMemo(() => buildDayMatrix(viewMonth), [viewMonth]);
  const selectedDayjs = value ? dayjs(value) : null;

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <Pressable
          onPress={handleMonthLabelPress}
          style={styles.monthLabelWrap}
          hitSlop={8}>
          <Text style={styles.monthLabel}>{monthLabel(viewMonth)}</Text>
          <Text style={styles.monthLabelChevron}>
            {mode === 'days' ? '›' : '⌃'}
          </Text>
        </Pressable>
        <View style={styles.navRow}>
          <Pressable onPress={handlePrev} style={styles.navBtn} hitSlop={8}>
            <Text style={styles.navGlyph}>{'‹'}</Text>
          </Pressable>
          <Pressable onPress={handleNext} style={styles.navBtn} hitSlop={8}>
            <Text style={styles.navGlyph}>{'›'}</Text>
          </Pressable>
        </View>
      </View>

      {mode === 'days' ? (
        <>
          <View style={styles.dowRow}>
            {DOW.map(d => (
              <Text key={d} style={styles.dowLabel}>
                {d}
              </Text>
            ))}
          </View>
          {dayMatrix.map((row, rIdx) => (
            <View key={rIdx} style={styles.dayRow}>
              {row.map((day, cIdx) => {
                if (day === null) {
                  return <View key={cIdx} style={styles.dayCell} />;
                }
                const cellDate = viewMonth.date(day);
                const disabled = isOutOfRange(cellDate);
                const isToday = cellDate.isSame(today, 'day');
                const isSelected = selectedDayjs
                  ? cellDate.isSame(selectedDayjs, 'day')
                  : false;
                return (
                  <Pressable
                    key={cIdx}
                    onPress={() => handleDayPress(day)}
                    disabled={disabled}
                    style={styles.dayCell}>
                    <View
                      style={[
                        styles.dayInner,
                        isToday && !isSelected && styles.dayToday,
                        isSelected && styles.daySelected,
                      ]}>
                      <Text
                        style={[
                          styles.dayText,
                          disabled && styles.dayTextDisabled,
                          isToday && !isSelected && styles.dayTextToday,
                          isSelected && styles.dayTextSelected,
                        ]}>
                        {day}
                      </Text>
                    </View>
                  </Pressable>
                );
              })}
            </View>
          ))}
        </>
      ) : (
        <View style={styles.yearGrid}>
          {Array.from({length: YEARS_PER_PAGE}).map((_, idx) => {
            const year = yearWindowStart + idx;
            const disabled = isYearOutOfRange(year);
            const isSelected = selectedDayjs
              ? selectedDayjs.year() === year
              : viewMonth.year() === year;
            return (
              <Pressable
                key={year}
                onPress={() => handleYearPress(year)}
                disabled={disabled}
                style={[
                  styles.yearCell,
                  {width: `${100 / YEAR_COLUMNS}%`},
                ]}>
                <Text
                  style={[
                    styles.yearText,
                    disabled && styles.yearTextDisabled,
                    isSelected && styles.yearTextSelected,
                  ]}>
                  {year}
                </Text>
              </Pressable>
            );
          })}
        </View>
      )}
    </View>
  );
};

export default InlineCalendar;
