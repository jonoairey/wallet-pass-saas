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
  Smartphone,
  Globe 
} from 'lucide-react';

interface PassTemplateBuilderProps {
  initialTemplate?: PassTemplate;
  mode?: 'create' | 'edit';
  templateId?: string;
}

interface FieldError {
  index: number;
  field: string;
  message: string;
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

const defaultTemplate: PassTemplate = {
  name: '',
  description: '',
  type: 'generic',
  organizationName: '',
  design: {
    colors: {
      backgroundColor: '#FFFFFF',
      foregroundColor: '#000000',
      labelColor: '#666666'
    },
    images: {}
  },
  structure: {
    headerFields: [],
    primaryFields: [],
    secondaryFields: [],
    auxiliaryFields: [],
    backFields: []
  },
  barcode: {
    format: 'PKBarcodeFormatQR',
    message: '',
  },
  nfc: initialNFCSettings,
  platformSpecific: {
    apple: {
      passTypeIdentifier: '',
      teamIdentifier: '',
      formatVersion: 1
    },
    google: {
      issuerId: '',
      classId: ''
    }
  },
  status: 'DRAFT'
};
const PassTemplateBuilder: React.FC<PassTemplateBuilderProps> = ({ 
  initialTemplate, 
  mode = 'create', 
  templateId 
}) => {
  const router = useRouter();
  const [template, setTemplate] = useState<PassTemplate>(initialTemplate || defaultTemplate);
  const [activeTab, setActiveTab] = useState('basic');
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [showPreview, setShowPreview] = useState(true);
  const [previewMode, setPreviewMode] = useState<'front' | 'back'>('front');

  // Tab configuration
  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: Type },
    { id: 'design', label: 'Design', icon: Palette },
    { id: 'fields', label: 'Fields', icon: Settings },
    { id: 'images', label: 'Images', icon: Image },
    { id: 'nfc', label: 'NFC', icon: Smartphone },
    { id: 'barcode', label: 'Barcode', icon: Barcode },
    { id: 'location', label: 'Location', icon: MapPin },
    { id: 'platforms', label: 'Platform Settings', icon: Globe },
    { id: 'advanced', label: 'Advanced', icon: Settings }
  ];

  // Handler functions
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
      setErrors(Array.isArray(error) ? error : ['Failed to save template']);
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

  // Field management functions
  const addField = (category: keyof PassTemplate['structure']) => {
    setTemplate(prev => ({
      ...prev,
      structure: {
        ...prev.structure,
        [category]: [
          ...prev.structure[category],
          { key: '', label: '', value: '', type: 'text' }
        ]
      }
    }));
  };

  const updateField = (
    category: keyof PassTemplate['structure'],
    index: number,
    field: keyof (PassTemplate['structure'][keyof PassTemplate['structure']][number]),
    value: string
  ) => {
    setTemplate(prev => {
      const updatedFields = [...prev.structure[category]];
      updatedFields[index] = { ...updatedFields[index], [field]: value };
      
      return {
        ...prev,
        structure: {
          ...prev.structure,
          [category]: updatedFields
        }
      };
    });
  };

  const removeField = (
    category: keyof PassTemplate['structure'],
    index: number
  ) => {
    setTemplate(prev => ({
      ...prev,
      structure: {
        ...prev.structure,
        [category]: prev.structure[category].filter((_, i) => i !== index)
      }
    }));
  };

  const updateNFCSettings = (updates: Partial<NFCSettings>) => {
    setTemplate(prev => ({
      ...prev,
      nfc: {
        ...(prev.nfc || initialNFCSettings),
        ...updates
      }
    }));
  };

  // Return statement will be in the next part...
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
      </div>
  
      {/* Main Content Area */}
      <div className="flex-1 flex">
        {/* Form Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Error Messages */}
            {errors.length !== 0 && (
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
                        </div>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
  
            {/* Tab Content - Will be added in next part */}
            <div className="space-y-6">
              {/* Tab content will go here */}
            </div>
          </div>
        </div>
  
        {/* Preview Panel */}
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
                {/* Pass Preview Component will go here */}
              </div>
            </div>
          </div>
        )}
      </div>
  
      {/* Footer Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4"></div>
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
{/* Tab content */}
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
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        placeholder="Corporate Access Pass"
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
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        placeholder="NFC-enabled corporate access pass for employees"
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700">
        Pass Type
      </label>
      <select
        value={template.type}
        onChange={(e) => setTemplate({...template, type: e.target.value as PassType})}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        placeholder="Your Company Name"
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
      <div className="mt-1 flex items-center gap-4">
        <input
          type="color"
          value={template.design.colors.backgroundColor}
          onChange={(e) => setTemplate({
            ...template,
            design: {
              ...template.design,
              colors: {
                ...template.design.colors,
                backgroundColor: e.target.value
              }
            }
          })}
          className="h-10 w-20 rounded border border-gray-300"
        />
        <input
          type="text"
          value={template.design.colors.backgroundColor}
          onChange={(e) => setTemplate({
            ...template,
            design: {
              ...template.design,
              colors: {
                ...template.design.colors,
                backgroundColor: e.target.value
              }
            }
          })}
          className="flex-1 rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700">
        Text Color
      </label>
      <div className="mt-1 flex items-center gap-4">
        <input
          type="color"
          value={template.design.colors.foregroundColor}
          onChange={(e) => setTemplate({
            ...template,
            design: {
              ...template.design,
              colors: {
                ...template.design.colors,
                foregroundColor: e.target.value
              }
            }
          })}
          className="h-10 w-20 rounded border border-gray-300"
        />
        <input
          type="text"
          value={template.design.colors.foregroundColor}
          onChange={(e) => setTemplate({
            ...template,
            design: {
              ...template.design,
              colors: {
                ...template.design.colors,
                foregroundColor: e.target.value
              }
            }
          })}
          className="flex-1 rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700">
        Label Color
      </label>
      <div className="mt-1 flex items-center gap-4">
        <input
          type="color"
          value={template.design.colors.labelColor}
          onChange={(e) => setTemplate({
            ...template,
            design: {
              ...template.design,
              colors: {
                ...template.design.colors,
                labelColor: e.target.value
              }
            }
          })}
          className="h-10 w-20 rounded border border-gray-300"
        />
        <input
          type="text"
          value={template.design.colors.labelColor}
          onChange={(e) => setTemplate({
            ...template,
            design: {
              ...template.design,
              colors: {
                ...template.design.colors,
                labelColor: e.target.value
              }
            }
          })}
          className="flex-1 rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
    </div>
  </div>
)}
{activeTab === 'nfc' && (
  <div className="space-y-6">
    <div className="p-4 border rounded-md bg-gray-50">
      <div className="flex items-center justify-between mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Enable NFC
        </label>
        <div className="relative inline-block w-10 mr-2 align-middle select-none">
          <input
            type="checkbox"
            checked={template.nfc.enabled}
            onChange={(e) => updateNFCSettings({ enabled: e.target.checked })}
            className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
          />
        </div>
      </div>

      {template.nfc.enabled && (
        <>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              NFC Message
            </label>
            <input
              type="text"
              value={template.nfc.message}
              onChange={(e) => updateNFCSettings({ message: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Message displayed during NFC interaction"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="requireAuth"
                checked={template.nfc.requiresAuthentication}
                onChange={(e) => updateNFCSettings({ 
                  requiresAuthentication: e.target.checked,
                  accessControl: {
                    ...template.nfc.accessControl,
                    requiresAuthentication: e.target.checked
                  }
                })}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="requireAuth" className="ml-2 block text-sm text-gray-900">
                Require Authentication
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="requirePresence"
                checked={template.nfc.accessControl.requiresPresence}
                onChange={(e) => updateNFCSettings({
                  accessControl: {
                    ...template.nfc.accessControl,
                    requiresPresence: e.target.checked
                  }
                })}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="requirePresence" className="ml-2 block text-sm text-gray-900">
                Require Device Presence
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="unlockDevice"
                checked={template.nfc.accessControl.unlockDevice}
                onChange={(e) => updateNFCSettings({
                  accessControl: {
                    ...template.nfc.accessControl,
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

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">
              Encryption Public Key
            </label>
            <input
              type="text"
              value={template.nfc.encryptionPublicKey || ''}
              onChange={(e) => updateNFCSettings({ encryptionPublicKey: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Optional: Public key for NFC encryption"
            />
          </div>
        </>
      )}
    </div>
  </div>
)}

{activeTab === 'platforms' && (
  <div className="space-y-6">
    {/* Apple Wallet Settings */}
    <div className="border-b border-gray-200 pb-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Apple Wallet Settings</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Pass Type Identifier
          </label>
          <input
            type="text"
            value={template.platformSpecific.apple.passTypeIdentifier}
            onChange={(e) => setTemplate({
              ...template,
              platformSpecific: {
                ...template.platformSpecific,
                apple: {
                  ...template.platformSpecific.apple,
                  passTypeIdentifier: e.target.value
                }
              }
            })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="pass.com.yourcompany.type"
          />
          <p className="mt-1 text-sm text-gray-500">
            Format: pass.com.{'{company}'}.{'{type}'}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Team Identifier
          </label>
          <input
            type="text"
            value={template.platformSpecific.apple.teamIdentifier}
            onChange={(e) => setTemplate({
              ...template,
              platformSpecific: {
                ...template.platformSpecific,
                apple: {
                  ...template.platformSpecific.apple,
                  teamIdentifier: e.target.value
                }
              }
            })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Your Apple Developer Team ID"
          />
        </div>
      </div>
    </div>

    {/* Google Wallet Settings */}
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-4">Google Wallet Settings</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Issuer ID
          </label>
          <input
            type="text"
            value={template.platformSpecific.google.issuerId}
            onChange={(e) => setTemplate({
              ...template,
              platformSpecific: {
                ...template.platformSpecific,
                google: {
                  ...template.platformSpecific.google,
                  issuerId: e.target.value
                }
              }
            })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Google Wallet Issuer ID"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Class ID
          </label>
          <input
            type="text"
            value={template.platformSpecific.google.classId}
            onChange={(e) => setTemplate({
              ...template,
              platformSpecific: {
                ...template.platformSpecific,
                google: {
                  ...template.platformSpecific.google,
                  classId: e.target.value
                }
              }
            })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Pass Class Identifier"
          />
        </div>
      </div>
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
      className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
    >
      <Plus className="h-4 w-4 mr-1" />
      Add Field
    </button>
  </div>
  {template.structure.headerFields.map((field, index) => (
    <FieldInput
      key={index.toString()}
      field={field}
      index={index}
      category="headerFields"
      onUpdate={(category, index, key, value) => updateField(category, index, key, value)}
      onRemove={(index) => removeField('headerFields', index)}
    />
  ))}
</div>
      {template.structure.headerFields.map((field, index) => (
        <div key={index} className="flex gap-4 mb-4 items-start">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">Key</label>
            <input
              type="text"
              value={field.key}
              onChange={(e) => updateField('headerFields', index, 'key', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="unique_identifier"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">Label</label>
            <input
              type="text"
              value={field.label}
              onChange={(e) => updateField('headerFields', index, 'label', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Display Label"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">Value</label>
            <input
              type="text"
              value={field.value}
              onChange={(e) => updateField('headerFields', index, 'value', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Field Value"
            />
          </div>
          <button
            onClick={() => removeField('headerFields', index)}
            className="mt-6 p-2 text-red-600 hover:text-red-800"
            title="Remove field"
          >
            <Trash className="h-5 w-5" />
          </button>
        </div>
      ))}
    </div>

    {/* Primary Fields */}
    </div>
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">Primary Fields</h3>
        <button
          onClick={() => addField('primaryFields')}
          className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Field
        </button>
      </div>
      {/* Same structure as header fields */}
      {template.structure.primaryFields.map((field, index) => (
        <div key={index} className="flex gap-4 mb-4 items-start">
          {/* Same input structure as header fields */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">Key</label>
            <input
              type="text"
              value={field.key}
              onChange={(e) => updateField('primaryFields', index, 'key', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="unique_identifier"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">Label</label>
            <input
              type="text"
              value={field.label}
              onChange={(e) => updateField('primaryFields', index, 'label', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Display Label"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">Value</label>
            <input
              type="text"
              value={field.value}
              onChange={(e) => updateField('primaryFields', index, 'value', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Field Value"
            />
          </div>
          <button
            onClick={() => removeField('primaryFields', index)}
            className="mt-6 p-2 text-red-600 hover:text-red-800"
            title="Remove field"
          >
            <Trash className="h-5 w-5" />
          </button>
        </div>
      ))}
    </div>

    {/* Secondary Fields - similar structure */}
    {/* Auxiliary Fields - similar structure */}
    {/* Back Fields - similar structure */}
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-4">Pass Images</h3>
      <p className="text-sm text-gray-500 mb-6">
        Upload images for your pass. Images should be PNG format.
      </p>
    </div>

      {/* Logo Image */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Logo Image
        </label>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <Image className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label htmlFor="logo-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                    <span>Upload a file</span>
                    <input 
                      id="logo-upload" 
                      name="logo-upload" 
                      type="file" 
                      className="sr-only"
                      accept="image/png"
                      onChange={(e) => {
                        // Handle image upload
                        const file = e.target.files?.[0];
                        if (file) {
                          // Add image handling logic here
                        }
                      }}
                    />
                  </label>
                </div>
                <p className="text-xs text-gray-500">PNG up to 1MB</p>
              </div>
            </div>
          </div>
          {template.design.images.logo && (
            <div className="w-20 h-20 relative">
              <img 
                src={template.design.images.logo} 
                alt="Logo preview"
                className="w-full h-full object-contain"
              />
              <button
                onClick={() => setTemplate({
                  ...template,
                  design: {
                    ...template.design,
                    images: {
                      ...template.design.images,
                      logo: undefined
                    }
                  }
                })}
                className="absolute -top-2 -right-2 p-1 bg-red-100 rounded-full text-red-600 hover:bg-red-200"
              >
                <Trash className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Icon Image - Similar structure to Logo */}
      {/* Strip Image (for Apple Wallet) - Similar structure */}
      {/* Background Image (for Google Wallet) - Similar structure */}
    </div>
  </div>
</div> {/* <-- Ensure this closing tag matches the opening tag */}
{/* Secondary Fields */}
<div className="flex justify-between items-center mb-4">
    <h3 className="text-lg font-medium text-gray-900">Secondary Fields</h3>
</div>
{template?.structure?.secondaryFields?.map((field, index) => (
  <div key={index} className="flex gap-4 mb-4 items-start">
    <div className="flex-1">
      <label className="block text-sm font-medium text-gray-700">Key</label>
      <input
        type="text"
        value={field.key}
        onChange={(e) => updateField('secondaryFields', index, 'key', e.target.value)}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        placeholder="unique_identifier"
      />
    </div>
    <div className="flex-1">
      <label className="block text-sm font-medium text-gray-700">Label</label>
      <input
        type="text"
        value={field.label}
        onChange={(e) => updateField('secondaryFields', index, 'label', e.target.value)}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        placeholder="Display Label"
      />
    </div>
    <div className="flex-1">
      <label className="block text-sm font-medium text-gray-700">Value</label>
      <input
        type="text"
        value={field.value}
        onChange={(e) => updateField('secondaryFields', index, 'value', e.target.value)}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        placeholder="Field Value"
      />
    </div>
    <button
      onClick={() => removeField('secondaryFields', index)}
      className="mt-6 p-2 text-red-600 hover:text-red-800"
      title="Remove field"
    >
      <Trash className="h-5 w-5" />
    </button>
  </div>
))}

{/* Auxiliary Fields */}
<div>
  <div className="flex justify-between items-center mb-4">
    <div>
      <h3 className="text-lg font-medium text-gray-900">Auxiliary Fields</h3>
      <p className="text-sm text-gray-500">Additional information shown on the pass</p>
    </div>
    <button
      onClick={() => addField('auxiliaryFields')}
      className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
    >
      <Plus className="h-4 w-4 mr-1" />
      Add Field
    </button>
  </div>
  {template.structure.auxiliaryFields.map((field, index) => (
    <div key={index} className="flex gap-4 mb-4 items-start">
      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700">Key</label>
        <input
          type="text"
          value={field.key}
          onChange={(e) => updateField('auxiliaryFields', index, 'key', e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="unique_identifier"
        />
      </div>
      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700">Label</label>
        <input
          type="text"
          value={field.label}
          onChange={(e) => updateField('auxiliaryFields', index, 'label', e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="Display Label"
        />
      </div>
      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700">Value</label>
        <input
          type="text"
          value={field.value}
          onChange={(e) => updateField('auxiliaryFields', index, 'value', e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="Field Value"
        />
      </div>
      <button
        onClick={() => removeField('auxiliaryFields', index)}
        className="mt-6 p-2 text-red-600 hover:text-red-800"
        title="Remove field"
      >
        <Trash className="h-5 w-5" />
      </button>
    </div>
  ))}
</div>

{/* Back Fields */}
<div>
  <div className="flex justify-between items-center mb-4">
    <div>
      <h3 className="text-lg font-medium text-gray-900">Back Fields</h3>
      <p className="text-sm text-gray-500">Information shown on the back of the pass</p>
    </div>
    <button
      onClick={() => addField('backFields')}
      className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
    >
      <Plus className="h-4 w-4 mr-1" />
      Add Field
    </button>
  </div>
  {template?.structure?.backFields?.map((field, index) => (
    <div key={index} className="flex gap-4 mb-4 items-start">
      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700">Key</label>
        <input
          type="text"
          value={field.key}
          onChange={(e) => updateField('backFields', index, 'key', e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="unique_identifier"
        />
      </div>
      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700">Label</label>
        <input
          type="text"
          value={field.label}
          onChange={(e) => updateField('backFields', index, 'label', e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="Display Label"
        />
      </div>
      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700">Value</label>
        <input
          type="text"
          value={field.value}
          onChange={(e) => updateField('backFields', index, 'value', e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="Field Value"
        />
      </div>
      <button
        onClick={() => removeField('backFields', index)}
        className="mt-6 p-2 text-red-600 hover:text-red-800"
        title="Remove field"
      >
        <Trash className="h-5 w-5" />
      </button>
    </div>
  ))}
</div>

type FieldType = 'text' | 'date' | 'number' | 'phoneNumber' | 'email' | 'url';

const FieldInput = ({ 
  field, 
  index, 
  category,
  onUpdate,
  onRemove 
}: {
  field: any;
  index: number;
  category: keyof PassTemplate['structure'];
  onUpdate: (category: keyof PassTemplate['structure'], index: number, key: string, value: string) => void;
  onRemove: (index: number) => void;
}) => {
  return (
    <div className="flex gap-4 mb-4 items-start">
      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700">Key</label>
        <input
          type="text"
          value={field.key}
          onChange={(e) => onUpdate(category, index, 'key', e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="unique_identifier"
        />
      </div>

      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700">Label</label>
        <input
          type="text"
          value={field.label}
          onChange={(e) => onUpdate(category, index, 'label', e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="Display Label"
        />
      </div>

      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700">Type</label>
        <select
          value={field.type || 'text'}
          onChange={(e) => onUpdate(category, index, 'type', e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="text">Text</option>
          <option value="date">Date</option>
          <option value="number">Number</option>
          <option value="phoneNumber">Phone Number</option>
          <option value="email">Email</option>
          <option value="url">URL</option>
        </select>
      </div>

      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700">Value</label>
        {field.type === 'date' ? (
          <input
            type="datetime-local"
            value={field.value}
            onChange={(e) => onUpdate(category, index, 'value', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        ) : field.type === 'number' ? (
          <input
            type="number"
            value={field.value}
            onChange={(e) => onUpdate(category, index, 'value', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        ) : field.type === 'phoneNumber' ? (
          <input
            type="tel"
            value={field.value}
            onChange={(e) => onUpdate(category, index, 'value', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="+1 (234) 567-8900"
          />
        ) : field.type === 'email' ? (
          <input
            type="email"
            value={field.value}
            onChange={(e) => onUpdate(category, index, 'value', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="email@example.com"
          />
        ) : field.type === 'url' ? (
          <input
            type="url"
            value={field.value}
            onChange={(e) => onUpdate(category, index, 'value', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="https://example.com"
          />
        ) : (
          <input
            type="text"
            value={field.value.toString()}
            onChange={(e) => onUpdate(category, index, 'value', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Field Value"
          />
        )}
      </div>

      <div className="flex-none mt-6">
        <button
          onClick={() => onRemove(index)}
          className="p-2 text-red-600 hover:text-red-800"
          title="Remove field"
        >
          <Trash className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};
