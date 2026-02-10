import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StressScreeningItem } from '@/types/stressScreening';
import { useLanguage } from '@/contexts/LanguageContext';
import { Check, X } from 'lucide-react';

interface StressScreeningItemCardProps {
  item: StressScreeningItem;
  response: boolean | null;
  onResponse: (itemId: string, value: boolean) => void;
}

export const StressScreeningItemCard = ({ item, response, onResponse }: StressScreeningItemCardProps) => {
  const { language } = useLanguage();
  const question = language === 'ml' ? item.questionMl : item.question;

  return (
    <Card className={`shadow-sm transition-all ${response === true ? 'border-red-300 bg-red-50/50' : response === false ? 'border-green-300 bg-green-50/50' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-4">
          <p className="text-slate-700 flex-1">{question}</p>
          <div className="flex gap-2 shrink-0">
            <Button
              size="sm"
              variant={response === true ? "default" : "outline"}
              className={response === true ? "bg-red-500 hover:bg-red-600" : ""}
              onClick={() => onResponse(item.id, true)}
            >
              <Check className="h-4 w-4 mr-1" />
              {language === 'ml' ? 'ഉണ്ട്' : 'Yes'}
            </Button>
            <Button
              size="sm"
              variant={response === false ? "default" : "outline"}
              className={response === false ? "bg-green-500 hover:bg-green-600" : ""}
              onClick={() => onResponse(item.id, false)}
            >
              <X className="h-4 w-4 mr-1" />
              {language === 'ml' ? 'ഇല്ല' : 'No'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
