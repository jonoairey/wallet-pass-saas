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
}

const PassTemplateBuilder: React.FC<PassTemplateBuilderProps> = ({ initialTemplate, mode }) => {
  const [template, setTemplate] = useState<PassTemplate>(initialTemplate || { /* initial state */ });
  const router = useRouter();

  const addField = (fieldType: string) => {
    setTemplate((prevTemplate) => ({
      ...prevTemplate,
      structure: {
        ...prevTemplate.structure,
        [fieldType]: [...prevTemplate.structure[fieldType], { /* new field data */ }],
      },
    }));
  };

  const removeField = (fieldType: string, index: number) => {
    setTemplate((prevTemplate) => ({
      ...prevTemplate,
      structure: {
        ...prevTemplate.structure,
        [fieldType]: prevTemplate.structure[fieldType].filter((_, i) => i !== index),
      },
    }));
  };

  return (
    <div className="flex flex-col h-full">
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
        <div key={index} className="flex gap-4 mb-4 items-start">
          {/* Input structure for header fields */}
          <button
            onClick={() => removeField('headerFields', index)}
            className="mt-6 p-2 text-red-600 hover:text-red-800"
            title="Remove field"
          >
            <Trash className="h-5 w-5" />
          </button>
        </div>
      ))}

      {/* Main Content Area */}
      <div className="flex-1 flex">
        {/* Form Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Your form content here */}
        </div>
      </div>
    </div>
  );
};

export default PassTemplateBuilder;
