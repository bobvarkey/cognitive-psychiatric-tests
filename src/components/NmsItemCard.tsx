import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { NmsItem } from '@/types/nms';

interface NmsItemCardProps {
  item: NmsItem;
  score: number | undefined;
  onChange: (score: number) => void;
  isMalayalam: boolean;
}

export const NmsItemCard: React.FC<NmsItemCardProps> = ({
  item,
  score,
  onChange,
  isMalayalam
}) => {
  const name = isMalayalam ? item.nameMl : item.name;
  const description = isMalayalam ? item.descriptionMl : item.description;
  const scoringGuide = isMalayalam ? item.scoringGuideMl : item.scoringGuide;

  return (
    <Card className="mb-4">
      <CardContent className="pt-4">
        <div className="mb-3">
          <h4 className="font-semibold text-foreground">{name}</h4>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        </div>
        
        <RadioGroup
          value={score?.toString()}
          onValueChange={(value) => onChange(parseInt(value))}
          className="space-y-2"
        >
          {Object.entries(scoringGuide).map(([value, label]) => (
            <div key={value} className="flex items-start space-x-3">
              <RadioGroupItem
                value={value}
                id={`${item.id}-${value}`}
                className="mt-1"
              />
              <Label
                htmlFor={`${item.id}-${value}`}
                className="text-sm font-normal cursor-pointer flex-1"
              >
                <span className="font-medium text-primary mr-2">{value}:</span>
                {label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  );
};
