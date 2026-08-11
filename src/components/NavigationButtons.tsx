import { useState, useEffect } from 'react';
import { Home, ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export const NavigationButtons = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="fixed bottom-24 right-6 flex flex-col gap-3 z-50">
      <Button
        variant="secondary"
        size="icon"
        onClick={() => navigate('/')}
        className="rounded-full shadow-lg bg-background/80 backdrop-blur-md border border-border h-12 w-12 hover:scale-110 transition-transform"
        title="Back to Home"
      >
        <Home className="h-6 w-6" />
      </Button>
      
      {showScrollTop && (
        <Button
          variant="secondary"
          size="icon"
          onClick={scrollToTop}
          className="rounded-full shadow-lg bg-background/80 backdrop-blur-md border border-border h-12 w-12 animate-in fade-in slide-in-from-bottom-4 hover:scale-110 transition-transform"
          title="Back to Top"
        >
          <ArrowUp className="h-6 w-6" />
        </Button>
      )}
    </div>
  );
};
