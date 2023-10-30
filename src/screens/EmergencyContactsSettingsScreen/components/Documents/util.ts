import {Platform} from 'react-native';

export const getFileType = (fileName: string) => {
  if (fileName.includes('.pdf')) {
    return 'application/pdf';
  }
  if (fileName.includes('.docx')) {
    return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
  }
  if (fileName.includes('.doc')) {
    return 'application/msword';
  }
  if (fileName.includes('.jpeg') || fileName.includes('.jpg')) {
    return 'image/jpeg';
  }
  return 'image/png';
};

export const getUri = (uri: string): string => {
  if (Platform.OS === 'ios') {
    return decodeURIComponent(uri.replace('file://', ''));
  }
  return uri;
};
