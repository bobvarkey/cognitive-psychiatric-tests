import React from 'react';
import { Button } from '@/components/ui/button';
import { Languages } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export const LanguageToggle: React.FC = () => {
  const { language, toggleLanguage } = useLanguage();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleLanguage}
      className="fixed top-4 right-4 z-50 bg-background/80 backdrop-blur-sm"
    >
      <Languages className="h-4 w-4 mr-2" />
      {language === 'en' ? 'മലയാളം' : 'English'}
    </Button>
  );
};