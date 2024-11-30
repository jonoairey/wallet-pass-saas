import { PassTemplate, PassType } from '@/types/pass';

export const validatePassTemplate = (template: Partial<PassTemplate>): string[] => {
  const errors: string[] = [];

  // Required fields
  const requiredFields = [
    'passTypeIdentifier',
    'teamIdentifier',
    'organizationName',
    'serialNumber',
    'description'
  ] as const;

  requiredFields.forEach(field => {
    if (!template[field]) {
      errors.push(`${field} is required`);
    }
  });

  // Format validation
  if (template.passTypeIdentifier && !template.passTypeIdentifier.match(/^[A-Z0-9]+\.[A-Za-z0-9.-]+\.[A-Za-z0-9.-]+$/)) {
    errors.push('Invalid passTypeIdentifier format');
  }

  // Team Identifier format (10 characters)
  if (template.teamIdentifier && template.teamIdentifier.length !== 10) {
    errors.push('Team Identifier must be 10 characters');
  }

  // Color validation
  ['backgroundColor', 'foregroundColor', 'labelColor'].forEach(color => {
    const value = template[color as keyof PassTemplate] as string | undefined;
    if (value && !value.match(/^rgb\(\d{1,3},\s*\d{1,3},\s*\d{1,3}\)$/)) {
      errors.push(`Invalid ${color} format. Use rgb(r, g, b) format`);
    }
  });

  // Barcode validation
  if (!template.barcodes || template.barcodes.length === 0) {
    errors.push('At least one barcode is required');
  } else {
    template.barcodes.forEach((barcode, index) => {
      if (!barcode.format) errors.push(`Barcode ${index + 1}: format is required`);
      if (!barcode.message) errors.push(`Barcode ${index + 1}: message is required`);
    });
  }

  // NFC validation
  if (template.nfc?.enabled) {
    if (!template.nfc.message) {
      errors.push('NFC message is required when NFC is enabled');
    }
  }

  // Structure validation
  if (template.structure) {
    const { primaryFields } = template.structure;
    if (!primaryFields || primaryFields.length === 0) {
      errors.push('At least one primary field is required');
    }

    // Validate field keys
    const validateFields = (fields: any[], fieldType: string) => {
      fields.forEach((field, index) => {
        if (!field.key) errors.push(`${fieldType} field ${index + 1}: key is required`);
        if (!field.label) errors.push(`${fieldType} field ${index + 1}: label is required`);
        if (!field.value) errors.push(`${fieldType} field ${index + 1}: value is required`);
      });
    };

    validateFields(template.structure.headerFields || [], 'Header');
    validateFields(template.structure.primaryFields || [], 'Primary');
    validateFields(template.structure.secondaryFields || [], 'Secondary');
    validateFields(template.structure.auxiliaryFields || [], 'Auxiliary');
    validateFields(template.structure.backFields || [], 'Back');
  }

  return errors;
};

export const generateSerialNumber = (): string => {
  return `PASS-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const getPassTypeIdentifier = (type: PassType, bundleId: string): string => {
  return `pass.${bundleId}.${type}`;
};

export const validateNFCSettings = (nfc: PassTemplate['nfc']): string[] => {
  const errors: string[] = [];

  if (nfc?.enabled) {
    if (!nfc.message) {
      errors.push('NFC message is required when NFC is enabled');
    }

    if (nfc.encryptionPublicKey && nfc.encryptionPublicKey.length < 10) {
      errors.push('NFC encryption public key must be at least 10 characters');
    }
  }

  return errors;
};
