// Existing types
export type PassType = 'boardingPass' | 'coupon' | 'eventTicket' | 'generic' | 'storeCard';

export type BarcodeFormat = 
  | 'PKBarcodeFormatQR'
  | 'PKBarcodeFormatPDF417'
  | 'PKBarcodeFormatAztec'
  | 'PKBarcodeFormatCode128';

// Google Wallet types
export type GooglePassType = 
  | 'TicketClass'
  | 'EventTicketClass'
  | 'GiftCardClass'
  | 'LoyaltyClass'
  | 'OfferClass'
  | 'TransitClass';

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
  // Added for Google Wallet Smart Tap
  googleSmartTap?: {
    enabled: boolean;
    domains?: string[];
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

// Your existing PassTemplate (renamed to ApplePassTemplate for clarity)
export interface ApplePassTemplate {
  passTypeIdentifier: string;
  teamIdentifier: string;
  organizationName: string;
  serialNumber: string;
  description: string;
  formatVersion: number;
  backgroundColor?: string;
  foregroundColor?: string;
  labelColor?: string;
  logoText?: string;
  barcodes: {
    format: BarcodeFormat;
    message: string;
    messageEncoding?: string;
    altText?: string;
  }[];
  structure: PassStructure;
  expirationDate?: string;
  voided?: boolean;
  locations?: {
    longitude: number;
    latitude: number;
    relevantText?: string;
    maxDistance?: number;
  }[];
  relevantDate?: string;
  maxDistance?: number;
  authenticationToken?: string;
  webServiceURL?: string;
  nfc?: NFCSettings;
}

// New Universal Template that generates both formats
export interface UniversalPassTemplate {
  id?: string;
  name: string;
  description: string;
  type: PassType;
  organizationName: string;

  design: {
    colors: {
      backgroundColor: string;
      foregroundColor: string;
      labelColor: string;
    };
    images: {
      icon?: string;
      logo?: string;
      hero?: string; // For Google Wallet
      strip?: string; // For Apple Wallet
    };
  };

  structure: PassStructure;

  barcode: {
    format: BarcodeFormat;
    message: string;
    alternativeText?: string;
  };

  nfc: NFCSettings;

  locations?: {
    latitude: number;
    longitude: number;
    relevantText?: string;
    maxDistance?: number;
  }[];

  platformSpecific: {
    apple: {
      passTypeIdentifier: string;
      teamIdentifier: string;
      formatVersion: number;
      webServiceURL?: string;
      authenticationToken?: string;
    };
    google: {
      issuerId: string;
      classId: string;
      classTemplate?: string;
      logo?: {
        sourceUri?: string;
        contentDescription?: string;
      };
    };
  };

  // Metadata
  createdAt?: string;
  updatedAt?: string;
  status: 'DRAFT' | 'ACTIVE' | 'ARCHIVED';
}

// Helper function to convert Universal template to Apple format
export function convertToApplePass(universal: UniversalPassTemplate): ApplePassTemplate {
  return {
    passTypeIdentifier: universal.platformSpecific.apple.passTypeIdentifier,
    teamIdentifier: universal.platformSpecific.apple.teamIdentifier,
    organizationName: universal.organizationName,
    description: universal.description,
    serialNumber: universal.id || Date.now().toString(),
    formatVersion: universal.platformSpecific.apple.formatVersion,
    backgroundColor: universal.design.colors.backgroundColor,
    foregroundColor: universal.design.colors.foregroundColor,
    labelColor: universal.design.colors.labelColor,
    structure: universal.structure,
    barcodes: [{
      format: universal.barcode.format,
      message: universal.barcode.message,
      altText: universal.barcode.alternativeText
    }],
    nfc: universal.nfc,
    locations: universal.locations,
    webServiceURL: universal.platformSpecific.apple.webServiceURL,
    authenticationToken: universal.platformSpecific.apple.authenticationToken
  };
}