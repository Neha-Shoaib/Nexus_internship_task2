import React from 'react';
import { Transaction, TransactionStatus, TransactionType } from '../../types';
import { Badge } from '../ui/Badge';
import { ArrowUpRight, ArrowDownLeft, RefreshCw, DollarSign } from 'lucide-react';

interface TransactionHistoryProps {
  transactions: Transaction[];
  compact?: boolean;
}

const getStatusBadge = (status: TransactionStatus) => {
  const variants: Record<TransactionStatus, 'success' | 'warning' | 'error' | 'gray'> = {
    completed: 'success',
    pending: 'warning',
    failed: 'error',
    cancelled: 'gray',
  };
  
  const labels: Record<TransactionStatus, string> = {
    completed: 'Completed',
    pending: 'Pending',
    failed: 'Failed',
    cancelled: 'Cancelled',
  };
  
  return <Badge variant={variants[status]}>{labels[status]}</Badge>;
};

const getTypeIcon = (type: TransactionType) => {
  const icons: Record<TransactionType, React.ReactNode> = {
    deposit: <ArrowDownLeft size={16} className="text-green-600" />,
    withdraw: <ArrowUpRight size={16} className="text-red-600" />,
    transfer: <RefreshCw size={16} className="text-blue-600" />,
    funding: <DollarSign size={16} className="text-purple-600" />,
  };
  return icons[type];
};

const getTypeLabel = (type: TransactionType) => {
  const labels: Record<TransactionType, string> = {
    deposit: 'Deposit',
    withdraw: 'Withdrawal',
    transfer: 'Transfer',
    funding: 'Funding',
  };
  return labels[type];
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const TransactionHistory: React.FC<TransactionHistoryProps> = ({ transactions = [], compact = false }) => {
  if (compact) {
    return (
      <div className="space-y-3">
        {transactions.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-sm text-gray-500">No transactions yet</p>
          </div>
        ) : (
          transactions.slice(0, 5).map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
                  {getTypeIcon(transaction.type)}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{getTypeLabel(transaction.type)}</p>
                  <p className="text-xs text-gray-500">{formatDate(transaction.createdAt)}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-sm font-semibold ${transaction.type === 'deposit' || transaction.type === 'funding' ? 'text-green-600' : 'text-gray-900'}`}>
                  {transaction.type === 'deposit' || transaction.type === 'funding' ? '+' : '-'}${transaction.amount.toLocaleString()}
                </p>
                {getStatusBadge(transaction.status)}
              </div>
            </div>
          ))
        )}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      {transactions.length === 0 ? (
        <div className="text-center py-8">
          <DollarSign size={48} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">No transactions yet</p>
        </div>
      ) : (
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-2 md:px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="text-left py-3 px-2 md:px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="text-left py-3 px-2 md:px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">
                From
              </th>
              <th className="text-left py-3 px-2 md:px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">
                To
              </th>
              <th className="text-left py-3 px-2 md:px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                Description
              </th>
              <th className="text-left py-3 px-2 md:px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="text-left py-3 px-2 md:px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                Date
              </th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-2 md:px-4">
                  <div className="flex items-center space-x-2">
                    {getTypeIcon(transaction.type)}
                    <span className="text-sm font-medium text-gray-900">{getTypeLabel(transaction.type)}</span>
                  </div>
                </td>
                <td className={`py-3 px-2 md:px-4 text-sm font-semibold ${transaction.type === 'deposit' || transaction.type === 'funding' ? 'text-green-600' : 'text-gray-900'}`}>
                  {transaction.type === 'deposit' || transaction.type === 'funding' ? '+' : '-'}${transaction.amount.toLocaleString()}
                </td>
                <td className="py-3 px-2 md:px-4 text-sm text-gray-600 hidden md:table-cell">
                  <div>
                    <p className="font-medium">{transaction.senderName}</p>
                    <p className="text-xs text-gray-400 hidden lg:table-cell">{transaction.senderId}</p>
                  </div>
                </td>
                <td className="py-3 px-2 md:px-4 text-sm text-gray-600 hidden md:table-cell">
                  <div>
                    <p className="font-medium">{transaction.receiverName}</p>
                    <p className="text-xs text-gray-400 hidden lg:table-cell">{transaction.receiverId}</p>
                  </div>
                </td>
                <td className="py-3 px-2 md:px-4 text-sm text-gray-600 max-w-xs truncate hidden lg:table-cell">
                  {transaction.description}
                </td>
                <td className="py-3 px-2 md:px-4">
                  {getStatusBadge(transaction.status)}
                </td>
                <td className="py-3 px-2 md:px-4 text-sm text-gray-600 hidden sm:table-cell">
                  {formatDate(transaction.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
