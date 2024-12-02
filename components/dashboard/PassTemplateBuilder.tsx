'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Layout,
  Palette,
  Settings,
  Smartphone,
} from 'lucide-react';

interface PassTemplateBuilderProps {
  mode?: 'create' | 'edit';
  templateId?: string;
}

const tabs = [
  { id: 'basic', label: 'Basic Info', icon: Layout },
  { id: 'design', label: 'Design & Fields', icon: Palette },
  { id: 'nfc', label: 'NFC', icon: Smartphone },
  { id: 'platforms', label: 'Platform Settings', icon: Settings }
] as const;

const PassTemplateBuilder: React.FC<PassTemplateBuilderProps> = ({ mode = 'create', templateId }) => {
  const router = useRouter();
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
        </div>
      </div>
    </div>
  );
};

export default PassTemplateBuilder;
