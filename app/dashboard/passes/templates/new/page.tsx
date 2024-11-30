'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Save,
  Image,
  Type,
  Palette,
  Barcode,
  MapPin,
  Bell,
  Settings,
  Smartphone
} from 'lucide-react';
import PassPreview from '@/components/dashboard/PassPreview';

interface FormData {
  name: string;
  description: string;
  passType: string;
  organizationName: string;
  teamIdentifier: string;
  passTypeIdentifier: string;
  primaryColor: string;
  secondaryColor: string;
  textColor: string;
  labelColor: string;
  backgroundColor: string;
  headerFields: Array<{ key: string; label: string; value: string }>;
  primaryFields: Array<{ key: string; label: string; value: string }>;
  secondaryFields: Array<{ key: string; label: string; value: string }>;
  auxiliaryFields: Array<{ key: string; label: string; value: string }>;
  backFields: Array<{ key: string; label: string; value: string }>;
  barcodeType: string;
  barcodeMessage: string;
  barcodeFormat: string;
  barcodeAltText: string;
  locations: Array<{ longitude: string; latitude: string; relevantText: string }>;
  maxDistance: number;
  expiryDate: string;
  relevantDate: string;
  notifications: {
    expiry: boolean;
    updates: boolean;
    location: boolean;
  };
  sharingEnabled: boolean;
  nfcEnabled: boolean;
  webServiceURL: string;
  authenticationToken: string;
  voided: boolean;
}

export default function NewTemplatePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('basic');
  const [previewMode, setPreviewMode] = useState<'front' | 'back'>('front');

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: Type },
    { id: 'design', label: 'Design', icon: Palette },
    { id: 'images', label: 'Images', icon: Image },
    { id: 'barcode', label: 'Barcode', icon: Barcode },
    { id: 'location', label: 'Location', icon: MapPin },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const [formData, setFormData] = useState<FormData>({
    // Basic Info
    name: '',
    description: '',
    passType: 'generic',
    organizationName: '',
    teamIdentifier: '',
    passTypeIdentifier: '',

    // Design
    primaryColor: '#000000',
    secondaryColor: '#ffffff',
    textColor: '#000000',
    labelColor: '#666666',
    backgroundColor: '#ffffff',

    // Pass Structure
    headerFields: [{ key: '', label: '', value: '' }],
    primaryFields: [{ key: '', label: '', value: '' }],
    secondaryFields: [{ key: '', label: '', value: '' }],
    auxiliaryFields: [{ key: '', label: '', value: '' }],
    backFields: [{ key: '', label: '', value: '' }],

    // Barcode
    barcodeType: 'qr',
    barcodeMessage: '',
    barcodeFormat: 'PKBarcodeFormatQR',
    barcodeAltText: '',

    // Location
    locations: [{ longitude: '', latitude: '', relevantText: '' }],
    maxDistance: 0,

    // Notifications
    expiryDate: '',
    relevantDate: '',
    notifications: {
      expiry: true,
      updates: true,
      location: true
    },

    // Settings
    sharingEnabled: true,
    nfcEnabled: true,
    webServiceURL: '',
    authenticationToken: '',
    voided: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Submit logic here
    console.log('Form data:', formData);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex justify-between items-center px-6 py-4 bg-white border-b">
        <h1 className="text-2xl font-bold">Create New Pass Template</h1>
        <div className="flex gap-4">
          <button 
            onClick={() => setPreviewMode(previewMode === 'front' ? 'back' : 'front')}
            className="px-4 py-2 text-gray-700 border rounded-md hover:bg-gray-50"
          >
            {previewMode === 'front' ? 'Show Back' : 'Show Front'}
          </button>
          <button
            onClick={handleSubmit}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Template
          </button>
        </div>
      </div>

      <div className="flex h-[calc(100vh-73px)]">
        {/* Left Sidebar - Configuration */}
        <div className="w-80 border-r bg-white overflow-y-auto">
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

        {/* Main Content - Form Fields */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'basic' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Template Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Pass Type</label>
                <select
                  value={formData.passType}
                  onChange={(e) => setFormData({...formData, passType: e.target.value})}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="generic">Generic</option>
                  <option value="eventTicket">Event Ticket</option>
                  <option value="boardingPass">Boarding Pass</option>
                  <option value="storeCard">Store Card</option>
                  <option value="coupon">Coupon</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar - Preview */}
        <div className="w-96 border-l bg-gray-100 p-4">
          <PassPreview 
            mode={previewMode} 
            data={formData}
          />
        </div>
      </div>
    </div>
  );
}