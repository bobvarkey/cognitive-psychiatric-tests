import { useState, useEffect, useCallback } from 'react';
import { Home, ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export const NavigationButtons = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const handleScroll = useCallback(() => {
    // Show scroll top button if page is long enough and scrolled down
    const isLongPage = document.documentElement.scrollHeight > window.innerHeight * 1.5;
    setShowScrollTop(isLongPage && window.scrollY > 300);
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const goHome = useCallback(() => {
    if (location.pathname === '/') {
      scrollToTop();
    } else {
      navigate('/', { replace: true });
      // Ensure we're at the top of the new page
      window.scrollTo(0, 0);
    }
  }, [navigate, location.pathname, scrollToTop]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (
        document.activeElement?.tagName === 'INPUT' || 
        document.activeElement?.tagName === 'TEXTAREA' ||
        (document.activeElement as HTMLElement)?.isContentEditable
      ) {
        return;
      }

      // Alt + H for Home
      if (e.altKey && e.key.toLowerCase() === 'h') {
        e.preventDefault();
        goHome();
      }
      
      // Alt + T for Top
      if (e.altKey && e.key.toLowerCase() === 't') {
        e.preventDefault();
        scrollToTop();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goHome, scrollToTop]);

  return (
    <div className="fixed bottom-6 sm:bottom-12 md:bottom-24 right-4 sm:right-6 flex flex-col gap-4 z-[100] print:hidden">
      {/* Tooltip-like label for mobile/desktop visibility hint */}
      <div className="flex flex-col gap-4 items-end">
        <Button
          variant="secondary"
          size="icon"
          onClick={goHome}
          className="rounded-full shadow-2xl bg-primary text-primary-foreground border-2 border-white/20 h-12 w-12 sm:h-14 sm:w-14 hover:scale-110 active:scale-95 transition-all flex items-center justify-center group relative"
          title="Back to Home (Alt+H)"
        >
          <Home className="h-5 w-5 sm:h-6 sm:w-6" />
          <span className="absolute right-full mr-3 px-2 py-1 bg-black/80 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none hidden sm:block">
            Home (Alt+H)
          </span>
        </Button>
        
        {showScrollTop && (
          <Button
            variant="secondary"
            size="icon"
            onClick={scrollToTop}
            className="rounded-full shadow-2xl bg-secondary text-secondary-foreground border-2 border-white/10 h-12 w-12 sm:h-14 sm:w-14 animate-in fade-in zoom-in slide-in-from-bottom-4 hover:scale-110 active:scale-95 transition-all flex items-center justify-center group relative"
            title="Back to Top (Alt+T)"
          >
            <ArrowUp className="h-5 w-5 sm:h-6 sm:w-6" />
            <span className="absolute right-full mr-3 px-2 py-1 bg-black/80 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none hidden sm:block">
              Top (Alt+T)
            </span>
          </Button>
        )}
      </div>
    </div>
  );
};