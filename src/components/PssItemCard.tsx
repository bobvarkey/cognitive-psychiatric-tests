import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { PssItem, PssResponse } from '@/types/pss';
import { PSS_OPTIONS } from '@/data/pssScale';
import { useLanguage } from '@/contexts/LanguageContext';

interface PssItemCardProps {
  item: PssItem;
  response?: PssResponse;
  onResponse: (itemId: number, score: number) => void;
}

export const PssItemCard = ({ item, response, onResponse }: PssItemCardProps) => {
  const { language } = useLanguage();
  const question = language === 'ml' ? item.questionMl : item.question;

  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow">
      <CardContent className="p-6 space-y-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg font-bold text-emerald-600">Item {item.id}</span>
          </div>
          <p className="text-slate-700 font-medium">{question}</p>
        </div>

        <RadioGroup
          value={response?.score.toString()}
          onValueChange={(value) => onResponse(item.id, parseInt(value))}
        >
          <div className="space-y-3">
            {PSS_OPTIONS.map((option) => (
              <div key={option.value} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                <RadioGroupItem value={option.value.toString()} id={`${item.id}-${option.value}`} className="mt-1" />
                <Label htmlFor={`${item.id}-${option.value}`} className="cursor-pointer flex-1">
                  <span className="font-semibold text-slate-700 mr-2">{option.value}.</span>
                  <span className="text-slate-600">{language === 'ml' ? option.labelMl : option.label}</span>
                </Label>
              </div>
            ))}
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  );
};
