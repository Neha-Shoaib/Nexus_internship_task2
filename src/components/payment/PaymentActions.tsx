import React, { useState } from 'react';
import { usePayment } from '../../context/PaymentContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card } from '../ui/Card';
import { ArrowDownLeft, ArrowUpRight, RefreshCw, CreditCard, Building2, Wallet } from 'lucide-react';
import toast from 'react-hot-toast';

export const PaymentActions: React.FC = () => {
  const { deposit, withdraw, transfer, isLoading } = usePayment();
  const [activeTab, setActiveTab] = useState<'deposit' | 'withdraw' | 'transfer'>('deposit');
  const [amount, setAmount] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    try {
      switch (activeTab) {
        case 'deposit':
          await deposit(amountValue);
          break;
        case 'withdraw':
          await withdraw(amountValue);
          break;
        case 'transfer':
          if (!recipientEmail) {
            toast.error('Please enter recipient email');
            return;
          }
          await transfer(amountValue, recipientEmail, description || 'Transfer');
          break;
      }
      setAmount('');
      setRecipientEmail('');
      setDescription('');
    } catch (error) {
      // Error handled in context
      console.log('Transaction processing:', error);
    }
  };

  const tabs = [
    { id: 'deposit' as const, label: 'Deposit', icon: <ArrowDownLeft size={20} />, color: 'text-green-600' },
    { id: 'withdraw' as const, label: 'Withdraw', icon: <ArrowUpRight size={20} />, color: 'text-red-600' },
    { id: 'transfer' as const, label: 'Transfer', icon: <RefreshCw size={20} />, color: 'text-blue-600' },
  ];

  const presetAmounts = [1000, 5000, 10000, 25000];

  return (
    <Card className="p-4 md:p-6">
      <div className="flex items-center mb-4 md:mb-6">
        <Wallet size={20} className="text-primary-600 mr-2 md:mr-3" />
        <h3 className="text-base md:text-lg font-semibold text-gray-900">Payment Actions</h3>
      </div>

      {/* Tab Navigation */}
      <div className="grid grid-cols-3 gap-2 md:gap-3 mb-4 md:mb-6">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center py-3 px-2 md:px-4 text-xs md:text-sm font-medium rounded-xl transition-all duration-200 ${
                isActive
                  ? tab.id === 'deposit' ? 'bg-green-50 text-green-700 border-2 border-green-300 shadow-sm' :
                    tab.id === 'withdraw' ? 'bg-red-50 text-red-700 border-2 border-red-300 shadow-sm' :
                    'bg-blue-50 text-blue-700 border-2 border-blue-300 shadow-sm'
                  : 'bg-white text-gray-600 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <span className={`${tab.color} mb-1`}>{tab.icon}</span>
              <span className="font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
        {/* Amount Input */}
        <div>
          <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">
            Amount (USD)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">$</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full pl-6 pr-3 md:pl-8 md:pr-4 py-2 md:py-3 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              min="0"
              step="0.01"
            />
          </div>
          
          {/* Preset Amounts */}
          <div className="flex flex-wrap gap-1 md:gap-2 mt-2">
            {presetAmounts.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setAmount(preset.toString())}
                className="px-2 py-1 text-xs md:text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
              >
                ${preset.toLocaleString()}
              </button>
            ))}
          </div>
        </div>

        {/* Transfer-specific fields */}
        {activeTab === 'transfer' && (
          <>
            <Input
              label="Recipient Email"
              type="email"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              placeholder="recipient@example.com"
              fullWidth
            />
            <Input
              label="Description (Optional)"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What's this transfer for?"
              fullWidth
            />
          </>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          fullWidth
          isLoading={isLoading}
          leftIcon={
            activeTab === 'deposit' ? <CreditCard size={16} /> :
            activeTab === 'withdraw' ? <Building2 size={16} /> :
            <RefreshCw size={16} />
          }
          size="md"
          className="mt-3 md:mt-4"
        >
          {activeTab === 'deposit' ? 'Deposit Funds' :
           activeTab === 'withdraw' ? 'Withdraw Funds' :
           'Transfer Funds'}
        </Button>
      </form>

      {/* Security Notice */}
      <div className="mt-4 md:mt-6 p-3 md:p-4 bg-gray-50 rounded-lg">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-4 w-4 md:h-5 md:w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <div className="ml-2 md:ml-3">
            <p className="text-xs md:text-sm text-gray-600">
              All transactions are secured with 256-bit encryption. Your financial data is protected.
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};
