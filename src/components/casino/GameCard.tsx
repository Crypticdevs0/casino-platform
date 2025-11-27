import { motion } from 'framer-motion';
import { Star, Clock, Users, Zap, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface GameCardProps {
  id: string;
  title: string;
  provider: string;
  thumbnail: string;
  isFavorite: boolean;
  isNew: boolean;
  isPopular: boolean;
  rtp: number;
  volatility: 'Low' | 'Medium' | 'High';
  minBet: number;
  maxBet: number;
  onPlay: (id: string) => void;
  onToggleFavorite: (id: string, isFavorite: boolean) => void;
  className?: string;
}

export function GameCard({
  id,
  title,
  provider,
  thumbnail,
  isFavorite,
  isNew,
  isPopular,
  rtp,
  volatility,
  minBet,
  maxBet,
  onPlay,
  onToggleFavorite,
  className,
}: GameCardProps) {
  return (
    <motion.div 
      className={cn(
        'relative rounded-xl overflow-hidden bg-card text-card-foreground shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1',
        className
      )}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="relative aspect-video">
        <img 
          src={thumbnail} 
          alt={title} 
          className="w-full h-full object-cover"
        />
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex gap-2">
          {isNew && (
            <span className="px-2 py-1 text-xs font-bold rounded-md bg-green-500 text-white">
              NEW
            </span>
          )}
          {isPopular && (
            <span className="px-2 py-1 text-xs font-bold rounded-md bg-amber-500 text-white">
              POPULAR
            </span>
          )}
        </div>
        
        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(id, !isFavorite);
          }}
          className="absolute top-2 right-2 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart 
            className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-white'}`} 
          />
        </button>
        
        {/* Play Button Overlay */}
        <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
          <Button 
            onClick={() => onPlay(id)}
            className="px-6 py-3 font-bold rounded-full bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
          >
            Play Now
          </Button>
        </div>
      </div>
      
      {/* Game Info */}
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold text-lg truncate">{title}</h3>
            <p className="text-sm text-muted-foreground">{provider}</p>
          </div>
          <div className="flex items-center gap-1 text-amber-400">
            <Star className="w-4 h-4 fill-current" />
            <span className="text-sm font-medium">4.8</span>
          </div>
        </div>
        
        {/* Game Stats */}
        <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-muted-foreground" />
            <span>RTP: {rtp}%</span>
          </div>
          <div className="flex items-center gap-1">
            <Zap className="w-3 h-3 text-muted-foreground" />
            <span>{volatility}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-3 h-3 text-muted-foreground" />
            <span>{minBet}-{maxBet}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Skeleton loader for GameCard
export function GameCardSkeleton() {
  return (
    <div className="rounded-xl overflow-hidden bg-muted/50 animate-pulse">
      <div className="aspect-video bg-muted/30" />
      <div className="p-4 space-y-2">
        <div className="h-5 bg-muted/30 rounded w-3/4" />
        <div className="h-4 bg-muted/30 rounded w-1/2" />
        <div className="h-3 bg-muted/30 rounded w-1/4 mt-4" />
      </div>
    </div>
  );
}

export default GameCard;
