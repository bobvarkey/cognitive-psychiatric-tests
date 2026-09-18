import { useState } from 'react';
import { Menu, X, Search, Bell } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';
import { useNotifications } from '@/contexts/NotificationsContext';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  onMenuToggle?: () => void;
  showSearch?: boolean;
  onSearch?: (query: string) => void;
  dark?: boolean;
}

export const Header = ({ onMenuToggle, showSearch = true, onSearch, dark = false }: HeaderProps) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { notifications, unreadCount, pushEnabled, markAllRead, clearAll } = useNotifications();
  const showBell = pushEnabled || notifications.length > 0;


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
            <span className="text-foreground text-lg">🧠</span>
          </div>
          <div>
            <div className={`text-sm font-bold ${dark ? 'text-foreground' : 'text-gray-900'}`}>Cognito</div>
            <div className={`text-xs ${dark ? 'text-muted-foreground' : 'text-muted-foreground'}`}>Clinical Assessments</div>
          </div>
        </Link>

        {/* Search Bar - Desktop */}
        {showSearch && (
          <div className="hidden md:flex flex-1 mx-8">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search assessments..."
                className={`pl-10 rounded-full ${dark ? 'border-white/10 bg-white/5 text-foreground placeholder:text-muted-foreground' : 'border-gray-300 bg-gray-50'}`}
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
              className={`md:hidden p-2 rounded-lg ${dark ? 'hover:bg-white/10 text-foreground' : 'hover:bg-gray-100 text-gray-900'}`}
              onClick={() => setSearchOpen(!searchOpen)}
            >
              {searchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
            </button>
          )}

          {/* Notifications */}
          {showBell && (
            <Popover onOpenChange={(open) => open && markAllRead()}>
              <PopoverTrigger asChild>
                <button
                  className={`relative p-2 rounded-lg ${dark ? 'hover:bg-white/10 text-foreground' : 'hover:bg-gray-100 text-gray-900'}`}
                  aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ''}`}
                  title="Notifications"
                >
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 ? (
                    <span className="absolute -right-0.5 -top-0.5 min-w-[1.1rem] rounded-full bg-destructive px-1 text-[10px] font-semibold leading-4 text-destructive-foreground tabular-nums">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  ) : (
                    pushEnabled && (
                      <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-green-500 ring-2 ring-background" />
                    )
                  )}
                </button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-80 p-0">
                <div className="flex items-center justify-between border-b px-4 py-2">
                  <span className="text-sm font-semibold">Notifications</span>
                  {notifications.length > 0 && (
                    <Button variant="ghost" size="sm" onClick={clearAll}>
                      Clear
                    </Button>
                  )}
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="px-4 py-6 text-sm text-muted-foreground">
                      No notifications yet.
                    </p>
                  ) : (
                    notifications.map((n) => (
                      <div key={n.id} className="border-b px-4 py-3 last:border-b-0">
                        <div className="text-sm font-medium">{n.title}</div>
                        {n.body && (
                          <p className="mt-0.5 text-sm text-muted-foreground">{n.body}</p>
                        )}
                        <div className="mt-1 text-xs text-muted-foreground tabular-nums">
                          {new Date(n.receivedAt).toLocaleString()}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </PopoverContent>
            </Popover>
          )}

          {/* Menu Button */}
          <button
            className={`md:hidden p-2 rounded-lg ${dark ? 'hover:bg-white/10 text-foreground' : 'hover:bg-gray-100 text-gray-900'}`}
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
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search assessments..."
              className={`pl-10 rounded-full ${dark ? 'border-white/10 bg-white/5 text-foreground placeholder:text-muted-foreground' : 'border-gray-300'}`}
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
