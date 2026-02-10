import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { DaphneItem } from '@/types/daphne';
import { useLanguage } from '@/contexts/LanguageContext';
import { DAPHNE_SCALE_ITEMS_EN, DAPHNE_SCALE_ITEMS_ML } from '@/data/daphneScale';

interface DaphneItemCardProps {
  item: DaphneItem;
  currentScore: number;
  onScoreChange: (itemId: string, score: number) => void;
}

export const DaphneItemCard: React.FC<DaphneItemCardProps> = ({
  item,
  currentScore,
  onScoreChange
}) => {
  const { t, language } = useLanguage();
  
  // Get the corresponding English and Malayalam items
  const englishItem = DAPHNE_SCALE_ITEMS_EN.find(enItem => enItem.id === item.id);
  const malayalamItem = DAPHNE_SCALE_ITEMS_ML.find(mlItem => mlItem.id === item.id);
  
  const domainColors = {
    disinhibition: 'bg-red-100 text-red-800 border-red-200',
    apathy: 'bg-gray-100 text-gray-800 border-gray-200',
    empathy: 'bg-blue-100 text-blue-800 border-blue-200',
    perseverations: 'bg-purple-100 text-purple-800 border-purple-200',
    hyperorality: 'bg-orange-100 text-orange-800 border-orange-200',
    neglect: 'bg-green-100 text-green-800 border-green-200'
  };

  const scoreOptions = [
    { 
      value: 0, 
      label: t('score.normal'), 
      descriptionEn: englishItem?.descriptions.normal,
      descriptionMl: malayalamItem?.descriptions.normal
    },
    { 
      value: 1, 
      label: t('score.very.mild'), 
      descriptionEn: englishItem?.descriptions.veryMild,
      descriptionMl: malayalamItem?.descriptions.veryMild
    },
    { 
      value: 2, 
      label: t('score.mild'), 
      descriptionEn: englishItem?.descriptions.mild,
      descriptionMl: malayalamItem?.descriptions.mild
    },
    { 
      value: 3, 
      label: t('score.moderate'), 
      descriptionEn: englishItem?.descriptions.moderate,
      descriptionMl: malayalamItem?.descriptions.moderate
    },
    { 
      value: 4, 
      label: t('score.severe'), 
      descriptionEn: englishItem?.descriptions.severe,
      descriptionMl: malayalamItem?.descriptions.severe
    }
  ];

  return (
    <Card className="shadow-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-semibold">
              {englishItem?.title}
            </CardTitle>
            {malayalamItem && (
              <p className="text-base text-muted-foreground mt-1 italic">{malayalamItem.title}</p>
            )}
          </div>
          <Badge 
            variant="secondary" 
            className={domainColors[item.domain as keyof typeof domainColors]}
          >
            {item.domain.charAt(0).toUpperCase() + item.domain.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={currentScore.toString()}
          onValueChange={(value) => onScoreChange(item.id, parseInt(value))}
          className="space-y-4"
        >
          {scoreOptions.map((option) => (
            <div key={option.value} className="flex items-start space-x-3">
              <RadioGroupItem
                value={option.value.toString()}
                id={`${item.id}-${option.value}`}
                className="mt-1"
              />
              <div className="flex-1">
                <Label
                  htmlFor={`${item.id}-${option.value}`}
                  className="text-sm font-medium cursor-pointer"
                >
                  {option.label}
                </Label>
                {option.descriptionEn && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {option.descriptionEn}
                  </p>
                )}
                {option.descriptionMl && (
                  <p className="text-sm text-muted-foreground mt-1 italic">
                    {option.descriptionMl}
                  </p>
                )}
              </div>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  );
};