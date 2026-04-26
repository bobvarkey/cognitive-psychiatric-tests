import React from 'react';
import { Languages, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLanguage } from '@/contexts/LanguageContext';
import { LANGUAGES } from '@/contexts/LanguageContext';

export const LanguageToggle: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const current = LANGUAGES.find((l) => l.code === language);

  return (
    <div className="fixed top-4 right-4 z-50">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="bg-background/80 backdrop-blur-sm shadow-md gap-2"
          >
            <Languages className="h-4 w-4" />
            <span className="hidden sm:inline">{current?.native ?? 'English'}</span>
            <span className="sm:hidden uppercase text-xs font-semibold">{language}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          {LANGUAGES.map((lang) => (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => setLanguage(lang.code)}
              className="flex items-center justify-between cursor-pointer"
            >
              <span className="flex flex-col">
                <span className="text-sm font-medium">{lang.native}</span>
                <span className="text-[11px] text-muted-foreground">{lang.label}</span>
              </span>
              {language === lang.code && <Check className="h-4 w-4 text-primary" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
