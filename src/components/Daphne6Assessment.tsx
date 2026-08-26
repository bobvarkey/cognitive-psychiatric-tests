import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Brain, FileText, AlertTriangle, ShieldCheck, RotateCcw } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  DAPHNE6_DOMAINS,
  DAPHNE6_MAX_SCORE,
  DAPHNE6_CUTOFF,
  DAPHNE6_INTERPRETATION,
  DAPHNE6_METADATA,
} from '@/data/daphne6Scale';
import { ExportButtons } from './ExportButtons';
import { AssessmentReference } from '@/components/AssessmentReference';
import type { ReportData } from '@/utils/reportGenerator';

interface Daphne6AssessmentProps {
  onBack?: () => void;
}

/** Binary per-domain DAPHNE-6 screener: a domain is positive when ANY symptom present. */
export const Daphne6Assessment: React.FC<Daphne6AssessmentProps> = ({ onBack }) => {
  const { language } = useLanguage();
  const [selected, setSelected] = useState<Record<string, string[]>>({}); // domainId -> symptom keys present
  const [showResults, setShowResults] = useState(false);
  const [started, setStarted] = useState(false);
  const [patientInfo, setPatientInfo] = useState({ name: '', age: '', assessorName: '' });

  const toggleSymptom = (domainId: string, symptomIndex: number) => {
    setSelected(prev => {
      const current = prev[domainId] ?? [];
      const key = String(symptomIndex);
      const exists = current.includes(key);
      return {
        ...prev,
        [domainId]: exists ? current.filter(k => k !== key) : [...current, key],
      };
    });
  };

  const domainPositive = (domainId: string): boolean => {
    const symptoms = selected[domainId] ?? [];
    return symptoms.length > 0;
  };

  // DAPHNE-6 total = number of domains with >= 1 symptom present (0-6)
  const totalScore = DAPHNE6_DOMAINS.filter(d => domainPositive(d.id)).length;
  const isPositive = totalScore >= DAPHNE6_CUTOFF.threshold;

  const handleBegin = () => setStarted(true);
  const handleRestart = () => {
    setSelected({});
    setShowResults(false);
    setStarted(false);
    setPatientInfo({ name: '', age: '', assessorName: '' });
  };

  const interpretation = isPositive ? DAPHNE6_INTERPRETATION.high : DAPHNE6_INTERPRETATION.low;

  const reportData: ReportData = {
    assessmentName: DAPHNE6_METADATA.toolName,
    date: new Date().toLocaleString(),
    totalScore: `${totalScore}/${DAPHNE6_MAX_SCORE}`,
    interpretation: `${interpretation.label}: ${interpretation.meaning}`,
    severity: isPositive ? 'Positive screening (>= 4/6)' : 'Below screening threshold (< 4/6)',
    patientInfo: patientInfo.name
      ? { Patient: patientInfo.name, Age: patientInfo.age || 'N/A', Assessor: patientInfo.assessorName || 'N/A' }
      : undefined,
    sections: [
      {
        title: language === 'ml' ? 'ഡൊമെയ്ൻ സ്കോറുകൾ' : 'Domain Scores',
        items: DAPHNE6_DOMAINS.map(
          d => `${language === 'ml' ? d.domainMl : d.domain}: ${domainPositive(d.id) ? '1' : '0'}`
        ),
        type: 'info',
      },
      {
        title: language === 'ml' ? 'പോസിറ്റീവ് ഡൊമെയ്ൻ ലക്ഷണങ്ങൾ' : 'Positive Domain Symptoms',
        items: DAPHNE6_DOMAINS.flatMap(d =>
          (selected[d.id] ?? []).map(i => `${language === 'ml' ? d.domainMl : d.domain}: ${language === 'ml' ? d.symptomsMl[Number(i)] : d.symptoms[Number(i)]}`)
        ),
        type: 'info',
      },
    ],
    disclaimer: DAPHNE6_METADATA.importantNote,
  };

  if (!started) {
    return (
      <div className="max-w-3xl mx-auto p-4 space-y-6">
        {onBack && <Button variant="ghost" onClick={onBack}><ArrowLeft className="mr-2" /> Back</Button>}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Brain /> {DAPHNE6_METADATA.toolName}</CardTitle>
            <CardDescription>{DAPHNE6_METADATA.fullName}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <p className="text-muted-foreground text-sm">{DAPHNE6_METADATA.purpose}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-muted/50">
                <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground block">Respondent</span>
                <span className="text-sm">{DAPHNE6_METADATA.respondent}</span>
              </div>
              <div className="p-3 rounded-lg bg-muted/50">
                <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground block">Max Score</span>
                <span className="text-sm">{DAPHNE6_METADATA.maximumScore} domains</span>
              </div>
            </div>
            <div className="space-y-3">
              <label className="block text-sm font-medium">{language === 'ml' ? 'രോഗിയുടെ പേര് (ഓപ്ഷണൽ)' : 'Patient name (optional)'}</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-input rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                value={patientInfo.name}
                onChange={(e) => setPatientInfo(p => ({ ...p, name: e.target.value }))}
              />
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium">{language === 'ml' ? 'വയസ്സ് (optional)' : 'Age (optional)'}</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-input rounded-md mt-1"
                    value={patientInfo.age}
                    onChange={(e) => setPatientInfo(p => ({ ...p, age: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">{language === 'ml' ? 'വിലയിരുത്തുന്നയാൾ (optional)' : 'Assessor (optional)'}</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-input rounded-md mt-1"
                    value={patientInfo.assessorName}
                    onChange={(e) => setPatientInfo(p => ({ ...p, assessorName: e.target.value }))}
                  />
                </div>
              </div>
            </div>
            <Button onClick={handleBegin} className="w-full" size="lg">
              <FileText className="mr-2 h-4 w-4" /> {language === 'ml' ? 'ആരംഭിക്കുക' : 'Begin Assessment'}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showResults) {
    return (
      <div className="max-w-3xl mx-auto p-4 space-y-6">
        {onBack && <Button variant="ghost" onClick={onBack}><ArrowLeft className="mr-2" /> Back</Button>}
        <Card className={isPositive ? 'border-amber-500/40' : 'border-emerald-500/40'}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {isPositive ? <AlertTriangle className="h-5 w-5 text-amber-500" /> : <ShieldCheck className="h-5 w-5 text-emerald-500" />}
              DAPHNE-6 Result
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="text-center">
              <div className="text-5xl font-bold">{totalScore}<span className="text-2xl text-muted-foreground">/{DAPHNE6_MAX_SCORE}</span></div>
              <p className="text-sm text-muted-foreground mt-1">DAPHNE-6 screening score</p>
            </div>
            <div className={`p-4 rounded-lg ${isPositive ? 'bg-amber-500/10 border border-amber-500/30' : 'bg-emerald-500/10 border border-emerald-500/30'}`}>
              <span className="text-xs font-bold uppercase block mb-1">{language === 'ml' ? interpretation.labelMl : interpretation.label}</span>
              <p>{language === 'ml' ? interpretation.meaningMl : interpretation.meaning}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {DAPHNE6_DOMAINS.map(d => (
                <div key={d.id} className={`p-3 rounded-lg border ${domainPositive(d.id) ? 'border-amber-400 bg-amber-500/5' : 'border-border bg-muted/40'}`}>
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">{language === 'ml' ? d.domainMl : d.domain}</span>
                    <Badge variant={domainPositive(d.id) ? 'default' : 'outline'}>{domainPositive(d.id) ? 'Positive' : '0'}</Badge>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-xs text-muted-foreground italic">
              Cut-off ≥ {DAPHNE6_CUTOFF.threshold}/6 — sensitivity {DAPHNE6_CUTOFF.sensitivity}, specificity {DAPHNE6_CUTOFF.specificity}. {DAPHNE6_CUTOFF.note}
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              <ExportButtons data={reportData} />
              <Button variant="outline" size="sm" onClick={handleRestart}><RotateCcw className="mr-1.5 h-4 w-4" /> Restart</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      {onBack && <Button variant="ghost" onClick={onBack}><ArrowLeft className="mr-2" /> Back</Button>}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Brain /> DAPHNE-6</CardTitle>
          <CardDescription>
            {language === 'ml'
              ? 'ഒരു ഡൊമെയ്നിൽ കുറഞ്ഞത് ഒരു ലക്ഷണം ഉണ്ടെങ്കിൽ ആ ഡൊമെയ്ന് 1 പോയിന്റ് സ്കോർ ചെയ്യുക.'
              : 'Score 1 point per domain if at least one symptom in that domain is present.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-between items-center p-4 rounded-lg bg-primary/10">
            <span className="font-semibold">DAPHNE-6 Score</span>
            <span className="font-bold text-2xl">{totalScore}/{DAPHNE6_MAX_SCORE}</span>
          </div>

          {DAPHNE6_DOMAINS.map(d => (
            <div key={d.id} className="p-4 border rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold">{language === 'ml' ? d.domainMl : d.domain}</span>
                <Badge variant={domainPositive(d.id) ? 'default' : 'outline'}>{domainPositive(d.id) ? 'Positive' : '0'}</Badge>
              </div>
              <div className="space-y-2">
                {d.symptoms.map((symptom, idx) => (
                  <label key={idx} className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer">
                    <Checkbox
                      checked={domainPositive(d.id) && (selected[d.id] ?? []).includes(String(idx))}
                      onCheckedChange={() => toggleSymptom(d.id, idx)}
                    />
                    <span className="text-sm">{language === 'ml' ? d.symptomsMl[idx] : symptom}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}

          <div className="flex justify-between gap-3">
            <Button variant="outline" onClick={handleRestart} className="flex-1"><RotateCcw className="mr-2 h-4 w-4" /> Reset</Button>
            <Button onClick={() => setShowResults(true)} className="flex-1" size="lg">View Result</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
