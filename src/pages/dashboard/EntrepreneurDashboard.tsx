import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Bell, Calendar, TrendingUp, AlertCircle, PlusCircle, Clock } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { CollaborationRequestCard } from '../../components/collaboration/CollaborationRequestCard';
import { InvestorCard } from '../../components/investor/InvestorCard';
import { MeetingCalendar } from '../../components/meetings/MeetingCalendar';
import { MeetingScheduler } from '../../components/meetings/MeetingScheduler';
import { MeetingRequestCard } from '../../components/meetings/MeetingRequestCard';
import { WalletBalanceCompact } from '../../components/payment/WalletBalance';
import { Walkthrough } from '../../components/walkthrough/Walkthrough';
import { useAuth } from '../../context/AuthContext';
import { useMeeting } from '../../context/MeetingContext';
import { CollaborationRequest } from '../../types';
import { getRequestsForEntrepreneur } from '../../data/collaborationRequests';
import { investors } from '../../data/users';

export const EntrepreneurDashboard: React.FC = () => {
  const { user } = useAuth();
  const { getUpcomingMeetings, getPendingRequestsForUser } = useMeeting();
  const [collaborationRequests, setCollaborationRequests] = useState<CollaborationRequest[]>([]);
  const [recommendedInvestors] = useState(investors.slice(0, 3));
  const [showScheduler, setShowScheduler] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'calendar' | 'meetings'>('overview');
  
  useEffect(() => {
    if (user) {
      // Load collaboration requests
      const requests = getRequestsForEntrepreneur(user.id);
      setCollaborationRequests(requests);
    }
  }, [user]);
  
  const handleRequestStatusUpdate = (requestId: string, status: 'accepted' | 'rejected') => {
    setCollaborationRequests(prevRequests => 
      prevRequests.map(req => 
        req.id === requestId ? { ...req, status } : req
      )
    );
  };
  
  if (!user) return null;
  
  const pendingRequests = collaborationRequests.filter(req => req.status === 'pending');
  const upcomingMeetings = user ? getUpcomingMeetings(user.id) : [];
  const pendingMeetingRequests = user ? getPendingRequestsForUser(user.id) : [];
  const totalPendingRequests = pendingRequests.length + pendingMeetingRequests.length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome, {user.name}</h1>
          <p className="text-gray-600">Here's what's happening with your startup today</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-full sm:w-64">
            <WalletBalanceCompact />
          </div>
          <div className="flex space-x-2">
            <Link to="/investors">
              <Button
                variant="outline"
                leftIcon={<PlusCircle size={18} />}
              >
                Find Investors
              </Button>
            </Link>
            <Button
              variant="primary"
              leftIcon={<Calendar size={18} />}
              onClick={() => setShowScheduler(true)}
            >
              Schedule Meeting
            </Button>
          </div>
        </div>
      </div>
      
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'overview'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('calendar')}
            className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'calendar'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Calendar
          </button>
          <button
            onClick={() => setActiveTab('meetings')}
            className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'meetings'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Meetings ({upcomingMeetings.length})
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <>
          {/* Summary cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-primary-50 border border-primary-100">
              <CardBody>
                <div className="flex items-center">
                  <div className="p-3 bg-primary-100 rounded-full mr-4">
                    <Bell size={20} className="text-primary-700" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-primary-700">Pending Requests</p>
                    <h3 className="text-xl font-semibold text-primary-900">{totalPendingRequests}</h3>
                  </div>
                </div>
              </CardBody>
            </Card>
            
            <Card className="bg-secondary-50 border border-secondary-100">
              <CardBody>
                <div className="flex items-center">
                  <div className="p-3 bg-secondary-100 rounded-full mr-4">
                    <Users size={20} className="text-secondary-700" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-secondary-700">Total Connections</p>
                    <h3 className="text-xl font-semibold text-secondary-900">
                      {collaborationRequests.filter(req => req.status === 'accepted').length}
                    </h3>
                  </div>
                </div>
              </CardBody>
            </Card>
            
            <Card className="bg-accent-50 border border-accent-100">
              <CardBody>
                <div className="flex items-center">
                  <div className="p-3 bg-accent-100 rounded-full mr-4">
                    <Calendar size={20} className="text-accent-700" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-accent-700">Upcoming Meetings</p>
                    <h3 className="text-xl font-semibold text-accent-900">{upcomingMeetings.length}</h3>
                  </div>
                </div>
              </CardBody>
            </Card>
            
            <Card className="bg-success-50 border border-success-100">
              <CardBody>
                <div className="flex items-center">
                  <div className="p-3 bg-green-100 rounded-full mr-4">
                    <TrendingUp size={20} className="text-success-700" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-success-700">Profile Views</p>
                    <h3 className="text-xl font-semibold text-success-900">24</h3>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Collaboration requests */}
            <div className="lg:col-span-2 space-y-4">
              <Card>
                <CardHeader className="flex justify-between items-center">
                  <h2 className="text-lg font-medium text-gray-900">Collaboration Requests</h2>
                  <Badge variant="primary">{pendingRequests.length} pending</Badge>
                </CardHeader>
                
                <CardBody>
                  {collaborationRequests.length > 0 ? (
                    <div className="space-y-4">
                      {collaborationRequests.map(request => (
                        <CollaborationRequestCard
                          key={request.id}
                          request={request}
                          onStatusUpdate={handleRequestStatusUpdate}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                        <AlertCircle size={24} className="text-gray-500" />
                      </div>
                      <p className="text-gray-600">No collaboration requests yet</p>
                      <p className="text-sm text-gray-500 mt-1">When investors are interested in your startup, their requests will appear here</p>
                    </div>
                  )}
                </CardBody>
              </Card>
            </div>
            
            {/* Recommended investors */}
            <div className="space-y-4">
              <Card>
                <CardHeader className="flex justify-between items-center">
                  <h2 className="text-lg font-medium text-gray-900">Recommended Investors</h2>
                  <Link to="/investors" className="text-sm font-medium text-primary-600 hover:text-primary-500">
                    View all
                  </Link>
                </CardHeader>
                
                <CardBody className="space-y-4">
                  {recommendedInvestors.map(investor => (
                    <InvestorCard
                      key={investor.id}
                      investor={investor}
                      showActions={false}
                    />
                  ))}
                </CardBody>
              </Card>
            </div>
          </div>
        </>
      )}

      {activeTab === 'calendar' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <MeetingCalendar />
          </div>
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
              </CardHeader>
              <CardBody className="space-y-2">
                <Button
                  variant="primary"
                  fullWidth
                  leftIcon={<Calendar size={18} />}
                  onClick={() => setShowScheduler(true)}
                >
                  Schedule New Meeting
                </Button>
                <Button
                  variant="outline"
                  fullWidth
                  leftIcon={<Clock size={18} />}
                  onClick={() => {}}
                >
                  Set Availability
                </Button>
              </CardBody>
            </Card>
            
            <Card>
              <CardHeader>
                <h3 className="text-lg font-medium text-gray-900">Upcoming Meetings</h3>
              </CardHeader>
              <CardBody>
                {upcomingMeetings.length > 0 ? (
                  <div className="space-y-3">
                    {upcomingMeetings.slice(0, 5).map(meeting => (
                      <div key={meeting.id} className="p-3 bg-gray-50 rounded-lg">
                        <p className="font-medium text-gray-900">{meeting.title}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(meeting.startTime).toLocaleDateString()} at{' '}
                          {new Date(meeting.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">No upcoming meetings</p>
                )}
              </CardBody>
            </Card>
          </div>
        </div>
      )}

      {activeTab === 'meetings' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader>
                <h2 className="text-lg font-medium text-gray-900">Meeting Requests</h2>
              </CardHeader>
              <CardBody>
                {pendingMeetingRequests.length > 0 ? (
                  <div className="space-y-4">
                    {pendingMeetingRequests.map(request => (
                      <MeetingRequestCard
                        key={request.id}
                        request={request}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-600">No pending meeting requests</p>
                    <p className="text-sm text-gray-500 mt-1">When investors request meetings with you, they will appear here</p>
                  </div>
                )}
              </CardBody>
            </Card>
            
            <Card>
              <CardHeader>
                <h2 className="text-lg font-medium text-gray-900">Upcoming Meetings</h2>
              </CardHeader>
              <CardBody>
                {upcomingMeetings.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingMeetings.map(meeting => (
                      <div key={meeting.id} className="p-4 border border-gray-200 rounded-lg hover:border-primary-200 transition-colors">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-gray-900">{meeting.title}</h4>
                            <p className="text-sm text-gray-500 mt-1">
                              {new Date(meeting.startTime).toLocaleDateString()} at{' '}
                              {new Date(meeting.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                            {meeting.meetingLink && (
                              <a
                                href={meeting.meetingLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-primary-600 hover:text-primary-500 mt-2 inline-block"
                              >
                                Join Meeting →
                              </a>
                            )}
                          </div>
                          <Badge variant={meeting.status === 'accepted' ? 'success' : 'warning'}>
                            {meeting.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-600">No upcoming meetings</p>
                    <Button
                      variant="outline"
                      className="mt-3"
                      onClick={() => setShowScheduler(true)}
                    >
                      Schedule a Meeting
                    </Button>
                  </div>
                )}
              </CardBody>
            </Card>
          </div>
          
          <div className="space-y-4">
            <Card>
              <CardBody className="text-center py-6">
                <Calendar className="w-12 h-12 text-primary-500 mx-auto mb-3" />
                <h4 className="font-medium text-gray-900">Quick Stats</h4>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-primary-600">{upcomingMeetings.length}</p>
                    <p className="text-xs text-gray-500">This Week</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-secondary-600">{pendingMeetingRequests.length}</p>
                    <p className="text-xs text-gray-500">Pending</p>
                  </div>
                </div>
              </CardBody>
            </Card>
            
            <Button
              variant="primary"
              fullWidth
              leftIcon={<PlusCircle size={18} />}
              onClick={() => setShowScheduler(true)}
            >
              Schedule New Meeting
            </Button>
          </div>
        </div>
      )}

      {/* Meeting Scheduler Modal */}
      <MeetingScheduler
        isOpen={showScheduler}
        onClose={() => setShowScheduler(false)}
      />
      
      {/* Walkthrough */}
      <Walkthrough userRole="entrepreneur" />
    </div>
  );
};
