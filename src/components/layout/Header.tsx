import { useState } from 'react';
import { Menu, X, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';

interface HeaderProps {
  onMenuToggle?: () => void;
  showSearch?: boolean;
  onSearch?: (query: string) => void;
  dark?: boolean;
}

export const Header = ({ onMenuToggle, showSearch = true, onSearch, dark = false }: HeaderProps) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    onSearch?.(value);
  };

  return (
    <header className={`sticky top-0 z-40 w-full border-b ${dark ? 'bg-black/80 backdrop-blur-md border-white/10' : 'bg-white shadow-sm'}`}>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo & Branding */}
        <Link to="/" className="flex items-center gap-3 font-bold text-lg">
          <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${dark ? 'from-fuchsia-600 to-cyan-500' : 'from-blue-500 to-blue-600'}`}>
            <span className="text-white text-lg">🧠</span>
          </div>
          <div>
            <div className={`text-sm font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>Cognito</div>
            <div className={`text-xs ${dark ? 'text-gray-400' : 'text-gray-500'}`}>Clinical Assessments</div>
          </div>
        </Link>

        {/* Search Bar - Desktop */}
        {showSearch && (
          <div className="hidden md:flex flex-1 mx-8">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search assessments..."
                className={`pl-10 rounded-full ${dark ? 'border-white/10 bg-white/5 text-white placeholder:text-gray-500' : 'border-gray-300 bg-gray-50'}`}
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          {/* Mobile Search Button */}
          {showSearch && (
            <button
              className={`md:hidden p-2 rounded-lg ${dark ? 'hover:bg-white/10 text-white' : 'hover:bg-gray-100 text-gray-900'}`}
              onClick={() => setSearchOpen(!searchOpen)}
            >
              {searchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
            </button>
          )}

          {/* Menu Button */}
          <button
            className={`md:hidden p-2 rounded-lg ${dark ? 'hover:bg-white/10 text-white' : 'hover:bg-gray-100 text-gray-900'}`}
            onClick={onMenuToggle}
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Mobile Search */}
      {showSearch && searchOpen && (
        <div className={`border-t px-4 py-3 md:hidden ${dark ? 'bg-black/80 border-white/10' : 'bg-gray-50'}`}>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search assessments..."
              className={`pl-10 rounded-full ${dark ? 'border-white/10 bg-white/5 text-white placeholder:text-gray-500' : 'border-gray-300'}`}
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              autoFocus
            />
          </div>
        </div>
      )}
    </header>
  );
};
