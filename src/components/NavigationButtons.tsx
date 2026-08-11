import { useEffect, useState } from 'react';
import { Home, ArrowUp } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

export const NavigationButtons = () => {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToHome = () => {
    window.location.href = '/';
  };

  return (
    <div className="fixed bottom-24 right-6 flex flex-col gap-3 z-50 print:hidden">
      <Button
        variant="secondary"
        size="icon"
        className="rounded-full shadow-lg bg-background/80 backdrop-blur-sm border border-border hover:bg-accent transition-all duration-300"
        onClick={goToHome}
        title="Back to Home"
      >
        <Home className="h-5 w-5" />
      </Button>
      
      <Button
        variant="secondary"
        size="icon"
        className={cn(
          "rounded-full shadow-lg bg-background/80 backdrop-blur-sm border border-border hover:bg-accent transition-all duration-300",
          showTop ? "opacity-100 scale-100" : "opacity-0 scale-0 pointer-events-none"
        )}
        onClick={scrollToTop}
        title="Back to Top"
      >
        <ArrowUp className="h-5 w-5" />
      </Button>
    </div>
  );
};
