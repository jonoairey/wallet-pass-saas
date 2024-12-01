'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { validatePassTemplate } from '@/utils/passValidation';
import { PassTemplate, PassType, BarcodeFormat, NFCSettings } from '@/types/pass';
import { 
  Eye, 
  Save, 
  AlertCircle, 
  Plus, 
  Trash,
  Settings,
  Image,
  Type,
  Palette,
  Barcode,
  MapPin,
  Bell,
  Smartphone 
} from 'lucide-react';

interface PassTemplateBuilderProps {
  initialTemplate?: any;
  mode?: 'create' | 'edit';
  templateId?: string;
}

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

const defaultTemplate = {
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
    format: 'PKBarcodeFormatQR' as BarcodeFormat,
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
const PassTemplateBuilder: React.FC<PassTemplateBuilderProps> = ({ 
  initialTemplate, 
  mode = 'create', 
  templateId 
}) => {
  const router = useRouter();
  const [template, setTemplate] = useState(initialTemplate || defaultTemplate);
  const [activeTab, setActiveTab] = useState('basic');
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [showPreview, setShowPreview] = useState(true);
  const [previewMode, setPreviewMode] = useState<'front' | 'back'>('front');

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: Type },
    { id: 'design', label: 'Design', icon: Palette },
    { id: 'fields', label: 'Fields', icon: Settings },
    { id: 'images', label: 'Images', icon: Image },
    { id: 'barcode', label: 'Barcode', icon: Barcode },
    { id: 'nfc', label: 'NFC', icon: Smartphone },
    { id: 'location', label: 'Location', icon: MapPin },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'advanced', label: 'Advanced', icon: Settings }
  ];

  const handleSave = async () => {
    setSaving(true);
    try {
      const validationErrors = validatePassTemplate(template);
      if (validationErrors.length > 0) {
        setErrors(validationErrors);
        setSaving(false);
        return;
      }

      const url = mode === 'edit' 
        ? `/api/templates/${templateId}`
        : '/api/templates';
        
      const response = await fetch(url, {
        method: mode === 'edit' ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(template),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save template');
      }

      router.push('/dashboard/passes/templates');
    } catch (error) {
      console.error('Save error:', error);
      setErrors(['Failed to save template']);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (mode === 'edit' && !confirm('Discard changes?')) {
      return;
    }
    router.push('/dashboard/passes/templates');
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
        [category]: template.structure[category].filter((field: any, i: number) => i !== index)
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
    <div className="flex h-full">
      {/* Left Sidebar - Tabs */}
      <div className="w-64 border-r bg-white">
        <nav className="space-y-1 p-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                  activeTab === tab.id
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon className="h-5 w-5 mr-3" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>
  
      {/* Main Content - Form */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6">
          {errors.length > 0 && (
            <div className="bg-red-50 p-4 rounded-md">
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
                  Template Name
                </label>
                <input
                  type="text"
                  value={template.name}
                  onChange={(e) => setTemplate({...template, name: e.target.value})}
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
                  Pass Type
                </label>
                <select
                  value={template.passType}
                  onChange={(e) => setTemplate({...template, passType: e.target.value})}
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
            </div>
          )}
          {activeTab === 'design' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Background Color
              </label>
              <input
                type="color"
                value={template.backgroundColor?.replace('rgb(', '').replace(')', '').split(',').map((x: string) => {
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
                className="mt-1 block w-full h-10 p-1 rounded-md border border-gray-300"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Text Color
              </label>
              <input
                type="color"
                value={template.foregroundColor?.replace('rgb(', '').replace(')', '').split(',').map((x: string) => {
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
                className="mt-1 block w-full h-10 p-1 rounded-md border border-gray-300"
              />
            </div>
          </div>
        )}

        {activeTab === 'fields' && (
          <div className="space-y-8">
            {/* Header Fields */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Header Fields</h3>
                <button
                  onClick={() => addField('headerFields')}
                  className="inline-flex items-center px-3 py-1 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-md hover:bg-indigo-100"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Field
                </button>
              </div>
              {template.structure.headerFields.map((field: { label: string; value: string }, index: number) => (
                <div key={index} className="flex items-center gap-4 mb-4">
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
                    className="p-1 text-red-600 hover:text-red-800"
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
                  className="inline-flex items-center px-3 py-1 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-md hover:bg-indigo-100"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Field
                </button>
              </div>
              {template.structure.primaryFields.map((field: { label: string; value: string }, index: number) => (
                <div key={index} className="flex items-center gap-4 mb-4">
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
                    className="p-1 text-red-600 hover:text-red-800"
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
                  <label htmlFor="nfcEnabled" className="ml-2 text-sm text-gray-900">
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

                  <div className="space-y-2">
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
                      <label htmlFor="requiresAuthentication" className="ml-2 text-sm text-gray-900">
                        Requires Authentication
                      </label>
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
      </div>
    </div>

    {/* Right Preview Panel */}
    {showPreview && (
      <div className="w-96 border-l bg-gray-50">
        <div className="p-4 sticky top-0">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900">Preview</h2>
            <button
              onClick={() => setPreviewMode(previewMode === 'front' ? 'back' : 'front')}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Show {previewMode === 'front' ? 'Back' : 'Front'}
            </button>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-4">
            {/* Pass Preview Component would go here */}
          </div>
        </div>
      </div>
    )}

    {/* Footer Actions */}
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
      <div className="flex justify-between items-center max-w-7xl mx-auto px-4">
        <button
          onClick={() => setShowPreview(!showPreview)}
          className="text-sm text-gray-600 hover:text-gray-900"
        >
          {showPreview ? 'Hide Preview' : 'Show Preview'}
        </button>
        <div className="flex space-x-4">
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className={`px-4 py-2 text-sm font-medium text-white rounded-md ${
              saving 
                ? 'bg-indigo-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {saving ? 'Saving...' : mode === 'edit' ? 'Save Changes' : 'Create Template'}
          </button>
        </div>
      </div>
    </div>
  </div>
);
};

export default PassTemplateBuilder;
