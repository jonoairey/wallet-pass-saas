'use client';

import { useState } from 'react';
import PassTemplateBuilder, { PassTemplate } from '@/components/dashboard/PassTemplateBuilder';

const defaultTemplate: PassTemplate = {
  name: '',
  description: '',
  type: 'generic',
  organizationName: '',
  colors: {
    background: '#FFFFFF',
    foreground: '#000000',
    label: '#666666'
  },
  fields: {
    header: [{ label: '', value: '' }],
    primary: [{ label: '', value: '' }],
    secondary: [{ label: '', value: '' }]
  },
  nfc: {
    enabled: false,
    message: '',
    requiresAuthentication: false
  },
  platformSettings: {
    apple: {
      passTypeIdentifier: '',
      teamIdentifier: ''
    },
    google: {
      issuerId: '',
      classId: ''
    }
  }
};

export default function NewTemplatePage() {
  const [initialTemplate] = useState<PassTemplate>(defaultTemplate);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-6">
        <h1 className="text-2xl font-bold text-gray-900">Create New Template</h1>
        <p className="mt-1 text-sm text-gray-500">
          Configure your new pass template
        </p>
      </div>
      <PassTemplateBuilder
        initialTemplate={initialTemplate}
        mode="create"
      />
    </div>
  );
}