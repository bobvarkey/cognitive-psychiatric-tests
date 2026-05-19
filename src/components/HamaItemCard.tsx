import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { HamaItem, HamaResponse } from '@/types/hama';
import { HAMA_OPTIONS, HAMA_OPTIONS_ML } from '@/data/hamaScale';
import { useLanguage } from '@/contexts/LanguageContext';

interface HamaItemCardProps {
  item: HamaItem;
  response?: HamaResponse;
  onResponse: (itemId: number, score: number) => void;
}

export const HamaItemCard = ({ item, response, onResponse }: HamaItemCardProps) => {
  const { language } = useLanguage();
  const title = language === 'ml' ? item.titleMl : item.title;
  const description = language === 'ml' ? item.descriptionMl : item.description;
  const options = language === 'ml' ? HAMA_OPTIONS_ML : HAMA_OPTIONS;

  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow">
      <CardContent className="p-6 space-y-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg font-bold text-indigo-600">Item {item.id}</span>
          </div>
          <p className="text-slate-700 font-semibold">{title}</p>
          <p className="text-sm text-slate-600 mt-1">{description}</p>
        </div>

        <RadioGroup
          value={response?.score.toString()}
          onValueChange={(value) => onResponse(item.id, parseInt(value))}
        >
          <div className="space-y-2">
            {options.map((option, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                <RadioGroupItem value={index.toString()} id={`hama-${item.id}-${index}`} className="mt-1" />
                <Label htmlFor={`hama-${item.id}-${index}`} className="cursor-pointer flex-1">
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
