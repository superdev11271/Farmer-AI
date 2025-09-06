import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  DollarSign, 
  TrendingUp, 
  Download,
  Eye,
  Settings
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [stats, setStats] = useState({
    total_invoices: 0,
    pending_invoices: 0,
    processed_invoices: 0,
    total_amount: 0,
    monthly_trend: [],
    recent_activity: []
  });

  // Mock data for demonstration
  useEffect(() => {
    const mockStats = {
      total_invoices: 1247,
      pending_invoices: 23,
      processed_invoices: 1224,
      total_amount: 456789.50,
      monthly_trend: [
        { month: 'Jan', invoices: 89, amount: 45600 },
        { month: 'Feb', invoices: 102, amount: 52300 },
        { month: 'Mar', invoices: 95, amount: 48700 },
        { month: 'Apr', invoices: 118, amount: 61200 },
        { month: 'May', invoices: 134, amount: 68900 },
        { month: 'Jun', invoices: 156, amount: 78900 },
        { month: 'Jul', invoices: 142, amount: 72300 },
        { month: 'Aug', invoices: 167, amount: 84500 },
        { month: 'Sep', invoices: 189, amount: 92300 },
        { month: 'Oct', invoices: 203, amount: 104500 },
        { month: 'Nov', invoices: 187, amount: 95600 },
        { month: 'Dec', invoices: 156, amount: 78900 }
      ],
      recent_activity: [
        { id: 1, invoice_number: 'INV-2024-001', vendor: 'Tech Solutions Inc.', amount: 1250.00, status: 'processed', date: '2024-01-15' },
        { id: 2, invoice_number: 'INV-2024-002', vendor: 'Office Supplies Co.', amount: 450.75, status: 'pending', date: '2024-01-14' },
        { id: 3, invoice_number: 'INV-2024-003', vendor: 'Marketing Agency', amount: 3200.00, status: 'processed', date: '2024-01-13' },
        { id: 4, invoice_number: 'INV-2024-004', vendor: 'Cloud Services Ltd.', amount: 890.50, status: 'processed', date: '2024-01-12' },
        { id: 5, invoice_number: 'INV-2024-005', vendor: 'Legal Services', amount: 2100.00, status: 'pending', date: '2024-01-11' }
      ]
    };
    setStats(mockStats);
  }, []);

  const StatCard = ({ title, value, icon: Icon, color, change, changeType }) => (
    <div className="stat-card group">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change && (
            <div className="flex items-center mt-1">
              <TrendingUp className={`h-4 w-4 ${changeType === 'positive' ? 'text-success-500' : 'text-danger-500'}`} />
              <span className={`text-sm font-medium ml-1 ${changeType === 'positive' ? 'text-success-600' : 'text-danger-600'}`}>
                {change}
              </span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color} group-hover:scale-110 transition-transform duration-200`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );

  const getStatusBadge = (status) => {
    const statusConfig = {
      processed: { color: 'bg-success-100 text-success-800', icon: CheckCircle },
      pending: { color: 'bg-warning-100 text-warning-800', icon: Clock },
      error: { color: 'bg-danger-100 text-danger-800', icon: Eye }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="h-3 w-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with your invoices today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Invoices"
          value={stats.total_invoices.toLocaleString()}
          icon={FileText}
          color="bg-gradient-primary"
          change="+12%"
          changeType="positive"
        />
        <StatCard
          title="Pending Invoices"
          value={stats.pending_invoices}
          icon={Clock}
          color="bg-gradient-secondary"
          change="-5%"
          changeType="negative"
        />
        <StatCard
          title="Processed Invoices"
          value={stats.processed_invoices.toLocaleString()}
          icon={CheckCircle}
          color="bg-success-500"
          change="+8%"
          changeType="positive"
        />
        <StatCard
          title="Total Amount"
          value={`$${stats.total_amount.toLocaleString()}`}
          icon={DollarSign}
          color="bg-warning-500"
          change="+15%"
          changeType="positive"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trend Chart */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Monthly Invoice Trend</h3>
            <div className="flex space-x-2">
              <button className="px-3 py-1 text-sm bg-primary-100 text-primary-700 rounded-lg">Invoices</button>
              <button className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700">Amount</button>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.monthly_trend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="invoices" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Amount Chart */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Monthly Amount Trend</h3>
            <div className="text-sm text-gray-500">Total: ${stats.total_amount.toLocaleString()}</div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.monthly_trend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                  formatter={(value) => [`$${value.toLocaleString()}`, 'Amount']}
                />
                <Bar dataKey="amount" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          <button className="btn-secondary text-sm">
            <Eye className="h-4 w-4 mr-2" />
            View All
          </button>
        </div>
        
        <div className="overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="table-header">Invoice #</th>
                <th className="table-header">Vendor</th>
                <th className="table-header">Amount</th>
                <th className="table-header">Status</th>
                <th className="table-header">Date</th>
                <th className="table-header">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stats.recent_activity.map((activity) => (
                <tr key={activity.id} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="table-cell font-medium text-primary-600">
                    {activity.invoice_number}
                  </td>
                  <td className="table-cell">{activity.vendor}</td>
                  <td className="table-cell font-medium">
                    ${activity.amount.toLocaleString()}
                  </td>
                  <td className="table-cell">
                    {getStatusBadge(activity.status)}
                  </td>
                  <td className="table-cell text-gray-500">
                    {new Date(activity.date).toLocaleDateString()}
                  </td>
                  <td className="table-cell">
                    <div className="flex space-x-2">
                      <button className="p-1 text-gray-400 hover:text-primary-600 transition-colors duration-200">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-success-600 transition-colors duration-200">
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link to="/export" className="card-hover text-center p-6">
          <div className="mx-auto h-12 w-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-4">
            <Settings className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Document Categories</h3>
          <p className="text-gray-600 mb-4">Configure document categories and subcategories for automated classification</p>
          <button className="btn-primary w-full">Configure Categories</button>
        </Link>

        <div className="card-hover text-center p-6">
          <div className="mx-auto h-12 w-12 bg-gradient-secondary rounded-lg flex items-center justify-center mb-4">
            <FileText className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">View Reports</h3>
          <p className="text-gray-600 mb-4">Generate and view detailed invoice reports</p>
          <button className="btn-secondary w-full">View Reports</button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 