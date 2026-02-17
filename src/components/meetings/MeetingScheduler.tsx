import React, { useState } from 'react';
import { X, Calendar, Clock, Video, MessageSquare, Send } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card, CardBody, CardHeader } from '../ui/Card';
import { useMeeting } from '../../context/MeetingContext';
import { useAuth } from '../../context/AuthContext';
import { format, addMinutes } from 'date-fns';
import toast from 'react-hot-toast';
import { entrepreneurs, investors } from '../../data/users';

interface MeetingSchedulerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate?: Date;
  selectedTimeRange?: { start: string; end: string };
  attendeeId?: string;
}

export const MeetingScheduler: React.FC<MeetingSchedulerProps> = ({
  isOpen,
  onClose,
  selectedDate,
  selectedTimeRange,
  attendeeId: preselectedAttendeeId,
}) => {
  const { user } = useAuth();
  const { sendMeetingRequest, createMeeting } = useMeeting();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(
    selectedDate ? format(selectedDate, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd')
  );
  const [startTime, setStartTime] = useState(selectedTimeRange?.start || '09:00');
  const [duration, setDuration] = useState(30);
  const [attendeeId, setAttendeeId] = useState(preselectedAttendeeId || '');
  const [meetingLink, setMeetingLink] = useState('');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Get list of potential attendees based on user role
  const potentialAttendees = user?.role === 'entrepreneur' ? investors : entrepreneurs;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error('You must be logged in to schedule a meeting');
      return;
    }

    if (!title || !date || !startTime || !attendeeId) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsLoading(true);

    try {
      const startDateTime = new Date(`${date}T${startTime}`);
      const endDateTime = addMinutes(startDateTime, duration);

      // First send a meeting request
      await sendMeetingRequest({
        senderId: user.id,
        receiverId: attendeeId,
        proposedTime: startDateTime.toISOString(),
        duration,
        message: description,
      });

      // Then create the meeting
      await createMeeting({
        title,
        description,
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
        organizerId: user.id,
        attendeeId,
        status: 'pending',
        meetingLink: meetingLink || undefined,
        notes: notes || undefined,
      });

      // Reset form and close
      setTitle('');
      setDescription('');
      setAttendeeId('');
      setMeetingLink('');
      setNotes('');
      onClose();
    } catch (error) {
      console.error('Failed to schedule meeting:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg mx-4 animate-slide-in max-h-[90vh] overflow-y-auto">
        <Card className="bg-white shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between sticky top-0 bg-white z-10 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-primary-600" />
              <h3 className="text-lg font-semibold text-gray-900">Schedule a Meeting</h3>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </CardHeader>
          <CardBody className="p-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meeting Title *
                </label>
                <Input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Pitch Discussion"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What would you like to discuss?"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none text-sm"
                  rows={3}
                />
              </div>

              {/* Date and Time */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date *
                  </label>
                  <Input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Time *
                  </label>
                    <Input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration
                </label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                >
                  <option value={15}>15 minutes</option>
                  <option value={30}>30 minutes</option>
                  <option value={45}>45 minutes</option>
                  <option value={60}>1 hour</option>
                  <option value={90}>1.5 hours</option>
                  <option value={120}>2 hours</option>
                </select>
              </div>

              {/* Attendee Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Attendee *
                </label>
                <select
                  value={attendeeId}
                  onChange={(e) => setAttendeeId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                  required
                >
                  <option value="">Select a person...</option>
                  {potentialAttendees.map((person: any) => (
                    <option key={person.id} value={person.id}>
                      {person.name} - {person.role === 'investor' ? 'Investor' : 'Entrepreneur'}
                    </option>
                  ))}
                </select>
              </div>

              {/* Meeting Link */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Video className="w-4 h-4 inline-block mr-1" />
                  Meeting Link (optional)
                </label>
                <Input
                  type="url"
                  value={meetingLink}
                  onChange={(e) => setMeetingLink(e.target.value)}
                  placeholder="https://zoom.us/j/..."
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <MessageSquare className="w-4 h-4 inline-block mr-1" />
                  Notes
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any additional notes..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none text-sm"
                  rows={2}
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex space-x-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  fullWidth
                  onClick={onClose}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  isLoading={isLoading}
                  leftIcon={<Send className="w-4 h-4" />}
                >
                  Send Request
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};
