import { useEffect, useState } from 'react';
import { Progress } from '@/components/ui/progress';

interface ProgressIndicatorProps {
  sections: { id: string; label: string }[];
}

export const ProgressIndicator = ({ sections }: ProgressIndicatorProps) => {
  const [activeSection, setActiveSection] = useState<string>('');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 3;
      
      // Calculate active section
      for (let i = sections.length - 1; i >= 0; i--) {
        const element = document.getElementById(sections[i].id);
        if (element && element.offsetTop <= scrollPosition) {
          setActiveSection(sections[i].id);
          setProgress(((i + 1) / sections.length) * 100);
          break;
        }
      }
      
      // Calculate overall page progress as fallback/enhancement
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      if (sections.length === 0) setProgress(scrolled);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

  if (sections.length === 0) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] bg-background/80 backdrop-blur-md border-b border-border/50">
      <Progress value={progress} className="h-1 rounded-none bg-transparent" />
      <div className="max-w-4xl mx-auto px-4 py-2 flex items-center justify-between text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
        <div className="flex items-center gap-2 overflow-hidden whitespace-nowrap">
          {sections.map((section, idx) => (
            <div 
              key={section.id}
              className={`transition-colors ${activeSection === section.id ? 'text-primary' : 'hidden md:block opacity-40'}`}
            >
              {idx + 1}. {section.label}
              {idx < sections.length - 1 && activeSection === section.id && (
                <span className="ml-2 text-muted-foreground/30 md:hidden">→</span>
              )}
            </div>
          ))}
        </div>
        <div className="font-mono tabular-nums ml-4">
          {Math.round(progress)}%
        </div>
      </div>
    </div>
  );
};
