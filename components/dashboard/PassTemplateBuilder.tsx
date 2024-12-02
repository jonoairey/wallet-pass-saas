'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Save, 
  Smartphone,
  Layout,
  Palette,
  Settings,
  Trash
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

interface PassField {
  label: string;
  value: string;

interface PassTemplate {
  name: string;
  description: string;
  type: 'generic' | 'eventTicket' | 'boardingPass' | 'storeCard';
  organizationName: string;
  colors: {
    background: string;
    foreground: string;
    label: string;
  };
  fields: {
    header: PassField[];
    primary: PassField[];
    secondary: PassField[];
  };
  nfc: {
    enabled: boolean;
    message: string;
    requiresAuthentication: boolean;
    requirePresence?: boolean;
    allowLocked?: boolean;
  };
  platformSettings: {
    apple: {
      passTypeIdentifier: string;
      teamIdentifier: string;
    };
    google: {
      issuerId: string;
      classId: string;
    };
  };
}

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
    requiresAuthentication: false,
  },
  platformSettings: {
    apple: {
      passTypeIdentifier: '',
      teamIdentifier: '',
    },
    google: {
      issuerId: '',
      classId: '',
    }
  }
};

const tabs = [
  { id: 'basic', label: 'Basic Info', icon: Layout },
  { id: 'design', label: 'Design & Fields', icon: Palette },
  { id: 'nfc', label: 'NFC', icon: Smartphone },
  { id: 'platforms', label: 'Platform Settings', icon: Settings }
] as const;

interface PassTemplateBuilderProps {
  mode?: 'create' | 'edit';
  templateId?: string;
}

// Component for rendering field sections
const FieldSection = ({ 
  section, 
  fields, 
  onUpdate, 
  onAdd, 
  onRemove 
}: { 
  section: keyof PassTemplate['fields'];
  fields: PassField[];
  onUpdate: (index: number, key: 'label' | 'value', value: string) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
}) => (
  <div className="space-y-4">
    <div className="flex justify-between items-center">
      <h3 className="text-lg font-medium text-gray-900 capitalize">{section} Fields</h3>
      <Button variant="outline" size="sm" onClick={onAdd}>Add Field</Button>
    </div>
    {fields.map((field, index) => (
      <div key={index} className="flex gap-4 items-start">
        <Input
          placeholder="Label"
          value={field.label}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onUpdate(index, 'label', e.target.value)}
        />
        <Input
          placeholder="Value"
          value={field.value}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onUpdate(index, 'value', e.target.value)}
        />
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => onRemove(index)}
          className="text-red-600 hover:text-red-800"
        >
          <Trash className="h-4 w-4" />
        </Button>
      </div>
    ))}
  </div>
);

