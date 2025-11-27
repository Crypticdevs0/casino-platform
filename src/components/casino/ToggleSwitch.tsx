import * as React from 'react';
import { cn } from '@/lib/utils';

interface ToggleSwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  labelPosition?: 'left' | 'right';
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
  wrapperClassName?: string;
  labelClassName?: string;
}

export function ToggleSwitch({
  label,
  labelPosition = 'right',
  variant = 'default',
  size = 'md',
  disabled = false,
  className = '',
  wrapperClassName = '',
  labelClassName = '',
  ...props
}: ToggleSwitchProps) {
  const toggleVariants = {
    default: 'bg-gray-200 dark:bg-gray-700',
    primary: 'bg-blue-500',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    danger: 'bg-red-500',
  };

  const toggleSizes = {
    sm: 'h-4 w-8 after:h-3 after:w-3 after:translate-x-4',
    md: 'h-5 w-10 after:h-4 after:w-4 after:translate-x-5',
    lg: 'h-6 w-12 after:h-5 after:w-5 after:translate-x-6',
  };

  const labelSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  return (
    <label 
      className={cn(
        'relative inline-flex items-center cursor-pointer',
        disabled && 'opacity-50 cursor-not-allowed',
        wrapperClassName
      )}
    >
      {label && labelPosition === 'left' && (
        <span className={cn('mr-3', labelSizes[size], labelClassName)}>
          {label}
        </span>
      )}
      <input
        type="checkbox"
        className="sr-only peer"
        disabled={disabled}
        {...props}
      />
      <div
        className={cn(
          'relative rounded-full transition-all duration-200 ease-in-out peer-checked:after:translate-x-full',
          'after:content-[""] after:absolute after:top-0.5 after:left-0.5 after:bg-white',
          'after:rounded-full after:transition-all after:duration-200 after:ease-in-out',
          'peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-offset-2 peer-focus:ring-offset-gray-100 dark:peer-focus:ring-offset-gray-800',
          'peer-checked:bg-opacity-100 peer-checked:after:border-white',
          'peer-disabled:opacity-50 peer-disabled:cursor-not-allowed',
          toggleVariants[variant],
          toggleSizes[size],
          'peer-checked:after:left-auto',
          'after:shadow-md',
          className
        )}
      />
      {label && labelPosition === 'right' && (
        <span className={cn('ml-3', labelSizes[size], labelClassName)}>
          {label}
        </span>
      )}
    </label>
  );
}

// Example usage:
/*
<ToggleSwitch 
  label="Enable Notifications"
  variant="primary"
  size="md"
  checked={isEnabled}
  onChange={(e) => setIsEnabled(e.target.checked)}
/>
*/

// ToggleSwitchSkeleton for loading states
export function ToggleSwitchSkeleton({ 
  label = false, 
  size = 'md' 
}: { 
  label?: boolean; 
  size?: 'sm' | 'md' | 'lg';
}) {
  const labelSizes = {
    sm: 'h-4 w-16',
    md: 'h-5 w-20',
    lg: 'h-6 w-24',
  };
  
  const toggleSizes = {
    sm: 'h-4 w-8',
    md: 'h-5 w-10',
    lg: 'h-6 w-12',
  };

  return (
    <div className="flex items-center space-x-3">
      {label && (
        <div className={`bg-gray-200 dark:bg-gray-700 rounded ${labelSizes[size]} animate-pulse`} />
      )}
      <div className={`bg-gray-200 dark:bg-gray-700 rounded-full ${toggleSizes[size]} animate-pulse`} />
    </div>
  );
}
