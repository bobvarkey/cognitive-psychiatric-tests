import { useState, useEffect } from 'react';
import { Home, ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export const NavigationButtons = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      // Show scroll top button if page is long enough and scrolled down
      const isLongPage = document.documentElement.scrollHeight > window.innerHeight * 1.5;
      setShowScrollTop(isLongPage && window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="fixed bottom-24 right-6 flex flex-col gap-4 z-[100] print:hidden">
      <Button
        variant="secondary"
        size="icon"
        onClick={() => navigate('/')}
        className="rounded-full shadow-xl bg-primary text-primary-foreground border-2 border-primary-foreground/20 h-14 w-14 hover:scale-110 transition-all active:scale-95 flex items-center justify-center"
        title="Back to Home"
      >
        <Home className="h-6 w-6" />
      </Button>
      
      {showScrollTop && (
        <Button
          variant="secondary"
          size="icon"
          onClick={scrollToTop}
          className="rounded-full shadow-xl bg-secondary text-secondary-foreground border-2 border-secondary-foreground/20 h-14 w-14 animate-in fade-in zoom-in slide-in-from-bottom-4 hover:scale-110 transition-all active:scale-95 flex items-center justify-center"
          title="Back to Top"
        >
          <ArrowUp className="h-6 w-6" />
        </Button>
      )}
    </div>
  );
};
