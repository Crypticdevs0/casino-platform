import { useState, useEffect, useMemo, useCallback, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ErrorBoundary } from 'react-error-boundary';
import { GameGrid, GameCardSkeleton } from '@/components/casino/GameGrid';
import { JackpotCounter } from '@/components/casino/JackpotCounter';
import { ConfettiButton } from '@/components/casino/ConfettiButton';
import { ProgressIndicator } from '@/components/casino/ProgressIndicator';
import { Search, Star, Zap, Clock, Volume2, VolumeX, Loader2 } from 'lucide-react';
import { CardFlip } from '@/components/casino/CardFlip';
import { cn } from '@/lib/utils';

// Lazy load heavy components
const GameCard = lazy(() => import('@/components/casino/GameCard'));

// Type definitions
type Volatility = 'Low' | 'Medium' | 'High';

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
  volatility: Volatility;
  minBet: number;
  maxBet: number;
  rating: number;
}

// Error Boundary Component
function ErrorFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
  return (
    <div role="alert" className="p-6 max-w-md mx-auto mt-10 bg-red-50 rounded-lg border border-red-200">
      <h2 className="text-lg font-semibold text-red-800 mb-2">Something went wrong</h2>
      <p className="text-red-700 mb-4">{error.message}</p>
      <button
        onClick={resetErrorBoundary}
        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
      >
        Try again
      </button>
    </div>
  );
}

// Mock data for games
const MOCK_GAMES: Game[] = [
  {
    id: 'mega-fortune',
    title: 'Mega Fortune',
    provider: 'NetEnt',
    thumbnail: 'https://via.placeholder.com/300x200/4F46E5/FFFFFF?text=Mega+Fortune',
    category: ['Slots', 'Jackpot', 'Popular'],
    isFavorite: false,
    isNew: false,
    isPopular: true,
    rtp: 96.6,
    volatility: 'Medium',
    minBet: 0.25,
    maxBet: 125,
    rating: 4.8,
  },
  {
    id: 'book-of-dead',
    title: 'Book of Dead',
    provider: 'Play\'n GO',
    thumbnail: 'https://via.placeholder.com/300x200/10B981/FFFFFF?text=Book+of+Dead',
    category: ['Slots', 'Adventure'],
    isFavorite: true,
    isNew: false,
    isPopular: true,
    rtp: 96.2,
    volatility: 'High',
    minBet: 0.1,
    maxBet: 100,
    rating: 4.9,
  },
  {
    id: 'lightning-roulette',
    title: 'Lightning Roulette',
    provider: 'Evolution',
    thumbnail: 'https://via.placeholder.com/300x200/F59E0B/FFFFFF?text=Lightning+Roulette',
    category: ['Table', 'Live Casino', 'Popular'],
    isFavorite: false,
    isNew: true,
    isPopular: true,
    rtp: 97.3,
    volatility: 'Medium',
    minBet: 0.2,
    maxBet: 2500,
    rating: 4.7,
  },
  {
    id: 'blackjack-vip',
    title: 'Blackjack VIP',
    provider: 'Playtech',
    thumbnail: 'https://via.placeholder.com/300x200/3B82F6/FFFFFF?text=Blackjack+VIP',
    category: ['Table', 'Cards'],
    isFavorite: false,
    isNew: true,
    isPopular: false,
    rtp: 99.4,
    volatility: 'Low',
    minBet: 5,
    maxBet: 5000,
    rating: 4.5,
  },
  {
    id: 'starburst',
    title: 'Starburst',
    provider: 'NetEnt',
    thumbnail: 'https://via.placeholder.com/300x200/8B5CF6/FFFFFF?text=Starburst',
    category: ['Slots', 'Classic'],
    isFavorite: true,
    isNew: false,
    isPopular: true,
    rtp: 96.1,
    volatility: 'Low',
    minBet: 0.1,
    maxBet: 100,
    rating: 4.8,
  },
];

// Mock jackpot data
const JACKPOT_AMOUNTS = {
  mega: 12500000,
  major: 3500000,
  minor: 850000,
  mini: 125000,
} as const;

