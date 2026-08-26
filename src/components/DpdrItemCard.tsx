import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { DpdrItem } from "@/types/dpdr";
import { scoreOptions } from "@/data/dpdrScale";
import { useLanguage } from "@/contexts/LanguageContext";

interface DpdrItemCardProps {
  item: DpdrItem;
  selectedScore?: number;
  onScoreSelect: (itemId: number, score: number) => void;
}

export const DpdrItemCard = ({ item, selectedScore, onScoreSelect }: DpdrItemCardProps) => {
  const { language } = useLanguage();
  
  const getDomainColor = (domain: string) => {
    switch (domain) {
      case 'depersonalization':
        return 'border-l-4 border-l-purple-500';
      case 'derealization':
        return 'border-l-4 border-l-blue-500';
      case 'distress':
        return 'border-l-4 border-l-orange-500';
      default:
        return '';
    }
  };

  const getDomainLabel = (domain: string) => {
    const labels: Record<string, { en: string; ml: string }> = {
      depersonalization: { en: 'Depersonalization', ml: 'വ്യക്തിത്വനഷ്ടം' },
      derealization: { en: 'Derealization', ml: 'യാഥാർത്ഥ്യനഷ്ടം' },
      distress: { en: 'Impact & Distress', ml: 'ആഘാതവും ദുരിതവും' }
    };
    return labels[domain]?.[(language === 'ml' ? 'ml' : 'en')] || domain;
  };

  return (
    <Card className={`${getDomainColor(item.domain)} transition-all hover:shadow-md`}>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {getDomainLabel(item.domain)}
              </span>
            </div>
            <CardTitle className="text-base font-medium leading-relaxed">
              {language === 'en' ? item.question : item.questionMl}
            </CardTitle>
          </div>
          <span className="text-sm font-semibold text-muted-foreground min-w-[2rem] text-right">
            #{item.id}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={selectedScore?.toString()}
          onValueChange={(value) => onScoreSelect(item.id, parseInt(value))}
          className="flex flex-wrap gap-4"
        >
          {scoreOptions.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <RadioGroupItem
                value={option.value.toString()}
                id={`${item.id}-${option.value}`}
              />
              <Label
                htmlFor={`${item.id}-${option.value}`}
                className="cursor-pointer text-sm font-normal"
              >
                {language === 'en' ? option.label : option.labelMl}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  );
};
