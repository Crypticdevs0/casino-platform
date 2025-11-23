import { ShieldAlert, ShieldCheck, ShieldQuestion } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface KycStatusBadgeProps {
  level: number;
  isBanned?: boolean;
  onClick?: () => void;
}

const getLabel = (level: number, isBanned?: boolean) => {
  if (isBanned) return 'Account Restricted';
  if (level <= 0) return 'KYC Required';
  if (level === 1) return 'Basic KYC';
  if (level === 2) return 'Enhanced KYC';
  return 'Full KYC';
};

const getVariantClasses = (level: number, isBanned?: boolean) => {
  if (isBanned) return 'bg-red-500/10 text-red-500 border-red-500/40';
  if (level <= 0) return 'bg-amber-500/10 text-amber-400 border-amber-500/40';
  if (level === 1) return 'bg-blue-500/10 text-blue-400 border-blue-500/40';
  return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/40';
};

const getIcon = (level: number, isBanned?: boolean) => {
  if (isBanned) return <ShieldAlert className="w-3 h-3" />;
  if (level <= 0) return <ShieldQuestion className="w-3 h-3" />;
  return <ShieldCheck className="w-3 h-3" />;
};

export function KycStatusBadge({ level, isBanned, onClick }: KycStatusBadgeProps) {
  const label = getLabel(level, isBanned);
  const classes = getVariantClasses(level, isBanned);

  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1 focus:outline-none"
      aria-label={`KYC status: ${label}`}
    >
      <Badge
        variant="outline"
        className={`border px-2 py-0.5 text-[10px] font-medium rounded-full ${classes}`}
      >
        <span className="mr-1 flex items-center justify-center">
          {getIcon(level, isBanned)}
        </span>
        {label}
      </Badge>
    </button>
  );
}
