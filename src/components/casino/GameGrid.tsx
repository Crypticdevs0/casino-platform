import { useState, useMemo } from 'react';
import { Search, Filter, X, ArrowUpDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GameCard, GameCardSkeleton } from './GameCard';

export { GameCardSkeleton };

interface Game {
  id: string;
  title: string;
  provider: string;
  thumbnail: string;
  category: string[];
  isFavorite: boolean;
  isNew: boolean;
  isPopular: boolean;
  rtp: number;
  volatility: 'Low' | 'Medium' | 'High';
  minBet: number;
  maxBet: number;
}

interface GameGridProps {
  games: Game[];
  loading?: boolean;
  onPlay: (id: string) => void;
  onToggleFavorite: (id: string, isFavorite: boolean) => void;
  className?: string;
}

export function GameGrid({
  games,
  loading = false,
  onPlay,
  onToggleFavorite,
  className,
}: GameGridProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('popularity');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    minRtp: 0,
    maxRtp: 100,
    minBet: 0,
    maxBet: 1000,
    volatility: [] as string[],
  });

  // Get unique categories from games
  const categories = useMemo(() => {
    const allCategories = new Set<string>();
    games.forEach(game => {
      game.category?.forEach(cat => allCategories.add(cat));
    });
    return ['all', ...Array.from(allCategories)];
  }, [games]);

  // Filter and sort games
  const filteredGames = useMemo(() => {
    return games
      .filter(game => {
        // Search filter
        const matchesSearch = 
          game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          game.provider.toLowerCase().includes(searchQuery.toLowerCase());
        
        // Category filter
        const matchesCategory = 
          selectedCategory === 'all' || 
          game.category?.includes(selectedCategory);
        
        // RTP filter
        const matchesRtp = 
          game.rtp >= filters.minRtp && 
          game.rtp <= filters.maxRtp;
        
        // Bet range filter
        const matchesBetRange = 
          game.minBet >= filters.minBet && 
          game.maxBet <= filters.maxBet;
        
        // Volatility filter
        const matchesVolatility = 
          filters.volatility.length === 0 || 
          filters.volatility.includes(game.volatility.toLowerCase());
        
        return matchesSearch && matchesCategory && matchesRtp && matchesBetRange && matchesVolatility;
      })
      .sort((a, b) => {
        // Sort logic
        switch (sortBy) {
          case 'a-z':
            return a.title.localeCompare(b.title);
          case 'z-a':
            return b.title.localeCompare(a.title);
          case 'rtp':
            return b.rtp - a.rtp;
          case 'newest':
            return a.isNew === b.isNew ? 0 : a.isNew ? -1 : 1;
          case 'popularity':
          default:
            return a.isPopular === b.isPopular ? 0 : a.isPopular ? -1 : 1;
        }
      });
  }, [games, searchQuery, selectedCategory, sortBy, filters]);

  // Toggle volatility filter
  const toggleVolatility = (volatility: string) => {
    setFilters(prev => ({
      ...prev,
      volatility: prev.volatility.includes(volatility)
        ? prev.volatility.filter(v => v !== volatility)
        : [...prev.volatility, volatility]
    }));
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSortBy('popularity');
    setFilters({
      minRtp: 0,
      maxRtp: 100,
      minBet: 0,
      maxBet: 1000,
      volatility: [],
    });
  };

  // Skeleton loading state
  if (loading) {
    return (
      <div className={className}>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, index) => (
            <GameCardSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Search and Filter Bar */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search games..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <div className="flex items-center gap-2">
                  <ArrowUpDown className="h-4 w-4" />
                  <span>Sort by</span>
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popularity">Popularity</SelectItem>
                <SelectItem value="a-z">A-Z</SelectItem>
                <SelectItem value="z-a">Z-A</SelectItem>
                <SelectItem value="rtp">Highest RTP</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
              </SelectContent>
            </Select>
            
            <Button 
              variant="outline" 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              <span>Filters</span>
            </Button>
          </div>
        </div>
        
        {/* Category Tabs */}
        <div className="overflow-x-auto">
          <Tabs 
            value={selectedCategory} 
            onValueChange={setSelectedCategory}
            className="w-full"
          >
            <TabsList className="w-full justify-start">
              {categories.map(category => (
                <TabsTrigger 
                  key={category} 
                  value={category}
                  className="capitalize"
                >
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
        
        {/* Advanced Filters */}
        {showFilters && (
          <div className="p-4 border rounded-lg bg-muted/20">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">Filters</h3>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={resetFilters}
                className="text-sm text-muted-foreground"
              >
                Reset all
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* RTP Range */}
              <div>
                <label className="block text-sm font-medium mb-2">RTP: {filters.minRtp}% - {filters.maxRtp}%</label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input 
                      type="number" 
                      min="0" 
                      max="100" 
                      value={filters.minRtp}
                      onChange={(e) => setFilters(prev => ({ ...prev, minRtp: Number(e.target.value) }))}
                      className="w-20"
                    />
                    <span className="self-center">to</span>
                    <Input 
                      type="number" 
                      min="0" 
                      max="100" 
                      value={filters.maxRtp}
                      onChange={(e) => setFilters(prev => ({ ...prev, maxRtp: Number(e.target.value) }))}
                      className="w-20"
                    />
                    <span className="self-center">%</span>
                  </div>
                </div>
              </div>
              
              {/* Bet Range */}
              <div>
                <label className="block text-sm font-medium mb-2">Bet Range: ${filters.minBet} - ${filters.maxBet}</label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input 
                      type="number" 
                      min="0" 
                      value={filters.minBet}
                      onChange={(e) => setFilters(prev => ({ ...prev, minBet: Number(e.target.value) }))}
                      className="w-24"
                      prefix="$"
                    />
                    <span className="self-center">to</span>
                    <Input 
                      type="number" 
                      min="0" 
                      value={filters.maxBet}
                      onChange={(e) => setFilters(prev => ({ ...prev, maxBet: Number(e.target.value) }))}
                      className="w-24"
                      prefix="$"
                    />
                  </div>
                </div>
              </div>
              
              {/* Volatility */}
              <div>
                <label className="block text-sm font-medium mb-2">Volatility</label>
                <div className="flex flex-wrap gap-2">
                  {['low', 'medium', 'high'].map(vol => (
                    <Button
                      key={vol}
                      variant={filters.volatility.includes(vol) ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => toggleVolatility(vol)}
                      className="capitalize"
                    >
                      {vol}
                    </Button>
                  ))}
                </div>
              </div>
              
              {/* Reset Button */}
              <div className="flex items-end">
                <Button 
                  variant="outline" 
                  onClick={resetFilters}
                  className="w-full"
                >
                  <X className="h-4 w-4 mr-2" />
                  Clear Filters
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Game Grid */}
      {filteredGames.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredGames.map(game => (
            <GameCard
              key={game.id}
              {...game}
              onPlay={onPlay}
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <Search className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium">No games found</h3>
          <p className="text-muted-foreground mt-1">
            Try adjusting your search or filter to find what you're looking for.
          </p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={resetFilters}
          >
            Clear all filters
          </Button>
        </div>
      )}
      
      {/* Results Count */}
      {filteredGames.length > 0 && (
        <div className="mt-6 text-sm text-muted-foreground">
          Showing {filteredGames.length} of {games.length} games
        </div>
      )}
    </div>
  );
}
