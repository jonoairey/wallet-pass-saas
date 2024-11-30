export type PassType = 'boardingPass' | 'coupon' | 'eventTicket' | 'generic' | 'storeCard';

export type BarcodeFormat = 
  | 'PKBarcodeFormatQR'
  | 'PKBarcodeFormatPDF417'
  | 'PKBarcodeFormatAztec'
  | 'PKBarcodeFormatCode128';

export interface NFCSettings {
  enabled: boolean;
  message: string;
  encryptionPublicKey?: string;
  requiresAuthentication: boolean;
  payload?: string;
  accessControl: {
    requiresAuthentication: boolean;
    requiresPresence: boolean;
    unlockDevice: boolean;
  };
}

export interface PassField {
  key: string;
  label: string;
  value: string;
  dateStyle?: string;
  timeStyle?: string;
  isRelative?: boolean;
  changeMessage?: string;
  textAlignment?: 'PKTextAlignmentLeft' | 'PKTextAlignmentCenter' | 'PKTextAlignmentRight';
  attributedValue?: string;
}

export interface PassStructure {
  headerFields: PassField[];
  primaryFields: PassField[];
  secondaryFields: PassField[];
  auxiliaryFields: PassField[];
  backFields: PassField[];
}

export interface PassTemplate {
  // Required Information
  passTypeIdentifier: string;
  teamIdentifier: string;
  organizationName: string;
  serialNumber: string;
  description: string;
  formatVersion: number;

  // Visual Appearance
  backgroundColor?: string;
  foregroundColor?: string;
  labelColor?: string;
  logoText?: string;
  
  // Barcode
  barcodes: {
    format: BarcodeFormat;
    message: string;
    messageEncoding?: string;
    altText?: string;
  }[];

  // Structure
  structure: PassStructure;

  // Expiration
  expirationDate?: string;
  voided?: boolean;

  // Relevance
  locations?: {
    longitude: number;
    latitude: number;
    relevantText?: string;
    maxDistance?: number;
  }[];
  relevantDate?: string;
  maxDistance?: number;

  // Web Service
  authenticationToken?: string;
  webServiceURL?: string;

  // NFC
  nfc?: NFCSettings;
}