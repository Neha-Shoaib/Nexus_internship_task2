import React from 'react';
import { PasswordStrength } from '../../types';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

interface PasswordStrengthMeterProps {
  password: string;
  showFeedback?: boolean;
}

export const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({ 
  password, 
  showFeedback = true 
}) => {
  const strength = calculatePasswordStrength(password);

  const requirements = [
    { label: 'At least 8 characters', met: password.length >= 8 },
    { label: 'Contains uppercase letter', met: /[A-Z]/.test(password) },
    { label: 'Contains lowercase letter', met: /[a-z]/.test(password) },
    { label: 'Contains a number', met: /[0-9]/.test(password) },
    { label: 'Contains special character', met: /[!@#$%^&*(),.?":{}|<>]/.test(password) },
  ];

  const metRequirements = requirements.filter(r => r.met).length;

  return (
    <div className="space-y-2">
      {/* Strength Bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Password Strength</span>
          <span className={`font-medium ${getStrengthColor(strength.label)}`}>
            {strength.label === 'weak' && 'Weak'}
            {strength.label === 'fair' && 'Fair'}
            {strength.label === 'good' && 'Good'}
            {strength.label === 'strong' && 'Strong'}
          </span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${getStrengthBarColor(strength.label)}`}
            style={{ width: `${(strength.score / 4) * 100}%` }}
          />
        </div>
      </div>

      {/* Requirements List */}
      {showFeedback && (
        <ul className="space-y-1 mt-3">
          {requirements.map((req, index) => (
            <li key={index} className="flex items-center text-sm">
              {req.met ? (
                <CheckCircle size={16} className="text-green-500 mr-2" />
              ) : (
                <XCircle size={16} className="text-gray-400 mr-2" />
              )}
              <span className={req.met ? 'text-green-700' : 'text-gray-500'}>
                {req.label}
              </span>
            </li>
          ))}
        </ul>
      )}

      {/* Feedback Messages */}
      {showFeedback && strength.feedback.length > 0 && (
        <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-md">
          <div className="flex items-start">
            <AlertTriangle size={16} className="text-yellow-600 mt-0.5 mr-2" />
            <div className="text-sm text-yellow-700">
              {strength.feedback.map((msg, index) => (
                <p key={index}>{msg}</p>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

function calculatePasswordStrength(password: string): PasswordStrength {
  let score = 0;
  const feedback: string[] = [];

  if (password.length >= 8) {
    score += 1;
  } else {
    feedback.push('Password should be at least 8 characters long');
  }

  if (/[A-Z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Add an uppercase letter');
  }

  if (/[a-z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Add a lowercase letter');
  }

  if (/[0-9]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Add a number');
  }

  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Add a special character');
  }

  // Additional checks
  if (password.length >= 12) {
    score += 1;
  }

  if (/(.)\1{2,}/.test(password)) {
    score -= 1;
    feedback.push('Avoid repeating characters');
  }

  // Clamp score between 0 and 4
  score = Math.max(0, Math.min(4, score));

  let label: 'weak' | 'fair' | 'good' | 'strong';
  if (score <= 1) {
    label = 'weak';
  } else if (score === 2) {
    label = 'fair';
  } else if (score === 3) {
    label = 'good';
  } else {
    label = 'strong';
  }

  return {
    score,
    label,
    color: getStrengthColor(label),
    feedback,
  };
}

function getStrengthColor(label: string): string {
  switch (label) {
    case 'weak':
      return 'text-red-600';
    case 'fair':
      return 'text-yellow-600';
    case 'good':
      return 'text-blue-600';
    case 'strong':
      return 'text-green-600';
    default:
      return 'text-gray-600';
  }
}

function getStrengthBarColor(label: string): string {
  switch (label) {
    case 'weak':
      return 'bg-red-500';
    case 'fair':
      return 'bg-yellow-500';
    case 'good':
      return 'bg-blue-500';
    case 'strong':
      return 'bg-green-500';
    default:
      return 'bg-gray-300';
  }
}
