'use client';

import { useState } from 'react';
import { Plus, Search, Filter, MoreVertical, Edit, Trash2, Eye } from 'lucide-react';
import Link from 'next/link';

// Temporary sample data - will be replaced with database data
const templates = [
  {
    id: '1',
    name: 'Corporate Access Card',
    type: 'CORPORATE_ACCESS',
    createdAt: '2024-01-15',
    status: 'active',
    totalPasses: 145,
    description: 'Employee access card with NFC capabilities',
  },
  {
    id: '2',
    name: 'VIP Event Pass',
    type: 'EVENT',
    createdAt: '2024-01-20',
    status: 'active',
    totalPasses: 89,
    description: 'NFC-enabled event access pass',
  },
  {
    id: '3',
    name: 'Smart Loyalty Card',
    type: 'LOYALTY',
    createdAt: '2024-01-25',
    status: 'draft',
    totalPasses: 0,
    description: 'Digital loyalty card with NFC rewards',
  },
];

export default function TemplatesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || template.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 p-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pass Templates</h1>
          <p className="mt-1 text-sm text-gray-500">Create and manage your pass templates</p>
        </div>
        <Link
          href="/dashboard/passes/templates/new"
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Template
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="block w-40 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredTemplates.map((template) => (
          <div
            key={template.id}
            className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    <Link href={`/dashboard/passes/templates/${template.id}`} className="hover:text-indigo-600">
                      {template.name}
                    </Link>
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">{template.description}</p>
                </div>
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  template.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {template.status}
                </span>
              </div>
              <div className="mt-4 flex justify-between items-center">
                <div className="flex space-x-2 text-sm text-gray-500">
                  <span>{template.type}</span>
                  <span>•</span>
                  <span>{template.totalPasses} passes</span>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => window.location.href = `/dashboard/passes/templates/${template.id}/edit`}
                    className="p-1 text-gray-400 hover:text-indigo-600"
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this template?')) {
                        // Add delete logic here
                        console.log('Deleting template:', template.id);
                      }
                    }}
                    className="p-1 text-gray-400 hover:text-red-600"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <h3 className="mt-2 text-sm font-medium text-gray-900">No templates found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchQuery ? 'Try adjusting your search terms.' : 'Get started by creating a new template.'}
          </p>
        </div>
      )}
    </div>
  );
}