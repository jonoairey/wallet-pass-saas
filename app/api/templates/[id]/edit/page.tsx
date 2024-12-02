'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PassTemplateBuilder, { PassTemplate } from '@/components/dashboard/PassTemplateBuilder';

interface Template {
  id: string;
  name: string;
  description: string;
  type: string;
  status: string;
  configuration: PassTemplate;
  organizationId: string;
  createdAt: string;
  updatedAt: string;
}

export default function EditTemplatePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [template, setTemplate] = useState<Template | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTemplate();
  }, [params.id]);

  const fetchTemplate = async () => {
    try {
      const response = await fetch(`/api/templates/${params.id}`);
      if (!response.ok) {
        throw new Error('Template not found');
      }
      const data = await response.json();
      setTemplate(data);
    } catch (error) {
      setError('Failed to load template');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-red-600">{error}</p>
        <button
          onClick={() => router.push('/dashboard/passes/templates')}
          className="mt-4 text-indigo-600 hover:text-indigo-800"
        >
          Return to Templates
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-6">
        <h1 className="text-2xl font-bold text-gray-900">Edit Template</h1>
        <p className="mt-1 text-sm text-gray-500">
          Modify your pass template configuration
        </p>
      </div>
      {template && (
        <PassTemplateBuilder
          initialTemplate={template.configuration}
          mode="edit"
          templateId={params.id}
        />
      )}
    </div>
  );
}