type JackpotType = keyof typeof JACKPOT_AMOUNTS;
type Category = {
  id: string;
  name: string;
  icon?: React.ReactNode;
  count: number;
};

// Main GameLobby Component
function GameLobbyContent() {
  // State
    // State management
  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFiltering, setIsFiltering] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showWelcomeBonus, setShowWelcomeBonus] = useState(true);
  const [jackpotAmount, setJackpotAmount] = useState<Record<JackpotType, number>>(JACKPOT_AMOUNTS);
  const [activeJackpot, setActiveJackpot] = useState<JackpotType>('mega');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState<'popular' | 'newest' | 'az' | 'rtp'>('popular');

  // Simulate loading games with progress
  useEffect(() => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 10) + 5;
      if (progress >= 100) {
        progress = 100;
        setGames(MOCK_GAMES);
        setIsLoading(false);
        setIsFiltering(false);
        clearInterval(interval);
      }
      setLoadingProgress(progress);
    }, 100);
    
    return () => clearInterval(interval);
  }, []);

  // Handle category change with loading state
  const handleCategoryChange = useCallback((categoryId: string) => {
    setIsFiltering(true);
    setSelectedCategory(categoryId);
    // Simulate API call delay
    setTimeout(() => setIsFiltering(false), 300);
  }, []);

  // Handle sort change with loading state
  const handleSortChange = useCallback((sortValue: 'popular' | 'newest' | 'az' | 'rtp') => {
    setIsFiltering(true);
    setSortBy(sortValue);
    // Simulate API call delay
    setTimeout(() => setIsFiltering(false), 300);
  }, []);
  
  // Animate jackpot amounts
  useEffect(() => {
    const interval = setInterval(() => {
      const jackpots = Object.keys(jackpotAmount) as Array<keyof typeof jackpotAmount>;
      const randomJackpot = jackpots[Math.floor(Math.random() * jackpots.length)];
      setActiveJackpot(randomJackpot);
      
      setJackpotAmount(prev => ({
        ...prev,
        [randomJackpot]: prev[randomJackpot] + Math.floor(Math.random() * 1000) + 100
      }));
    }, 3000);
    
    return () => clearInterval(interval);
  }, [jackpotAmount]);
  
  const handlePlayGame = (gameId: string) => {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`Playing game: ${gameId}`);
    }
    // In a real app, this would navigate to the game or open it in a modal
  };
  
  const handleToggleFavorite = (gameId: string, isFavorite: boolean) => {
    setGames(games.map(game => 
      game.id === gameId ? { ...game, isFavorite } : game
    ));
  };

  // Memoized filtered and sorted games
  const filteredAndSortedGames = useMemo(() => {
    // Show loading state while filtering
    if (isFiltering) return [];

    return games
      // Filter by category
      .filter(game => 
        selectedCategory === 'all' || 
        game.category.some(cat => cat.toLowerCase() === selectedCategory)
      )
      // Sort based on selected option
      .sort((a, b) => {
        switch (sortBy) {
          case 'newest':
            return (a.isNew === b.isNew ? 0 : a.isNew ? -1 : 1);
          case 'az':
            return a.title.localeCompare(b.title);
          case 'rtp':
            return b.rtp - a.rtp;
          case 'popular':
          default:
            return (a.isPopular === b.isPopular ? 0 : a.isPopular ? -1 : 1);
        }
      });
  }, [games, selectedCategory, sortBy, isFiltering]);

  // Generate categories from games
  const categories = useMemo<Category[]>(() => {
    const categoryMap = games.reduce((acc, game) => {
      game.category.forEach(cat => {
        acc.set(cat, (acc.get(cat) || 0) + 1);
      });
      return acc;
    }, new Map<string, number>());

    return [
      { id: 'all', name: 'All Games', count: games.length },
      ...Array.from(categoryMap.entries()).map(([name, count]) => ({
        id: name.toLowerCase(),
        name,
        count,
      })),
    ];
  }, [games]);
  
  const claimBonus = () => {
    setShowWelcomeBonus(false);
    // Show confetti effect and update user balance in a real app
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      {/* Header */}
      <header className="bg-gray-900/80 backdrop-blur-md border-b border-gray-800 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">
              CryptoCasino
            </h1>
            <nav className="hidden md:flex space-x-6">
              <a href="#" className="text-white hover:text-amber-400 transition-colors">Games</a>
              <a href="#" className="text-gray-400 hover:text-amber-400 transition-colors">Live Casino</a>
              <a href="#" className="text-gray-400 hover:text-amber-400 transition-colors">Promotions</a>
              <a href="#" className="text-gray-400 hover:text-amber-400 transition-colors">VIP</a>
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2 bg-gray-800/50 px-3 py-1.5 rounded-full">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">
                <JackpotCounter 
                  value={jackpotAmount[activeJackpot as keyof typeof jackpotAmount]} 
                  prefix="$" 
                  className="text-yellow-400 font-bold text-lg"
                />
              </span>
              <span className="text-xs text-gray-400">JACKPOT</span>
            </div>
            
            <button 
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 rounded-full bg-gray-800/50 hover:bg-gray-700/80 transition-colors"
              aria-label={soundEnabled ? 'Mute sound' : 'Unmute sound'}
            >
              {soundEnabled ? (
                <Volume2 className="w-5 h-5 text-gray-300" />
              ) : (
                <VolumeX className="w-5 h-5 text-gray-500" />
              )}
            </button>
            
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center text-white font-bold">
              U
            </div>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        {/* Loading Overlay */}
        <AnimatePresence>
          {isLoading && (
            <motion.div 
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="w-full max-w-md px-8 py-6 bg-gray-900/90 rounded-xl border border-gray-800">
                <h2 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent">
                  Loading Games
                </h2>
                <div className="mb-4">
                  <ProgressIndicator 
                    value={loadingProgress} 
                    showLabel 
                    variant="primary"
                    size="lg"
                    className="mb-2"
                  />
                  <p className="text-center text-gray-400 text-sm">
                    {loadingProgress < 100 
                      ? `Loading your games... ${loadingProgress}%` 
                      : 'Almost there!'}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Welcome Banner */}
        {showWelcomeBonus && (
          <motion.div 
            className="bg-gradient-to-r from-amber-600 to-yellow-500 rounded-xl p-6 mb-8 relative overflow-hidden"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative z-10">
              <h2 className="text-2xl font-bold text-white mb-2">Welcome to CryptoCasino!</h2>
              <p className="text-amber-100 mb-4">Claim your 100% welcome bonus up to 1 BTC + 100 free spins!</p>
              <ConfettiButton
                onClick={claimBonus}
                className="w-full sm:w-auto"
                buttonClassName="bg-white text-amber-700 hover:bg-gray-100"
              >
                Claim Bonus Now
              </ConfettiButton>
            </div>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden md:block">
              <div className="relative w-32 h-32">
                <CardFlip
                  isFlipped={true}
                  front={
                    <div className="w-full h-full bg-amber-700/20 rounded-lg flex items-center justify-center">
                      <div className="text-4xl">🎰</div>
                    </div>
                  }
                  back={
                    <div className="w-full h-full bg-amber-800/30 rounded-lg flex items-center justify-center">
                      <div className="text-4xl">🎲</div>
                    </div>
                  }
                  flipSpeed={1.5}
                />
              </div>
            </div>
          </motion.div>
        )}
        
        {/* Featured Games */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold flex items-center">
              <Zap className="w-5 h-5 mr-2 text-amber-400" />
              Hot Drops
            </h2>
            <a href="#" className="text-amber-400 hover:underline text-sm font-medium">View All</a>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {games.slice(0, 4).map((game) => (
              <div key={game.id} className="relative group">
                <GameCard
                  id={game.id}
                  title={game.title}
                  provider={game.provider}
                  thumbnail={game.thumbnail}
                  isFavorite={game.isFavorite}
                  isNew={game.isNew}
                  isPopular={game.isPopular}
                  rtp={game.rtp}
                  volatility={game.volatility as 'Low' | 'Medium' | 'High'}
                  minBet={game.minBet}
                  maxBet={game.maxBet}
                  onPlay={handlePlayGame}
                  onToggleFavorite={handleToggleFavorite}
                  className="h-full"
                />
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-5/6 h-2 bg-gradient-to-t from-black/30 to-transparent rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
            ))}
          </div>
        </section>
        
        {/* All Games */}
        <section>
          <div className="mb-6">
            {/* Category Filter */}
            <div className="mb-6">
              {isLoading ? (
                <div className="mb-4">
                  <div className="h-6 w-48 bg-gray-700 rounded-md animate-pulse mb-2"></div>
                  <div className="flex space-x-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="h-8 w-20 bg-gray-700 rounded-full animate-pulse"></div>
                    ))}
                  </div>
                </div>
              ) : (
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-2">Filter by Category</h3>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                          selectedCategory === category.id
                            ? 'bg-amber-500 text-white'
                            : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                        }`}
                      >
                        {category.name}
                        <span className="ml-1.5 px-1.5 py-0.5 bg-black/10 rounded-full text-xs">
                          {category.count}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">
                {selectedCategory === 'all' 
                  ? 'All Games' 
                  : categories.find(c => c.id === selectedCategory)?.name || 'Games'}
                {selectedCategory !== 'all' && (
                  <span className="ml-2 text-sm font-normal text-gray-400">
                    ({filteredAndSortedGames.length} {filteredAndSortedGames.length === 1 ? 'game' : 'games'})
                  </span>
                )}
              </h2>
              
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <select
                    className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 pr-8 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-amber-500"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'popular' | 'newest' | 'az' | 'rtp')}
                  >
                    <option value="popular">Most Popular</option>
                    <option value="newest">Newest First</option>
                    <option value="az">A-Z</option>
                    <option value="rtp">Highest RTP</option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              {Array.from({ length: 10 }).map((_, index) => (
                <GameCardSkeleton key={index} />
              ))}
            </div>
          ) : filteredAndSortedGames.length > 0 ? (
            <GameGrid
              games={filteredAndSortedGames}
              onPlay={handlePlayGame}
              onToggleFavorite={handleToggleFavorite}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6"
            />
          ) : (
            <div className="text-center py-12">
              <div className="mx-auto w-24 h-24 text-amber-400 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-300 mb-2">No games found</h3>
              <p className="text-gray-500 mb-6">Try adjusting your filters or search to find what you're looking for.</p>
              <button 
                onClick={() => setSelectedCategory('all')}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium transition-colors"
              >
                Reset Filters
              </button>
            </div>
          )}
        </section>
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-900/80 border-t border-gray-800 mt-16">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">CryptoCasino</h3>
              <p className="text-gray-400 text-sm">The ultimate crypto gaming experience with instant payouts and provably fair games.</p>
            </div>
            <div>
              <h4 className="font-medium mb-4">Games</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-amber-400 transition-colors">Slots</a></li>
                <li><a href="#" className="hover:text-amber-400 transition-colors">Table Games</a></li>
                <li><a href="#" className="hover:text-amber-400 transition-colors">Live Casino</a></li>
                <li><a href="#" className="hover:text-amber-400 transition-colors">Jackpots</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4">Information</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-amber-400 transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-amber-400 transition-colors">Fairness</a></li>
                <li><a href="#" className="hover:text-amber-400 transition-colors">Security</a></li>
                <li><a href="#" className="hover:text-amber-400 transition-colors">Affiliates</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-amber-400 transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-amber-400 transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-amber-400 transition-colors">Terms & Conditions</a></li>
                <li><a href="#" className="hover:text-amber-400 transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm mb-4 md:mb-0">© 2023 CryptoCasino. All rights reserved.</p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-amber-400 transition-colors">
                <span className="sr-only">Twitter</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-amber-400 transition-colors">
                <span className="sr-only">Discord</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.1 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.1c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.84 19.84 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-amber-400 transition-colors">
                <span className="sr-only">Telegram</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Wrap GameLobby with Error Boundary
export default function GameLobby() {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => window.location.reload()}
    >
      <GameLobbyContent />
    </ErrorBoundary>
  );
}
