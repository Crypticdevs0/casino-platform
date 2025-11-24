import { toast } from 'sonner';

export type ErrorType = 'validation' | 'network' | 'auth' | 'payment' | 'game' | 'general';

export interface ErrorContext {
  type?: ErrorType;
  action?: string;
  recoverable?: boolean;
  retry?: () => Promise<void>;
}

/**
 * Categorize errors and provide appropriate messages
 */
export function categorizeError(error: unknown): {
  message: string;
  type: ErrorType;
  recoverable: boolean;
} {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();

    if (message.includes('network') || message.includes('fetch')) {
      return {
        message: 'Network error. Please check your connection and try again.',
        type: 'network',
        recoverable: true,
      };
    }

    if (message.includes('timeout')) {
      return {
        message: 'Request timed out. Please try again.',
        type: 'network',
        recoverable: true,
      };
    }

    if (message.includes('auth') || message.includes('401') || message.includes('unauthorized')) {
      return {
        message: 'Authentication failed. Please log in again.',
        type: 'auth',
        recoverable: true,
      };
    }

    if (message.includes('insufficient balance') || message.includes('payment')) {
      return {
        message: 'Payment failed. Please check your wallet balance.',
        type: 'payment',
        recoverable: true,
      };
    }

    if (message.includes('validation') || message.includes('invalid')) {
      return {
        message: error.message,
        type: 'validation',
        recoverable: true,
      };
    }

    if (message.includes('game')) {
      return {
        message: 'Game error occurred. Your game session has been saved.',
        type: 'game',
        recoverable: true,
      };
    }

    return {
      message: error.message || 'An unexpected error occurred.',
      type: 'general',
      recoverable: false,
    };
  }

  return {
    message: 'An unexpected error occurred. Please try again.',
    type: 'general',
    recoverable: false,
  };
}

/**
 * Display error with appropriate styling and actions
 */
export function displayError(
  error: unknown,
  context: ErrorContext = {}
): void {
  const { message, type, recoverable } = categorizeError(error);
  
  const actionLabel = context.action || 'Dismiss';
  
  const toastConfig = {
    duration: type === 'validation' ? 3000 : 5000,
    action: context.retry
      ? {
          label: 'Retry',
          onClick: async () => {
            try {
              toast.loading('Retrying...');
              await context.retry!();
              toast.success('Success!');
            } catch (retryError) {
              displayError(retryError, { ...context, retry: undefined });
            }
          },
        }
      : undefined,
  };

  const icons = {
    validation: '⚠️',
    network: '🌐',
    auth: '🔐',
    payment: '💳',
    game: '🎮',
    general: '❌',
  };

  const icon = icons[type];
  
  switch (type) {
    case 'validation':
      toast.error(`${icon} ${message}`, toastConfig);
      break;
    case 'network':
      toast.error(`${icon} Connection Issue`, {
        description: message,
        ...toastConfig,
      });
      break;
    case 'auth':
      toast.error(`${icon} Authentication Error`, {
        description: message,
        ...toastConfig,
      });
      break;
    case 'payment':
      toast.error(`${icon} Payment Failed`, {
        description: message,
        ...toastConfig,
      });
      break;
    case 'game':
      toast.error(`${icon} Game Error`, {
        description: message,
        ...toastConfig,
      });
      break;
    default:
      toast.error(`${icon} Error`, {
        description: message,
        ...toastConfig,
      });
  }
}

/**
 * Display success with consistent styling
 */
export function displaySuccess(message: string, description?: string): void {
  if (description) {
    toast.success(message, { description });
  } else {
    toast.success(message);
  }
}

/**
 * Display warning
 */
export function displayWarning(message: string, description?: string): void {
  if (description) {
    toast.warning(message, { description });
  } else {
    toast.warning(message);
  }
}

/**
 * Display info
 */
export function displayInfo(message: string, description?: string): void {
  if (description) {
    toast.info(message, { description });
  } else {
    toast.info(message);
  }
}

/**
 * Validate form input and show error
 */
export function validateInput(
  value: any,
  rules: {
    required?: boolean;
    min?: number;
    max?: number;
    pattern?: RegExp;
    custom?: (value: any) => string | null;
  }
): string | null {
  if (rules.required && !value) {
    return 'This field is required.';
  }

  if (rules.min !== undefined && Number(value) < rules.min) {
    return `Value must be at least ${rules.min}.`;
  }

  if (rules.max !== undefined && Number(value) > rules.max) {
    return `Value must not exceed ${rules.max}.`;
  }

  if (rules.pattern && !rules.pattern.test(String(value))) {
    return 'Invalid format.';
  }

  if (rules.custom) {
    return rules.custom(value);
  }

  return null;
}

/**
 * Create an async operation with error handling
 */
export async function withErrorHandling<T>(
  operation: () => Promise<T>,
  context: ErrorContext = {}
): Promise<T | null> {
  try {
    const result = await operation();
    if (context.action) {
      displaySuccess(`${context.action} completed successfully.`);
    }
    return result;
  } catch (error) {
    displayError(error, context);
    return null;
  }
}
