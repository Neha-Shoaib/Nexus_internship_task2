import React, { useState } from 'react';
import { Plus, Trash2, Clock, Calendar, Check, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card, CardBody, CardHeader } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { useMeeting } from '../../context/MeetingContext';
import { AvailabilitySlot } from '../../types';
import toast from 'react-hot-toast';

const DAYS_OF_WEEK = [
  { value: 0, label: 'Sunday', short: 'Sun' },
  { value: 1, label: 'Monday', short: 'Mon' },
  { value: 2, label: 'Tuesday', short: 'Tue' },
  { value: 3, label: 'Wednesday', short: 'Wed' },
  { value: 4, label: 'Thursday', short: 'Thu' },
  { value: 5, label: 'Friday', short: 'Fri' },
  { value: 6, label: 'Saturday', short: 'Sat' },
];

export const AvailabilityManager: React.FC = () => {
  const { availabilitySlots, addAvailabilitySlot, removeAvailabilitySlot } = useMeeting();
  
  const [showForm, setShowForm] = useState(false);
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');
  const [isRecurring, setIsRecurring] = useState(true);

  const handleAddSlot = async (e: React.FormEvent) => {
    e.preventDefault();

    if (startTime >= endTime) {
      toast.error('End time must be after start time');
      return;
    }

    try {
      await addAvailabilitySlot({
        dayOfWeek: selectedDay,
        startTime,
        endTime,
        isRecurring,
      });

      // Reset form
      setStartTime('09:00');
      setEndTime('17:00');
      setShowForm(false);
    } catch (error) {
      console.error('Failed to add availability slot:', error);
    }
  };

  const handleRemoveSlot = async (slotId: string) => {
    try {
      await removeAvailabilitySlot(slotId);
    } catch (error) {
      console.error('Failed to remove availability slot:', error);
    }
  };

  const getSlotsForDay = (day: number): AvailabilitySlot[] => {
    return availabilitySlots.filter(slot => slot.dayOfWeek === day);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center space-x-2">
          <Clock className="w-5 h-5 text-primary-600" />
          <h3 className="text-lg font-semibold text-gray-900">Availability</h3>
        </div>
        <Button
          variant="outline"
          size="sm"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => setShowForm(true)}
        >
          Add Slot
        </Button>
      </CardHeader>
      <CardBody className="space-y-4">
        {/* Add Slot Form */}
        {showForm && (
          <form onSubmit={handleAddSlot} className="p-4 bg-gray-50 rounded-lg space-y-4 animate-fade-in">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-gray-700">Add Availability Slot</h4>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="p-1 rounded-full hover:bg-gray-200 transition-colors"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Day
                </label>
                <select
                  value={selectedDay}
                  onChange={(e) => setSelectedDay(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                >
                  {DAYS_OF_WEEK.map((day) => (
                    <option key={day.value} value={day.value}>
                      {day.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center pt-6">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isRecurring}
                    onChange={(e) => setIsRecurring(e.target.checked)}
                    className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700">Recurring weekly</span>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Time
                </label>
                <Input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Time
                </label>
                <Input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
              >
                Add Slot
              </Button>
            </div>
          </form>
        )}

        {/* Weekly Schedule */}
        <div className="space-y-3">
          {DAYS_OF_WEEK.map((day) => {
            const daySlots = getSlotsForDay(day.value);
            const isToday = new Date().getDay() === day.value;
            
            return (
              <div
                key={day.value}
                className={`p-3 rounded-lg border ${
                  isToday 
                    ? 'bg-primary-50 border-primary-200' 
                    : 'bg-white border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className={`font-medium ${isToday ? 'text-primary-700' : 'text-gray-700'}`}>
                      {day.label}
                    </span>
                    {isToday && (
                      <Badge variant="primary" size="sm">Today</Badge>
                    )}
                  </div>
                  <Badge variant={daySlots.length > 0 ? 'success' : 'gray'} size="sm">
                    {daySlots.length} slot{daySlots.length !== 1 ? 's' : ''}
                  </Badge>
                </div>

                {daySlots.length > 0 ? (
                  <div className="space-y-2">
                    {daySlots.map((slot) => (
                      <div
                        key={slot.id}
                        className="flex items-center justify-between p-2 bg-white rounded-md border border-gray-200"
                      >
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {slot.startTime} - {slot.endTime}
                          </span>
                          {slot.isRecurring && (
                            <Badge variant="secondary" size="sm">Weekly</Badge>
                          )}
                        </div>
                        <button
                          onClick={() => handleRemoveSlot(slot.id)}
                          className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400 italic">No availability set</p>
                )}
              </div>
            );
          })}
        </div>
      </CardBody>
    </Card>
  );
};
