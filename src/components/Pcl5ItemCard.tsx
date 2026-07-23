import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Pcl5Item } from '@/types/pcl5';
import { pcl5ScoreOptions, pcl5ScreeningOptions } from '@/data/pcl5Scale';
import { useLanguage } from '@/contexts/LanguageContext';

interface Pcl5ItemCardProps {
  item: Pcl5Item;
  value: number | undefined;
  onChange: (score: number) => void;
}

export const Pcl5ItemCard = ({ item, value, onChange }: Pcl5ItemCardProps) => {
  const { language } = useLanguage();

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="text-lg">
          {item.type === 'screening' ? '' : `${item.id}. `}
          {language === 'en' ? item.text : item.textMl}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={value?.toString()}
          onValueChange={(val) => onChange(parseInt(val))}
        >
          <div className="space-y-3">
            {(item.type === 'screening' ? pcl5ScreeningOptions : pcl5ScoreOptions).map((option) => (
              <div key={option.value} className="flex items-center space-x-3">
                <RadioGroupItem
                  value={option.value.toString()}
                  id={`item-${item.id}-${option.value}`}
                />
                <Label
                  htmlFor={`item-${item.id}-${option.value}`}
                  className="font-normal cursor-pointer flex-1"
                >
                  {item.type === 'question' && (
                    <span className="mr-2 text-muted-foreground">{option.value}</span>
                  )}
                  {language === 'en' ? option.label : option.labelMl}
                </Label>
              </div>
            ))}
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  );
};
