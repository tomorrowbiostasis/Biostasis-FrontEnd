import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  scrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.64)',
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    paddingTop: 24,
    overflow: 'hidden',
  },
  content: {
    paddingHorizontal: 37,
    gap: 21,
    paddingBottom: 36,
  },
  title: {
    fontFamily: 'DMSans-SemiBold',
    fontSize: 18,
    lineHeight: 24,
    color: '#1D1617',
  },
  description: {
    fontFamily: 'DMSans-Regular',
    fontSize: 14,
    lineHeight: 18,
    color: '#7B6F72',
  },
  steps: {
    marginTop: 4,
  },
  stepRow: {
    flexDirection: 'row',
    gap: 14,
  },
  stepMarker: {
    width: 40,
    alignItems: 'center',
  },
  stepNumber: {
    fontFamily: 'DMSans-Regular',
    fontSize: 14,
    color: '#2ABFA0',
  },
  stepDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 4,
    borderColor: '#2ABFA0',
    marginTop: 6,
  },
  stepLine: {
    width: 2,
    flex: 1,
    minHeight: 24,
    backgroundColor: 'rgba(42, 191, 160, 0.4)',
    marginTop: 6,
  },
  stepText: {
    flex: 1,
    fontFamily: 'DMSans-Bold',
    fontSize: 14,
    lineHeight: 21,
    color: '#1D1617',
    paddingBottom: 24,
  },
  holdBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#D6455D',
    paddingVertical: 19,
    paddingHorizontal: 40,
  },
  holdCount: {
    fontFamily: 'DMSans-Bold',
    fontSize: 18,
    color: '#FFFFFF',
  },
  holdLabel: {
    fontFamily: 'DMSans-Bold',
    fontSize: 14,
    color: '#FFFFFF',
  },
});

export default styles;
