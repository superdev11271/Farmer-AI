import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  DollarSign, 
  TrendingUp, 
  Download,
  Eye,
  Settings,
  Upload,
  AlertCircle,
  FileImage,
  Receipt,
  BarChart3
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { apiConfig } from '../config/api';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    documents: {
      total: 0,
      uploaded: 0,
      processing: 0,
      processed: 0
    },
    invoices: {
      total: 0,
      totalAmount: 0,
      totalBtw: 0
    },
    loading: true
  });

  // Fetch dashboard data from API
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setDashboardData(prev => ({ ...prev, loading: true }));
      
      // Fetch documents data
      const documentsResponse = await axios.get(apiConfig.endpoints.documents);
      const documents = documentsResponse.data;
      
      // Fetch invoices data
      const invoicesResponse = await axios.get(apiConfig.endpoints.invoices);
      const invoices = invoicesResponse.data;
      
      // Process documents data
      const documentStats = {
        total: documents.length,
        uploaded: documents.filter(doc => doc.status === 1).length,
        processing: documents.filter(doc => doc.status === 2).length,
        processed: documents.filter(doc => doc.status === 3).length
      };
      
      // Process invoices data
      const totalAmount = invoices.reduce((sum, inv) => sum + parseFloat(inv.bedrag || 0), 0);
      const totalBtw = invoices.reduce((sum, inv) => sum + parseFloat(inv.btw || 0), 0);
      
      const invoiceStats = {
        total: invoices.length,
        totalAmount,
        totalBtw
      };
      
      setDashboardData({
        documents: documentStats,
        invoices: invoiceStats,
        loading: false
      });
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Fallback to mock data if API fails
      setDashboardData({
        documents: {
          total: 45,
          uploaded: 12,
          processing: 3,
          processed: 30
        },
        invoices: {
          total: 30,
          totalAmount: 45678.90,
          totalBtw: 9145.78
        },
        loading: false
      });
    }
  };

  const StatCard = ({ title, value, icon: Icon, color, subtitle, loading = false }) => (
    <div className="stat-card group">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">
            {loading ? '...' : value}
          </p>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color} group-hover:scale-110 transition-transform duration-200`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('nl-NL', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  if (dashboardData.loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Invoice Automation Dashboard</h1>
        <p className="text-gray-600">Monitor document processing and invoice management</p>
      </div>

      {/* Document Stats */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Document Processing</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard
            title="Total Documents"
            value={dashboardData.documents.total}
            icon={FileText}
            color="bg-gradient-primary"
            subtitle={`${dashboardData.documents.processed} processed`}
            loading={dashboardData.loading}
          />
          <StatCard
            title="Processing"
            value={dashboardData.documents.processing}
            icon={Clock}
            color="bg-yellow-500"
            subtitle="Currently being processed"
            loading={dashboardData.loading}
          />
          <StatCard
            title="Processed"
            value={dashboardData.documents.processed}
            icon={CheckCircle}
            color="bg-green-500"
            subtitle="Ready for review"
            loading={dashboardData.loading}
          />
        </div>
      </div>

      {/* Invoice Stats */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Invoice Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Invoices"
            value={dashboardData.invoices.total}
            icon={Receipt}
            color="bg-gradient-secondary"
            subtitle="Extracted from documents"
            loading={dashboardData.loading}
        />
        <StatCard
          title="Total Amount"
            value={formatCurrency(dashboardData.invoices.totalAmount)}
          icon={DollarSign}
            color="bg-green-500"
            subtitle="Before tax"
            loading={dashboardData.loading}
          />
          <StatCard
            title="Total BTW"
            value={formatCurrency(dashboardData.invoices.totalBtw)}
            icon={BarChart3}
            color="bg-purple-500"
            subtitle="Tax amount"
            loading={dashboardData.loading}
          />
          <StatCard
            title="Average Amount"
            value={formatCurrency(dashboardData.invoices.total > 0 ? dashboardData.invoices.totalAmount / dashboardData.invoices.total : 0)}
            icon={FileImage}
            color="bg-indigo-500"
            subtitle="Per invoice"
            loading={dashboardData.loading}
          />
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Document Processing Status */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Document Processing Status</h3>
            <Link to="/document" className="text-sm text-primary-600 hover:text-primary-700">
              View All
            </Link>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'Processing', value: dashboardData.documents.processing, color: '#f59e0b' },
                    { name: 'Processed', value: dashboardData.documents.processed, color: '#10b981' }
                  ]}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {[
                    { name: 'Processing', value: dashboardData.documents.processing, color: '#f59e0b' },
                    { name: 'Processed', value: dashboardData.documents.processed, color: '#10b981' }
                  ].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Invoice Summary */}
        <div className="card bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 bg-green-100 rounded-lg">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-900">Invoice Summary</h3>
                <p className="text-xs text-gray-500">Financial overview</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            {/* Main Amount Display */}
            <div className="text-center py-4 bg-white rounded-lg border border-green-100 shadow-sm">
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {formatCurrency(dashboardData.invoices.totalAmount)}
              </div>
              <div className="text-xs text-gray-500 mb-1">Total Invoice Amount</div>
              <div className="text-xs text-green-600 font-medium">
                {dashboardData.invoices.total} invoices
              </div>
            </div>
            
            {/* Stats Grid */}
            <div className="space-y-2">
              <div className="bg-white p-3 rounded-lg border border-green-100 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="p-1.5 bg-blue-100 rounded-lg">
                      <Receipt className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="text-xs text-gray-500">Total Invoices</div>
                  </div>
                  <div className="text-lg font-bold text-gray-900">
                    {dashboardData.invoices.total}
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-3 rounded-lg border border-green-100 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="p-1.5 bg-purple-100 rounded-lg">
                      <BarChart3 className="h-4 w-4 text-purple-600" />
                    </div>
                    <div className="text-xs text-gray-500">Total BTW</div>
                  </div>
                  <div className="text-lg font-bold text-gray-900">
                    {formatCurrency(dashboardData.invoices.totalBtw)}
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-3 rounded-lg border border-green-100 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="p-1.5 bg-indigo-100 rounded-lg">
                      <FileImage className="h-4 w-4 text-indigo-600" />
                    </div>
                    <div className="text-xs text-gray-500">Average</div>
                  </div>
                  <div className="text-lg font-bold text-indigo-600">
                    {formatCurrency(dashboardData.invoices.total > 0 ? dashboardData.invoices.totalAmount / dashboardData.invoices.total : 0)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link to="/document" className="card-hover text-center p-6">
          <div className="mx-auto h-12 w-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-4">
            <Upload className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Documents</h3>
          <p className="text-gray-600 mb-4">Upload new invoices and receipts for automated processing</p>
          <button className="btn-primary w-full">Upload Documents</button>
        </Link>

        <Link to="/export" className="card-hover text-center p-6">
          <div className="mx-auto h-12 w-12 bg-gradient-secondary rounded-lg flex items-center justify-center mb-4">
            <Settings className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Manage Categories</h3>
          <p className="text-gray-600 mb-4">Configure document categories and processing rules</p>
          <button className="btn-secondary w-full">Manage Categories</button>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard; 