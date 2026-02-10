import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { HareItem } from '@/types/hare';
import { useLanguage } from '@/contexts/LanguageContext';

interface HareItemCardProps {
  item: HareItem;
  currentScore: number | undefined;
  onScoreChange: (score: number) => void;
}

export const HareItemCard = ({ item, currentScore, onScoreChange }: HareItemCardProps) => {
  const { language } = useLanguage();

  const scoreOptions = [
    { value: 0, labelEn: 'Does not apply', labelMl: 'ബാധകമല്ല' },
    { value: 1, labelEn: 'Applies somewhat', labelMl: 'ഒരു പരിധിവരെ ബാധകം' },
    { value: 2, labelEn: 'Definitely applies', labelMl: 'തീർച്ചയായും ബാധകം' }
  ];

  const getFactorColor = (factor: string) => {
    return factor === 'interpersonal-affective' 
      ? 'bg-orange-100 text-orange-800 border-orange-200'
      : 'bg-red-100 text-red-800 border-red-200';
  };

  const getFactorLabel = (factor: string) => {
    return factor === 'interpersonal-affective'
      ? 'Interpersonal/Affective'
      : 'Lifestyle/Antisocial';
  };

  return (
    <Card className="shadow-lg hover:shadow-xl transition-all border-2">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-4 flex-wrap">
          <CardTitle className="text-xl flex-1">
            <div className="font-semibold text-slate-800 mb-2">
              {item.question}
            </div>
            {language === 'ml' && item.questionMl && (
              <div className="font-medium text-slate-600 text-lg mt-2">
                {item.questionMl}
              </div>
            )}
          </CardTitle>
          <Badge variant="outline" className={getFactorColor(item.factor)}>
            {getFactorLabel(item.factor)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={currentScore?.toString()}
          onValueChange={(value) => onScoreChange(parseInt(value))}
          className="space-y-3"
        >
          {scoreOptions.map((option) => (
            <div
              key={option.value}
              className={`flex items-start space-x-3 rounded-lg border-2 p-4 transition-all cursor-pointer hover:bg-slate-50 ${
                currentScore === option.value
                  ? 'border-orange-500 bg-orange-50'
                  : 'border-slate-200'
              }`}
            >
              <RadioGroupItem value={option.value.toString()} id={`${item.id}-${option.value}`} />
              <Label
                htmlFor={`${item.id}-${option.value}`}
                className="flex-1 cursor-pointer"
              >
                <div className="font-semibold text-slate-800">
                  {option.value} - {option.labelEn}
                </div>
                {language === 'ml' && (
                  <div className="text-sm text-slate-600 mt-1">
                    {option.value} - {option.labelMl}
                  </div>
                )}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  );
};
