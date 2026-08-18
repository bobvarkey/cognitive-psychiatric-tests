import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Brain, LayoutDashboard, HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
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
    { 
      id: 'memory', name: 'Memory', nameMl: 'ഓർമ്മ',
      tooltips: {
        0: 'No memory loss or slight inconstant forgetfulness.',
        0.5: 'Consistent slight forgetfulness; partial recollection of events; "benign" forgetfulness.',
        1: 'Moderate memory loss; more marked for recent events; defect interferes with everyday activities.',
        2: 'Severe memory loss; only highly learned material retained; new material rapidly lost.',
        3: 'Severe memory loss; only fragments remain.'
      },
      prompts: 'Ask about recent news events, names of friends, and if they forget where they place things.'
    },
    { 
      id: 'orientation', name: 'Orientation', nameMl: 'ഓറിയന്റേഷൻ',
      tooltips: {
        0: 'Fully oriented.',
        0.5: 'Fully oriented except for slight difficulty with time relationships.',
        1: 'Moderate difficulty with time relationships; oriented for place at examination; may have geographic disorientation elsewhere.',
        2: 'Severe difficulty with time relationships; usually disoriented to time, often to place.',
        3: 'Oriented to person only.'
      },
      prompts: 'Ask for the current date, day of week, season, and where they are right now.'
    },
    { 
      id: 'judgment', name: 'Judgment', nameMl: 'വിധിന്യായം',
      tooltips: {
        0: 'Solves problems well; judgment good in relation to past performance.',
        0.5: 'Slight impairment in solving problems, similarities, differences.',
        1: 'Moderate difficulty in handling problems, similarities, differences; social judgment usually maintained.',
        2: 'Severely impaired in handling problems, similarities, differences; social judgment usually impaired.',
        3: 'Unable to make judgments or solve problems.'
      },
      prompts: 'Ask how they would handle a small fire in the kitchen or find their way if lost.'
    },
    { 
      id: 'community', name: 'Community Affairs', nameMl: 'സാമൂഹിക കാര്യങ്ങൾ',
      tooltips: {
        0: 'Independent at usual level in job, shopping, business and financial affairs, volunteer and social groups.',
        0.5: 'Slight impairment in these activities.',
        1: 'Unable to function independently in these activities though may still be engaged in some; appears normal to casual inspection.',
        2: 'No pretense of independent function outside the home; appears well enough to be taken to functions outside a family home.',
        3: 'No pretense of independent function outside the home; appears too ill to be taken to functions outside a family home.'
      },
      prompts: 'Ask if they still manage their own finances, go shopping alone, or attend social events.'
    },
    { 
      id: 'home', name: 'Home & Hobbies', nameMl: 'വീട് & ഹോബികൾ',
      tooltips: {
        0: 'Life at home, hobbies, intellectual interests well maintained.',
        0.5: 'Life at home, hobbies, intellectual interests slightly impaired.',
        1: 'Mild but definite impairment of function at home; more difficult tasks abandoned; more complicated hobbies and interests abandoned.',
        2: 'Only simple chores preserved; very restricted interests, poorly maintained.',
        3: 'No significant function in home.'
      },
      prompts: 'Ask if they have given up any hobbies or if they need reminders to do simple chores.'
    },
    { 
      id: 'personalCare', name: 'Personal Care', nameMl: 'വ്യക്തിപരമായ പരിചരണം',
      tooltips: {
        0: 'Fully capable of self-care.',
        1: 'Needs occasional prompting.',
        2: 'Requires assistance in dressing, hygiene, keeping of personal effects.',
        3: 'Requires much help with personal care; often incontinent.'
      },
      prompts: 'Ask if they need help choosing clothes, bathing, or using the bathroom.'
    }
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
        <CardContent className="space-y-8">
          <TooltipProvider>
            {domains.map(d => (
              <div key={d.id} className="space-y-4 p-4 border rounded-lg bg-card dark:bg-card">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Label className="text-base font-semibold">{language === 'ml' ? d.nameMl : d.name}</Label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-[300px]">
                        <p className="font-bold mb-1">Clinician Prompt:</p>
                        <p>{d.prompts}</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <span className="text-sm font-bold bg-primary/10 px-2 py-1 rounded">Score: {scores[d.id] ?? 0}</span>
                </div>
                
                <div className="space-y-2">
                  <Slider 
                    min={0} max={3} step={0.5} 
                    value={[scores[d.id] ?? 0]} 
                    onValueChange={(v) => handleScoreChange(d.id, v[0])}
                  />
                  <div className="flex justify-between text-[11px] text-muted-foreground font-semibold uppercase tracking-tight">
                    <span>None (0)</span>
                    <span>Ques (0.5)</span>
                    <span>Mild (1)</span>
                    <span>Mod (2)</span>
                    <span>Sev (3)</span>
                  </div>
                </div>

                <div className="text-xs text-muted-foreground italic border-t pt-2 mt-2">
                  {d.tooltips[scores[d.id] as keyof typeof d.tooltips] || d.tooltips[0 as keyof typeof d.tooltips]}
                </div>
              </div>
            ))}
          </TooltipProvider>
          <div className="p-4 bg-primary/10 rounded font-bold">Total Domains Rated: {Object.keys(scores).length}</div>
        </CardContent>
      </Card>
    </div>
  );
};
