import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { AdamItem } from '@/types/adam';
import { likertOptions } from '@/data/adamScale';
import { useLanguage } from '@/contexts/LanguageContext';

interface AdamItemCardProps {
  item: AdamItem;
  value: number | undefined;
  onChange: (score: number) => void;
}

export const AdamItemCard = ({ item, value, onChange }: AdamItemCardProps) => {
  const { language } = useLanguage();

  const getOptions = () => {
    if (item.type === 'bdi' && item.options) {
      return item.options.map(opt => ({
        value: opt.value,
        label: language === 'en' ? opt.label : opt.labelMl,
      }));
    }

    // Likert items
    if (item.reverseScored) {
      return likertOptions.map(opt => ({
        value: 3 - opt.value, // reverse: Strongly Agree=3, Strongly Disagree=0
        label: language === 'en' ? opt.label : opt.labelMl,
      }));
    }

    return likertOptions.map(opt => ({
      value: opt.value,
      label: language === 'en' ? opt.label : opt.labelMl,
    }));
  };

  const options = getOptions();
  const domainColors: Record<string, string> = {
    'apathy-behavioural': 'border-l-orange-500',
    'apathy-social': 'border-l-amber-500',
    'apathy-emotional': 'border-l-yellow-500',
    'anhedonia': 'border-l-blue-500',
    'depression': 'border-l-rose-500',
  };

  return (
    <Card className={`mb-4 border-l-4 ${domainColors[item.domain] || ''}`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base leading-snug">
            {item.id}. {language === 'en' ? item.text : item.textMl}
          </CardTitle>
          <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
            {language === 'en' ? item.domainLabel : item.domainLabelMl}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        {item.type === 'likert' ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => onChange(opt.value)}
                className={`p-2 rounded-lg border text-center text-sm transition-all ${
                  value === opt.value
                    ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                    : 'bg-card hover:bg-accent hover:text-accent-foreground border-border'
                }`}
              >
                <div className="font-semibold">☐ {opt.value}</div>
                <div className="text-xs mt-0.5 opacity-80">{opt.label}</div>
              </button>
            ))}
          </div>
        ) : (
          <RadioGroup
            value={value?.toString()}
            onValueChange={(val) => onChange(parseInt(val))}
          >
            <div className="space-y-2">
              {options.map((opt) => (
                <div key={opt.value} className="flex items-start space-x-3">
                  <RadioGroupItem
                    value={opt.value.toString()}
                    id={`adam-${item.id}-${opt.value}`}
                  />
                  <Label
                    htmlFor={`adam-${item.id}-${opt.value}`}
                    className="font-normal cursor-pointer flex-1"
                  >
                    <span className="font-semibold">{opt.value}: </span>
                    {opt.label}
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        )}
      </CardContent>
    </Card>
  );
};
