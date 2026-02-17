import React, { useState } from 'react';
import { Calendar, Clock, MessageSquare, Check, X, User } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card, CardBody } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { MeetingRequest } from '../../types';
import { useMeeting } from '../../context/MeetingContext';
import { useAuth } from '../../context/AuthContext';
import { format } from 'date-fns';
import { entrepreneurs, investors } from '../../data/users';

interface MeetingRequestCardProps {
  request: MeetingRequest;
  onUpdate?: () => void;
}

export const MeetingRequestCard: React.FC<MeetingRequestCardProps> = ({ request, onUpdate }) => {
  const { user } = useAuth();
  const { respondToMeetingRequest } = useMeeting();
  const [isLoading, setIsLoading] = useState(false);

  // Get sender info
  const sender = user?.role === 'entrepreneur'
    ? investors.find(i => i.id === request.senderId)
    : entrepreneurs.find(e => e.id === request.senderId);

  const handleAccept = async () => {
    setIsLoading(true);
    try {
      await respondToMeetingRequest(request.id, 'accepted');
      onUpdate?.();
    } catch (error) {
      console.error('Failed to accept meeting request:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDecline = async () => {
    setIsLoading(true);
    try {
      await respondToMeetingRequest(request.id, 'declined');
      onUpdate?.();
    } catch (error) {
      console.error('Failed to decline meeting request:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = () => {
    switch (request.status) {
      case 'pending':
        return <Badge variant="warning">Pending</Badge>;
      case 'accepted':
        return <Badge variant="success">Accepted</Badge>;
      case 'declined':
        return <Badge variant="error">Declined</Badge>;
      case 'cancelled':
        return <Badge variant="gray">Cancelled</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardBody className="p-0">
        <div className="p-4">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                <User className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">{sender?.name || 'Unknown User'}</h4>
                <p className="text-sm text-gray-500">
                  {sender?.role === 'investor' ? 'Investor' : 'Entrepreneur'}
                </p>
              </div>
            </div>
            {getStatusBadge()}
          </div>

          {/* Meeting Details */}
          <div className="space-y-2 mb-3">
            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="w-4 h-4 mr-2 text-gray-400" />
              <span>{format(new Date(request.proposedTime), 'EEEE, MMMM d, yyyy')}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="w-4 h-4 mr-2 text-gray-400" />
              <span>
                {format(new Date(request.proposedTime), 'h:mm a')} - {request.duration} minutes
              </span>
            </div>
            {request.message && (
              <div className="flex items-start text-sm text-gray-600 mt-2">
                <MessageSquare className="w-4 h-4 mr-2 mt-0.5 text-gray-400" />
                <p className="italic">"{request.message}"</p>
              </div>
            )}
          </div>

          {/* Actions */}
          {request.status === 'pending' && (
            <div className="flex space-x-2 pt-3 border-t border-gray-100">
              <Button
                variant="success"
                size="sm"
                fullWidth
                onClick={handleAccept}
                isLoading={isLoading}
                leftIcon={<Check className="w-4 h-4" />}
              >
                Accept
              </Button>
              <Button
                variant="error"
                size="sm"
                fullWidth
                onClick={handleDecline}
                isLoading={isLoading}
                leftIcon={<X className="w-4 h-4" />}
              >
                Decline
              </Button>
            </div>
          )}

          {/* Status Message */}
          {request.status !== 'pending' && (
            <div className="pt-3 border-t border-gray-100">
              <p className="text-sm text-gray-500 text-center">
                {request.status === 'accepted' 
                  ? '✓ Meeting confirmed!' 
                  : '✗ Request declined'}
              </p>
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );
};
