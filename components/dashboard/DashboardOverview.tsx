import React from 'react';
import { BarChart, LineChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  CreditCard, 
  Users, 
  ArrowUpRight,
  ArrowDownRight,
  Activity
} from 'lucide-react';

const DashboardOverview = () => {
  // Sample data - would be fetched from API in production
  const passDistributionData = [
    { name: 'Corporate Access', value: 4000 },
    { name: 'Event Passes', value: 3000 },
    { name: 'Loyalty Cards', value: 2000 },
  ];

  const recentActivity = [
    { id: 1, type: 'Pass Created', details: 'Corporate access pass for Tech Corp', time: '2 minutes ago' },
    { id: 2, type: 'Bulk Distribution', details: '150 event passes sent for Annual Conference', time: '1 hour ago' },
    { id: 3, type: 'Template Updated', details: 'Loyalty program template modified', time: '3 hours ago' },
  ];

  const stats = [
    {
      name: 'Total Active Passes',
      value: '12,789',
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

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="p-6 bg-white rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">Pass Distribution</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={passDistributionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area dataKey="value" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-6 bg-white rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">Usage Analytics</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={passDistributionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area dataKey="value" fill="#10B981" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
          <div className="mt-6 space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-4">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Activity className="w-5 h-5 text-blue-500" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.type}</p>
                  <p className="text-sm text-gray-500">{activity.details}</p>
                </div>
                <p className="text-sm text-gray-500">{activity.time}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