export default function PassTemplateBuilder({ mode = 'create', templateId }: PassTemplateBuilderProps) {
  const router = useRouter();
  const [template, setTemplate] = useState<PassTemplate>(defaultTemplate);
  const [activeTab, setActiveTab] = useState<typeof tabs[number]['id']>('basic');
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  

  const updateTemplate = <K extends keyof PassTemplate>(
    key: K,
    value: PassTemplate[K]
  ) => {
    setTemplate(prev => ({ ...prev, [key]: value }));
  };

  const updateField = (
    section: keyof PassTemplate['fields'],
    index: number,
    key: 'label' | 'value',
    value: string
  ) => {
    setTemplate(prev => ({
      ...prev,
      fields: {
        ...prev.fields,
        [section]: prev.fields[section].map((field, i) =>
          i === index ? { ...field, [key]: value } : field
        )
      }
    }));
  };

  const addField = (section: keyof PassTemplate['fields']) => {
    setTemplate(prev => ({
      ...prev,
      fields: {
        ...prev.fields,
        [section]: [...prev.fields[section], { label: '', value: '' }]
      }
    }));
  };

  const removeField = (section: keyof PassTemplate['fields'], index: number) => {
    setTemplate(prev => ({
      ...prev,
      fields: {
        ...prev.fields,
        [section]: prev.fields[section].filter((_, i) => i !== index)
      }
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const url = mode === 'edit' ? `/api/templates/${templateId}` : '/api/templates';
      const response = await fetch(url, {
        method: mode === 'edit' ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(template),
      });

      if (!response.ok) throw new Error('Failed to save template');
      router.push('/dashboard/passes/templates');
    } catch (error) {
      console.error('Save error:', error);
      alert('Failed to save template');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-64 border-r bg-white">
        <nav className="space-y-1 p-4">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                activeTab === id
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Icon className="h-5 w-5 mr-3" />
              {label}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            <Card>
              <CardContent className="pt-6">
                {activeTab === 'basic' && (
                  <div className="space-y-6">
                    <Input
                      label="Template Name"
                      value={template.name}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateTemplate('name', e.target.value)}
                      placeholder="Corporate Access Pass"
                    />
                    <Textarea
                      label="Description"
                      value={template.description}
                      onChange={(e) => updateTemplate('description', e.target.value)}
                      placeholder="NFC-enabled pass for corporate access"
                    />
                    <Select
                      value={template.type}
                      onValueChange={(value: string) => updateTemplate('type', value as PassTemplate['type'])}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select pass type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="generic">Generic</SelectItem>
                        <SelectItem value="eventTicket">Event Ticket</SelectItem>
                        <SelectItem value="boardingPass">Boarding Pass</SelectItem>
                        <SelectItem value="storeCard">Store Card</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      label="Organization Name"
                      value={template.organizationName}
                      onChange={(e) => updateTemplate('organizationName', e.target.value)}
                      placeholder="Your Company Name"
                    />
                  </div>
                )}

                {activeTab === 'design' && (
                  <div className="space-y-8">
                    {/* Colors */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Colors</h3>
                      <div className="grid grid-cols-3 gap-4">
                        {Object.entries(template.colors).map(([key, value]) => (
                          <div key={key}>
                            <label className="block text-sm font-medium text-gray-700 capitalize">
                              {key}
                            </label>
                            <div className="mt-1 flex items-center gap-2">
                              <input
                                type="color"
                                value={value}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateTemplate('colors', {
                                  ...template.colors,
                                  [key]: e.target.value
                                })}
                                className="h-8 w-14 rounded border border-gray-300"
                              />
                              <Input
                                value={value}
                                onChange={(e) => updateTemplate('colors', {
                                  ...template.colors,
                                  [key]: e.target.value
                                })}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Fields */}
                    {(Object.keys(template.fields) as Array<keyof PassTemplate['fields']>).map((section) => (
                      <FieldSection
                        key={section}
                        section={section}
                        fields={template.fields[section]}
                        onUpdate={(index, key, value) => updateField(section, index, key, value)}
                        onAdd={() => addField(section)}
                        onRemove={(index) => removeField(section, index)}
                      />
                    ))}
                  </div>
                )}

                {activeTab === 'nfc' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium">Enable NFC</h3>
                        <p className="text-sm text-gray-500">Allow this pass to be used with NFC</p>
                      </div>
                      <Switch
                        checked={template.nfc.enabled}
                        onCheckedChange={(checked: boolean) => updateTemplate('nfc', {
                          ...template.nfc,
                          enabled: checked
                        })}
                      />
                    </div>

                    {template.nfc.enabled && (
                      <div className="space-y-6">
                        <Input
                          label="NFC Message"
                          value={template.nfc.message}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateTemplate('nfc', {
                            ...template.nfc,
                            message: e.target.value
                          })}
                          placeholder="Message displayed during NFC interaction"
                        />
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-sm font-medium">Require Authentication</h4>
                            <p className="text-sm text-gray-500">
                              Require user authentication before NFC access
                            </p>
                          </div>
                          <Switch
                            checked={template.nfc.requiresAuthentication}
                            onCheckedChange={(checked: boolean) => updateTemplate('nfc', {
                              ...template.nfc,
                              requiresAuthentication: checked
                            })}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'platforms' && (
                  <div className="space-y-8">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Apple Wallet Settings</h3>
                      <Input
                        label="Pass Type Identifier"
                        value={template.platformSettings.apple.passTypeIdentifier}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateTemplate('platformSettings', {
                          ...template.platformSettings,
                          apple: {
                            ...template.platformSettings.apple,
                            passTypeIdentifier: e.target.value
                          }
                        })}
                      />
                      <Input
                        label="Team Identifier"
                        value={template.platformSettings.apple.teamIdentifier}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateTemplate('platformSettings', {
                          ...template.platformSettings,
                          apple: {
                            ...template.platformSettings.apple,
                            teamIdentifier: e.target.value
                          }
                        })}
                      />
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Google Wallet Settings</h3>
                      <Input
                        label="Issuer ID"
                        value={template.platformSettings.google.issuerId}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateTemplate('platformSettings', {
                          ...template.platformSettings,
                          google: {
                            ...template.platformSettings.google,
                            issuerId: e.target.value
                          }
                        })}
                      />
                      <Input
                        label="Class ID"
                        value={template.platformSettings.google.classId}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateTemplate('platformSettings', {
                          ...template.platformSettings,
                          google: {
                            ...template.platformSettings.google,
                            classId: e.target.value
                          }
                        })}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Preview Content */}
              <div>
                <Card className="overflow-hidden">
                  <CardContent className="p-4">
                    {/* Pass Preview */}
                    <div 
                      className="rounded-lg shadow p-4"
                      style={{ backgroundColor: template.colors.background }}
                    >
                      {/* Organization Name */}
                      <div 
                        className="text-sm font-medium mb-4"
                        style={{ color: template.colors.label }}
                      >
                        {template.organizationName || 'Organization Name'}
                      </div>
              
                      {/* Header Fields */}
                      {template.fields.header.map((field, index) => (
                        <div key={index} className="mb-4">
                          <div 
                            className="text-xs"
                            style={{ color: template.colors.label }}
                          >
                            {field.label || 'Header Label'}
                          </div>
                          <div 
                            className="text-base font-medium"
                            style={{ color: template.colors.foreground }}
                          >
                            {field.value || 'Header Value'}
                          </div>
                        </div>
                      ))}
              
                      {/* Primary Fields */}
                      {template.fields.primary.map((field, index) => (
                        <div key={index} className="mb-3">
                          <div 
                            className="text-xs"
                            style={{ color: template.colors.label }}
                          >
                            {field.label || 'Primary Label'}
                          </div>
                          <div 
                            className="text-lg font-bold"
                            style={{ color: template.colors.foreground }}
                          >
                            {field.value || 'Primary Value'}
                          </div>
                        </div>
                      ))}
              
                      {/* Secondary Fields */}
                      <div className="grid grid-cols-2 gap-4">
                        {template.fields.secondary.map((field, index) => (
                          <div key={index}>
                            <div 
                              className="text-xs"
                              style={{ color: template.colors.label }}
                            >
                              {field.label || 'Secondary Label'}
                            </div>
                            <div 
                              className="text-sm"
                              style={{ color: template.colors.foreground }}
                            >
                              {field.value || 'Secondary Value'}
                            </div>
                          </div>
                        ))}
                      </div>
              
                      {/* NFC Indicator */}
                      {template.nfc.enabled && (
                        <div className="mt-4 flex items-center gap-2">
                          <Smartphone className="h-4 w-4" style={{ color: template.colors.label }} />
                          <span className="text-xs" style={{ color: template.colors.label }}>
                            NFC Enabled
                          </span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      }

        {/* Footer */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
          <div className="flex justify-between items-center max-w-7xl mx-auto px-4">
            <Button
              variant="ghost"
              onClick={() => setShowPreview(!showPreview)}
            >
              {showPreview ? 'Hide Preview' : 'Show Preview'}
            </Button>

            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => router.push('/dashboard/passes/templates')}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={saving}
              >
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Saving...' : mode === 'edit' ? 'Save Changes' : 'Create Template'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}