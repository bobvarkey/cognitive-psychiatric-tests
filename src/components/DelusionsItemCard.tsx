import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { DelusionItem } from '@/types/delusions';
import { useLanguage } from '@/contexts/LanguageContext';

interface DelusionsItemCardProps {
  item: DelusionItem;
  value: { present: boolean; severity?: number };
  onChange: (value: { present: boolean; severity?: number }) => void;
}

export const DelusionsItemCard = ({ item, value, onChange }: DelusionsItemCardProps) => {
  const { language } = useLanguage();
  const type = language === 'ml' ? item.typeMl : item.type;
  const description = language === 'ml' ? item.descriptionMl : item.description;

  return (
    <Card className="mb-4 overflow-hidden">
      {item.image && (
        <div className="h-48 w-full overflow-hidden">
          <img 
            src={item.image} 
            alt={item.type}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg flex-1">
            {item.type}
            {language === 'ml' && (
              <div className="text-base font-normal mt-1">{item.typeMl}</div>
            )}
          </CardTitle>
          {item.familiarity && (
            <Badge 
              variant={item.familiarity === 'Hypofamiliarity' ? 'secondary' : 'default'}
              className="shrink-0"
            >
              {item.familiarity}
            </Badge>
          )}
        </div>
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">{item.description}</p>
          {language === 'ml' && (
            <p className="text-sm text-muted-foreground">{item.descriptionMl}</p>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label className="text-base font-semibold mb-2 block">Present?</Label>
          <RadioGroup
            value={value.present ? 'yes' : 'no'}
            onValueChange={(val) => {
              const present = val === 'yes';
              onChange({ present, severity: present ? (value.severity || 1) : undefined });
            }}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id={`${item.id}-no`} />
              <Label htmlFor={`${item.id}-no`}>No</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id={`${item.id}-yes`} />
              <Label htmlFor={`${item.id}-yes`}>Yes</Label>
            </div>
          </RadioGroup>
        </div>

        {value.present && (
          <div>
            <Label className="text-base font-semibold mb-2 block">Severity</Label>
            <RadioGroup
              value={value.severity?.toString() || '1'}
              onValueChange={(val) => onChange({ present: true, severity: parseInt(val) })}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="1" id={`${item.id}-mild`} />
                <Label htmlFor={`${item.id}-mild`}>Mild</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="2" id={`${item.id}-moderate`} />
                <Label htmlFor={`${item.id}-moderate`}>Moderate</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="3" id={`${item.id}-severe`} />
                <Label htmlFor={`${item.id}-severe`}>Severe</Label>
              </div>
            </RadioGroup>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
