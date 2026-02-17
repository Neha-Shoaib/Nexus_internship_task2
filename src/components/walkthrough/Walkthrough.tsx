import React, { useState, useEffect, useCallback } from 'react';
import ReactJoyride, { Step, CallBackProps, TooltipRenderProps } from 'react-joyride';
import { useLocation } from 'react-router-dom';
import { Home, Users, Calendar, MessageCircle, DollarSign, FileText, Bell, Settings, HelpCircle, Briefcase } from 'lucide-react';

// Get current page info
const usePageInfo = () => {
  const location = useLocation();
  const path = location.pathname;
  
  let pageName = 'Dashboard';
  let userRole: 'entrepreneur' | 'investor' = 'entrepreneur';
  
  if (path.includes('/dashboard/entrepreneur') || path === '/dashboard') {
    pageName = 'Dashboard';
    userRole = 'entrepreneur';
  } else if (path.includes('/dashboard/investor')) {
    pageName = 'Dashboard';
    userRole = 'investor';
  } else if (path.includes('/investors')) {
    pageName = 'Find Investors';
    userRole = 'entrepreneur';
  } else if (path.includes('/entrepreneurs')) {
    pageName = 'Find Startups';
    userRole = 'investor';
  } else if (path.includes('/calendar')) {
    pageName = 'Calendar';
  } else if (path.includes('/messages') || path.includes('/chat')) {
    pageName = 'Messages';
  } else if (path.includes('/payments')) {
    pageName = 'Payments';
  } else if (path.includes('/documents')) {
    pageName = 'Documents';
  } else if (path.includes('/notifications')) {
    pageName = 'Notifications';
  } else if (path.includes('/deals')) {
    pageName = 'Deals';
  } else if (path.includes('/settings')) {
    pageName = 'Settings';
  } else if (path.includes('/help')) {
    pageName = 'Help & Support';
  }
  
  return { pageName, userRole };
};

// Steps for entrepreneur
const getEntrepreneurSteps = (currentPage: string): Step[] => [
  {
    target: '[data-tour="dashboard"]',
    content: currentPage === 'Dashboard' 
      ? 'This is your dashboard. It shows an overview of your startup activities, pending requests, upcoming meetings, and key metrics.'
      : 'Click here to go to your Dashboard - shows overview of your startup activities.',
    title: 'Dashboard',
    placement: 'right',
  },
  {
    target: '[data-tour="investors"]',
    content: currentPage === 'Find Investors'
      ? 'Browse and connect with investors. Send collaboration requests and pitch your startup.'
      : 'Find and connect with investors interested in your industry.',
    title: 'Find Investors',
    placement: 'right',
  },
  {
    target: '[data-tour="calendar"]',
    content: currentPage === 'Calendar'
      ? 'Schedule and manage meetings with investors. Set your availability and track appointments.'
      : 'Manage your schedule and meetings with investors.',
    title: 'Calendar',
    placement: 'right',
  },
  {
    target: '[data-tour="messages"]',
    content: currentPage === 'Messages'
      ? 'Chat directly with investors and collaborators.'
      : 'Chat with investors and collaborators.',
    title: 'Messages',
    placement: 'right',
  },
  {
    target: '[data-tour="payments"]',
    content: currentPage === 'Payments'
      ? 'Manage your funds, track transactions, and receive funding from investors.'
      : 'View wallet balance and transaction history.',
    title: 'Payments',
    placement: 'right',
  },
  {
    target: '[data-tour="documents"]',
    content: currentPage === 'Documents'
      ? 'Store and share documents. You can also e-sign documents here.'
      : 'Store and share important documents.',
    title: 'Documents',
    placement: 'right',
  },
  {
    target: '[data-tour="notifications"]',
    content: currentPage === 'Notifications'
      ? 'Stay updated with notifications about messages, meetings, and funding.'
      : 'View all your notifications.',
    title: 'Notifications',
    placement: 'left',
  },
  {
    target: '[data-tour="settings"]',
    content: currentPage === 'Settings'
      ? 'Configure your account, manage profile, and enable two-factor authentication.'
      : 'Manage your account settings.',
    title: 'Settings',
    placement: 'top',
  },
  {
    target: '[data-tour="help"]',
    content: currentPage === 'Help & Support'
      ? 'Get help and support, access FAQs, and contact our team.'
      : 'Get help and support.',
    title: 'Help & Support',
    placement: 'top',
  },
];

