import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { validatePassTemplate, validateFields } from '@/utils/passValidation';
import { PassTemplate, PassType, BarcodeFormat, NFCSettings, PassField } from '@/types/pass';
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
  initialTemplate?: PassTemplate;
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
  const [fieldErrors, setFieldErrors] = useState<{
    [key: string]: { index: number; field: string; message: string }[]
  }>({
    headerFields: [],
    primaryFields: [],
    secondaryFields: [],
    auxiliaryFields: [],
  });
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
    { id: 'platforms', label: 'Platforms', icon: Settings }
  ];

  const validateAllFields = (): boolean => {
    const newFieldErrors: typeof fieldErrors = {
      headerFields: validateFields(template.structure.headerFields, 'header'),
      primaryFields: validateFields(template.structure.primaryFields, 'primary'),
      secondaryFields: validateFields(template.structure.secondaryFields, 'secondary'),
      auxiliaryFields: validateFields(template.structure.auxiliaryFields, 'auxiliary'),
    };
    setFieldErrors(newFieldErrors);

    return Object.values(newFieldErrors).every(errors => errors.length === 0);
  };

  const handleSave = async () => {
    if (!validateAllFields()) {
      setErrors(['Please fix field validation errors before saving']);
      return;
    }

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
        const data = await
