import React, { useState } from 'react';
import { usePayment } from '../../context/PaymentContext';
import { useAuth } from '../../context/AuthContext';
import { FundingDeal } from '../../types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { DollarSign, Users, Clock, CheckCircle, XCircle, ArrowRight, Building2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface FundingDealFlowProps {
  onClose?: () => void;
  compact?: boolean;
}

export const FundingDealFlow: React.FC<FundingDealFlowProps> = ({ onClose, compact = false }) => {
  const { user } = useAuth();
  const { fundingDeals, createFundingDeal, acceptFundingDeal, rejectFundingDeal, isLoading } = usePayment();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newDeal, setNewDeal] = useState({
    entrepreneurId: '',
    entrepreneurName: '',
    startupName: '',
    amount: '',
    equity: '',
    message: '',
  });

  const handleCreateDeal = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please log in to create a funding deal');
      return;
    }

    try {
      await createFundingDeal({
        investorId: user.id,
        investorName: user.name,
        entrepreneurId: newDeal.entrepreneurId,
        entrepreneurName: newDeal.entrepreneurName,
        startupName: newDeal.startupName,
        amount: parseFloat(newDeal.amount),
        equity: parseFloat(newDeal.equity),
        status: 'pending',
      });
      
      setNewDeal({
        entrepreneurId: '',
        entrepreneurName: '',
        startupName: '',
        amount: '',
        equity: '',
        message: '',
      });
      setShowCreateForm(false);
      toast.success('Funding deal sent successfully!');
    } catch (error) {
      // Error handled in context
    }
  };

  const userDeals = user ? fundingDeals.filter(d => 
    user.role === 'investor' ? d.investorId === user.id : d.entrepreneurId === user.id
  ) : [];

  if (compact) {
    return (
      <div className="space-y-4">
        {userDeals.length === 0 ? (
          <div className="text-center py-6">
            <DollarSign size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">No funding deals yet</p>
            {user?.role === 'investor' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCreateForm(true)}
                className="mt-3"
              >
                Create Deal
              </Button>
            )}
          </div>
        ) : (
          userDeals.map((deal) => (
            <div key={deal.id} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <Building2 size={18} className="text-primary-600 mr-2" />
                  <span className="font-medium text-gray-900">{deal.startupName}</span>
                </div>
                <Badge
                  variant={
                    deal.status === 'completed' ? 'success' :
                    deal.status === 'accepted' ? 'success' :
                    deal.status === 'rejected' ? 'error' :
                    'warning'
                  }
                >
                  {deal.status.charAt(0).toUpperCase() + deal.status.slice(1)}
                </Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">
                  ${deal.amount.toLocaleString()} for {deal.equity}% equity
                </span>
                <span className="text-gray-500">
                  {user?.role === 'investor' ? `To: ${deal.entrepreneurName}` : `From: ${deal.investorName}`}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <DollarSign size={24} className="text-primary-600 mr-3" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Funding Deals</h3>
            <p className="text-sm text-gray-500">Manage investment opportunities</p>
          </div>
        </div>
        {user?.role === 'investor' && (
          <Button
            onClick={() => setShowCreateForm(true)}
            leftIcon={<DollarSign size={18} />}
          >
            Create Deal
          </Button>
        )}
      </div>

      {/* Create Deal Form */}
      {showCreateForm && (
        <Card className="p-6 border-2 border-primary-200 bg-primary-50">
          <h4 className="font-semibold text-gray-900 mb-4">Create New Funding Deal</h4>
          <form onSubmit={handleCreateDeal} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Entrepreneur Name"
                type="text"
                value={newDeal.entrepreneurName}
                onChange={(e) => setNewDeal({ ...newDeal, entrepreneurName: e.target.value })}
                placeholder="John Doe"
                fullWidth
                required
              />
              <Input
                label="Entrepreneur ID"
                type="text"
                value={newDeal.entrepreneurId}
                onChange={(e) => setNewDeal({ ...newDeal, entrepreneurId: e.target.value })}
                placeholder="user_003"
                fullWidth
                required
              />
            </div>
            <Input
              label="Startup Name"
              type="text"
              value={newDeal.startupName}
              onChange={(e) => setNewDeal({ ...newDeal, startupName: e.target.value })}
              placeholder="TechWave"
              fullWidth
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Investment Amount (USD)"
                type="number"
                value={newDeal.amount}
                onChange={(e) => setNewDeal({ ...newDeal, amount: e.target.value })}
                placeholder="50000"
                fullWidth
                required
              />
              <Input
                label="Equity (%)"
                type="number"
                value={newDeal.equity}
                onChange={(e) => setNewDeal({ ...newDeal, equity: e.target.value })}
                placeholder="10"
                fullWidth
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Message to Entrepreneur (Optional)
              </label>
              <textarea
                value={newDeal.message}
                onChange={(e) => setNewDeal({ ...newDeal, message: e.target.value })}
                placeholder="I'd like to invest in your startup because..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                rows={3}
              />
            </div>
            <div className="flex space-x-3">
              <Button type="submit" isLoading={isLoading}>
                Send Deal
              </Button>
              <Button type="button" variant="outline" onClick={() => setShowCreateForm(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Deals List */}
      <div className="space-y-4">
        {userDeals.length === 0 ? (
          <Card className="p-8 text-center">
            <Users size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">No funding deals found</p>
            <p className="text-sm text-gray-400 mt-1">
              {user?.role === 'investor' 
                ? 'Create a new deal to start investing'
                : 'Waiting for investment offers'}
            </p>
          </Card>
        ) : (
          userDeals.map((deal) => (
            <Card key={deal.id} className="p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mr-4">
                    <Building2 size={24} className="text-primary-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{deal.startupName}</h4>
                    <p className="text-sm text-gray-500">
                      {user?.role === 'investor' 
                        ? `To: ${deal.entrepreneurName}`
                        : `From: ${deal.investorName}`}
                    </p>
                  </div>
                </div>
                <Badge
                  variant={
                    deal.status === 'completed' ? 'success' :
                    deal.status === 'accepted' ? 'success' :
                    deal.status === 'rejected' ? 'error' :
                    'warning'
                  }
                  size="lg"
                >
                  {deal.status === 'pending' && <Clock size={14} className="mr-1" />}
                  {deal.status === 'completed' && <CheckCircle size={14} className="mr-1" />}
                  {deal.status === 'rejected' && <XCircle size={14} className="mr-1" />}
                  {deal.status.charAt(0).toUpperCase() + deal.status.slice(1)}
                </Badge>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Investment</p>
                  <p className="text-lg font-semibold text-gray-900">
                    ${deal.amount.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Equity</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {deal.equity}%
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Valuation</p>
                  <p className="text-lg font-semibold text-gray-900">
                    ${Math.round(deal.amount / (deal.equity / 100)).toLocaleString()}
                  </p>
                </div>
              </div>

              {deal.status === 'pending' && user?.role === 'entrepreneur' && (
                <div className="flex space-x-3">
                  <Button
                    variant="primary"
                    onClick={() => acceptFundingDeal(deal.id)}
                    isLoading={isLoading}
                    leftIcon={<CheckCircle size={18} />}
                  >
                    Accept Deal
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => rejectFundingDeal(deal.id)}
                    leftIcon={<XCircle size={18} />}
                  >
                    Reject
                  </Button>
                </div>
              )}

              {deal.status === 'accepted' && (
                <div className="flex items-center text-green-600">
                  <CheckCircle size={18} className="mr-2" />
                  <span className="font-medium">Deal accepted! Transfer initiated.</span>
                </div>
              )}

              <p className="text-xs text-gray-400 mt-4">
                Created: {new Date(deal.createdAt).toLocaleDateString()}
              </p>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
