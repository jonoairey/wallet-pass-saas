'use client';

import { useState } from 'react';
import { Plus, Search, Filter, MoreVertical } from 'lucide-react';
import Link from 'next/link';

export default function TemplatesPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const templates = [
    {
      id: '1',
      name: 'Corporate Access Card',
      type: 'CORPORATE_ACCESS',
      createdAt: '2024-01-15',
      status: 'active',
      totalPasses: 145,
    },
    {
      id: '2',
      name: 'VIP Event Pass',
      type: 'EVENT',
      createdAt: '2024-01-20',
      status: 'active',
      totalPasses: 89,
    },
    {
      id: '3',
      name: 'Loyalty Program Card',
      type: 'LOYALTY',
      createdAt: '2024-01-25',
      status: 'draft',
      totalPasses: 0,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Pass Templates</h1>
        <Link
          href="/dashboard/passes/templates/new"
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Template
        </Link>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
        </div>
        <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </button>
      </div>

      {/* Templates List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {templates.map((template) => (
            <li key={template.id}>
              <div className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <Link 
                      href={`/dashboard/passes/templates/${template.id}`}
                      className="text-lg font-medium text-indigo-600 hover:text-indigo-900"
                    >
                      {template.name}
                    </Link>
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      template.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {template.status}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <span className="mr-6">Type: {template.type}</span>
                    <span className="mr-6">Created: {template.createdAt}</span>
                    <span>Active Passes: {template.totalPasses}</span>
                  </div>
                </div>
                <div className="ml-4">
                  <button className="p-2 text-gray-400 hover:text-gray-600">
                    <MoreVertical className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}