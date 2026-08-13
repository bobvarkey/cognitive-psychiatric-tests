import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
    suicidalThoughtsFrequency: "none",
    suicidalPlanOrIntent: false,
    homicidalThoughts: false,
    recentViolenceOrWeapons: false,
    psychosisHallucinations: false,
    psychosisDelusions: false,
    psychoticExperiencesClearlyReal: false,
  },
  mood: {
    depressionPresence: "none",
    bipolarScreenPositive: false,
  },
  anxietyTraumaOcd: {
    anxietyLevel: "none",
    ptsdScreenPositive: false,
    ocdSymptomsProminent: false,
  },
  adhd: {
    inattentionLevel: "none",
    adhdSinceChildhood: false,
    adhdFunctionalImpact: "none",
  },
  personality: {
    longstandingInterpersonalProblems: false,
    unstableIntenseRelationships: false,
    chronicImpulsivity: false,
  },
  substance: {
    hazardousAlcoholUse: "unlikely",
    hazardousDrugUse: "unlikely",
  },
  cognitive: {
    cognitiveConcerns: "none",
  },
};

export const PsychiatricTriageAssessment = ({ onBack }: PsychiatricTriageAssessmentProps) => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<PsychiatricTriageData>(INITIAL_DATA);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<TriageResult | null>(null);

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
    const out: TriageResult = {
      primaryCategory: "none_or_unclear",
      comorbidCategories: [],
      riskLevel: "low",
      recommendedRoute: "monitor_and_reassess",
      clinicalNotes: []
    };

    // Safety
    const highSuicide =
      data.safetyPsychosis.suicidalPlanOrIntent ||
      data.safetyPsychosis.suicidalThoughtsFrequency === "frequent";

    const highViolence =
      data.safetyPsychosis.homicidalThoughts ||
      data.safetyPsychosis.recentViolenceOrWeapons;

    const psychosisPresent =
      (data.safetyPsychosis.psychosisHallucinations ||
       data.safetyPsychosis.psychosisDelusions) &&
      data.safetyPsychosis.psychoticExperiencesClearlyReal;

    if (highSuicide || highViolence) {
      out.riskLevel = "high";
      out.primaryCategory = psychosisPresent
        ? "psychosis_or_psychosis_risk"
        : "emergency_risk";
      out.recommendedRoute = "urgent_psychiatry_or_ED";
      out.clinicalNotes.push("Immediate safety risk detected. Requires urgent evaluation.");
    } else if (psychosisPresent) {
      out.riskLevel = "moderate";
      out.primaryCategory = "psychosis_or_psychosis_risk";
      out.recommendedRoute = "routine_psychiatry";
      out.clinicalNotes.push("Active psychotic symptoms reported.");
    }

    // Mood
    const probableDepression =
      data.mood.depressionPresence === "moderate" ||
      data.mood.depressionPresence === "severe";

    const probableBipolar = data.mood.bipolarScreenPositive;

    if (out.primaryCategory === "none_or_unclear") {
      if (probableBipolar) {
        out.primaryCategory = "bipolar_mood_disorder";
        out.riskLevel = highSuicide ? "high" : "moderate";
        out.recommendedRoute = "routine_psychiatry";
        out.clinicalNotes.push("Probable bipolar mood disorder.");
      } else if (probableDepression) {
        out.primaryCategory = "unipolar_mood_disorder";
        out.riskLevel = highSuicide ? "high" : "moderate";
        out.recommendedRoute =
          out.riskLevel === "high"
            ? "urgent_psychiatry_or_ED"
            : "routine_psychiatry";
        out.clinicalNotes.push("Significant unipolar depressive symptoms.");
      }
    }

    // Anxiety / Trauma / OCD
    const anxietySignificant =
      data.anxietyTraumaOcd.anxietyLevel === "moderate" ||
      data.anxietyTraumaOcd.anxietyLevel === "severe";

    const ptsdPositive = data.anxietyTraumaOcd.ptsdScreenPositive;
    const ocdProminent = data.anxietyTraumaOcd.ocdSymptomsProminent;

    if (out.primaryCategory === "none_or_unclear") {
      if (anxietySignificant || ptsdPositive || ocdProminent) {
        out.primaryCategory = "anxiety_trauma_or_oCD";
        out.riskLevel = "moderate";
        out.recommendedRoute = "psychology_or_therapy";
        out.clinicalNotes.push("Anxiety, trauma, or OCD symptoms are primary concerns.");
      }
    } else if (anxietySignificant || ptsdPositive || ocdProminent) {
      out.comorbidCategories.push("anxiety_trauma_or_oCD");
    }

    // ADHD / ADD
    const adhdLikely =
      (data.adhd.inattentionLevel === "moderate" ||
        data.adhd.inattentionLevel === "severe") &&
      data.adhd.adhdSinceChildhood &&
      data.adhd.adhdFunctionalImpact !== "none";

    if (adhdLikely) {
      if (out.primaryCategory === "none_or_unclear") {
        out.primaryCategory = "ADHD_add_spectrum";
        out.riskLevel = "low";
        out.recommendedRoute = "routine_psychiatry";
        out.clinicalNotes.push("ADHD/ADD spectrum identified as primary.");
      } else {
        out.comorbidCategories.push("ADHD_add_spectrum");
      }
    }

    // Substance
    const substanceLikely =
      data.substance.hazardousAlcoholUse === "likely" ||
      data.substance.hazardousDrugUse === "likely";

    if (substanceLikely) {
      if (out.primaryCategory === "none_or_unclear") {
        out.primaryCategory = "substance_use_disorder";
        out.riskLevel = "moderate";
        out.recommendedRoute = "substance_use_services";
        out.clinicalNotes.push("Substance use disorder identified as primary.");
      } else {
        out.comorbidCategories.push("substance_use_disorder");
      }
    }

    // Personality traits
    const pdTraits =
      data.personality.longstandingInterpersonalProblems ||
      data.personality.unstableIntenseRelationships ||
      data.personality.chronicImpulsivity;

    if (pdTraits) {
      out.comorbidCategories.push("personality_disorder_traits");
    }

    // Cognitive
    const cognitiveSignificant =
      data.cognitive.cognitiveConcerns === "moderate" ||
      data.cognitive.cognitiveConcerns === "severe";

    if (cognitiveSignificant) {
      if (out.primaryCategory === "none_or_unclear") {
        out.primaryCategory = "cognitive_disorder_MCI_dementia";
        out.riskLevel = "moderate";
        out.recommendedRoute = "neurocognitive_workup";
        out.clinicalNotes.push("Significant cognitive concerns reported.");
      } else {
        out.comorbidCategories.push("cognitive_disorder_MCI_dementia");
      }
    }

    if (out.primaryCategory === "none_or_unclear") {
      out.riskLevel = "low";
      out.recommendedRoute = "monitor_and_reassess";
      out.clinicalNotes.push("No specific psychiatric diagnosis reached clinical threshold for triage.");
    }

    setResult(out);
    setShowResult(true);
  };

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
                <ShieldAlert className={result.riskLevel === 'high' ? 'text-destructive' : result.riskLevel === 'moderate' ? 'text-yellow-500' : 'text-green-500'} />
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
            <div className="space-y-2">
              <Label>Suicidal Thoughts Frequency</Label>
              <Select 
                value={data.safetyPsychosis.suicidalThoughtsFrequency} 
                onValueChange={(val: any) => setData({...data, safetyPsychosis: {...data.safetyPsychosis, suicidalThoughtsFrequency: val}})}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="occasional">Occasional</SelectItem>
                  <SelectItem value="frequent">Frequent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {[
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
            <h3 className="font-semibold text-lg border-b pb-2">Mood</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Depression Presence</Label>
                <Select 
                  value={data.mood.depressionPresence} 
                  onValueChange={(val: any) => setData({...data, mood: {...data.mood, depressionPresence: val}})}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="moderate">Moderate</SelectItem>
                    <SelectItem value="severe">Severe</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50">
                <Label>Bipolar Screen Positive</Label>
                <Switch checked={data.mood.bipolarScreenPositive} onCheckedChange={(checked) => setData({ ...data, mood: { ...data.mood, bipolarScreenPositive: checked }})} />
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
                <Label>Anxiety Level</Label>
                <Select 
                  value={data.anxietyTraumaOcd.anxietyLevel} 
                  onValueChange={(val: any) => setData({...data, anxietyTraumaOcd: {...data.anxietyTraumaOcd, anxietyLevel: val}})}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="moderate">Moderate</SelectItem>
                    <SelectItem value="severe">Severe</SelectItem>
                  </SelectContent>
                </Select>
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
              <div className="space-y-2">
                <Label>Inattention Level</Label>
                <Select 
                  value={data.adhd.inattentionLevel} 
                  onValueChange={(val: any) => setData({...data, adhd: {...data.adhd, inattentionLevel: val}})}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="moderate">Moderate</SelectItem>
                    <SelectItem value="severe">Severe</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50">
                <Label>Symptoms since childhood</Label>
                <Switch checked={data.adhd.adhdSinceChildhood} onCheckedChange={(checked) => setData({ ...data, adhd: { ...data.adhd, adhdSinceChildhood: checked }})} />
              </div>
              <div className="space-y-2">
                <Label>ADHD Functional Impact</Label>
                <Select 
                  value={data.adhd.adhdFunctionalImpact} 
                  onValueChange={(val: any) => setData({...data, adhd: {...data.adhd, adhdFunctionalImpact: val}})}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="moderate">Moderate</SelectItem>
                    <SelectItem value="severe">Severe</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="font-bold border-t pt-4 mt-2">Personality traits</div>
              {[
                { key: 'longstandingInterpersonalProblems', label: 'Longstanding Interpersonal Problems' },
                { key: 'unstableIntenseRelationships', label: 'Unstable/Intense Relationships' },
                { key: 'chronicImpulsivity', label: 'Chronic Impulsivity' },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50">
                  <Label htmlFor={item.key} className="flex-1">{item.label}</Label>
                  <Switch 
                    id={item.key}
                    checked={(data.personality as any)[item.key]}
                    onCheckedChange={(checked) => setData({
                      ...data,
                      personality: { ...data.personality, [item.key]: checked }
                    })}
                  />
                </div>
              ))}
            </div>
          </div>
        );
      case 7:
        return (
          <div className="space-y-6">
            <h3 className="font-semibold text-lg border-b pb-2">Substance Use</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50">
                <Label>Hazardous Alcohol Use Likely</Label>
                <Switch checked={data.substance.hazardousAlcoholUse === 'likely'} onCheckedChange={(checked) => setData({ ...data, substance: { ...data.substance, hazardousAlcoholUse: checked ? 'likely' : 'unlikely' }})} />
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50">
                <Label>Hazardous Drug Use Likely</Label>
                <Switch checked={data.substance.hazardousDrugUse === 'likely'} onCheckedChange={(checked) => setData({ ...data, substance: { ...data.substance, hazardousDrugUse: checked ? 'likely' : 'unlikely' }})} />
              </div>
            </div>
          </div>
        );
      case 8:
        return (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg border-b pb-2 mb-4">Cognitive</h3>
            <div className="space-y-2">
              <Label>Cognitive Concerns</Label>
              <Select 
                value={data.cognitive.cognitiveConcerns} 
                onValueChange={(val: any) => setData({...data, cognitive: {...data.cognitive, cognitiveConcerns: val}})}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="moderate">Moderate</SelectItem>
                  <SelectItem value="severe">Severe</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto w-full p-4 space-y-6">
      <Card className="border-primary/20 bg-card/50 backdrop-blur-sm shadow-2xl">
        <CardHeader className="text-center pb-2">
          <div className="flex justify-between items-center mb-4">
            <Button variant="ghost" size="sm" onClick={handleBack} className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {step === 1 ? 'Back to Menu' : 'Previous Step'}
            </Button>
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
              Step {step} of {totalSteps}
            </div>
          </div>
          <CardTitle className="text-3xl font-extrabold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Psychiatric Triage
          </CardTitle>
          <CardDescription>Clinical Routing decision support</CardDescription>
          
          <div className="w-full bg-muted h-1.5 rounded-full mt-6 overflow-hidden">
            <div 
              className="bg-primary h-full transition-all duration-500 ease-in-out" 
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {renderStep()}
          
          <div className="flex justify-end mt-8">
            <Button onClick={handleNext} size="lg" className="px-8 shadow-lg shadow-primary/20">
              {step === totalSteps ? 'Calculate Triage' : 'Next Step'}
              {step !== totalSteps && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <div className="text-center">
        <p className="text-[10px] text-muted-foreground italic">
          Disclaimer: This is a clinical decision support tool for clinicians. It does not replace professional judgment.
        </p>
      </div>
    </div>
  );
};
