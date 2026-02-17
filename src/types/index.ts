export type UserRole = 'entrepreneur' | 'investor';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl: string;
  bio: string;
  isOnline?: boolean;
  createdAt: string;
}

export interface Entrepreneur extends User {
  role: 'entrepreneur';
  startupName: string;
  pitchSummary: string;
  fundingNeeded: string;
  industry: string;
  location: string;
  foundedYear: number;
  teamSize: number;
}

export interface Investor extends User {
  role: 'investor';
  investmentInterests: string[];
  investmentStage: string[];
  portfolioCompanies: string[];
  totalInvestments: number;
  minimumInvestment: string;
  maximumInvestment: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  isRead: boolean;
}

export interface ChatConversation {
  id: string;
  participants: string[];
  lastMessage?: Message;
  updatedAt: string;
}

export interface CollaborationRequest {
  id: string;
  investorId: string;
  entrepreneurId: string;
  message: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

export interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  lastModified: string;
  shared: boolean;
  url: string;
  ownerId: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
  updateProfile: (userId: string, updates: Partial<User>) => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface AvailabilitySlot {
  id: string;
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
  isRecurring: boolean;
  specificDate?: string; // ISO date for non-recurring
}

export interface Meeting {
  id: string;
  title: string;
  description?: string;
  startTime: string; // ISO datetime
  endTime: string; // ISO datetime
  organizerId: string;
  attendeeId: string;
  status: 'pending' | 'accepted' | 'declined' | 'cancelled' | 'completed';
  meetingLink?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MeetingRequest {
  id: string;
  meetingId?: string;
  senderId: string;
  receiverId: string;
  proposedTime: string;
  duration: number; // in minutes
  message?: string;
  status: 'pending' | 'accepted' | 'declined' | 'cancelled';
  createdAt: string;
}

// Meeting Context Types
export interface MeetingContextType {
  meetings: Meeting[];
  meetingRequests: MeetingRequest[];
  availabilitySlots: AvailabilitySlot[];
  createMeeting: (meeting: Omit<Meeting, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Meeting>;
  updateMeeting: (meetingId: string, updates: Partial<Meeting>) => Promise<void>;
  deleteMeeting: (meetingId: string) => Promise<void>;
  sendMeetingRequest: (request: Omit<MeetingRequest, 'id' | 'createdAt' | 'status'>) => Promise<MeetingRequest>;
  respondToMeetingRequest: (requestId: string, status: 'accepted' | 'declined') => Promise<void>;
  addAvailabilitySlot: (slot: Omit<AvailabilitySlot, 'id'>) => Promise<void>;
  removeAvailabilitySlot: (slotId: string) => Promise<void>;
  getMeetingsForUser: (userId: string) => Meeting[];
  getPendingRequestsForUser: (userId: string) => MeetingRequest[];
  getUpcomingMeetings: (userId: string) => Meeting[];
  isLoading: boolean;
}

// Payment Types
export type TransactionType = 'deposit' | 'withdraw' | 'transfer' | 'funding';
export type TransactionStatus = 'pending' | 'completed' | 'failed' | 'cancelled';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  currency: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  receiverName: string;
  status: TransactionStatus;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface Wallet {
  id: string;
  userId: string;
  balance: number;
  currency: string;
  isFrozen: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FundingDeal {
  id: string;
  investorId: string;
  investorName: string;
  entrepreneurId: string;
  entrepreneurName: string;
  startupName: string;
  amount: number;
  equity: number;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  createdAt: string;
  updatedAt: string;
}

export interface PaymentContextType {
  wallet: Wallet | null;
  transactions: Transaction[];
  fundingDeals: FundingDeal[];
  deposit: (amount: number) => Promise<void>;
  withdraw: (amount: number) => Promise<void>;
  transfer: (amount: number, receiverId: string, description: string) => Promise<void>;
  createFundingDeal: (deal: Omit<FundingDeal, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  acceptFundingDeal: (dealId: string) => Promise<void>;
  rejectFundingDeal: (dealId: string) => Promise<void>;
  getTransactionsForUser: (userId: string) => Transaction[];
  getFundingDealsForUser: (userId: string) => FundingDeal[];
  getWalletBalance: (userId: string) => number;
  isLoading: boolean;
}

// Password Strength Types
export interface PasswordStrength {
  score: number; // 0-4
  label: 'weak' | 'fair' | 'good' | 'strong';
  color: string;
  feedback: string[];
}

// 2FA Types
export interface TwoFactorAuthType {
  isEnabled: boolean;
  isVerified: boolean;
  enable2FA: () => Promise<void>;
  verifyOTP: (otp: string) => Promise<boolean>;
  disable2FA: () => Promise<void>;
  setup2FA: () => Promise<{ qrCode: string; secret: string }>;
}