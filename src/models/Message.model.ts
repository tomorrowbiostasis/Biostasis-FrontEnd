export type IAlertMessage = {
  success: boolean;
  messageKey: string;
};

export type IToastMessage = {
  text1Key: string;
  type: 'biostasis_success' | 'biostasis_error';
};
