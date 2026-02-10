import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { FabItem, FabScore } from '@/types/fab';
import { useLanguage } from '@/contexts/LanguageContext';

interface FabItemCardProps {
  item: FabItem;
  value: FabScore | undefined;
  onChange: (score: FabScore) => void;
}

export const FabItemCard = ({ item, value, onChange }: FabItemCardProps) => {
  const { language } = useLanguage();

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="text-lg">
          {item.id}. {language === 'en' ? item.domain : item.domainMl}
        </CardTitle>
        <div className="text-sm text-muted-foreground mt-2">
          <p className="font-medium">{language === 'en' ? item.task : item.taskMl}</p>
          <p className="mt-2 text-xs">{language === 'en' ? item.instruction : item.instructionMl}</p>
        </div>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={value?.toString()}
          onValueChange={(val) => onChange(parseInt(val) as FabScore)}
        >
          <div className="space-y-3">
            {item.scoring.map((option) => (
              <div key={option.score} className="flex items-start space-x-3">
                <RadioGroupItem value={option.score.toString()} id={`item-${item.id}-${option.score}`} />
                <Label
                  htmlFor={`item-${item.id}-${option.score}`}
                  className="font-normal cursor-pointer flex-1"
                >
                  <span className="font-semibold">{option.score}: </span>
                  {language === 'en' ? option.criteria : option.criteriaMl}
                </Label>
              </div>
            ))}
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  );
};
