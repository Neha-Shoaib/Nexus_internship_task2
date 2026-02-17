import React, { useState } from 'react';
import { usePayment } from '../../context/PaymentContext';
import { useAuth } from '../../context/AuthContext';
import { WalletBalance } from '../../components/payment/WalletBalance';
import { TransactionHistory } from '../../components/payment/TransactionHistory';
import { PaymentActions } from '../../components/payment/PaymentActions';
import { FundingDealFlow } from '../../components/payment/FundingDealFlow';
import { Card } from '../../components/ui/Card';
import { DollarSign, History, GitMerge, FileText } from 'lucide-react';

export const PaymentDashboard: React.FC = () => {
  const { user } = useAuth();
  const { transactions } = usePayment();
  const [activeTab, setActiveTab] = useState('all');

  const userTransactions = user 
    ? transactions.filter(t => t.senderId === user.id || t.receiverId === user.id)
    : transactions;

  // For demo purposes, show all transactions if user has no matching transactions
  const displayTransactions = userTransactions.length > 0 ? userTransactions : transactions;

  const filteredTransactions = activeTab === 'all' 
    ? displayTransactions
    : displayTransactions.filter(t => t.type === activeTab.slice(0, -1));

  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'deposits', label: 'Deposits' },
    { id: 'withdrawals', label: 'Withdrawals' },
    { id: 'transfers', label: 'Transfers' },
    { id: 'funding', label: 'Funding' },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
          <p className="text-gray-500">Manage your funds, transactions, and investments</p>
        </div>
      </div>

      {/* Wallet Balance */}
      <WalletBalance />

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Left Column - Actions & Deals */}
        <div className="md:col-span-2 lg:col-span-1 space-y-6">
          <PaymentActions />
          <FundingDealFlow compact />
        </div>

        {/* Right Column - Transactions */}
        <div className="md:col-span-2 lg:col-span-2">
          <Card className="p-4 md:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 md:mb-6">
              <div className="flex items-center mb-2 sm:mb-0">
                <History size={20} className="text-primary-600 mr-2 md:mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">Transaction History</h3>
              </div>
            </div>
            
            {/* Tab Navigation */}
            <div className="flex flex-wrap gap-1 bg-gray-100 p-1 rounded-lg mb-4 md:mb-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-2 px-2 md:px-4 text-xs md:text-sm font-medium rounded-md transition-colors ${
                    activeTab === tab.id
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="mt-4 md:mt-6">
              <TransactionHistory transactions={filteredTransactions} />
            </div>

            {/* Export Button */}
            <div className="mt-4 md:mt-6 pt-4 border-t border-gray-200">
              <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                Download Statement (CSV)
              </button>
            </div>
          </Card>
        </div>
      </div>

      {/* Funding Deals Section */}
      <Card className="p-4 md:p-6">
        <FundingDealFlow />
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <Card className="p-3 md:p-4 flex items-center">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-green-100 rounded-lg flex items-center justify-center mr-2 md:mr-4">
            <DollarSign size={16} className="text-green-600 md:w-5 md:h-5" />
          </div>
          <div>
            <p className="text-xs md:text-sm text-gray-500">Deposits</p>
            <p className="text-sm md:text-lg font-semibold text-gray-900">
              ${displayTransactions
                .filter(t => t.type === 'deposit' && t.status === 'completed')
                .reduce((sum, t) => sum + t.amount, 0)
                .toLocaleString()}
            </p>
          </div>
        </Card>
        
        <Card className="p-3 md:p-4 flex items-center">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-red-100 rounded-lg flex items-center justify-center mr-2 md:mr-4">
            <DollarSign size={16} className="text-red-600 md:w-5 md:h-5" />
          </div>
          <div>
            <p className="text-xs md:text-sm text-gray-500">Withdrawals</p>
            <p className="text-sm md:text-lg font-semibold text-gray-900">
              ${displayTransactions
                .filter(t => t.type === 'withdraw' && t.status === 'completed')
                .reduce((sum, t) => sum + t.amount, 0)
                .toLocaleString()}
            </p>
          </div>
        </Card>
        
        <Card className="p-3 md:p-4 flex items-center">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-2 md:mr-4">
            <GitMerge size={16} className="text-blue-600 md:w-5 md:h-5" />
          </div>
          <div>
            <p className="text-xs md:text-sm text-gray-500">Transfers</p>
            <p className="text-sm md:text-lg font-semibold text-gray-900">
              ${displayTransactions
                .filter(t => t.type === 'transfer' && t.status === 'completed')
                .reduce((sum, t) => sum + t.amount, 0)
                .toLocaleString()}
            </p>
          </div>
        </Card>
        
        <Card className="p-3 md:p-4 flex items-center">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-2 md:mr-4">
            <FileText size={16} className="text-purple-600 md:w-5 md:h-5" />
          </div>
          <div>
            <p className="text-xs md:text-sm text-gray-500">Funding</p>
            <p className="text-sm md:text-lg font-semibold text-gray-900">
              ${displayTransactions
                .filter(t => t.type === 'funding' && t.status === 'completed')
                .reduce((sum, t) => sum + t.amount, 0)
                .toLocaleString()}
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};
