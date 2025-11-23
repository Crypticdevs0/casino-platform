import * as React from 'react';
import { cn } from '@/lib/utils';

export interface Category {
  id: string;
  name: string;
  icon?: React.ReactNode;
  count?: number;
}

interface GameCategoryFilterProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
  className?: string;
  itemClassName?: string;
  activeItemClassName?: string;
  showIcons?: boolean;
  showCounts?: boolean;
  variant?: 'default' | 'pills' | 'underlined' | 'segmented';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export function GameCategoryFilter({
  categories,
  selectedCategory,
  onSelectCategory,
  className = '',
  itemClassName = '',
  activeItemClassName = '',
  showIcons = true,
  showCounts = false,
  variant = 'default',
  size = 'md',
  fullWidth = false,
}: GameCategoryFilterProps) {
  const variants = {
    default: 'space-x-2',
    pills: 'flex-wrap gap-2',
    underlined: 'border-b border-gray-200 dark:border-gray-700 space-x-4',
    segmented: 'bg-gray-100 dark:bg-gray-800 p-1 rounded-lg inline-flex',
  };

  const itemSizes = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2',
  };

  const itemVariants = {
    default: 'text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400',
    pills: cn(
      'rounded-full px-4 py-1.5 transition-colors',
      'hover:bg-gray-100 dark:hover:bg-gray-700',
      'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500',
      'whitespace-nowrap'
    ),
    underlined: 'pb-3 -mb-px border-b-2 border-transparent hover:border-gray-300 dark:hover:border-gray-500',
    segmented: 'rounded-md transition-colors',
  };

  const activeItemVariants = {
    default: 'text-primary-600 dark:text-primary-400 font-medium',
    pills: 'bg-white dark:bg-gray-700 shadow-sm text-primary-700 dark:text-primary-200 font-medium',
    underlined: 'border-primary-500 text-primary-600 dark:text-primary-400 font-medium',
    segmented: 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white',
  };

  return (
    <div className={cn(
      'flex flex-nowrap overflow-x-auto no-scrollbar',
      'scrollbar-hide',
      fullWidth ? 'w-full' : 'w-auto',
      variants[variant],
      variant === 'segmented' ? 'p-1' : 'py-2',
      className
    )}>
      {categories.map((category) => (
        <button
          key={category.id}
          type="button"
          onClick={() => onSelectCategory(category.id)}
          className={cn(
            'flex items-center space-x-2 transition-colors duration-200',
            'focus:outline-none',
            itemSizes[size],
            itemVariants[variant],
            selectedCategory === category.id && [
              activeItemVariants[variant],
              activeItemClassName,
            ],
            itemClassName
          )}
          aria-current={selectedCategory === category.id ? 'true' : 'false'}
        >
          {showIcons && category.icon && (
            <span className="flex-shrink-0" aria-hidden="true">
              {category.icon}
            </span>
          )}
          <span>{category.name}</span>
          {showCounts && category.count !== undefined && (
            <span 
              className={cn(
                'inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-medium',
                selectedCategory === category.id 
                  ? 'bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              )}
            >
              {category.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

// Skeleton loader for GameCategoryFilter
export function GameCategoryFilterSkeleton({
  count = 5,
  variant = 'default',
  size = 'md',
  fullWidth = false,
}: {
  count?: number;
  variant?: 'default' | 'pills' | 'underlined' | 'segmented';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}) {
  const itemSizes = {
    sm: 'h-6 w-16',
    md: 'h-8 w-20',
    lg: 'h-10 w-24',
  };

  const itemSpacing = {
    sm: 'mr-2',
    md: 'mr-3',
    lg: 'mr-4',
  };

  const isPills = variant === 'pills';
  const isSegmented = variant === 'segmented';

  return (
    <div className={cn(
      'flex flex-nowrap',
      fullWidth ? 'w-full' : 'w-auto',
      isSegmented && 'bg-gray-100 dark:bg-gray-800 p-1 rounded-lg',
      'space-x-2'
    )}>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={cn(
            'bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse',
            itemSizes[size],
            itemSpacing[size],
            isPills && 'rounded-full',
            isSegmented && 'rounded-md',
            index === 0 && isSegmented && 'bg-primary-500 dark:bg-primary-600'
          )}
        />
      ))}
    </div>
  );
}

// Utility component to hide scrollbar but keep functionality
const NoScrollbar = ({ children }: { children: React.ReactNode }) => (
  <div className="[&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:none]">
    {children}
  </div>
);
