import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useNotification } from '../contexts/NotificationContext.jsx';
import {
  Menu,
  X,
  FileText,
  BarChart3,
  Download,
  LogOut,
  User,
  Bell,
  BellOff,
  BookOpen
} from 'lucide-react';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const { notificationsEnabled, toggleNotifications } = useNotification();
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
    { name: 'Documents', href: '/document', icon: FileText },
    { name: 'Invoices', href: '/invoice', icon: FileText },
    { name: 'References', href: '/references', icon: BookOpen },
    { name: 'Export', href: '/export', icon: Download },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white shadow-xl">
          <div className="flex h-16 items-center justify-between px-6 border-b border-gray-200">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-primary-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">InvoiceAI</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <nav className="flex-1 space-y-1 px-4 py-4">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`sidebar-item ${isActive ? 'active' : ''}`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center px-4 py-2">
              {/* Circle container with equal width and height */}
              <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>

              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">
                  {user?.first_name} {user?.last_name}
                </p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
            </div>

            <button
              onClick={logout}
              className="mt-3 w-full sidebar-item text-red-600 hover:text-red-700 flex items-center justify-center"
            >
              <LogOut className="mr-3 h-5 w-5" />
              Sign out
            </button>
          </div>

        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200 shadow-soft">
          <div className="flex h-16 items-center px-6 border-b border-gray-200">
            <FileText className="h-8 w-8 text-primary-600" />
            <span className="ml-2 text-xl font-bold text-gray-900">InvoiceAI</span>
          </div>
          <nav className="flex-1 space-y-1 px-4 py-4">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`sidebar-item ${isActive ? 'active' : ''}`}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center px-4 py-2">
              <div className="h-8 w-8 bg-gradient-primary rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">{user?.first_name} {user?.last_name}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="mt-3 w-full sidebar-item text-danger-600 hover:text-danger-700"
            >
              <LogOut className="mr-3 h-5 w-5" />
              Sign out
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>

          {/* Page Title */}
          <div className="flex flex-1 items-center justify-center">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Invoice Automation System
            </h1>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-x-4 lg:gap-x-6">
            <button
              type="button"
              onClick={toggleNotifications}
              className={`-m-2.5 p-2.5 transition-colors duration-200 ${
                notificationsEnabled 
                  ? 'text-blue-500 hover:text-blue-600' 
                  : 'text-gray-400 hover:text-gray-500'
              }`}
              title={notificationsEnabled ? 'Disable notifications' : 'Enable notifications'}
            >
              {notificationsEnabled ? (
                <Bell className="h-6 w-6" />
              ) : (
                <BellOff className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Page content */}
        <main className="py-6">
          <div className="mx-auto max-w-10xl px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout; 