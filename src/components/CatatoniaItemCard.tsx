import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { CatatoniaItem } from '@/types/catatonia';
import { CATATONIA_RESPONSE_OPTIONS } from '@/data/catatoniaScale';
import { Badge } from '@/components/ui/badge';

interface CatatoniaItemCardProps {
  item: CatatoniaItem;
  selectedScore: number | undefined;
  onScoreChange: (itemId: string, score: number) => void;
}

export const CatatoniaItemCard = ({ item, selectedScore, onScoreChange }: CatatoniaItemCardProps) => {
  const { language } = useLanguage();
  
  const getScoreLabel = (score: number) => {
    const guide = language === 'ml' ? item.scoringGuideMl : item.scoringGuide;
    return guide[score as keyof typeof guide];
  };

  return (
    <Card className="border-l-4 border-l-cyan-500 shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start gap-3 mb-3">
          <Badge variant="outline" className="shrink-0 bg-cyan-50 text-cyan-700 border-cyan-200">
            {item.number}
          </Badge>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-slate-800">
                {language === 'ml' ? item.nameMl : item.name}
              </h3>
              {item.isScreening && (
                <Badge variant="secondary" className="text-xs bg-amber-100 text-amber-700 border-amber-200">
                  {language === 'ml' ? 'സ്ക്രീനിംഗ്' : 'Screening'}
                </Badge>
              )}
            </div>
            <p className="text-sm text-slate-600 mt-1">
              {language === 'ml' ? item.descriptionMl : item.description}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 mt-4">
          {CATATONIA_RESPONSE_OPTIONS.map((option) => {
            const label = getScoreLabel(option.value);
            const isSelected = selectedScore === option.value;
            const hasLabel = label && label.length > 0;
            
            return (
              <Button
                key={option.value}
                variant={isSelected ? "default" : "outline"}
                size="sm"
                onClick={() => onScoreChange(item.id, option.value)}
                className={`h-auto py-2 px-2 text-xs flex flex-col items-center justify-center min-h-[60px] ${
                  isSelected 
                    ? 'bg-cyan-600 hover:bg-cyan-700 text-white' 
                    : 'hover:bg-cyan-50 hover:border-cyan-300'
                } ${!hasLabel && option.value !== 0 && option.value !== 3 ? 'opacity-50' : ''}`}
                disabled={!hasLabel && option.value !== 0 && option.value !== 3}
              >
                <span className="font-bold text-lg">{option.value}</span>
                {hasLabel && (
                  <span className="text-[10px] leading-tight text-center mt-1 whitespace-normal">
                    {label}
                  </span>
                )}
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
