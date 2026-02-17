import React from 'react';
import { usePayment } from '../../context/PaymentContext';
import { Card } from '../ui/Card';
import { Wallet, TrendingUp, TrendingDown, Lock } from 'lucide-react';
import { Badge } from '../ui/Badge';

interface WalletBalanceProps {
  showActions?: boolean;
}

export const WalletBalance: React.FC<WalletBalanceProps> = ({ showActions = false }) => {
  const { wallet } = usePayment();

  if (!wallet) {
    return (
      <Card className="p-6 bg-gradient-to-r from-gray-100 to-gray-50">
        <div className="flex items-center justify-center">
          <div className="animate-pulse flex space-x-4">
            <div className="h-4 bg-gray-200 rounded w-32"></div>
          </div>
        </div>
      </Card>
    );
  }

  const isFrozen = wallet.isFrozen;

  return (
    <Card className={`p-6 ${isFrozen ? 'bg-gray-100' : 'bg-gradient-to-r from-primary-600 to-primary-700'} relative overflow-hidden`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#grid)" />
        </svg>
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mr-4">
              <Wallet size={24} className="text-white" />
            </div>
            <div>
              <p className="text-primary-100 text-sm font-medium">Available Balance</p>
              <div className="flex items-center">
                {isFrozen && (
                  <Lock size={16} className="text-yellow-300 mr-1" />
                )}
                <Badge 
                  variant={isFrozen ? 'warning' : 'success'} 
                  rounded
                  className={isFrozen ? 'bg-yellow-300/20 text-yellow-100' : 'bg-blue-400/20 text-white'}
                >
                  {isFrozen ? 'Frozen' : 'Active'}
                </Badge>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-primary-100 text-sm">USD</p>
            <h2 className="text-3xl font-bold text-white">
              ${wallet.balance.toLocaleString()}
            </h2>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-white/20">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-green-400/20 rounded-lg flex items-center justify-center mr-3">
              <TrendingUp size={16} className="text-green-300" />
            </div>
            <div>
              <p className="text-primary-200 text-xs">Total Received</p>
              <p className="text-white font-semibold">$125,000</p>
            </div>
          </div>
          <div className="flex items-center justify-end">
            <div className="w-8 h-8 bg-red-400/20 rounded-lg flex items-center justify-center mr-3">
              <TrendingDown size={16} className="text-red-300" />
            </div>
            <div className="text-right">
              <p className="text-primary-200 text-xs">Total Sent</p>
              <p className="text-white font-semibold">$50,000</p>
            </div>
          </div>
        </div>

        {/* Wallet ID */}
        <div className="mt-4 pt-4 border-t border-white/20">
          <p className="text-primary-200 text-xs">Wallet ID: {wallet.id}</p>
        </div>
      </div>
    </Card>
  );
};

// Compact version for dashboard widgets
export const WalletBalanceCompact: React.FC = () => {
  const { wallet } = usePayment();

  if (!wallet) return null;

  return (
    <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg">
      <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
        <Wallet size={20} className="text-white" />
      </div>
      <div className="flex-1">
        <p className="text-primary-200 text-xs">Balance</p>
        <p className="text-white font-semibold">${wallet.balance.toLocaleString()}</p>
      </div>
      <Badge variant="success" rounded className="bg-blue-300/20 text-white">
        Active
      </Badge>
    </div>
  );
};
