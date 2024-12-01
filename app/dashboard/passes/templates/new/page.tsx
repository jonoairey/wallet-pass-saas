'use client';

import PassTemplateBuilder from '@/components/dashboard/PassTemplateBuilder';

const initialTemplate = {
  name: '',
  description: '',
  passType: 'generic',
  organizationName: '',
  backgroundColor: 'rgb(255, 255, 255)',
  foregroundColor: 'rgb(0, 0, 0)',
  labelColor: 'rgb(102, 102, 102)',
  barcodes: [{
    format: 'PKBarcodeFormatQR',
    message: '',
    messageEncoding: 'iso-8859-1'
  }],
  structure: {
    headerFields: [],
    primaryFields: [],
    secondaryFields: [],
    auxiliaryFields: [],
    backFields: []
  },
  nfc: {
    enabled: false,
    message: '',
    requiresAuthentication: false,
    accessControl: {
      requiresAuthentication: false,
      requiresPresence: false,
      unlockDevice: false
    }
  }
};

export default function NewTemplatePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-6">
        <h1 className="text-2xl font-bold text-gray-900">Create New Template</h1>
        <p className="mt-1 text-sm text-gray-500">Design your pass template with NFC capabilities</p>
      </div>
      <PassTemplateBuilder 
        initialTemplate={initialTemplate}
        mode="create"
      />
    </div>
  );
}