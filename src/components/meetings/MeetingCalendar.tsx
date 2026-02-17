import React, { useCallback, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import { Meeting } from '../../types';
import { useMeeting } from '../../context/MeetingContext';
import { useAuth } from '../../context/AuthContext';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, X, Video, ExternalLink } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card, CardBody, CardHeader } from '../ui/Card';

interface MeetingCalendarProps {
  onDateSelect?: (selectInfo: any) => void;
  onEventClick?: (event: any) => void;
}

export const MeetingCalendar: React.FC<MeetingCalendarProps> = ({ 
  onDateSelect, 
  onEventClick 
}) => {
  const { user } = useAuth();
  const { meetings, deleteMeeting, updateMeeting } = useMeeting();
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [showMeetingDetails, setShowMeetingDetails] = useState(false);

  // Filter meetings for the current user
  const userMeetings = user 
    ? meetings.filter(m => m.organizerId === user.id || m.attendeeId === user.id)
    : [];

  // Convert meetings to calendar events
  const events = userMeetings.map(meeting => ({
    id: meeting.id,
    title: meeting.title,
    start: meeting.startTime,
    end: meeting.endTime,
    backgroundColor: getMeetingColor(meeting.status),
    borderColor: getMeetingColor(meeting.status),
    extendedProps: {
      description: meeting.description,
      status: meeting.status,
      meetingLink: meeting.meetingLink,
      notes: meeting.notes,
    },
  }));

  function getMeetingColor(status: string): string {
    switch (status) {
      case 'accepted':
        return '#22c55e'; // success-500
      case 'pending':
        return '#f59e0b'; // warning-500
      case 'declined':
        return '#ef4444'; // error-500
      case 'cancelled':
        return '#6b7280'; // gray-500
      case 'completed':
        return '#3b82f6'; // primary-500
      default:
        return '#3b82f6';
    }
  }

  const handleEventClick = useCallback((info: any) => {
    const meeting = userMeetings.find(m => m.id === info.event.id);
    if (meeting) {
      setSelectedMeeting(meeting);
      setShowMeetingDetails(true);
    }
    onEventClick?.(info);
  }, [userMeetings, onEventClick]);

  const handleSelect = useCallback((info: any) => {
    onDateSelect?.(info);
  }, [onDateSelect]);

  const handleCancelMeeting = async (meetingId: string) => {
    await updateMeeting(meetingId, { status: 'cancelled' });
    setShowMeetingDetails(false);
    setSelectedMeeting(null);
  };

  const handleJoinMeeting = (meetingLink: string | undefined) => {
    if (meetingLink) {
      window.open(meetingLink, '_blank');
    }
  };

  return (
    <>
      <Card className="overflow-hidden">
        <CardBody className="p-0">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
            }}
            events={events}
            eventClick={handleEventClick}
            selectable={true}
            select={handleSelect}
            selectMirror={true}
            dayMaxEvents={true}
            weekends={true}
            height="auto"
            eventTimeFormat={{
              hour: '2-digit',
              minute: '2-digit',
              meridiem: 'short',
            }}
            slotMinTime="08:00:00"
            slotMaxTime="20:00:00"
            allDaySlot={false}
            nowIndicator={true}
            eventContent={(eventInfo) => (
              <div className="flex items-center px-1 py-0.5 overflow-hidden">
                <div 
                  className="w-2 h-2 rounded-full mr-1.5 flex-shrink-0"
                  style={{ backgroundColor: eventInfo.event.backgroundColor }}
                />
                <span className="text-xs font-medium truncate">{eventInfo.event.title}</span>
              </div>
            )}
          />
        </CardBody>
      </Card>

      {/* Meeting Details Modal */}
      {showMeetingDetails && selectedMeeting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md mx-4 animate-slide-in">
            <Card className="bg-white shadow-xl">
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CalendarIcon className="w-5 h-5 text-primary-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Meeting Details</h3>
                </div>
                <button 
                  onClick={() => {
                    setShowMeetingDetails(false);
                    setSelectedMeeting(null);
                  }}
                  className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </CardHeader>
              <CardBody className="space-y-4">
                <div>
                  <h4 className="text-xl font-bold text-gray-900">{selectedMeeting.title}</h4>
                  <p className="text-sm text-gray-500 mt-1 capitalize">{selectedMeeting.status}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="font-medium w-20">Start:</span>
                    <span>{format(new Date(selectedMeeting.startTime), 'PPp')}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="font-medium w-20">End:</span>
                    <span>{format(new Date(selectedMeeting.endTime), 'PPp')}</span>
                  </div>
                  {selectedMeeting.description && (
                    <div className="mt-3">
                      <p className="text-sm font-medium text-gray-700">Description:</p>
                      <p className="text-sm text-gray-600 mt-1">{selectedMeeting.description}</p>
                    </div>
                  )}
                  {selectedMeeting.notes && (
                    <div className="mt-3">
                      <p className="text-sm font-medium text-gray-700">Notes:</p>
                      <p className="text-sm text-gray-600 mt-1">{selectedMeeting.notes}</p>
                    </div>
                  )}
                </div>

                {selectedMeeting.status === 'accepted' && (
                  <div className="pt-4 border-t border-gray-200">
                    {selectedMeeting.meetingLink ? (
                      <Button
                        variant="primary"
                        fullWidth
                        leftIcon={<Video className="w-4 h-4" />}
                        onClick={() => handleJoinMeeting(selectedMeeting.meetingLink)}
                      >
                        Join Meeting
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        fullWidth
                        leftIcon={<ExternalLink className="w-4 h-4" />}
                        onClick={() => handleJoinMeeting(selectedMeeting.meetingLink)}
                      >
                        No Meeting Link
                      </Button>
                    )}
                  </div>
                )}

                {selectedMeeting.status !== 'cancelled' && selectedMeeting.status !== 'completed' && (
                  <div className="pt-4 border-t border-gray-200 flex space-x-3">
                    {selectedMeeting.status === 'pending' && (
                      <Button
                        variant="success"
                        fullWidth
                        onClick={() => {
                          // Accept meeting logic would go here
                          setShowMeetingDetails(false);
                          setSelectedMeeting(null);
                        }}
                      >
                        Accept
                      </Button>
                    )}
                    <Button
                      variant="error"
                      fullWidth
                      onClick={() => handleCancelMeeting(selectedMeeting.id)}
                    >
                      Cancel Meeting
                    </Button>
                  </div>
                )}
              </CardBody>
            </Card>
          </div>
        </div>
      )}
    </>
  );
};
