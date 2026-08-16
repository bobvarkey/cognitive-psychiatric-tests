import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Clock, LayoutDashboard, HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useLanguage } from '@/contexts/LanguageContext';
import { FAST_ITEMS } from '@/data/fastScale';
import { DementiaConsolidatedResults } from './DementiaConsolidatedResults';

interface FastAssessmentProps { 
  onBack?: () => void;
  cdrScores?: Record<string, number>;
  onStageChange?: (stage: number | null) => void;
}

export const FastAssessment: React.FC<FastAssessmentProps> = ({ onBack, cdrScores, onStageChange }) => {
  const { language } = useLanguage();
  const [selectedStage, setSelectedStage] = useState<number | null>(null);
  const [showConsolidated, setShowConsolidated] = useState(false);

  const handleStageChange = (val: string) => {
    const stage = parseInt(val);
    setSelectedStage(stage);
    if (onStageChange) onStageChange(stage);
  };

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
          <TooltipProvider>
            <RadioGroup onValueChange={handleStageChange}>
              {FAST_ITEMS.map(item => (
                <div key={item.id} className="group relative flex items-start space-x-2 p-3 border rounded-lg hover:bg-accent/5 transition-colors">
                  <RadioGroupItem value={item.stage.toString()} id={item.id} className="mt-1" />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <Label htmlFor={item.id} className="font-bold text-sm cursor-pointer">
                        {language === 'ml' ? item.titleMl : item.title}
                      </Label>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-bold">Stage {item.stage}</span>
                      
                      {item.tooltip && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help opacity-0 group-hover:opacity-100 transition-opacity" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-[280px]">
                            <p className="font-bold text-xs mb-1">Clinician Note:</p>
                            <p className="text-xs">{item.tooltip}</p>
                            {item.prompt && (
                              <>
                                <p className="font-bold text-xs mt-2 mb-1">Prompt:</p>
                                <p className="text-xs italic">"{item.prompt}"</p>
                              </>
                            )}
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {language === 'ml' ? item.descriptionMl : item.description}
                    </p>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </TooltipProvider>
          {selectedStage && (
            <div className="mt-6 p-4 bg-primary/10 rounded-xl border border-primary/20 animate-in fade-in slide-in-from-bottom-2">
              <span className="text-xs font-bold text-primary uppercase tracking-wider block mb-1">Selected Clinical Stage</span>
              <div className="text-xl font-black text-foreground">Stage {selectedStage}</div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
