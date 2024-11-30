'use client';

import React, { useState } from 'react';
import { validatePassTemplate } from '@/utils/passValidation';
import { PassTemplate, PassType, BarcodeFormat, NFCSettings } from '@/types/pass';
import { Eye, Save, AlertCircle, Plus, Trash } from 'lucide-react';

const initialNFCSettings: NFCSettings = {
  enabled: false,
  message: '',
  requiresAuthentication: false,
  accessControl: {
    requiresAuthentication: false,
    requiresPresence: false,
    unlockDevice: false
  }
};

const initialTemplate: PassTemplate = {
  passTypeIdentifier: '',
  teamIdentifier: '',
  organizationName: '',
  serialNumber: `PASS-${Date.now()}`,
  description: '',
  formatVersion: 1,
  backgroundColor: 'rgb(255, 255, 255)',
  foregroundColor: 'rgb(0, 0, 0)',
  labelColor: 'rgb(0, 0, 0)',
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
  nfc: initialNFCSettings
};

export default function PassTemplateBuilder() {
  const [template, setTemplate] = useState<PassTemplate>(initialTemplate);
  const [activeTab, setActiveTab] = useState('basic');
  const [errors, setErrors] = useState<string[]>([]);

  const tabs = [
    { id: 'basic', label: 'Basic Info' },
    { id: 'appearance', label: 'Appearance' },
    { id: 'structure', label: 'Fields' },
    { id: 'barcode', label: 'Barcode' },
    { id: 'location', label: 'Location' },
    { id: 'nfc', label: 'NFC' },
    { id: 'advanced', label: 'Advanced' }
  ];

  const handleSave = () => {
    const validationErrors = validatePassTemplate(template);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }
    console.log('Valid template:', template);
    // Add your save logic here
  };

  const addField = (category: keyof PassTemplate['structure']) => {
    setTemplate({
      ...template,
      structure: {
        ...template.structure,
        [category]: [
          ...template.structure[category],
          { key: '', label: '', value: '' }
        ]
      }
    });
  };

  const updateField = (
    category: keyof PassTemplate['structure'],
    index: number,
    field: string,
    value: string
  ) => {
    const updatedFields = [...template.structure[category]];
    updatedFields[index] = { ...updatedFields[index], [field]: value };
    
    setTemplate({
      ...template,
      structure: {
        ...template.structure,
        [category]: updatedFields
      }
    });
  };

  const removeField = (category: keyof PassTemplate['structure'], index: number) => {
    setTemplate({
      ...template,
      structure: {
        ...template.structure,
        [category]: template.structure[category].filter((_, i) => i !== index)
      }
    });
  };

  const updateNFCSettings = (updates: Partial<NFCSettings>) => {
    setTemplate({
      ...template,
      nfc: {
        ...(template.nfc || initialNFCSettings),
        ...updates
      }
    });
  };
  return (
    <div className="flex flex-col h-full">
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                py-4 px-1 border-b-2 font-medium text-sm
                ${activeTab === tab.id
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
              `}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {errors.length > 0 && (
          <div className="mb-4 p-4 bg-red-50 rounded-md">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Please fix the following errors:
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <ul className="list-disc pl-5 space-y-1">
                    {errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'basic' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Pass Type
              </label>
              <select
                value={template.passTypeIdentifier.split('.').pop() || 'generic'}
                onChange={(e) => {
                  const type = e.target.value as PassType;
                  setTemplate({
                    ...template,
                    passTypeIdentifier: `pass.com.yourcompany.${type}`
                  });
                }}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="generic">Generic</option>
                <option value="eventTicket">Event Ticket</option>
                <option value="boardingPass">Boarding Pass</option>
                <option value="storeCard">Store Card</option>
                <option value="coupon">Coupon</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Organization Name
              </label>
              <input
                type="text"
                value={template.organizationName}
                onChange={(e) => setTemplate({...template, organizationName: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                value={template.description}
                onChange={(e) => setTemplate({...template, description: e.target.value})}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Team Identifier
              </label>
              <input
                type="text"
                value={template.teamIdentifier}
                onChange={(e) => setTemplate({...template, teamIdentifier: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Your Apple Developer Team ID"
              />
            </div>
          </div>
        )}

        {activeTab === 'appearance' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Background Color
              </label>
              <input
                type="color"
                value={template.backgroundColor?.replace('rgb(', '').replace(')', '').split(',').map(x => {
                  const hex = parseInt(x.trim()).toString(16);
                  return hex.length === 1 ? '0' + hex : hex;
                }).join('')}
                onChange={(e) => {
                  const hex = e.target.value;
                  const r = parseInt(hex.slice(1, 3), 16);
                  const g = parseInt(hex.slice(3, 5), 16);
                  const b = parseInt(hex.slice(5, 7), 16);
                  setTemplate({...template, backgroundColor: `rgb(${r}, ${g}, ${b})`});
                }}
                className="mt-1 block w-full h-10"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Foreground Color
              </label>
              <input
                type="color"
                value={template.foregroundColor?.replace('rgb(', '').replace(')', '').split(',').map(x => {
                  const hex = parseInt(x.trim()).toString(16);
                  return hex.length === 1 ? '0' + hex : hex;
                }).join('')}
                onChange={(e) => {
                  const hex = e.target.value;
                  const r = parseInt(hex.slice(1, 3), 16);
                  const g = parseInt(hex.slice(3, 5), 16);
                  const b = parseInt(hex.slice(5, 7), 16);
                  setTemplate({...template, foregroundColor: `rgb(${r}, ${g}, ${b})`});
                }}
                className="mt-1 block w-full h-10"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Label Color
              </label>
              <input
                type="color"
                value={template.labelColor?.replace('rgb(', '').replace(')', '').split(',').map(x => {
                  const hex = parseInt(x.trim()).toString(16);
                  return hex.length === 1 ? '0' + hex : hex;
                }).join('')}
                onChange={(e) => {
                  const hex = e.target.value;
                  const r = parseInt(hex.slice(1, 3), 16);
                  const g = parseInt(hex.slice(3, 5), 16);
                  const b = parseInt(hex.slice(5, 7), 16);
                  setTemplate({...template, labelColor: `rgb(${r}, ${g}, ${b})`});
                }}
                className="mt-1 block w-full h-10"
              />
            </div>
          </div>
        )}

        {activeTab === 'structure' && (
          <div className="space-y-8">
            {/* Header Fields */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Header Fields</h3>
                <button
                  onClick={() => addField('headerFields')}
                  className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
                >
                  Add Field
                </button>
              </div>
              {template.structure.headerFields.map((field, index) => (
                <div key={index} className="flex gap-4 mb-4">
                  <input
                    placeholder="Label"
                    value={field.label}
                    onChange={(e) => updateField('headerFields', index, 'label', e.target.value)}
                    className="flex-1 rounded-md border-gray-300"
                  />
                  <input
                    placeholder="Value"
                    value={field.value}
                    onChange={(e) => updateField('headerFields', index, 'value', e.target.value)}
                    className="flex-1 rounded-md border-gray-300"
                  />
                  <button
                    onClick={() => removeField('headerFields', index)}
                    className="px-2 py-1 text-red-600 hover:text-red-800"
                  >
                    <Trash className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Primary Fields */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Primary Fields</h3>
                <button
                  onClick={() => addField('primaryFields')}
                  className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
                >
                  Add Field
                </button>
              </div>
              {template.structure.primaryFields.map((field, index) => (
                <div key={index} className="flex gap-4 mb-4">
                  <input
                    placeholder="Label"
                    value={field.label}
                    onChange={(e) => updateField('primaryFields', index, 'label', e.target.value)}
                    className="flex-1 rounded-md border-gray-300"
                  />
                  <input
                    placeholder="Value"
                    value={field.value}
                    onChange={(e) => updateField('primaryFields', index, 'value', e.target.value)}
                    className="flex-1 rounded-md border-gray-300"
                  />
                  <button
                    onClick={() => removeField('primaryFields', index)}
                    className="px-2 py-1 text-red-600 hover:text-red-800"
                  >
                    <Trash className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'nfc' && (
          <div className="space-y-6">
            <div className="p-4 border rounded-md space-y-4 bg-gray-50">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">NFC Configuration</h3>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="nfcEnabled"
                    checked={template.nfc?.enabled}
                    onChange={(e) => updateNFCSettings({ enabled: e.target.checked })}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="nfcEnabled" className="ml-2 block text-sm text-gray-900">
                    Enable NFC
                  </label>
                </div>
              </div>

              {template.nfc?.enabled && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      NFC Message
                    </label>
                    <input
                      type="text"
                      value={template.nfc?.message}
                      onChange={(e) => updateNFCSettings({ message: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300"
                      placeholder="Message to display during NFC interaction"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Access Control
                    </label>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="requiresAuthentication"
                          checked={template.nfc?.accessControl.requiresAuthentication}
                          onChange={(e) => updateNFCSettings({
                            accessControl: {
                              ...template.nfc!.accessControl,
                              requiresAuthentication: e.target.checked
                            }
                          })}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label htmlFor="requiresAuthentication" className="ml-2 block text-sm text-gray-900">
                          Requires Authentication
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="requiresPresence"
                          checked={template.nfc?.accessControl.requiresPresence}
                          onChange={(e) => updateNFCSettings({
                            accessControl: {
                              ...template.nfc!.accessControl,
                              requiresPresence: e.target.checked
                            }
                          })}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label htmlFor="requiresPresence" className="ml-2 block text-sm text-gray-900">
                          Requires Presence
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="unlockDevice"
                          checked={template.nfc?.accessControl.unlockDevice}
                          onChange={(e) => updateNFCSettings({
                            accessControl: {
                              ...template.nfc!.accessControl,
                              unlockDevice: e.target.checked
                            }
                          })}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label htmlFor="unlockDevice" className="ml-2 block text-sm text-gray-900">
                          Unlock Device
                        </label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Encryption Public Key
                    </label>
                    <input
                      type="text"
                      value={template.nfc?.encryptionPublicKey}
                      onChange={(e) => updateNFCSettings({ encryptionPublicKey: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300"
                      placeholder="Optional: Public key for NFC encryption"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Custom NFC Payload
                    </label>
                    <textarea
                      value={template.nfc?.payload}
                      onChange={(e) => updateNFCSettings({ payload: e.target.value })}
                      rows={4}
                      className="mt-1 block w-full rounded-md border-gray-300"
                      placeholder="Optional: Custom NFC payload data"
                      />
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {activeTab === 'barcode' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Barcode Format
              </label>
              <select
                value={template.barcodes[0]?.format}
                onChange={(e) => setTemplate({
                  ...template,
                  barcodes: [{
                    ...template.barcodes[0],
                    format: e.target.value as BarcodeFormat
                  }]
                })}
                className="mt-1 block w-full rounded-md border-gray-300"
              >
                <option value="PKBarcodeFormatQR">QR Code</option>
                <option value="PKBarcodeFormatPDF417">PDF417</option>
                <option value="PKBarcodeFormatAztec">Aztec</option>
                <option value="PKBarcodeFormatCode128">Code 128</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Barcode Message
              </label>
              <input
                type="text"
                value={template.barcodes[0]?.message}
                onChange={(e) => setTemplate({
                  ...template,
                  barcodes: [{
                    ...template.barcodes[0],
                    message: e.target.value
                  }]
                })}
                className="mt-1 block w-full rounded-md border-gray-300"
              />
            </div>
          </div>
        )}

        {activeTab === 'advanced' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Web Service URL
              </label>
              <input
                type="url"
                value={template.webServiceURL}
                onChange={(e) => setTemplate({...template, webServiceURL: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300"
                placeholder="https://your-api.com/passes"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Authentication Token
              </label>
              <input
                type="text"
                value={template.authenticationToken}
                onChange={(e) => setTemplate({...template, authenticationToken: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300"
              />
            </div>
          </div>
        )}
      </div>

      <div className="flex-shrink-0 px-6 py-4 border-t border-gray-200">
        <div className="flex justify-end space-x-3">
          <button
            onClick={handleSave}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Template
          </button>
        </div>
      </div>
    </div>
  );
}


