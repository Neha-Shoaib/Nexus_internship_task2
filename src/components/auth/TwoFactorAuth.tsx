import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card } from '../ui/Card';
import { Shield, Smartphone, Key, CheckCircle, XCircle, RefreshCw, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

interface TwoFactorAuthProps {
  onVerify: (code: string) => Promise<boolean>;
  onSkip?: () => void;
  isSetup?: boolean;
  onSetupComplete?: () => void;
}

export const TwoFactorAuth: React.FC<TwoFactorAuthProps> = ({ 
  onVerify, 
  onSkip,
  isSetup = false,
  onSetupComplete 
}) => {
  const [step, setStep] = useState<'select' | 'verify' | 'setup' | 'success'>('select');
  const [method, setMethod] = useState<'app' | 'sms' | 'email'>('app');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Auto-verify demo OTP
  const DEMO_OTP = '123456';

  useEffect(() => {
    if (step === 'verify' && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [step]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all fields filled
    if (newOtp.every(digit => digit !== '') && !isLoading) {
      handleVerify(newOtp.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (code: string) => {
    setIsLoading(true);
    try {
      const isValid = await onVerify(code);
      if (isValid) {
        setIsVerified(true);
        setStep('success');
        toast.success('Verification successful!');
        onSetupComplete?.();
      } else {
        toast.error('Invalid verification code');
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } catch (error) {
      toast.error('Verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = () => {
    toast.success('New code sent!');
    setOtp(['', '', '', '', '', '']);
    inputRefs.current[0]?.focus();
  };

  const handleSetupMethod = (selectedMethod: 'app' | 'sms' | 'email') => {
    setMethod(selectedMethod);
    setStep('setup');
  };

  const handleSetupSubmit = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setStep('verify');
    toast.success('2FA setup initiated!');
    setIsLoading(false);
  };

  if (isVerified || step === 'success') {
    return (
      <Card className="p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={32} className="text-green-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Two-Factor Authentication Enabled</h3>
        <p className="text-gray-600 mb-4">
          Your account is now protected with an extra layer of security.
        </p>
        <Button onClick={onSetupComplete} leftIcon={<ArrowRight size={18} />}>
          Continue
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Step 1: Select Method */}
      {step === 'select' && (
        <Card className="p-6">
          <div className="flex items-center mb-6">
            <Shield size={24} className="text-primary-600 mr-3" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Enable Two-Factor Authentication</h3>
              <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => handleSetupMethod('app')}
              className="w-full p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors text-left"
            >
              <div className="flex items-center">
                <Smartphone size={24} className="text-primary-600 mr-4" />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Authenticator App</p>
                  <p className="text-sm text-gray-500">Use Google Authenticator or similar apps</p>
                </div>
                <ArrowRight size={18} className="text-gray-400" />
              </div>
            </button>

            <button
              onClick={() => handleSetupMethod('sms')}
              className="w-full p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors text-left"
            >
              <div className="flex items-center">
                <Key size={24} className="text-primary-600 mr-4" />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">SMS Verification</p>
                  <p className="text-sm text-gray-500">Receive codes via text message</p>
                </div>
                <ArrowRight size={18} className="text-gray-400" />
              </div>
            </button>

            <button
              onClick={() => handleSetupMethod('email')}
              className="w-full p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors text-left"
            >
              <div className="flex items-center">
                <Shield size={24} className="text-primary-600 mr-4" />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Email Verification</p>
                  <p className="text-sm text-gray-500">Receive codes via email</p>
                </div>
                <ArrowRight size={18} className="text-gray-400" />
              </div>
            </button>
          </div>

          {onSkip && (
            <div className="mt-6 pt-4 border-t border-gray-200">
              <button
                onClick={onSkip}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Skip for now
              </button>
            </div>
          )}
        </Card>
      )}

      {/* Step 2: Setup */}
      {step === 'setup' && (
        <Card className="p-6">
          <div className="text-center mb-6">
            {method === 'app' && <Smartphone size={48} className="mx-auto text-primary-600 mb-4" />}
            {method === 'sms' && <Key size={48} className="mx-auto text-primary-600 mb-4" />}
            {method === 'email' && <Shield size={48} className="mx-auto text-primary-600 mb-4" />}
            <h3 className="text-lg font-semibold text-gray-900">
              {method === 'app' && 'Set up Authenticator App'}
              {method === 'sms' && 'Set up SMS Verification'}
              {method === 'email' && 'Set up Email Verification'}
            </h3>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600 mb-2">
              {method === 'app' && 'Download Google Authenticator or Authy on your phone'}
              {method === 'sms' && 'We will send verification codes to your registered phone number'}
              {method === 'email' && 'We will send verification codes to your registered email address'}
            </p>
          </div>

          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={() => setStep('select')}
              fullWidth
            >
              Back
            </Button>
            <Button
              onClick={handleSetupSubmit}
              isLoading={isLoading}
              fullWidth
            >
              Continue
            </Button>
          </div>
        </Card>
      )}

      {/* Step 3: Verify */}
      {step === 'verify' && (
        <Card className="p-6">
          <div className="text-center mb-6">
            <Shield size={48} className="mx-auto text-primary-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900">Enter Verification Code</h3>
            <p className="text-sm text-gray-500">
              {method === 'app' && 'Enter the 6-digit code from your authenticator app'}
              {method === 'sms' && 'Enter the 6-digit code sent to your phone'}
              {method === 'email' && 'Enter the 6-digit code sent to your email'}
            </p>
          </div>

          <div className="flex justify-center space-x-2 mb-6">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={el => inputRefs.current[index] = el}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={e => handleOtpChange(index, e.target.value)}
                onKeyDown={e => handleKeyDown(index, e)}
                className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-colors"
              />
            ))}
          </div>

          <Button
            onClick={() => handleVerify(otp.join(''))}
            isLoading={isLoading}
            fullWidth
            size="lg"
          >
            Verify
          </Button>

          <div className="mt-4 text-center">
            <button
              onClick={handleResend}
              className="text-sm text-primary-600 hover:text-primary-700 flex items-center justify-center"
            >
              <RefreshCw size={14} className="mr-1" />
              Resend code
            </button>
          </div>

          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-700 text-center">
              Demo OTP: <strong>{DEMO_OTP}</strong>
            </p>
          </div>
        </Card>
      )}
    </div>
  );
};

// Login 2FA Component
interface Login2FAProps {
  onVerify: (code: string) => Promise<boolean>;
  onCancel: () => void;
}

export const Login2FA: React.FC<Login2FAProps> = ({ onVerify, onCancel }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const DEMO_OTP = '123456';

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const isValid = await onVerify(otp.join(''));
      if (!isValid) {
        toast.error('Invalid verification code');
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } catch (error) {
      toast.error('Verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Shield size={48} className="mx-auto text-primary-600 mb-4" />
        <h3 className="text-xl font-semibold text-gray-900">Two-Factor Authentication</h3>
        <p className="text-sm text-gray-500 mt-2">
          Enter the 6-digit code from your authenticator app
        </p>
      </div>

      <div className="flex justify-center space-x-2">
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={el => inputRefs.current[index] = el}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={e => handleOtpChange(index, e.target.value)}
            onKeyDown={e => handleKeyDown(index, e)}
            className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-colors"
          />
        ))}
      </div>

      <Button
        onClick={handleSubmit}
        isLoading={isLoading}
        fullWidth
        size="lg"
      >
        Verify
      </Button>

      <div className="flex justify-between">
        <button
          onClick={onCancel}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          Back to login
        </button>
        <button className="text-sm text-primary-600 hover:text-primary-700">
          Use recovery code
        </button>
      </div>

      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-700 text-center">
          Demo OTP: <strong>{DEMO_OTP}</strong>
        </p>
      </div>
    </div>
  );
};
