import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ClipboardCheck, Scale } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface DementiaConsolidatedResultsProps {
  cdrScores: Record<string, number>;
  fastStage: number | null;
  onBack?: () => void;
}

export const DementiaConsolidatedResults: React.FC<DementiaConsolidatedResultsProps> = ({ 
  cdrScores, 
  fastStage, 
  onBack 
}) => {
  const { language } = useLanguage();

  const cdrTotal = Object.values(cdrScores).reduce((a, b) => a + b, 0);
  const cdrInterpretation = () => {
    if (cdrTotal === 0) return language === 'ml' ? 'ഡിമെൻഷ്യ ഇല്ല' : 'No dementia';
    if (cdrTotal <= 0.5) return language === 'ml' ? 'സംശയാസ്പദമായ ഡിമെൻഷ്യ' : 'Questionable dementia';
    if (cdrTotal <= 1) return language === 'ml' ? 'നേരിയ ഡിമെൻഷ്യ' : 'Mild dementia';
    if (cdrTotal <= 2) return language === 'ml' ? 'മിതമായ ഡിമെൻഷ്യ' : 'Moderate dementia';
    return language === 'ml' ? 'കഠിനമായ ഡിമെൻഷ്യ' : 'Severe dementia';
  };

  const fastInterpretation = (stage: number | null) => {
    if (!stage) return language === 'ml' ? 'വിലയിരുത്തിയിട്ടില്ല' : 'Not assessed';
    if (stage <= 2) return language === 'ml' ? 'സാധാരണ വാർദ്ധക്യം' : 'Normal aging';
    if (stage === 3) return language === 'ml' ? 'നേരിയ വൈജ്ഞാനിക വൈകല്യം' : 'Early-stage dementia / MCI';
    if (stage === 4) return language === 'ml' ? 'നേരിയ അൽഷിമേഴ്‌സ്' : 'Mild Alzheimer\'s';
    if (stage === 5) return language === 'ml' ? 'മിതമായ അൽഷിമേഴ്‌സ്' : 'Moderate Alzheimer\'s';
    if (stage === 6) return language === 'ml' ? 'മിതമായ കഠിനമായ അൽഷിമേഴ്‌സ്' : 'Moderately severe Alzheimer\'s';
    if (stage === 7) return language === 'ml' ? 'കഠിനമായ അൽഷിമേഴ്‌സ്' : 'Severe Alzheimer\'s';
    return '';
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {onBack && <Button variant="ghost" onClick={onBack}><ArrowLeft className="mr-2" /> Back</Button>}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-blue-500/20 bg-blue-500/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-500">
              <ClipboardCheck className="h-5 w-5" />
              CDR Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">{cdrTotal}</div>
            <p className="text-sm text-muted-foreground mb-4">
              {language === 'ml' ? 'ക്ലിനിക്കൽ ഡിമെൻഷ്യ റേറ്റിംഗ്' : 'Clinical Dementia Rating total score'}
            </p>
            <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <span className="text-xs font-bold uppercase text-blue-500 block mb-1">
                {language === 'ml' ? 'വ്യാഖ്യാനം' : 'Interpretation'}
              </span>
              <p className="text-foreground font-medium">{cdrInterpretation()}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-500/20 bg-purple-500/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-500">
              <Scale className="h-5 w-5" />
              FAST Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">Stage {fastStage ?? 'N/A'}</div>
            <p className="text-sm text-muted-foreground mb-4">
              {language === 'ml' ? 'ഫങ്ഷണൽ അസസ്മെന്റ് സ്റ്റേജിംഗ്' : 'Functional Assessment Staging'}
            </p>
            <div className="p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
              <span className="text-xs font-bold uppercase text-purple-500 block mb-1">
                {language === 'ml' ? 'വ്യാഖ്യാനം' : 'Interpretation'}
              </span>
              <p className="text-foreground font-medium">{fastInterpretation(fastStage)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{language === 'ml' ? 'ക്ലിനിക്കൽ സംഗ്രഹം' : 'Clinical Conclusion'}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            {language === 'ml' 
              ? `രോഗിയുടെ CDR സ്കോർ ${cdrTotal} ആണ് (${cdrInterpretation()}). FAST ഘട്ടം ${fastStage ?? 'ലഭ്യമല്ല'} ആണ് (${fastInterpretation(fastStage)}).` 
              : `Patient demonstrates a CDR score of ${cdrTotal} (${cdrInterpretation()}) and a FAST stage of ${fastStage ?? 'N/A'} (${fastInterpretation(fastStage)}).`}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
