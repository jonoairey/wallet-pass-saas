'use client';

import { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';

interface EditTemplatePanelProps {
  template: any;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedTemplate: any) => void;
}

export default function EditTemplatePanel({ template, isOpen, onClose, onSave }: EditTemplatePanelProps) {
  const [formData, setFormData] = useState(template);
  const [activeTab, setActiveTab] = useState('basic');

  useEffect(() => {
    setFormData(template);
  }, [template]);

  const tabs = [
    { id: 'basic', label: 'Basic Info' },
    { id: 'design', label: 'Design' },
    { id: 'fields', label: 'Fields' },
    { id: 'barcode', label: 'Barcode' },
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className={`fixed inset-0 overflow-hidden ${isOpen ? 'z-50' : 'hidden'}`}>
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />
        
        <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
          <div className="w-screen max-w-md">
            <div className="h-full divide-y divide-gray-200 flex flex-col bg-white shadow-xl">
              {/* Header */}
              <div className="px-4 py-6 sm:px-6">
                <div className="flex items-start justify-between">
                  <h2 className="text-lg font-medium text-gray-900">Edit Template</h2>
                  <button
                    type="button"
                    className="rounded-md text-gray-400 hover:text-gray-500"
                    onClick={onClose}
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>

              {/* Tabs */}
              <div className="border-b border-gray-200">
                <nav className="px-4 -mb-px flex space-x-8">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === tab.id
                          ? 'border-indigo-500 text-indigo-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto">
                <form onSubmit={handleSave} className="divide-y divide-gray-200">
                  <div className="px-4 py-6 sm:px-6 space-y-6">
                    {activeTab === 'basic' && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Template Name
                          </label>
                          <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Description
                          </label>
                          <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                            rows={3}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Organization Name
                          </label>
                          <input
                            type="text"
                            value={formData.organizationName}
                            onChange={(e) => setFormData({...formData, organizationName: e.target.value})}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          />
                        </div>
                      </>
                    )}

                    {activeTab === 'design' && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Primary Color
                          </label>
                          <input
                            type="color"
                            value={formData.primaryColor}
                            onChange={(e) => setFormData({...formData, primaryColor: e.target.value})}
                            className="mt-1 block w-full h-10 p-1 rounded-md border border-gray-300"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Background Color
                          </label>
                          <input
                            type="color"
                            value={formData.backgroundColor}
                            onChange={(e) => setFormData({...formData, backgroundColor: e.target.value})}
                            className="mt-1 block w-full h-10 p-1 rounded-md border border-gray-300"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Text Color
                          </label>
                          <input
                            type="color"
                            value={formData.textColor}
                            onChange={(e) => setFormData({...formData, textColor: e.target.value})}
                            className="mt-1 block w-full h-10 p-1 rounded-md border border-gray-300"
                          />
                        </div>
                      </>
                    )}

                    {activeTab === 'fields' && (
                      <div className="space-y-6">
                        {/* Header Fields */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Header Fields
                          </label>
                          {formData.headerFields.map((field: any, index: number) => (
                            <div key={index} className="flex gap-2 mb-2">
                              <input
                                type="text"
                                placeholder="Label"
                                value={field.label}
                                onChange={(e) => {
                                  const newFields = [...formData.headerFields];
                                  newFields[index].label = e.target.value;
                                  setFormData({...formData, headerFields: newFields});
                                }}
                                className="flex-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                              />
                              <input
                                type="text"
                                placeholder="Value"
                                value={field.value}
                                onChange={(e) => {
                                  const newFields = [...formData.headerFields];
                                  newFields[index].value = e.target.value;
                                  setFormData({...formData, headerFields: newFields});
                                }}
                                className="flex-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                              />
                            </div>
                          ))}
                        </div>

                        {/* Primary Fields */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Primary Fields
                          </label>
                          {formData.primaryFields.map((field: any, index: number) => (
                            <div key={index} className="flex gap-2 mb-2">
                              <input
                                type="text"
                                placeholder="Label"
                                value={field.label}
                                onChange={(e) => {
                                  const newFields = [...formData.primaryFields];
                                  newFields[index].label = e.target.value;
                                  setFormData({...formData, primaryFields: newFields});
                                }}
                                className="flex-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                              />
                              <input
                                type="text"
                                placeholder="Value"
                                value={field.value}
                                onChange={(e) => {
                                  const newFields = [...formData.primaryFields];
                                  newFields[index].value = e.target.value;
                                  setFormData({...formData, primaryFields: newFields});
                                }}
                                className="flex-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {activeTab === 'barcode' && (
                      <div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Barcode Message
                          </label>
                          <input
                            type="text"
                            value={formData.barcodeMessage}
                            onChange={(e) => setFormData({...formData, barcodeMessage: e.target.value})}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </form>
              </div>

              {/* Footer */}
              <div className="flex-shrink-0 px-4 py-4 flex justify-end space-x-2">
                <button
                  type="button"
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 border border-gray-300 rounded-md"
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}