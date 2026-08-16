import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Brain, LayoutDashboard } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { DementiaConsolidatedResults } from './DementiaConsolidatedResults';

interface CdrAssessmentProps { 
  onBack?: () => void;
  fastStage?: number | null;
  onScoresChange?: (scores: Record<string, number>) => void;
}

export const CdrAssessment: React.FC<CdrAssessmentProps> = ({ onBack, fastStage, onScoresChange }) => {
  const { language } = useLanguage();
  const [scores, setScores] = useState<Record<string, number>>({});
  const [showConsolidated, setShowConsolidated] = useState(false);

  const handleScoreChange = (id: string, value: number) => {
    const newScores = { ...scores, [id]: value };
    setScores(newScores);
    if (onScoresChange) onScoresChange(newScores);
  };

  const domains = [
    { id: 'memory', name: 'Memory', nameMl: 'ഓർമ്മ' },
    { id: 'orientation', name: 'Orientation', nameMl: 'ഓറിയന്റേഷൻ' },
    { id: 'judgment', name: 'Judgment', nameMl: 'വിധിന്യായം' },
    { id: 'community', name: 'Community Affairs', nameMl: 'സാമൂഹിക കാര്യങ്ങൾ' },
    { id: 'home', name: 'Home & Hobbies', nameMl: 'വീട് & ഹോബികൾ' },
    { id: 'personalCare', name: 'Personal Care', nameMl: 'വ്യക്തിപരമായ പരിചരണം' }
  ];

  if (showConsolidated) {
    return <DementiaConsolidatedResults 
      cdrScores={scores} 
      fastStage={fastStage ?? null} 
      onBack={() => setShowConsolidated(false)} 
    />;
  }

  const isComplete = Object.keys(scores).length === domains.length;

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        {onBack && <Button variant="ghost" onClick={onBack}><ArrowLeft className="mr-2" /> Back</Button>}
        {isComplete && (
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
          <CardTitle className="flex items-center gap-2"><Brain /> CDR (Clinical Dementia Rating)</CardTitle>
          <CardDescription>Rate domain impairment (0 = None, 0.5 = Questionable, 1 = Mild, 2 = Moderate, 3 = Severe).</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {domains.map(d => (
            <div key={d.id} className="space-y-2">
              <Label>{language === 'ml' ? d.nameMl : d.name}: {scores[d.id] ?? 0}</Label>
              <Slider 
                min={0} max={3} step={0.5} 
                value={[scores[d.id] ?? 0]} 
                onValueChange={(v) => handleScoreChange(d.id, v[0])}
              />
            </div>
          ))}
          <div className="p-4 bg-primary/10 rounded font-bold">Total Domains Rated: {Object.keys(scores).length}</div>
        </CardContent>
      </Card>
    </div>
  );
};
