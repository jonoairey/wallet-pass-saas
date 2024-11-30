'use client';

import { useState } from 'react';
import { Wallet, Box, Layers } from 'lucide-react';
import Link from 'next/link';

export default function PassManagementPage() {
  const sections = [
    {
      title: 'Pass Templates',
      description: 'Create and manage your pass templates',
      icon: Box,
      link: '/dashboard/passes/templates',
      count: 5
    },
    {
      title: 'Active Passes',
      description: 'View and manage all active passes',
      icon: Wallet,
      link: '/dashboard/passes/active',
      count: 1234
    },
    {
      title: 'Pass Groups',
      description: 'Organize passes into groups',
      icon: Layers,
      link: '/dashboard/passes/groups',
      count: 8
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Pass Management</h1>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <Link 
              key={section.title}
              href={section.link}
              className="block p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="p-2 bg-indigo-50 rounded-lg">
                  <Icon className="w-6 h-6 text-indigo-600" />
                </div>
                <span className="text-2xl font-semibold text-gray-900">{section.count}</span>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">{section.title}</h3>
              <p className="mt-1 text-sm text-gray-500">{section.description}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}