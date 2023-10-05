export interface IFile {
  id: string;
  name: string;
  mimeType: string;
  createdAt: string;
}

export type DocumentIdType = number;

export interface IFiles {
  code: string;
  files: IFile[];
}

export type GetDocumentsResponseType = IFiles[];

export interface IFileToUpload {
  file: {
    filename: string;
    filepath: string;
    filetype: string;
  };
  category: string;
}

export type UploadFileCategoryType = 'medicalDirective' | 'lastWill' | 'other';

export type EmergencyMessageType = 'noConnectionToWatch' | 'heartRateInvalid';

export interface IApiSuccessfulResponse {
  success: boolean;
}

export interface IApiTimeSlot {
  id: number;
  active: boolean;
  from: string | null; //ISO time
  to: string; //ISO time
  days: string[];
  createdAt: string; //ISO time
}

export interface IApiPostTimeSlot {
  active: boolean;
  from?: string; //ISO time
  to: string; //ISO time
  days: string[];
  timezone?: string;
}

export interface IApiPatchTimeSlot extends IApiPostTimeSlot {}
