import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, ArrowLeft, ArrowRight, CheckCircle2, ShieldAlert } from "lucide-react";
import { 
  PsychiatricTriageData, 
  TriageResult, 
  TriagePrimaryCategory, 
  TriageRiskLevel, 
  TriageRecommendedRoute,
  TriageComorbidCategory
} from '@/types/triage';

interface PsychiatricTriageAssessmentProps {
  onBack: () => void;
}

const INITIAL_DATA: PsychiatricTriageData = {
  patient: { ageYears: 18 },
  safetyPsychosis: {
    suicidalThoughtsRecent: false,
    suicidalPlanOrIntent: false,
    homicidalThoughts: false,
    recentViolenceOrWeapons: false,
    psychosisHallucinations: false,
    psychosisDelusions: false,
    psychoticExperiencesClearlyReal: false,
  },
  mood: {
    phq9Total: 0,
    phq9Item9Suicidality: 0,
    mdqPositive: false,
  },
  anxietyTraumaOcd: {
    gad7Total: 0,
    ptsdScreenPositive: false,
    ocdSymptomsProminent: false,
  },
  adhd: {
    asrsPartAPositive: false,
    adhdSinceChildhood: false,
    adhdCrossSettingImpairment: false,
  },
  personality: {
    personalityScreenPositive: false,
  },
  substance: {
    auditTotal: 0,
    dastTotal: 0,
    substanceUseClinicallySignificant: false,
  },
  cognitive: {
    cognitiveScreenPositive: false,
  },
};

