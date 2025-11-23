import * as React from 'react';
import { cn } from '@/lib/utils';

interface ProgressIndicatorProps {
  value?: number; // 0-100
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  showLabel?: boolean;
  className?: string;
  labelClassName?: string;
  trackClassName?: string;
  indicatorClassName?: string;
}

export function ProgressIndicator({
  value = 0,
  size = 'md',
  variant = 'primary',
  showLabel = false,
  className = '',
  labelClassName = '',
  trackClassName = '',
  indicatorClassName = '',
  ...props
}: ProgressIndicatorProps) {
  const progress = Math.min(100, Math.max(0, value || 0));
  
  const sizes = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  const variants = {
    default: 'bg-gray-200 dark:bg-gray-700',
    primary: 'bg-blue-500',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    danger: 'bg-red-500',
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  return (
    <div className={cn('w-full', className)} {...props}>
      {showLabel && (
        <div className="flex justify-between mb-1">
          <span className={cn('font-medium text-gray-700 dark:text-gray-300', textSizes[size], labelClassName)}>
            Progress
          </span>
          <span className={cn('font-medium text-gray-700 dark:text-gray-300', textSizes[size], labelClassName)}>
            {progress}%
          </span>
        </div>
      )}
      <div
        className={cn(
          'w-full rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700',
          sizes[size],
          trackClassName
        )}
      >
        <div
          className={cn(
            'h-full rounded-full transition-all duration-300 ease-in-out',
            variants[variant],
            indicatorClassName
          )}
          style={{ width: `${progress}%` }}
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          role="progressbar"
        />
      </div>
    </div>
  );
}

export function ProgressIndicatorSkeleton({ 
  size = 'md',
  showLabel = true 
}: { 
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}) {
  const sizes = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  const textSizes = {
    sm: 'h-3 w-12',
    md: 'h-4 w-16',
    lg: 'h-5 w-20',
  };

  return (
    <div className="w-full space-y-1.5">
      {showLabel && (
        <div className="flex justify-between">
          <div className={`bg-gray-200 dark:bg-gray-700 rounded ${textSizes[size]} w-16 animate-pulse`} />
          <div className={`bg-gray-200 dark:bg-gray-700 rounded ${textSizes[size]} w-12 animate-pulse`} />
        </div>
      )}
      <div className={`w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden ${sizes[size]}`}>
        <div 
          className={`h-full bg-gray-300 dark:bg-gray-600 rounded-full animate-pulse`}
          style={{ width: '60%' }}
        />
      </div>
    </div>
  );
}
