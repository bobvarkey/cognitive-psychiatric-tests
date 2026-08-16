import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Clock, LayoutDashboard } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { FAST_ITEMS } from '@/data/fastScale';
import { DementiaConsolidatedResults } from './DementiaConsolidatedResults';

interface FastAssessmentProps { 
  onBack?: () => void;
  cdrScores?: Record<string, number>;
}

export const FastAssessment: React.FC<FastAssessmentProps> = ({ onBack, cdrScores }) => {
  const { language } = useLanguage();
  const [selectedStage, setSelectedStage] = useState<number | null>(null);
  const [showConsolidated, setShowConsolidated] = useState(false);

  if (showConsolidated) {
    return <DementiaConsolidatedResults 
      cdrScores={cdrScores ?? {}} 
      fastStage={selectedStage} 
      onBack={() => setShowConsolidated(false)} 
    />;
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        {onBack && <Button variant="ghost" onClick={onBack}><ArrowLeft className="mr-2" /> Back</Button>}
        {selectedStage !== null && (
          <Button 
            variant="outline" 
            className="bg-primary/5 border-primary/20 text-primary hover:bg-primary/10"
            onClick={() => setShowConsolidated(true)}
          >
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Consolidated View
          </Button>
        )}
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Clock /> FAST (Functional Assessment Staging)</CardTitle>
          <CardDescription>Assess functional progression in dementia.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <RadioGroup onValueChange={(val) => setSelectedStage(parseInt(val))}>
            {FAST_ITEMS.map(item => (
              <div key={item.id} className="flex items-center space-x-2 p-2 border rounded">
                <RadioGroupItem value={item.stage.toString()} id={item.id} />
                <Label htmlFor={item.id}>{language === 'ml' ? item.titleMl : item.title}: {language === 'ml' ? item.descriptionMl : item.description}</Label>
              </div>
            ))}
          </RadioGroup>
          {selectedStage && <div className="p-4 bg-primary/10 rounded font-bold">Selected Stage: {selectedStage}</div>}
        </CardContent>
      </Card>
    </div>
  );
};
