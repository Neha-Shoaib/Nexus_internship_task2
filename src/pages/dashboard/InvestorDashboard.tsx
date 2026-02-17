import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, PieChart, Filter, Search, PlusCircle, Calendar, Clock, AlertCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { EntrepreneurCard } from '../../components/entrepreneur/EntrepreneurCard';
import { MeetingCalendar } from '../../components/meetings/MeetingCalendar';
import { MeetingScheduler } from '../../components/meetings/MeetingScheduler';
import { MeetingRequestCard } from '../../components/meetings/MeetingRequestCard';
import { WalletBalanceCompact } from '../../components/payment/WalletBalance';
import { Walkthrough } from '../../components/walkthrough/Walkthrough';
import { useAuth } from '../../context/AuthContext';
import { useMeeting } from '../../context/MeetingContext';
import { Entrepreneur } from '../../types';
import { entrepreneurs } from '../../data/users';
import { getRequestsFromInvestor } from '../../data/collaborationRequests';

export const InvestorDashboard: React.FC = () => {
  const { user } = useAuth();
  const { getUpcomingMeetings, getPendingRequestsForUser } = useMeeting();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [showScheduler, setShowScheduler] = useState(false);
  const [activeTab, setActiveTab] = useState<'discover' | 'calendar' | 'meetings'>('discover');
  
  if (!user) return null;
  
  // Get collaboration requests sent by this investor
  const sentRequests = getRequestsFromInvestor(user.id);
  const requestedEntrepreneurIds = sentRequests.map(req => req.entrepreneurId);
  
  // Filter entrepreneurs based on search and industry filters
  const filteredEntrepreneurs = entrepreneurs.filter(entrepreneur => {
    // Search filter
    const matchesSearch = searchQuery === '' || 
      entrepreneur.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entrepreneur.startupName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entrepreneur.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entrepreneur.pitchSummary.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Industry filter
    const matchesIndustry = selectedIndustries.length === 0 || 
      selectedIndustries.includes(entrepreneur.industry);
    
    return matchesSearch && matchesIndustry;
  });
  
  // Get unique industries for filter
  const industries = Array.from(new Set(entrepreneurs.map(e => e.industry)));
  
  // Toggle industry selection
  const toggleIndustry = (industry: string) => {
    setSelectedIndustries(prevSelected => 
      prevSelected.includes(industry)
        ? prevSelected.filter(i => i !== industry)
        : [...prevSelected, industry]
    );
  };

  const upcomingMeetings = getUpcomingMeetings(user.id);
  const pendingMeetingRequests = getPendingRequestsForUser(user.id);
  
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {activeTab === 'discover' ? 'Discover Startups' : 
             activeTab === 'calendar' ? 'My Calendar' : 'My Meetings'}
          </h1>
          <p className="text-gray-600">
            {activeTab === 'discover' 
              ? 'Find and connect with promising entrepreneurs' 
              : activeTab === 'calendar'
              ? 'Manage your schedule and meetings'
              : 'View and manage your meetings'}
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-full sm:w-64">
            <WalletBalanceCompact />
          </div>
          <Button
            variant="primary"
            leftIcon={<Calendar size={18} />}
            onClick={() => setShowScheduler(true)}
          >
            Schedule Meeting
          </Button>
        </div>
      </div>
      
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('discover')}
            className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'discover'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Discover
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
      {activeTab === 'discover' && (
        <>
          {/* Stats summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-primary-50 border border-primary-100">
              <CardBody>
                <div className="flex items-center">
                  <div className="p-3 bg-primary-100 rounded-full mr-4">
                    <Users size={20} className="text-primary-700" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-primary-700">Total Startups</p>
                    <h3 className="text-xl font-semibold text-primary-900">{entrepreneurs.length}</h3>
                  </div>
                </div>
              </CardBody>
            </Card>
            
            <Card className="bg-secondary-50 border border-secondary-100">
              <CardBody>
                <div className="flex items-center">
                  <div className="p-3 bg-secondary-100 rounded-full mr-4">
                    <PieChart size={20} className="text-secondary-700" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-secondary-700">Industries</p>
                    <h3 className="text-xl font-semibold text-secondary-900">{industries.length}</h3>
                  </div>
                </div>
              </CardBody>
            </Card>
            
            <Card className="bg-accent-50 border border-accent-100">
              <CardBody>
                <div className="flex items-center">
                  <div className="p-3 bg-accent-100 rounded-full mr-4">
                    <Users size={20} className="text-accent-700" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-accent-700">Your Connections</p>
                    <h3 className="text-xl font-semibold text-accent-900">
                      {sentRequests.filter(req => req.status === 'accepted').length}
                    </h3>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
          
          {/* Filters and search */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-2/3">
              <Input
                placeholder="Search startups, industries, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                fullWidth
                startAdornment={<Search size={18} />}
              />
            </div>
            
            <div className="w-full md:w-1/3">
              <div className="flex items-center space-x-2">
                <Filter size={18} className="text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Filter by:</span>
                
                <div className="flex flex-wrap gap-2">
                  {industries.map(industry => (
                    <Badge
                      key={industry}
                      variant={selectedIndustries.includes(industry) ? 'primary' : 'gray'}
                      className="cursor-pointer"
                      onClick={() => toggleIndustry(industry)}
                    >
                      {industry}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Entrepreneurs grid */}
          <div>
            <Card>
              <CardHeader>
                <h2 className="text-lg font-medium text-gray-900">Featured Startups</h2>
              </CardHeader>
              
              <CardBody>
                {filteredEntrepreneurs.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredEntrepreneurs.map(entrepreneur => (
                      <EntrepreneurCard
                        key={entrepreneur.id}
                        entrepreneur={entrepreneur}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                      <AlertCircle size={24} className="text-gray-500" />
                    </div>
                    <p className="text-gray-600">No startups match your filters</p>
                    <Button 
                      variant="outline" 
                      className="mt-2"
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedIndustries([]);
                      }}
                    >
                      Clear filters
                    </Button>
                  </div>
                )}
              </CardBody>
            </Card>
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
      <Walkthrough userRole="investor" />
    </div>
  );
};
