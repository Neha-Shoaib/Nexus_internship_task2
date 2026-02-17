import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { VideoCall } from '../../components/meetings/VideoCall';
import { Button } from '../../components/ui/Button';
import { ArrowLeft } from 'lucide-react';

export const VideoCallPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const meetingId = searchParams.get('meetingId') || 'demo-meeting';
  const participantName = searchParams.get('participant') || 'John Doe';

  const handleEndCall = () => {
    // Navigate back to previous page or dashboard
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4 md:p-6">
      {/* Header - Only show on larger screens */}
      <div className="max-w-6xl mx-auto mb-4 flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
          className="text-white hover:bg-white/10"
        >
          <span className="hidden sm:inline">Back</span>
        </Button>
        
        <div className="text-white">
          <h1 className="text-lg md:text-xl font-bold">Video Call</h1>
          <p className="text-sm text-gray-400 hidden sm:block">Connect with your partners through video calls</p>
        </div>
        
        <div className="w-20 hidden sm:block"></div>
      </div>
      
      {/* Video Call Component */}
      <div className="max-w-6xl mx-auto">
        <VideoCall
          meetingId={meetingId}
          participantName={participantName}
          onEndCall={handleEndCall}
        />
      </div>
    </div>
  );
};
