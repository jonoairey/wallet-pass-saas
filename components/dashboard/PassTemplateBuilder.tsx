'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Layout,
  Palette,
  Settings,
  Smartphone,
} from 'lucide-react';

export interface PassTemplate {
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
    header: Array<{ label: string; value: string }>;
    primary: Array<{ label: string; value: string }>;
    secondary: Array<{ label: string; value: string }>;
  };
  nfc: {
    enabled: boolean;
    message: string;
    requiresAuthentication: boolean;
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

interface PassTemplateBuilderProps {
  mode?: 'create' | 'edit';
  templateId?: string;
  initialTemplate?: PassTemplate;
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

const PassTemplateBuilder: React.FC<PassTemplateBuilderProps> = ({ 
  mode = 'create', 
  templateId,
  initialTemplate 
}) => {
  const router = useRouter();
  const [template, setTemplate] = useState<PassTemplate>(initialTemplate || defaultTemplate);
  const [activeTab, setActiveTab] = useState<typeof tabs[number]['id']>('basic');

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-64 border-r bg-white">
        <nav className="space-y-1 p-4">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className="w-full flex items-center px-4 py-2 text-sm font-medium rounded-md"
            >
              <Icon className="h-5 w-5 mr-3" />
              {label}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <div className="p-6">
          <h1>Current Tab: {activeTab}</h1>
          <pre>{JSON.stringify(template, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
};

export default PassTemplateBuilder;
