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
  initialTemplate?: UniversalPassTemplate;
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

const defaultTemplate: UniversalPassTemplate = {
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
  nfc: {
    enabled: false,
    message: '',
    requiresAuthentication: false,
    accessControl: {
      requiresAuthentication: false,
      requiresPresence: false,
      unlockDevice: false
    }
  },
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
  }
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

  const handleTemplateSave = async () => {
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
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
      >
        <option value="generic">Generic</option>
        <option value="eventTicket">Event Ticket</option>
        <option value="boardingPass">Boarding Pass</option>
        <option value="coupon">Coupon</option>
        <option value="storeCard">Store Card</option>
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
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
            onChange={(e) => setTemplate({
              ...template,
              nfc: {
                ...template.nfc,
                enabled: e.target.checked
              }
            })}
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
              onChange={(e) => setTemplate({
                ...template,
                nfc: {
                  ...template.nfc,
                  message: e.target.value
                }
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Message displayed during NFC interaction"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={template.nfc.requiresAuthentication}
                onChange={(e) => setTemplate({
                  ...template,
                  nfc: {
                    ...template.nfc,
                    requiresAuthentication: e.target.checked
                  }
                })}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-900">
                Require Authentication
              </label>
            </div>
          </div>
        </>
      )}
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
          onClick={() => {
            setTemplate({
              ...template,
              structure: {
                ...template.structure,
                headerFields: [
                  ...template.structure.headerFields,
                  { key: '', label: '', value: '' }
                ]
              }
            });
          }}
          className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
        >
          Add Field
        </button>
      </div>
      {template.structure.headerFields.map((field: { key: string; label: string; value: string }, index: number) => (
        <div key={index} className="flex gap-4 mb-4 items-start">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">Label</label>
            <input
              type="text"
              value={field.label}
              onChange={(e) => {
                const newFields = [...template.structure.headerFields];
                newFields[index] = { ...field, label: e.target.value };
                setTemplate({
                  ...template,
                  structure: {
                    ...template.structure,
                    headerFields: newFields
                  }
                });
              }}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">Value</label>
            <input
              type="text"
              value={field.value}
              onChange={(e) => {
                const newFields = [...template.structure.headerFields];
                newFields[index] = { ...field, value: e.target.value };
                setTemplate({
                  ...template,
                  structure: {
                    ...template.structure,
                    headerFields: newFields
                  }
                });
              }}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <button
            onClick={() => {
              const newFields = template.structure.headerFields.filter((field: { key: string; label: string; value: string }, i: number) => i !== index);
              setTemplate({
                ...template,
                structure: {
                  ...template.structure,
                  headerFields: newFields
                }
              });
            }}
            className="mt-6 p-2 text-red-600 hover:text-red-800"
          >
            <Trash className="h-5 w-5" />
          </button>
        </div>
      ))}
    </div>

    {/* Primary Fields */}
    {/* Similar structure to Header Fields */}
    {/* Primary Fields */}
<div>
  <div className="flex justify-between items-center mb-4">
    <h3 className="text-lg font-medium text-gray-900">Primary Fields</h3>
    <button
      onClick={() => {
        setTemplate({
          ...template,
          structure: {
            ...template.structure,
            primaryFields: [
              ...template.structure.primaryFields,
              { key: '', label: '', value: '' }
            ]
          }
        });
      }}
      className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
    >
      Add Field
    </button>
  </div>
  {template.structure.primaryFields.map((field: { key: string; label: string; value: string }, index: number) => (
    <div key={index} className="flex gap-4 mb-4 items-start">
      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700">Label</label>
        <input
          type="text"
          value={field.label}
          onChange={(e) => {
            const newFields = [...template.structure.primaryFields];
            newFields[index] = { ...field, label: e.target.value };
            setTemplate({
              ...template,
              structure: {
                ...template.structure,
                primaryFields: newFields
              }
            });
          }}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700">Value</label>
        <input
          type="text"
          value={field.value}
          onChange={(e) => {
            const newFields = [...template.structure.primaryFields];
            newFields[index] = { ...field, value: e.target.value };
            setTemplate({
              ...template,
              structure: {
                ...template.structure,
                primaryFields: newFields
              }
            });
          }}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      <button
        onClick={() => {
          const newFields = template.structure.primaryFields.filter((field: { key: string; label: string; value: string }, i: number) => i !== index);
          setTemplate({
            ...template,
            structure: {
              ...template.structure,
              primaryFields: newFields
            }
          });
        }}
        className="mt-6 p-2 text-red-600 hover:text-red-800"
      >
        <Trash className="h-5 w-5" />
      </button>
    </div>
  ))}
</div>

{/* Secondary Fields */}
<div>
  <div className="flex justify-between items-center mb-4">
    <h3 className="text-lg font-medium text-gray-900">Secondary Fields</h3>
    <button
      onClick={() => {
        setTemplate({
          ...template,
          structure: {
            ...template.structure,
            secondaryFields: [
              ...template.structure.secondaryFields,
              { key: '', label: '', value: '' }
            ]
          }
        });
      }}
      className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
    >
      Add Field
    </button>
  </div>
  {template.structure.secondaryFields.map((field: { key: string; label: string; value: string }, index: number) => (
    <div key={index} className="flex gap-4 mb-4 items-start">
      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700">Label</label>
        <input
          type="text"
          value={field.label}
          onChange={(e) => {
            const newFields = [...template.structure.secondaryFields];
            newFields[index] = { ...field, label: e.target.value };
            setTemplate({
              ...template,
              structure: {
                ...template.structure,
                secondaryFields: newFields
              }
            });
          }}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700">Value</label>
        <input
          type="text"
          value={field.value}
          onChange={(e) => {
            const newFields = [...template.structure.secondaryFields];
            newFields[index] = { ...field, value: e.target.value };
            setTemplate({
              ...template,
              structure: {
                ...template.structure,
                secondaryFields: newFields
              }
            });
          }}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      <button
        onClick={() => {
          const newFields = template.structure.secondaryFields.filter((field: { key: string; label: string; value: string }, i: number) => i !== index);
          setTemplate({
            ...template,
            structure: {
              ...template.structure,
              secondaryFields: newFields
            }
          });
        }}
        className="mt-6 p-2 text-red-600 hover:text-red-800"
      >
        <Trash className="h-5 w-5" />
      </button>
    </div>
  ))}
</div>

{/* Auxiliary Fields */}
<div>
  <div className="flex justify-between items-center mb-4">
    <h3 className="text-lg font-medium text-gray-900">Auxiliary Fields</h3>
    <button
      onClick={() => {
        setTemplate({
          ...template,
          structure: {
            ...template.structure,
            auxiliaryFields: [
              ...template.structure.auxiliaryFields,
              { key: '', label: '', value: '' }
            ]
          }
        });
      }}
      className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
    >
      Add Field
    </button>
  </div>
  {template.structure.auxiliaryFields.map((field: { key: string; label: string; value: string }, index: number) => (
    <div key={index} className="flex gap-4 mb-4 items-start">
      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700">Label</label>
        <input
          type="text"
          value={field.label}
          onChange={(e) => {
            const newFields = [...template.structure.auxiliaryFields];
            newFields[index] = { ...field, label: e.target.value };
            setTemplate({
              ...template,
              structure: {
                ...template.structure,
                auxiliaryFields: newFields
              }
            });
          }}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700">Value</label>
        <input
          type="text"
          value={field.value}
          onChange={(e) => {
            const newFields = [...template.structure.auxiliaryFields];
            newFields[index] = { ...field, value: e.target.value };
            setTemplate({
              ...template,
              structure: {
                ...template.structure,
                auxiliaryFields: newFields
              }
            });
          }}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      <button
        onClick={() => {
          const newFields = template.structure.auxiliaryFields.filter((field: { key: string; label: string; value: string }, i: number) => i !== index);
          setTemplate({
            ...template,
            structure: {
              ...template.structure,
              auxiliaryFields: newFields
            }
          });
        }}
        className="mt-6 p-2 text-red-600 hover:text-red-800"
      >
        <Trash className="h-5 w-5" />
      </button>
    </div>
  ))}
</div>
  </div>
)}