// Steps for investor
const getInvestorSteps = (currentPage: string): Step[] => [
  {
    target: '[data-tour="dashboard"]',
    content: currentPage === 'Dashboard'
      ? 'This is your dashboard. It shows portfolio activities, pending requests, and key metrics.'
      : 'Go to your Dashboard.',
    title: 'Dashboard',
    placement: 'right',
  },
  {
    target: '[data-tour="startups"]',
    content: currentPage === 'Find Startups'
      ? 'Discover startups looking for funding. Browse profiles and pitch decks.'
      : 'Discover promising startups.',
    title: 'Find Startups',
    placement: 'right',
  },
  {
    target: '[data-tour="deals"]',
    content: currentPage === 'Deals'
      ? 'Track and manage your investment deals.'
      : 'View and manage your deals.',
    title: 'Deals',
    placement: 'right',
  },
  {
    target: '[data-tour="calendar"]',
    content: currentPage === 'Calendar'
      ? 'Schedule and manage meetings with entrepreneurs.'
      : 'Manage your schedule.',
    title: 'Calendar',
    placement: 'right',
  },
  {
    target: '[data-tour="messages"]',
    content: currentPage === 'Messages'
      ? 'Communicate directly with entrepreneurs.'
      : 'Chat with entrepreneurs.',
    title: 'Messages',
    placement: 'right',
  },
  {
    target: '[data-tour="payments"]',
    content: currentPage === 'Payments'
      ? 'Manage your investment funds and transfer money.'
      : 'Manage your funds.',
    title: 'Payments',
    placement: 'right',
  },
  {
    target: '[data-tour="notifications"]',
    content: currentPage === 'Notifications'
      ? 'Stay updated with startup pitches and deal updates.'
      : 'View notifications.',
    title: 'Notifications',
    placement: 'left',
  },
  {
    target: '[data-tour="settings"]',
    content: currentPage === 'Settings'
      ? 'Configure account settings and enable two-factor authentication.'
      : 'Account settings.',
    title: 'Settings',
    placement: 'top',
  },
  {
    target: '[data-tour="help"]',
    content: currentPage === 'Help & Support'
      ? 'Get help and support, access FAQs.'
      : 'Get help.',
    title: 'Help & Support',
    placement: 'top',
  },
];

// Get icon for step
const getStepIcon = (title: string) => {
  switch (title) {
    case 'Dashboard': return <Home size={20} className="text-primary-600" />;
    case 'Find Investors': 
    case 'Find Startups': return <Users size={20} className="text-primary-600" />;
    case 'Deals': return <Briefcase size={20} className="text-primary-600" />;
    case 'Calendar': return <Calendar size={20} className="text-primary-600" />;
    case 'Messages': return <MessageCircle size={20} className="text-primary-600" />;
    case 'Payments': return <DollarSign size={20} className="text-primary-600" />;
    case 'Documents': return <FileText size={20} className="text-primary-600" />;
    case 'Notifications': return <Bell size={20} className="text-primary-600" />;
    case 'Settings': return <Settings size={20} className="text-primary-600" />;
    case 'Help & Support': return <HelpCircle size={20} className="text-primary-600" />;
    default: return <Home size={20} className="text-primary-600" />;
  }
};

