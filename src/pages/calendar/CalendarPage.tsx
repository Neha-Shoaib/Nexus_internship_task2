import React, { useState } from 'react';
import { Calendar as CalendarIcon, Plus, Clock } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { MeetingCalendar } from '../../components/meetings/MeetingCalendar';
import { MeetingScheduler } from '../../components/meetings/MeetingScheduler';
import { useMeeting } from '../../context/MeetingContext';
import { useAuth } from '../../context/AuthContext';

export const CalendarPage: React.FC = () => {
  const { user } = useAuth();
  const { getUpcomingMeetings } = useMeeting();
  const [showScheduler, setShowScheduler] = useState(false);

  if (!user) return null;

  const upcomingMeetings = getUpcomingMeetings(user.id);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Calendar</h1>
          <p className="text-gray-600">Manage your meetings and schedule</p>
        </div>
        
        <Button
          variant="primary"
          leftIcon={<Plus size={18} />}
          onClick={() => setShowScheduler(true)}
        >
          Schedule Meeting
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Calendar */}
        <div className="lg:col-span-3">
          <MeetingCalendar />
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-medium text-gray-900">Quick Stats</h3>
            </CardHeader>
            <CardBody className="text-center py-6">
              <CalendarIcon className="w-12 h-12 text-primary-500 mx-auto mb-3" />
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-primary-600">{upcomingMeetings.length}</p>
                  <p className="text-xs text-gray-500">Upcoming</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-secondary-600">
                    {upcomingMeetings.filter(m => {
                      const day = 24 * 60 * 60 * 1000;
                      const now = new Date();
                      const meetingDate = new Date(m.startTime);
                      return meetingDate.getTime() - now.getTime() <= day;
                    }).length}
                  </p>
                  <p className="text-xs text-gray-500">Today</p>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Upcoming Meetings */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-medium text-gray-900">Today's Meetings</h3>
            </CardHeader>
            <CardBody>
              {upcomingMeetings.length > 0 ? (
                <div className="space-y-3">
                  {upcomingMeetings.slice(0, 5).map(meeting => (
                    <div key={meeting.id} className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <p className="font-medium text-gray-900">{meeting.title}</p>
                      <div className="flex items-center mt-1 text-sm text-gray-500">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>
                          {new Date(meeting.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No upcoming meetings</p>
              )}
            </CardBody>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
            </CardHeader>
            <CardBody className="space-y-2">
              <Button
                variant="primary"
                fullWidth
                leftIcon={<Plus size={18} />}
                onClick={() => setShowScheduler(true)}
              >
                Schedule New Meeting
              </Button>
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Meeting Scheduler Modal */}
      <MeetingScheduler
        isOpen={showScheduler}
        onClose={() => setShowScheduler(false)}
      />
    </div>
  );
};