{activeTab === 'platforms' && (
  <div className="space-y-6">
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

{activeTab === 'barcode' && (
  <div className="space-y-6">
    <div>
      <label className="block text-sm font-medium text-gray-700">
        Barcode Format
      </label>
      <select
        value={template.barcode.format}
        onChange={(e) => setTemplate({
          ...template,
          barcode: {
            ...template.barcode,
            format: e.target.value as BarcodeFormat
          }
        })}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
        value={template.barcode.message}
        onChange={(e) => setTemplate({
          ...template,
          barcode: {
            ...template.barcode,
            message: e.target.value
          }
        })}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        placeholder="Enter barcode content"
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700">
        Alternative Text
      </label>
      <input
        type="text"
        value={template.barcode.alternativeText || ''}
        onChange={(e) => setTemplate({
          ...template,
          barcode: {
            ...template.barcode,
            alternativeText: e.target.value
          }
        })}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        placeholder="Text displayed below barcode"
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
            onClick={() => handleSave()}
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
  // Add this function to validate fields before saving
  const validateAllFields = (): boolean => {
    const headerErrors = validateFields(template.structure.headerFields, 'header');
    const primaryErrors = validateFields(template.structure.primaryFields, 'primary');
    const secondaryErrors = validateFields(template.structure.secondaryFields, 'secondary');
    const auxiliaryErrors = validateFields(template.structure.auxiliaryFields, 'auxiliary');
    setFieldErrors({
      headerFields: headerErrors,
      primaryFields: primaryErrors,
      secondaryFields: secondaryErrors,
      auxiliaryFields: auxiliaryErrors,
    });
  
    return (
      headerErrors.length === 0 &&
      primaryErrors.length === 0 &&
      secondaryErrors.length === 0 &&
      auxiliaryErrors.length === 0
    );
  };
  
  // Update the save handler
  const handleSave = async () => {
    if (!validateAllFields()) {
      // Show error message
      console.error('Please fix field validation errors before saving');
      return;
    }
    // ... rest of your save logic
  };
  
  // Update the field input to show validation errors
  const renderFieldInput = (
    fieldType: keyof typeof template.structure,
    field: PassField,
    index: number,
    fieldErrors: { [key in keyof typeof template.structure]: { index: number; field: string; message: string }[] }
  ) => {
    const errors = fieldErrors[fieldType].filter((error: { index: number; field: string; message: string }) => error.index === index);
    
    return (
      <div key={index} className="flex gap-4 mb-4 items-start">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700">Key</label>
          <input
            type="text"
            value={field.key}
            onChange={(e) => {
              const newFields = [...template.structure[fieldType]];
              newFields[index] = { ...field, key: e.target.value };
              setTemplate({
                ...template,
                structure: {
                  ...template.structure,
                  [fieldType]: newFields
                }
              });
            }}
            className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
              errors.some(e => e.field === 'key')
                ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
            }`}
          />
          {errors.map((error, i) => 
            error.field === 'key' && (
              <p key={i} className="mt-1 text-sm text-red-600">
                {error.message}
              </p>
            )
          )}
        </div>
  
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700">Label</label>
          <input
            type="text"
            value={field.label}
            onChange={(e) => {
              const newFields = [...template.structure[fieldType]];
              newFields[index] = { ...field, label: e.target.value };
              setTemplate({
                ...template,
                structure: {
                  ...template.structure,
                  [fieldType]: newFields
                }
              });
            }}
            className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
              errors.some(e => e.field === 'label')
                ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
            }`}
          />
          {errors.map((error, i) => 
            error.field === 'label' && (
              <p key={i} className="mt-1 text-sm text-red-600">
                {error.message}
              </p>
            )
          )}
        </div>
  
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700">Value</label>
          <input
            type="text"
            value={field.value}
            onChange={(e) => {
              const newFields = [...template.structure[fieldType]];
              newFields[index] = { ...field, value: e.target.value };
              setTemplate({
                ...template,
                structure: {
                  ...template.structure,
                  [fieldType]: newFields
                }
              });
            }}
            className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
              errors.some(e => e.field === 'value')
                ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
            }`}
          />
          {errors.map((error, i) => 
            error.field === 'value' && (
              <p key={i} className="mt-1 text-sm text-red-600">
                {error.message}
              </p>
            )
          )}
        </div>
  
        <button
          onClick={() => {
            const newFields = template.structure[fieldType].filter((field: any, i: number) => i !== index);
            setTemplate((prevTemplate: typeof template) => ({
              ...prevTemplate,
              structure: {
                ...prevTemplate.structure,
                [fieldType]: newFields
              }
            }));
          }}
          className="mt-6 p-2 text-red-600 hover:text-red-800"
        >
          <Trash className="h-5 w-5" />
        </button>
      </div>
    );
  }
  export default PassTemplateBuilder;
