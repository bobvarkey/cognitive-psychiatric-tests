import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { delusionsScale } from '@/data/delusionsScale';
import { useLanguage } from '@/contexts/LanguageContext';
import { Separator } from '@/components/ui/separator';

interface DelusionChecklistSelectorProps {
  selectedIds: string[];
  onToggle: (id: string) => void;
}

export const DelusionChecklistSelector = ({ selectedIds, onToggle }: DelusionChecklistSelectorProps) => {
  const { language } = useLanguage();

  const delusionItems = delusionsScale.filter(item => item.section === 'Delusions');
  const hallucinationItems = delusionsScale.filter(item => item.section === 'Hallucinations');

  const renderSection = (items: typeof delusionsScale, title: string) => {
    // Group by category
    const groupedByCategory = items.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    }, {} as Record<string, typeof delusionsScale>);

    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">{title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {Object.entries(groupedByCategory).map(([category, categoryItems]) => (
            <div key={category}>
              <h3 className="font-semibold text-sm text-muted-foreground mb-3">{category}</h3>
              <div className="space-y-3 ml-2">
                {categoryItems.map((item) => (
                  <div key={item.id} className="flex items-start space-x-3">
                    <Checkbox
                      id={item.id}
                      checked={selectedIds.includes(item.id)}
                      onCheckedChange={() => onToggle(item.id)}
                      className="mt-1"
                    />
                    <Label
                      htmlFor={item.id}
                      className="flex-1 cursor-pointer leading-tight"
                    >
                      <span className="font-medium">
                        {language === 'ml' ? item.typeMl : item.type}
                      </span>
                      <p className="text-sm text-muted-foreground mt-1">
                        {language === 'ml' ? item.descriptionMl : item.description}
                      </p>
                    </Label>
                  </div>
                ))}
              </div>
              <Separator className="mt-4" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2 mb-6">
        <h2 className="text-2xl font-bold">Select Patient's Symptoms</h2>
        <p className="text-muted-foreground">
          Check all symptoms that are present in the patient
        </p>
      </div>

      {renderSection(delusionItems, 'Delusions & Misidentification Syndromes')}
      {renderSection(hallucinationItems, 'Visual Hallucinations')}
    </div>
  );
};
