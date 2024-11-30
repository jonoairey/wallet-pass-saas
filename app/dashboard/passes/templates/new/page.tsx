'use client';

import PassTemplateBuilder from '@/components/dashboard/PassTemplateBuilder';
import PassPreview from '@/components/dashboard/PassPreview';

export default function NewTemplatePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-6">
        <h1 className="text-2xl font-bold text-gray-900">Create New Template</h1>
        <p className="mt-1 text-sm text-gray-500">Design your pass template with NFC capabilities</p>
      </div>
      <PassTemplateBuilder />
    </div>
  );
}