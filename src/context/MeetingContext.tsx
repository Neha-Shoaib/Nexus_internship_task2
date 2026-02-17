import React, { createContext, useState, useContext, useCallback } from 'react';
import { Meeting, MeetingRequest, AvailabilitySlot, MeetingContextType } from '../types';
import toast from 'react-hot-toast';

// Mock data for meetings
const mockMeetings: Meeting[] = [
  {
    id: 'm1',
    title: 'Pitch Meeting - Tech Startup',
    description: 'Initial pitch discussion for Series A funding',
    startTime: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
    endTime: new Date(Date.now() + 86400000 + 3600000).toISOString(), // 1 hour later
    organizerId: 'i1',
    attendeeId: 'e1',
    status: 'accepted',
    meetingLink: 'https://zoom.us/j/123456789',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'm2',
    title: 'Follow-up Call',
    description: 'Discuss next steps after initial review',
    startTime: new Date(Date.now() + 172800000).toISOString(), // 2 days later
    endTime: new Date(Date.now() + 172800000 + 1800000).toISOString(),
    organizerId: 'e1',
    attendeeId: 'i1',
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const mockMeetingRequests: MeetingRequest[] = [
  {
    id: 'mr1',
    senderId: 'i1',
    receiverId: 'e1',
    proposedTime: new Date(Date.now() + 259200000).toISOString(), // 3 days later
    duration: 45,
    message: 'I would like to schedule a meeting to discuss your startup in more detail.',
    status: 'pending',
    createdAt: new Date().toISOString(),
  },
];

const mockAvailabilitySlots: AvailabilitySlot[] = [
  { id: 'a1', dayOfWeek: 1, startTime: '09:00', endTime: '12:00', isRecurring: true },
  { id: 'a2', dayOfWeek: 3, startTime: '14:00', endTime: '17:00', isRecurring: true },
  { id: 'a3', dayOfWeek: 5, startTime: '10:00', endTime: '15:00', isRecurring: true },
];

// Create Meeting Context
const MeetingContext = createContext<MeetingContextType | undefined>(undefined);

// Meeting Provider Component
export const MeetingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [meetings, setMeetings] = useState<Meeting[]>(mockMeetings);
  const [meetingRequests, setMeetingRequests] = useState<MeetingRequest[]>(mockMeetingRequests);
  const [availabilitySlots, setAvailabilitySlots] = useState<AvailabilitySlot[]>(mockAvailabilitySlots);
  const [isLoading, setIsLoading] = useState(false);

  // Generate unique ID
  const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // Create a new meeting
  const createMeeting = useCallback(async (meeting: Omit<Meeting, 'id' | 'createdAt' | 'updatedAt'>): Promise<Meeting> => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));

      const newMeeting: Meeting = {
        ...meeting,
        id: generateId(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setMeetings(prev => [...prev, newMeeting]);
      toast.success('Meeting scheduled successfully!');
      return newMeeting;
    } catch (error) {
      toast.error('Failed to create meeting');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Update an existing meeting
  const updateMeeting = useCallback(async (meetingId: string, updates: Partial<Meeting>): Promise<void> => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      setMeetings(prev => 
        prev.map(m => 
          m.id === meetingId 
            ? { ...m, ...updates, updatedAt: new Date().toISOString() } 
            : m
        )
      );
      toast.success('Meeting updated successfully!');
    } catch (error) {
      toast.error('Failed to update meeting');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Delete a meeting
  const deleteMeeting = useCallback(async (meetingId: string): Promise<void> => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      setMeetings(prev => prev.filter(m => m.id !== meetingId));
      toast.success('Meeting cancelled successfully!');
    } catch (error) {
      toast.error('Failed to cancel meeting');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Send a meeting request
  const sendMeetingRequest = useCallback(async (
    request: Omit<MeetingRequest, 'id' | 'createdAt' | 'status'>
  ): Promise<MeetingRequest> => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      const newRequest: MeetingRequest = {
        ...request,
        id: generateId(),
        status: 'pending',
        createdAt: new Date().toISOString(),
      };

      setMeetingRequests(prev => [...prev, newRequest]);
      toast.success('Meeting request sent successfully!');
      return newRequest;
    } catch (error) {
      toast.error('Failed to send meeting request');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Respond to a meeting request
  const respondToMeetingRequest = useCallback(async (
    requestId: string, 
    status: 'accepted' | 'declined'
  ): Promise<void> => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      const request = meetingRequests.find(r => r.id === requestId);
      if (!request) throw new Error('Request not found');

      setMeetingRequests(prev => 
        prev.map(r => r.id === requestId ? { ...r, status } : r)
      );

      // If accepted, create a meeting from the request
      if (status === 'accepted' && request.meetingId === undefined) {
        const newMeeting: Meeting = {
          id: generateId(),
          title: 'Meeting',
          startTime: request.proposedTime,
          endTime: new Date(new Date(request.proposedTime).getTime() + request.duration * 60000).toISOString(),
          organizerId: request.senderId,
          attendeeId: request.receiverId,
          status: 'accepted',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setMeetings(prev => [...prev, newMeeting]);
      }

      toast.success(`Meeting request ${status}!`);
    } catch (error) {
      toast.error('Failed to respond to meeting request');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [meetingRequests]);

  // Add availability slot
  const addAvailabilitySlot = useCallback(async (
    slot: Omit<AvailabilitySlot, 'id'>
  ): Promise<void> => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      const newSlot: AvailabilitySlot = {
        ...slot,
        id: generateId(),
      };

      setAvailabilitySlots(prev => [...prev, newSlot]);
      toast.success('Availability slot added!');
    } catch (error) {
      toast.error('Failed to add availability slot');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Remove availability slot
  const removeAvailabilitySlot = useCallback(async (slotId: string): Promise<void> => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      setAvailabilitySlots(prev => prev.filter(s => s.id !== slotId));
      toast.success('Availability slot removed!');
    } catch (error) {
      toast.error('Failed to remove availability slot');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Get meetings for a specific user
  const getMeetingsForUser = useCallback((userId: string): Meeting[] => {
    return meetings.filter(m => 
      m.organizerId === userId || m.attendeeId === userId
    );
  }, [meetings]);

  // Get pending requests for a user
  const getPendingRequestsForUser = useCallback((userId: string): MeetingRequest[] => {
    return meetingRequests.filter(r => 
      r.receiverId === userId && r.status === 'pending'
    );
  }, [meetingRequests]);

  // Get upcoming meetings for a user
  const getUpcomingMeetings = useCallback((userId: string): Meeting[] => {
    const now = new Date();
    return meetings.filter(m => 
      (m.organizerId === userId || m.attendeeId === userId) &&
      m.status !== 'cancelled' &&
      new Date(m.startTime) > now
    ).sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
  }, [meetings]);

  const value: MeetingContextType = {
    meetings,
    meetingRequests,
    availabilitySlots,
    createMeeting,
    updateMeeting,
    deleteMeeting,
    sendMeetingRequest,
    respondToMeetingRequest,
    addAvailabilitySlot,
    removeAvailabilitySlot,
    getMeetingsForUser,
    getPendingRequestsForUser,
    getUpcomingMeetings,
    isLoading,
  };

  return (
    <MeetingContext.Provider value={value}>
      {children}
    </MeetingContext.Provider>
  );
};

// Custom hook to use meeting context
export const useMeeting = (): MeetingContextType => {
  const context = useContext(MeetingContext);
  if (context === undefined) {
    throw new Error('useMeeting must be used within a MeetingProvider');
  }
  return context;
};
