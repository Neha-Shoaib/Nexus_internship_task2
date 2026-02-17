import React, { createContext, useState, useContext, useEffect } from 'react';
import { PaymentContextType, Transaction, FundingDeal, Wallet } from '../types';
import toast from 'react-hot-toast';

// Create Payment Context
const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

// Mock data for transactions and deals
const mockTransactions: Transaction[] = [
  {
    id: 'txn_001',
    type: 'deposit',
    amount: 50000,
    currency: 'USD',
    senderId: 'bank_001',
    senderName: 'Bank Transfer',
    receiverId: 'e1',
    receiverName: 'Sarah Johnson',
    status: 'completed',
    description: 'Initial deposit to wallet',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
  },
  {
    id: 'txn_002',
    type: 'funding',
    amount: 25000,
    currency: 'USD',
    senderId: 'i1',
    senderName: 'Michael Chen',
    receiverId: 'e1',
    receiverName: 'Sarah Johnson',
    status: 'completed',
    description: 'Seed funding for TechWave',
    createdAt: '2024-01-20T14:45:00Z',
    updatedAt: '2024-01-20T14:45:00Z',
  },
  {
    id: 'txn_003',
    type: 'transfer',
    amount: 5000,
    currency: 'USD',
    senderId: 'e1',
    senderName: 'Sarah Johnson',
    receiverId: 'e2',
    receiverName: 'Emily Davis',
    status: 'completed',
    description: 'Consulting payment',
    createdAt: '2024-01-25T09:15:00Z',
    updatedAt: '2024-01-25T09:15:00Z',
  },
  {
    id: 'txn_004',
    type: 'withdraw',
    amount: 10000,
    currency: 'USD',
    senderId: 'e1',
    senderName: 'Sarah Johnson',
    receiverId: 'bank_001',
    receiverName: 'Bank Transfer',
    status: 'pending',
    description: 'Withdrawal to bank account',
    createdAt: '2024-02-01T16:20:00Z',
    updatedAt: '2024-02-01T16:20:00Z',
  },
];

const mockFundingDeals: FundingDeal[] = [
  {
    id: 'deal_001',
    investorId: 'i1',
    investorName: 'Michael Chen',
    entrepreneurId: 'e1',
    entrepreneurName: 'Sarah Johnson',
    startupName: 'TechWave',
    amount: 50000,
    equity: 8,
    status: 'pending',
    createdAt: '2024-02-05T11:00:00Z',
    updatedAt: '2024-02-05T11:00:00Z',
  },
  {
    id: 'deal_002',
    investorId: 'i2',
    investorName: 'Jennifer Lee',
    entrepreneurId: 'e2',
    entrepreneurName: 'David Chen',
    startupName: 'GreenLife Solutions',
    amount: 75000,
    equity: 12,
    status: 'accepted',
    createdAt: '2024-01-20T10:00:00Z',
    updatedAt: '2024-01-22T14:30:00Z',
  },
  {
    id: 'deal_003',
    investorId: 'i3',
    investorName: 'Robert Torres',
    entrepreneurId: 'e3',
    entrepreneurName: 'Maya Patel',
    startupName: 'HealthPulse',
    amount: 100000,
    equity: 15,
    status: 'pending',
    createdAt: '2024-02-10T09:00:00Z',
    updatedAt: '2024-02-10T09:00:00Z',
  },
  {
    id: 'deal_004',
    investorId: 'i1',
    investorName: 'Michael Chen',
    entrepreneurId: 'e4',
    entrepreneurName: 'James Wilson',
    startupName: 'UrbanFarm',
    amount: 150000,
    equity: 10,
    status: 'rejected',
    createdAt: '2024-01-15T16:00:00Z',
    updatedAt: '2024-01-18T11:00:00Z',
  },
];