// Custom tooltip component
const CustomTooltip: React.FC<TooltipRenderProps> = ({
  continuous,
  index,
  step,
  backProps,
  primaryProps,
  tooltipProps,
}) => {
  const totalSteps = 9;
  
  return (
    <div
      {...tooltipProps}
      className="bg-white rounded-xl shadow-xl border border-gray-200 p-5 max-w-sm"
    >
      <div className="flex items-start mb-3">
        <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
          {getStepIcon(String(step.title))}
        </div>
        <div>
          <h3 className="text-base font-semibold text-gray-900">{step.title}</h3>
        </div>
      </div>
      
      <p className="text-sm text-gray-600 mb-4">{step.content as string}</p>
      
      <div className="flex justify-between items-center pt-3 border-t border-gray-100">
        <div className="text-xs text-gray-500">
          {index + 1} of {totalSteps}
        </div>
        <div className="flex space-x-2">
          {index > 0 && (
            <button
              {...backProps}
              className="px-3 py-1.5 text-xs font-medium text-gray-700 hover:text-gray-900"
            >
              Back
            </button>
          )}
          {continuous && (
            <button
              {...primaryProps}
              className="px-3 py-1.5 text-xs font-medium text-white bg-primary-600 rounded hover:bg-primary-700"
            >
              {index === totalSteps - 1 ? 'Done' : 'Next'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

interface WalkthroughProps {
  userRole?: 'entrepreneur' | 'investor';
}

export const Walkthrough: React.FC<WalkthroughProps> = ({ 
  userRole: propUserRole 
}) => {
  const { pageName, userRole: locationRole } = usePageInfo();
  
  // Use prop or detect from location
  const userRole = propUserRole || locationRole;
  
  const [run, setRun] = useState(false);
  const [steps, setSteps] = useState<Step[]>([]);

  // Update steps based on current page
  useEffect(() => {
    const newSteps = userRole === 'entrepreneur' 
      ? getEntrepreneurSteps(pageName)
      : getInvestorSteps(pageName);
    setSteps(newSteps);
  }, [userRole, pageName]);

  // Check if walkthrough has been completed
  useEffect(() => {
    const hasCompleted = localStorage.getItem('walkthrough_completed');
    if (!hasCompleted) {
      // Auto-start on first load
      const timer = setTimeout(() => setRun(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleJoyrideCallback = useCallback((data: CallBackProps) => {
    const { status } = data;

    if (status === 'finished' || status === 'skipped') {
      setRun(false);
      localStorage.setItem('walkthrough_completed', 'true');
    }
  }, []);

  const startTour = () => {
    localStorage.removeItem('walkthrough_completed');
    setRun(true);
  };

  return (
    <>
      {/* Start Tour Button */}
      <button
        onClick={startTour}
        className="fixed bottom-4 right-4 z-50 px-3 py-2 bg-primary-600 text-white text-sm rounded-lg shadow-lg hover:bg-primary-700 transition-colors flex items-center"
        title="Start Tour"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-1.5">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4M12 8h.01" />
        </svg>
        Tour
      </button>

      {steps.length > 0 && (
        <ReactJoyride
          steps={steps}
          run={run}
          continuous
          showSkipButton
          showProgress={false}
          callback={handleJoyrideCallback}
          tooltipComponent={CustomTooltip}
          styles={{
            options: {
              primaryColor: '#4F46E5',
              zIndex: 10000,
              arrowColor: '#ffffff',
              backgroundColor: '#ffffff',
            },
            buttonNext: {
              borderRadius: '4px',
            },
            buttonBack: {
              color: '#4B5563',
            },
          }}
          locale={{
            last: 'Done',
            skip: 'Skip',
          }}
        />
      )}
    </>
  );
};

// Hook for managing walkthrough state
export const useWalkthrough = () => {
  const [isVisible, setIsVisible] = useState(false);

  const startWalkthrough = () => {
    setIsVisible(true);
  };

  const endWalkthrough = () => {
    setIsVisible(false);
    localStorage.setItem('walkthrough_completed', 'true');
  };

  const resetWalkthrough = () => {
    localStorage.removeItem('walkthrough_completed');
    setIsVisible(true);
  };

  const hasCompletedWalkthrough = () => {
    return localStorage.getItem('walkthrough_completed') !== null;
  };

  return {
    isVisible,
    startWalkthrough,
    endWalkthrough,
    resetWalkthrough,
    hasCompletedWalkthrough,
  };
};
