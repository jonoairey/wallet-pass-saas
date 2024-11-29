import React from 'react';
import { 
  CreditCard, 
  Users, 
  BarChart, 
  Settings, 
  LogOut,
  Layers,
  Box,
  Target,
  Bell,
  Code,
  Wallet,
  Building,
  UserPlus,
  Layout
} from 'lucide-react';

const DashboardLayout = ({ children }) => {
  const navigation = [
    {
      name: 'Overview',
      href: '/dashboard',
      icon: Layout,
    },
    {
      name: 'Pass Management',
      href: '/dashboard/passes',
      subItems: [
        { name: 'Pass Templates', href: '/dashboard/passes/templates', icon: Box },
        { name: 'Active Passes', href: '/dashboard/passes/active', icon: CreditCard },
        { name: 'Pass Groups', href: '/dashboard/passes/groups', icon: Layers },
      ]
    },
    {
      name: 'Distribution',
      href: '/dashboard/distribution',
      subItems: [
        { name: 'Campaigns', href: '/dashboard/distribution/campaigns', icon: Target },
        { name: 'Bulk Operations', href: '/dashboard/distribution/bulk', icon: Users },
        { name: 'Notifications', href: '/dashboard/distribution/notifications', icon: Bell },
      ]
    },
    {
      name: 'Integration',
      href: '/dashboard/integration',
      subItems: [
        { name: 'API Keys', href: '/dashboard/integration/api-keys', icon: Code },
        { name: 'Webhooks', href: '/dashboard/integration/webhooks', icon: Box },
        { name: 'SDK Access', href: '/dashboard/integration/sdk', icon: Wallet },
      ]
    },
    {
      name: 'Organization',
      href: '/dashboard/organization',
      subItems: [
        { name: 'Team Members', href: '/dashboard/organization/team', icon: UserPlus },
        { name: 'Departments', href: '/dashboard/organization/departments', icon: Building },
        { name: 'Roles & Permissions', href: '/dashboard/organization/roles', icon: Users },
      ]
    },
    {
      name: 'Analytics',
      href: '/dashboard/analytics',
      icon: BarChart,
    },
    {
      name: 'Settings',
      href: '/dashboard/settings',
      icon: Settings,
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-50">
        <div className="flex items-center justify-between h-full px-4">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-gray-800">PassPort</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-500 hover:text-gray-700">
              <Bell className="w-5 h-5" />
            </button>
            <div className="w-8 h-8 rounded-full bg-gray-200" />
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 pt-16">
        <div className="flex flex-col h-full">
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => (
              <div key={item.name} className="space-y-1">
                <a
                  href={item.href}
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900"
                >
                  {item.icon && <item.icon className="w-5 h-5 mr-3" />}
                  {item.name}
                </a>
                {item.subItems && (
                  <div className="pl-4 space-y-1">
                    {item.subItems.map((subItem) => (
                      <a
                        key={subItem.name}
                        href={subItem.href}
                        className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 rounded-md hover:bg-gray-50 hover:text-gray-900"
                      >
                        <subItem.icon className="w-4 h-4 mr-3" />
                        {subItem.name}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          <div className="p-4 border-t border-gray-200">
            <button className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900">
              <LogOut className="w-5 h-5 mr-3" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="pl-64 pt-16">
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
