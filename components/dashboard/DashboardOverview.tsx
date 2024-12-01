'use client';

import React from 'react';
import { 
  CreditCard, 
  Users, 
  ArrowUpRight,
  ArrowDownRight,
  Activity
} from 'lucide-react';

interface Template {
  id: string;
  name: string;
  description: string;
  type: string;
  status: string;
  configuration: any;
}

interface DashboardOverviewProps {
  templates: Template[];
}

export default function DashboardOverview({ templates }: DashboardOverviewProps) {
  const stats = [
    {
      name: 'Total Active Passes',
      value: templates.length.toString(),
      change: '+12.3%',
      trend: 'up',
      icon: CreditCard,
    },
    {
      name: 'Pass Usage Today',
      value: '1,439',
      change: '+22.4%',
      trend: 'up',
      icon: Activity,
    },
    {
      name: 'Active Users',
      value: '891',
      change: '-3.2%',
      trend: 'down',
      icon: Users,
    }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="p-6 bg-white rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <Icon className="w-6 h-6 text-gray-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                {stat.trend === 'up' ? (
                  <ArrowUpRight className="w-4 h-4 text-green-500" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 text-red-500" />
                )}
                <span className={`text-sm ml-1 ${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                  {stat.change}
                </span>
                <span className="text-sm text-gray-500 ml-2">vs last week</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Templates */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Templates</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {templates.slice(0, 5).map((template) => (
            <div key={template.id} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">{template.name}</h4>
                  <p className="text-sm text-gray-500">{template.description}</p>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  template.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {template.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}