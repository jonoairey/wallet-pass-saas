'use client'

import React from 'react';
import { 
  CreditCard, 
  Users, 
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Wallet,
  ChevronRight
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

// Sample data - replace with real data later
const passDistributionData = [
  { name: 'Jan', corporate: 400, event: 240, loyalty: 320 },
  { name: 'Feb', corporate: 450, event: 280, loyalty: 340 },
  { name: 'Mar', corporate: 420, event: 250, loyalty: 360 },
  { name: 'Apr', corporate: 480, event: 290, loyalty: 380 },
  { name: 'May', corporate: 460, event: 300, loyalty: 400 },
  { name: 'Jun', corporate: 500, event: 320, loyalty: 420 },
];

const usageData = [
  { name: 'Mon', usage: 2400 },
  { name: 'Tue', usage: 1398 },
  { name: 'Wed', usage: 9800 },
  { name: 'Thu', usage: 3908 },
  { name: 'Fri', usage: 4800 },
  { name: 'Sat', usage: 3800 },
  { name: 'Sun', usage: 4300 },
];

export default function DashboardOverview() {
  const stats = [
    {
      name: 'Total Active Passes',
      value: '12,789',
      change: '+12.3%',
      trend: 'up',
      icon: Wallet,
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

  const recentActivity = [
    { id: 1, type: 'Pass Created', details: 'Corporate access pass for Tech Corp', time: '2 minutes ago' },
    { id: 2, type: 'Bulk Distribution', details: '150 event passes sent for Annual Conference', time: '1 hour ago' },
    { id: 3, type: 'Template Updated', details: 'Loyalty program template modified', time: '3 hours ago' },
    { id: 4, type: 'Pass Expired', details: 'Event pass for Summer Festival', time: '4 hours ago' },
    { id: 5, type: 'New Integration', details: 'API key generated for Mobile App', time: '5 hours ago' },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="p-6 bg-white rounded-lg shadow-sm">
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

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Pass Distribution</h3>
            <select className="text-sm border-gray-300 rounded-md">
              <option>Last 6 months</option>
              <option>Last 12 months</option>
              <option>Last 30 days</option>
            </select>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={passDistributionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="corporate" fill="#4F46E5" name="Corporate" />
                <Bar dataKey="event" fill="#10B981" name="Event" />
                <Bar dataKey="loyalty" fill="#F59E0B" name="Loyalty" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Usage Analytics</h3>
            <select className="text-sm border-gray-300 rounded-md">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 90 days</option>
            </select>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={usageData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="usage" stroke="#4F46E5" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
            <a href="#" className="text-sm text-indigo-600 hover:text-indigo-900">
              View all
              <ChevronRight className="inline-block w-4 h-4 ml-1" />
            </a>
          </div>
        </div>
        <div className="divide-y divide-gray-200">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-indigo-50 rounded-lg">
                    <Activity className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{activity.type}</p>
                    <p className="text-sm text-gray-500">{activity.details}</p>
                  </div>
                </div>
                <span className="text-sm text-gray-500">{activity.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}