// Payment Provider Component
export const PaymentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wallet, setWallet] = useState<Wallet | null>({
    id: 'wallet_001',
    userId: 'e1',
    balance: 75000,
    currency: 'USD',
    isFrozen: false,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-02-01T16:20:00Z',
  });
  
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [fundingDeals, setFundingDeals] = useState<FundingDeal[]>(mockFundingDeals);
  const [isLoading, setIsLoading] = useState(false);

  // Deposit function
  const deposit = async (amount: number): Promise<void> => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newTransaction: Transaction = {
        id: `txn_${Date.now()}`,
        type: 'deposit',
        amount,
        currency: 'USD',
        senderId: 'bank_001',
        senderName: 'Bank Transfer',
        receiverId: 'e1',
        receiverName: 'Current User',
        status: 'completed',
        description: `Deposit of ${amount.toLocaleString()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      setTransactions(prev => [newTransaction, ...prev]);
      setWallet(prev => prev ? { ...prev, balance: prev.balance + amount, updatedAt: new Date().toISOString() } : null);
      toast.success(`Successfully deposited $${amount.toLocaleString()}`);
    } catch (error) {
      toast.error('Deposit failed. Please try again.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Withdraw function
  const withdraw = async (amount: number): Promise<void> => {
    setIsLoading(true);
    try {
      if (wallet && amount > wallet.balance) {
        throw new Error('Insufficient balance');
      }
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newTransaction: Transaction = {
        id: `txn_${Date.now()}`,
        type: 'withdraw',
        amount,
        currency: 'USD',
        senderId: 'e1',
        senderName: 'Current User',
        receiverId: 'bank_001',
        receiverName: 'Bank Transfer',
        status: 'pending',
        description: `Withdrawal of ${amount.toLocaleString()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      setTransactions(prev => [newTransaction, ...prev]);
      setWallet(prev => prev ? { ...prev, balance: prev.balance - amount, updatedAt: new Date().toISOString() } : null);
      toast.success(`Withdrawal of $${amount.toLocaleString()} initiated`);
    } catch (error) {
      toast.error((error as Error).message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Transfer function
  const transfer = async (amount: number, receiverId: string, description: string): Promise<void> => {
    setIsLoading(true);
    try {
      if (wallet && amount > wallet.balance) {
        throw new Error('Insufficient balance');
      }
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newTransaction: Transaction = {
        id: `txn_${Date.now()}`,
        type: 'transfer',
        amount,
        currency: 'USD',
        senderId: 'e1',
        senderName: 'Current User',
        receiverId,
        receiverName: 'Recipient',
        status: 'completed',
        description,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      setTransactions(prev => [newTransaction, ...prev]);
      setWallet(prev => prev ? { ...prev, balance: prev.balance - amount, updatedAt: new Date().toISOString() } : null);
      toast.success(`Successfully transferred $${amount.toLocaleString()}`);
    } catch (error) {
      toast.error((error as Error).message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Create funding deal
  const createFundingDeal = async (deal: Omit<FundingDeal, 'id' | 'createdAt' | 'updatedAt'>): Promise<void> => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newDeal: FundingDeal = {
        ...deal,
        id: `deal_${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      setFundingDeals(prev => [newDeal, ...prev]);
      toast.success('Funding deal created successfully!');
    } catch (error) {
      toast.error('Failed to create funding deal');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Accept funding deal
  const acceptFundingDeal = async (dealId: string): Promise<void> => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const deal = fundingDeals.find(d => d.id === dealId);
      if (deal) {
        setFundingDeals(prev => 
          prev.map(d => d.id === dealId ? { ...d, status: 'accepted', updatedAt: new Date().toISOString() } : d)
        );
        
        // Create transaction for funding
        const newTransaction: Transaction = {
          id: `txn_${Date.now()}`,
          type: 'funding',
          amount: deal.amount,
          currency: 'USD',
          senderId: deal.investorId,
          senderName: deal.investorName,
          receiverId: deal.entrepreneurId,
          receiverName: deal.entrepreneurName,
          status: 'completed',
          description: `Funding deal: ${deal.startupName}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        setTransactions(prev => [newTransaction, ...prev]);
        setWallet(prev => prev ? { ...prev, balance: prev.balance + deal.amount, updatedAt: new Date().toISOString() } : null);
      }
      
      toast.success('Funding deal accepted!');
    } catch (error) {
      toast.error('Failed to accept funding deal');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Reject funding deal
  const rejectFundingDeal = async (dealId: string): Promise<void> => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setFundingDeals(prev => 
        prev.map(d => d.id === dealId ? { ...d, status: 'rejected', updatedAt: new Date().toISOString() } : d)
      );
      
      toast.success('Funding deal rejected');
    } catch (error) {
      toast.error('Failed to reject funding deal');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Get transactions for user
  const getTransactionsForUser = (userId: string): Transaction[] => {
    return transactions.filter(t => t.senderId === userId || t.receiverId === userId);
  };

  // Get funding deals for user
  const getFundingDealsForUser = (userId: string): FundingDeal[] => {
    return fundingDeals.filter(d => d.investorId === userId || d.entrepreneurId === userId);
  };

  // Get wallet balance
  const getWalletBalance = (userId: string): number => {
    return wallet?.balance || 0;
  };

  const value: PaymentContextType = {
    wallet,
    transactions,
    fundingDeals,
    deposit,
    withdraw,
    transfer,
    createFundingDeal,
    acceptFundingDeal,
    rejectFundingDeal,
    getTransactionsForUser,
    getFundingDealsForUser,
    getWalletBalance,
    isLoading,
  };

  return <PaymentContext.Provider value={value}>{children}</PaymentContext.Provider>;
};

// Custom hook for using payment context
export const usePayment = (): PaymentContextType => {
  const context = useContext(PaymentContext);
  if (context === undefined) {
    throw new Error('usePayment must be used within a PaymentProvider');
  }
  return context;
};