export const PsychiatricTriageAssessment = ({ onBack }: PsychiatricTriageAssessmentProps) => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<PsychiatricTriageData>(INITIAL_DATA);
  const [showResult, setShowResult] = useState(false);

  const totalSteps = 8;

  const handleNext = () => {
    if (step < totalSteps) setStep(step + 1);
    else calculateResult();
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
    else onBack();
  };

  const calculateResult = () => {
    const result: TriageResult = {
      primaryCategory: "none_or_unclear",
      comorbidCategories: [],
      riskLevel: "low",
      recommendedRoute: "monitor_and_reassess",
      clinicalNotes: []
    };

    // 1. Safety & Risk Check (High Priority)
    if (data.safetyPsychosis.suicidalPlanOrIntent || 
        data.safetyPsychosis.homicidalThoughts || 
        data.safetyPsychosis.recentViolenceOrWeapons ||
        data.mood.phq9Item9Suicidality >= 2) {
      result.primaryCategory = "emergency_risk";
      result.riskLevel = "high";
      result.recommendedRoute = "urgent_psychiatry_or_ED";
      result.clinicalNotes.push("Immediate safety risk detected. Requires urgent evaluation.");
    } 
    // 2. Psychosis Check
    else if (data.safetyPsychosis.psychosisHallucinations || data.safetyPsychosis.psychosisDelusions) {
      result.primaryCategory = "psychosis_or_psychosis_risk";
      result.riskLevel = data.safetyPsychosis.psychoticExperiencesClearlyReal ? "high" : "moderate";
      result.recommendedRoute = "urgent_psychiatry_or_ED";
      result.clinicalNotes.push("Active psychotic symptoms reported.");
    }
    // 3. Mood Disorders
    else if (data.mood.mdqPositive) {
      result.primaryCategory = "bipolar_mood_disorder";
      result.riskLevel = "moderate";
      result.recommendedRoute = "routine_psychiatry";
    }
    else if (data.mood.phq9Total >= 10) {
      result.primaryCategory = "unipolar_mood_disorder";
      result.riskLevel = "moderate";
      result.recommendedRoute = "psychology_or_therapy";
    }
    // 4. Anxiety/Trauma
    else if (data.anxietyTraumaOcd.gad7Total >= 10 || data.anxietyTraumaOcd.ptsdScreenPositive || data.anxietyTraumaOcd.ocdSymptomsProminent) {
      result.primaryCategory = "anxiety_trauma_or_oCD";
      result.riskLevel = "moderate";
      result.recommendedRoute = "psychology_or_therapy";
    }
    // 5. ADHD
    else if (data.adhd.asrsPartAPositive && data.adhd.adhdSinceChildhood && data.adhd.adhdCrossSettingImpairment) {
      result.primaryCategory = "ADHD_add_spectrum";
      result.riskLevel = "low";
      result.recommendedRoute = "routine_psychiatry";
    }
    // 6. Substance Use
    else if (data.substance.auditTotal >= 8 || data.substance.dastTotal >= 3 || data.substance.substanceUseClinicallySignificant) {
      result.primaryCategory = "substance_use_disorder";
      result.riskLevel = "moderate";
      result.recommendedRoute = "substance_use_services";
    }
    // 7. Cognitive
    else if (data.cognitive.cognitiveScreenPositive) {
      result.primaryCategory = "cognitive_disorder_MCI_dementia";
      result.riskLevel = "moderate";
      result.recommendedRoute = "neurocognitive_workup";
    }

    // Comorbidities
    if (data.personality.personalityScreenPositive) result.comorbidCategories.push("personality_disorder_traits");
    if (result.primaryCategory !== "substance_use_disorder" && (data.substance.auditTotal >= 8 || data.substance.dastTotal >= 3)) {
      result.comorbidCategories.push("substance_use_disorder");
    }
    if (result.primaryCategory !== "ADHD_add_spectrum" && data.adhd.asrsPartAPositive) {
      result.comorbidCategories.push("ADHD_add_spectrum");
    }

    setResult(result);
    setShowResult(true);
  };

  const [result, setResult] = useState<TriageResult | null>(null);

  if (showResult && result) {
    return (
      <div className="max-w-4xl mx-auto w-full p-4 space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" size="icon" onClick={() => setShowResult(false)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Triage Results</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-primary/20 bg-card/50 backdrop-blur-sm shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldAlert className={result.riskLevel === 'high' ? 'text-destructive' : 'text-warning'} />
                Clinical Priority
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-muted-foreground">Primary Category</Label>
                <div className="text-xl font-bold capitalize">{result.primaryCategory.replace(/_/g, ' ')}</div>
              </div>
              <div>
                <Label className="text-muted-foreground">Risk Level</Label>
                <div className={`text-lg font-bold capitalize ${result.riskLevel === 'high' ? 'text-destructive' : result.riskLevel === 'moderate' ? 'text-yellow-500' : 'text-green-500'}`}>
                  {result.riskLevel}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-card/50 backdrop-blur-sm shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <CheckCircle2 />
                Recommended Route
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-semibold capitalize">{result.recommendedRoute.replace(/_/g, ' ')}</div>
              {result.clinicalNotes.length > 0 && (
                <div className="mt-4 p-3 rounded-lg bg-muted/50 border border-border">
                  <ul className="list-disc list-inside text-sm space-y-1">
                    {result.clinicalNotes.map((note, i) => <li key={i}>{note}</li>)}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>

          {result.comorbidCategories.length > 0 && (
            <Card className="md:col-span-2 border-primary/20 bg-card/50 backdrop-blur-sm shadow-xl">
              <CardHeader>
                <CardTitle className="text-sm uppercase tracking-wider text-muted-foreground">Comorbid Considerations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {result.comorbidCategories.map((cat, i) => (
                    <span key={i} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold capitalize">
                      {cat.replace(/_/g, ' ')}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="flex justify-center mt-8">
          <Button onClick={onBack} size="lg" className="w-full max-w-xs shadow-lg shadow-primary/20">
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="age">Patient Age (Years)</Label>
              <Input 
                id="age"
                type="number"
                value={data.patient.ageYears}
                onChange={(e) => setData({ ...data, patient: { ...data.patient, ageYears: parseInt(e.target.value) || 0 }})}
                className="max-w-xs"
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg border-b pb-2 mb-4">Safety & Risk</h3>
            {[
              { key: 'suicidalThoughtsRecent', label: 'Recent Suicidal Thoughts' },
              { key: 'suicidalPlanOrIntent', label: 'Active Plan or Intent' },
              { key: 'homicidalThoughts', label: 'Homicidal Thoughts' },
              { key: 'recentViolenceOrWeapons', label: 'Recent Violence or Weapons Access' },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50">
                <Label htmlFor={item.key} className="flex-1">{item.label}</Label>
                <Switch 
                  id={item.key}
                  checked={(data.safetyPsychosis as any)[item.key]}
                  onCheckedChange={(checked) => setData({
                    ...data,
                    safetyPsychosis: { ...data.safetyPsychosis, [item.key]: checked }
                  })}
                />
              </div>
            ))}
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg border-b pb-2 mb-4">Psychosis Screen</h3>
            {[
              { key: 'psychosisHallucinations', label: 'Hallucinations (Auditory/Visual)' },
              { key: 'psychosisDelusions', label: 'Delusions (Paranoid/Bizarre)' },
              { key: 'psychoticExperiencesClearlyReal', label: 'Patient convinced experiences are real' },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50">
                <Label htmlFor={item.key} className="flex-1">{item.label}</Label>
                <Switch 
                  id={item.key}
                  checked={(data.safetyPsychosis as any)[item.key]}
                  onCheckedChange={(checked) => setData({
                    ...data,
                    safetyPsychosis: { ...data.safetyPsychosis, [item.key]: checked }
                  })}
                />
              </div>
            ))}
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <h3 className="font-semibold text-lg border-b pb-2">Mood (PHQ-9 & MDQ)</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>PHQ-9 Total Score (0-27)</Label>
                <Input type="number" min="0" max="27" value={data.mood.phq9Total} 
                  onChange={(e) => setData({ ...data, mood: { ...data.mood, phq9Total: parseInt(e.target.value) || 0 }})}
                />
              </div>
              <div className="space-y-2">
                <Label>PHQ-9 Item 9 (Suicidality 0-3)</Label>
                <Input type="number" min="0" max="3" value={data.mood.phq9Item9Suicidality} 
                  onChange={(e) => setData({ ...data, mood: { ...data.mood, phq9Item9Suicidality: parseInt(e.target.value) || 0 }})}
                />
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50">
                <Label>MDQ Positive (Bipolar Screen)</Label>
                <Switch checked={data.mood.mdqPositive} onCheckedChange={(checked) => setData({ ...data, mood: { ...data.mood, mdqPositive: checked }})} />
              </div>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-6">
            <h3 className="font-semibold text-lg border-b pb-2">Anxiety, Trauma & OCD</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>GAD-7 Total Score (0-21)</Label>
                <Input type="number" min="0" max="21" value={data.anxietyTraumaOcd.gad7Total} 
                  onChange={(e) => setData({ ...data, anxietyTraumaOcd: { ...data.anxietyTraumaOcd, gad7Total: parseInt(e.target.value) || 0 }})}
                />
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50">
                <Label>PTSD Screen Positive</Label>
                <Switch checked={data.anxietyTraumaOcd.ptsdScreenPositive} onCheckedChange={(checked) => setData({ ...data, anxietyTraumaOcd: { ...data.anxietyTraumaOcd, ptsdScreenPositive: checked }})} />
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50">
                <Label>Prominent OCD Symptoms</Label>
                <Switch checked={data.anxietyTraumaOcd.ocdSymptomsProminent} onCheckedChange={(checked) => setData({ ...data, anxietyTraumaOcd: { ...data.anxietyTraumaOcd, ocdSymptomsProminent: checked }})} />
              </div>
            </div>
          </div>
        );
      case 6:
        return (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg border-b pb-2 mb-4">ADHD & Personality</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50">
                <Label>ASRS Part A Positive</Label>
                <Switch checked={data.adhd.asrsPartAPositive} onCheckedChange={(checked) => setData({ ...data, adhd: { ...data.adhd, asrsPartAPositive: checked }})} />
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50">
                <Label>Symptoms since childhood</Label>
                <Switch checked={data.adhd.adhdSinceChildhood} onCheckedChange={(checked) => setData({ ...data, adhd: { ...data.adhd, adhdSinceChildhood: checked }})} />
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50">
                <Label>Cross-setting impairment</Label>
                <Switch checked={data.adhd.adhdCrossSettingImpairment} onCheckedChange={(checked) => setData({ ...data, adhd: { ...data.adhd, adhdCrossSettingImpairment: checked }})} />
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50 mt-6">
                <Label className="font-bold">Personality Disorder Screen Positive</Label>
                <Switch checked={data.personality.personalityScreenPositive} onCheckedChange={(checked) => setData({ ...data, personality: { ...data.personality, personalityScreenPositive: checked }})} />
              </div>
            </div>
          </div>
        );
      case 7:
        return (
          <div className="space-y-6">
            <h3 className="font-semibold text-lg border-b pb-2">Substance Use</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>AUDIT Total (Alcohol, 0-40)</Label>
                <Input type="number" value={data.substance.auditTotal} 
                  onChange={(e) => setData({ ...data, substance: { ...data.substance, auditTotal: parseInt(e.target.value) || 0 }})}
                />
              </div>
              <div className="space-y-2">
                <Label>DAST Total (Drugs, 0-10)</Label>
                <Input type="number" value={data.substance.dastTotal} 
                  onChange={(e) => setData({ ...data, substance: { ...data.substance, dastTotal: parseInt(e.target.value) || 0 }})}
                />
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50">
                <Label>Clinically Significant Use reported</Label>
                <Switch checked={data.substance.substanceUseClinicallySignificant} onCheckedChange={(checked) => setData({ ...data, substance: { ...data.substance, substanceUseClinicallySignificant: checked }})} />
              </div>
            </div>
          </div>
        );
      case 8:
        return (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg border-b pb-2 mb-4">Cognitive</h3>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50">
              <Label className="text-lg">Cognitive Screen Positive (MoCA/MMSE/CCSA)</Label>
              <Switch 
                checked={data.cognitive.cognitiveScreenPositive} 
                onCheckedChange={(checked) => setData({ ...data, cognitive: { ...data.cognitive, cognitiveScreenPositive: checked }})} 
              />
            </div>
            <p className="text-xs text-muted-foreground italic mt-2">
              Check this if objective testing suggests MCI or Dementia.
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto w-full p-4">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="outline" size="icon" onClick={handleBack} className="rounded-full">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold tracking-tight">Psychiatric Triage</h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
            <span>Step {step} of {totalSteps}</span>
            <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-300" 
                style={{ width: `${(step / totalSteps) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <Card className="border-primary/20 bg-card/50 backdrop-blur-sm shadow-2xl rounded-2xl overflow-hidden border">
        <CardContent className="pt-8">
          {renderStep()}
        </CardContent>
        <div className="p-6 bg-muted/20 border-t flex justify-between items-center">
          <Button variant="ghost" onClick={handleBack}>
            {step === 1 ? 'Cancel' : 'Back'}
          </Button>
          <Button onClick={handleNext} className="gap-2 shadow-lg shadow-primary/20">
            {step === totalSteps ? 'Complete Triage' : 'Next Step'}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </Card>

      <div className="mt-8">
        <Alert variant="default" className="bg-primary/5 border-primary/20">
          <AlertCircle className="h-4 w-4 text-primary" />
          <AlertTitle className="text-primary text-xs uppercase tracking-widest font-bold">Clinical Disclaimer</AlertTitle>
          <AlertDescription className="text-xs text-muted-foreground">
            This triage tool is for clinician decision-support only. It does not replace full clinical judgment or face-to-face evaluation. High-risk indicators require immediate psychiatric or emergency department referral.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
};
