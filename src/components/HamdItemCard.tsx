import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { HamdItem, HamdResponse } from '@/types/hamd';
import { useLanguage } from '@/contexts/LanguageContext';

interface HamdItemCardProps {
  item: HamdItem;
  response?: HamdResponse;
  onResponse: (itemId: number, score: number) => void;
}

export const HamdItemCard = ({ item, response, onResponse }: HamdItemCardProps) => {
  const { language, t } = useLanguage();
  const question = language === 'ml' ? item.questionMl : item.question;
  const options = language === 'ml' ? item.optionsMl : item.options;

  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow">
      <CardContent className="p-6 space-y-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg font-bold text-indigo-600">Item {item.id}</span>
          </div>
          <p className="text-slate-700 font-medium">{question}</p>
        </div>

        <RadioGroup
          value={response?.score.toString()}
          onValueChange={(value) => onResponse(item.id, parseInt(value))}
        >
          <div className="space-y-3">
            {options.map((option, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                <RadioGroupItem value={index.toString()} id={`${item.id}-${index}`} className="mt-1" />
                <Label htmlFor={`${item.id}-${index}`} className="cursor-pointer flex-1">
                  <span className="font-semibold text-slate-700 mr-2">{index}.</span>
                  <span className="text-slate-600">{option}</span>
                </Label>
              </div>
            ))}
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  );
};
