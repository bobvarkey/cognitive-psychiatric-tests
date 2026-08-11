import { useState, useMemo, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { DaphneAssessment } from '@/components/DaphneAssessment';
import { HoehnYahrAssessment } from '@/components/HoehnYahrAssessment';
import { EpworthAssessment } from '@/components/EpworthAssessment';
import { StopBangAssessment } from '@/components/StopBangAssessment';
import { AimsAssessment } from '@/components/AimsAssessment';
import { TwstrsAssessment } from '@/components/TwstrsAssessment';
import { MdsUpdrsAssessment } from '@/components/MdsUpdrsAssessment';

import { HareAssessment } from '@/components/HareAssessment';
import { AdhdAssessment } from '@/components/AdhdAssessment';
import { TuliaAssessment } from '@/components/TuliaAssessment';
import { MsiBpdAssessment } from '@/components/MsiBpdAssessment';
import { HamdAssessment } from '@/components/HamdAssessment';
import { HamaAssessment } from '@/components/HamaAssessment';
import { FibromyalgiaAssessment } from '@/components/FibromyalgiaAssessment';
import { DelusionsAssessment } from '@/components/DelusionsAssessment';
import { FabAssessment } from '@/components/FabAssessment';
import { DpdrLanding } from '@/components/DpdrLanding';
import { MiniCogAssessment } from '@/components/MiniCogAssessment';
import { IqcodeAssessment } from '@/components/IqcodeAssessment';
import { Pcl5Assessment } from '@/components/Pcl5Assessment';
import { PssAssessment } from '@/components/PssAssessment';
import { SmartsAssessment } from '@/components/SmartsAssessment';
import { DementiaAssessment } from '@/components/DementiaAssessment';
import { CatatoniaAssessment } from '@/components/CatatoniaAssessment';
import { StressScreeningAssessment } from '@/components/StressScreeningAssessment';
import { FallRiskAssessment } from '@/components/FallRiskAssessment';
import { MiniAceAssessment } from '@/components/MiniAceAssessment';
import { NmsAssessment } from '@/components/NmsAssessment';
import { MmpiAssessment } from '@/components/MmpiAssessment';
import { AdamAssessment } from '@/components/AdamAssessment';
import { HunterAssessment } from '@/components/HunterAssessment';
import { AdverseEffectsAssessment } from '@/components/AdverseEffectsAssessment';
import { CognitiveSyndromesAssessment } from '@/components/CognitiveSyndromesAssessment';
import { CallosalAssessment } from '@/components/CallosalAssessment';
import { MseAssessment } from '@/components/MseAssessment';
import { CcsaAssessment } from '@/components/CcsaAssessment';
import { ConsciousnessAssessment } from '@/components/ConsciousnessAssessment';
import { SubstanceAssessment } from '@/components/SubstanceAssessment';
import { PsychosisScaleAssessment } from '@/components/PsychosisScaleAssessment';
import { BdiAssessment } from '@/components/BdiAssessment';
import { YbocsAssessment } from '@/components/YbocsAssessment';
import { IpdeAssessment } from '@/components/IpdeAssessment';
import { Pid5UnifiedAssessment } from '@/components/Pid5UnifiedAssessment';
import { CageAssessment } from '@/components/CageAssessment';
import { CowsAssessment } from '@/components/CowsAssessment';
import { SimpsonAngusAssessment } from '@/components/SimpsonAngusAssessment';
import { EprsAssessment } from '@/components/EprsAssessment';
import { PanssAssessment } from '@/components/PanssAssessment';
import { IlaeSeizureClassificationAssessment } from '@/components/IlaeSeizureClassificationAssessment';
import { LaepAssessment } from '@/components/LaepAssessment';
import { EsgsAssessment } from '@/components/EsgsAssessment';
import { CasesToolAssessment } from '@/components/CasesToolAssessment';
import { EngelScaleAssessment } from '@/components/EngelScaleAssessment';
import { FiveTwoOneCriteriaAssessment } from '@/components/FiveTwoOneCriteriaAssessment';
import { AnagePdAssessment } from '@/components/AnagePdAssessment';
import { DDatsAssessment } from '@/components/DDatsAssessment';
import { StimulusDbsAssessment } from '@/components/StimulusDbsAssessment';
import { Sudep7InventoryAssessment } from '@/components/Sudep7InventoryAssessment';
import { SudepSafetyChecklistAssessment } from '@/components/SudepSafetyChecklistAssessment';
import { IsiAssessment } from '@/components/IsiAssessment';
import { BerlinAssessment } from '@/components/BerlinAssessment';
import { PsqiAssessment } from '@/components/PsqiAssessment';
import { FosqAssessment } from '@/components/FosqAssessment';
import { IrlsAssessment } from '@/components/IrlsAssessment';
import { AsrsAssessment } from '@/components/AsrsAssessment';
import { CataplexyAssessment } from '@/components/CataplexyAssessment';
import { SdqAssessment } from '@/components/SdqAssessment';
import { AuditAssessment } from '@/components/AuditAssessment';
import { AlcoholUnitsCalculator } from '@/components/AlcoholUnitsCalculator';
import { BrainFogAssessment } from '@/components/BrainFogAssessment';
import { LateOnsetPsychosisAssessment } from '@/components/LateOnsetPsychosisAssessment';
import { SmdsSfAssessment } from '@/components/SmdsSfAssessment';
import { AntipsychoticMetabolicAssessment } from '@/components/AntipsychoticMetabolicAssessment';
import { SsriAdverseEventsAssessment } from '@/components/SsriAdverseEventsAssessment';
import { OpdPsychEvalAssessment } from '@/components/OpdPsychEvalAssessment';
import { PSYCHOSIS_SCALES } from '@/data/psychosisScales';
import { ADHD_SCREENERS } from '@/data/adhdScreenerScales';
import { ASSESSMENT_REFERENCES } from '@/data/assessmentReferences';
import { AdhdScreenerLanding } from '@/components/AdhdScreenerLanding';
import { cognitiveSyndromes, frontalLobeTests } from '@/data/cognitiveSyndromesData';
import {
  Brain, Home, AlertTriangle, Focus, Hand, Heart, Frown, Eye, Zap,
  Shield, Gauge, Activity, Stethoscope, Pause, Scale, Footprints, ClipboardCheck,
  ThermometerSun, ClipboardList, Search, X, BookOpen, ArrowRight, FlaskConical, Pill,
  Sparkles, MessageCircle, Lightbulb, Ear, HelpCircle, TrendingUp, CheckCircle,
  Cloud,
} from 'lucide-react';
import { MiniAppSearch, GlossaryDialog } from './ThemeExtras';
import { OfflineFallback } from './OfflineFallback';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { usePatientInfo } from '@/contexts/PatientInfoContext';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { PaywallModal } from './PaywallModal';
import { AdBanner } from './AdBanner';
import { SuggestionsView } from './SuggestionsView';
import { LanguageToggle } from './LanguageToggle';
import { MainSidebar, type Section } from './MainSidebar';
import { MobileBottomNav } from './MobileBottomNav';
import { CategoryChips } from './CategoryChips';
import { ResultsView } from './ResultsView';
import { SettingsView } from './SettingsView';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import cognitoHero from '@/assets/cognito-hero.png';
// Images removed as they are unused and causing build errors

export type AssessmentKey =
  | 'daphne' | 'minicog' | 'hare' | 'adhd' | 'tulia' | 'msibpd'
  | 'hamd' | 'hama' | 'delusions' | 'fab' | 'dpdr' | 'pcl5' | 'pss'
  | 'dementia' | 'catatonia' | 'stressScreening' | 'fallRisk' | 'miniace'
  | 'nms' | 'mmpi' | 'adam' | 'hunter' | 'smarts' | 'adverseEffects' | 'cognitiveSyndromes' | 'callosal' | 'mse' | 'moca' | 'consciousness' | 'substance' | 'iqcode'
  | 'bprs' | 'sapsSans' | 'crdpss' | 'sops' | 'psyrats' | 'vagus'
  | 'asrs6' | 'asrs18' | 'vanderbilt' | 'adhdScreener'
  | 'bdi' | 'ybocs' | 'ipde' | 'cage' | 'cows' | 'simpsonAngus' | 'eprs' | 'panss'
  | 'mds-updrs' | 'hoehn-yahr' | 'aims' | 'twstrs' | 'epworth' | 'stop-bang'
  | 'ilae-seizure-classification' | 'laep' | 'esgs' | 'cases' | 'engel'
  | 'five-two-one' | 'anage-pd' | 'd-dats' | 'stimulus-dbs'
  | 'sudep-7' | 'sudep-safety'
  | 'isi' | 'berlin' | 'psqi' | 'fosq' | 'irls' | 'asrs-sleep' | 'cataplexy' | 'sdq'
  | 'audit' | 'fibromyalgia' | 'alcohol-units' | 'brain-fog' | 'smds-sf' | 'antipsychotic-metabolic' | 'ssri-adverse' | 'opd-psych-eval' | 'late-onset-psychosis' | 'pid5-unified';

// Pro-only assessments (not available in Lite tier) - 40 Pro, 25 Lite
const PRO_ONLY_ASSESSMENTS: AssessmentKey[] = [
  'miniace', 'mse', 'adhd', 'daphne', 'fab', 'tulia', 'cognitiveSyndromes',
  'callosal', 'hare', 'dpdr', 'hamd', 'hama', 'mmpi', 'bprs', 'crdpss', 'dementia',
  'catatonia', 'hunter', 'consciousness', 'mds-updrs', 'eprs', 'aims',
  'asrs6', 'asrs18', 'vanderbilt', 'adhdScreener', 'substance', 'sops',
  'psyrats', 'vagus', 'sapsSans', 'panss', 'ipde', 'ybocs', 'moca',
  'twstrs', 'epworth', 'ilae-seizure-classification', 'engel', 'sudep-7'
];

type Category = 'all' | 'cognitive' | 'mood' | 'personality' | 'adverse' | 'movement' | 'epilepsy' | 'substance' | 'sleep' | 'psychosis' | 'fibromyalgia' | 'brainfog';

interface AssessmentInfo {
  key: AssessmentKey;
  name: string;
  subtitle: string;
  icon: React.ElementType;
  gradient: string;
  category: Category[];
  description: string;
}

const assessments: AssessmentInfo[] = [
  { key: 'opd-psych-eval', name: 'OPD Psych Evaluation', subtitle: 'Pediatric / SLD Workup', icon: ClipboardList, gradient: 'from-emerald-500 to-teal-600', category: ['cognitive'], description: 'Brief OPD psychological evaluation performa — identification, presenting complaints, clinical observation, prenatal/perinatal/postnatal history, developmental milestones, family history, psychological test results (MISIC, BKT, VSMS, ISAA, NIMHANS SLD, IQ), reading/writing/calculation skills and diagnosis with exportable report.' },
  { key: 'daphne', name: 'DAPHNE', subtitle: 'bvFTD Assessment', icon: Brain, gradient: 'from-purple-500 to-pink-600', category: ['cognitive'], description: 'DAPHNE — Behavioural variant Frontotemporal Dementia screening across disinhibition, apathy, perseveration, hyperorality, neglect and loss of empathy.' },

  { key: 'minicog', name: 'Mini-Cog™', subtitle: 'Brief Screening', icon: Brain, gradient: 'from-blue-500 to-cyan-600', category: ['cognitive'], description: 'Mini-Cog — 3-item recall plus clock-drawing; rapid bedside dementia screen (~3 min).' },
  { key: 'iqcode', name: 'Short IQCODE', subtitle: 'Informant — Cognitive Decline', icon: ClipboardCheck, gradient: 'from-blue-600 to-indigo-700', category: ['cognitive'], description: 'Short IQCODE (Jorm) — 16-item informant questionnaire comparing the person now vs. ~10 years ago across memory, learning, and everyday function. Cutoff ≥3.31 suggests cognitive decline.' },
  { key: 'miniace', name: 'Mini-ACE', subtitle: "Addenbrooke's", icon: ClipboardCheck, gradient: 'from-emerald-500 to-green-600', category: ['cognitive'], description: "Mini-ACE — Mini Addenbrooke's Cognitive Examination; brief multidomain cognitive screen (attention, memory, fluency, visuospatial)." },
  { key: 'fab', name: 'FAB', subtitle: 'Frontal Battery', icon: Zap, gradient: 'from-amber-500 to-yellow-600', category: ['cognitive'], description: 'FAB — Frontal Assessment Battery; 6 subtests for executive/frontal lobe dysfunction.' },
  { key: 'cognitiveSyndromes', name: 'Cog Syndromes', subtitle: 'Frontal & Neuro', icon: BookOpen, gradient: 'from-sky-500 to-indigo-600', category: ['cognitive'], description: 'Reference library of 30+ neuropsychiatric syndromes and 11 frontal-lobe bedside tests.' },
  { key: 'mse', name: 'MSE', subtitle: 'Mental Status Exam', icon: ClipboardList, gradient: 'from-slate-500 to-zinc-600', category: ['cognitive'], description: 'Comprehensive Mental Status Examination — consciousness, orientation, attention, memory, language, frontal-lobe, parietal, occipital and temporal-lobe bedside testing.' },
  { key: 'moca', name: 'CCSA', subtitle: 'Comprehensive Cognitive Screening', icon: BookOpen, gradient: 'from-fuchsia-500 to-purple-600', category: ['cognitive'], description: 'CCSA — original 30-point multidomain cognitive screen (orientation, memory, attention, executive, language, visuospatial, recall). Prototype tool; not clinically validated.' },
  { key: 'callosal', name: 'CDS', subtitle: 'Callosal Disconnection', icon: Brain, gradient: 'from-indigo-500 to-purple-600', category: ['cognitive'], description: 'CDS — Callosal Disconnection Syndrome ("split-brain") bedside tests: left-hand tactile anomia, agraphia, apraxia, alien-hand sign and left-visual-field anomia.' },
  { key: 'tulia', name: 'TULIA', subtitle: 'Apraxia Screen', icon: Hand, gradient: 'from-teal-500 to-cyan-600', category: ['cognitive'], description: 'TULIA — Test of Upper Limb Apraxia; 48-item gesture battery covering meaningless, intransitive and transitive movements.' },
  { key: 'hamd', name: 'HAM-D', subtitle: 'Depression Scale', icon: Frown, gradient: 'from-blue-500 to-indigo-600', category: ['mood'], description: 'HAM-D — Hamilton Depression Rating Scale; clinician-rated severity of depressive symptoms.' },
  { key: 'hama', name: 'HAM-A', subtitle: 'Anxiety Scale', icon: Activity, gradient: 'from-amber-500 to-orange-600', category: ['mood'], description: 'HAM-A — Hamilton Anxiety Rating Scale; 14-item clinician-rated severity of anxiety (psychic and somatic).' },
  { key: 'pss', name: 'PSS-10', subtitle: 'Perceived Stress', icon: Gauge, gradient: 'from-emerald-500 to-teal-600', category: ['mood'], description: 'PSS-10 — Perceived Stress Scale; 10 items measuring how unpredictable and overloaded life feels.' },
  { key: 'pcl5', name: 'PC-PTSD-5', subtitle: 'PTSD Screen', icon: Shield, gradient: 'from-red-500 to-rose-600', category: ['mood'], description: 'PC-PTSD-5 — Primary Care PTSD Screen for DSM-5; 5-item trauma screen.' },
  { key: 'dpdr', name: 'DPDR Scales', subtitle: 'DPDR · CDS · DES-II · DSS', icon: Eye, gradient: 'from-cyan-500 to-blue-600', category: ['mood'], description: 'Depersonalisation, derealisation and dissociation scales: brief DPDR screen, Cambridge Depersonalisation Scale (CDS-29), Dissociative Experiences Scale (DES-II), and Dissociative Symptoms Scale (DSS, past-week brief). Choose by clinical question.' },
  { key: 'stressScreening', name: 'Stress vs Disorder', subtitle: 'Differentiation', icon: Scale, gradient: 'from-violet-500 to-purple-600', category: ['mood'], description: 'Differentiates normal stress reaction from an emerging stress-related disorder.' },
  { key: 'adam', name: 'ADAM', subtitle: 'Apathy-Depression', icon: ClipboardList, gradient: 'from-teal-500 to-blue-600', category: ['mood'], description: 'ADAM — Androgen Deficiency in Aging Males / apathy-depression-anhedonia screener (10 items).' },
  { key: 'hare', name: 'Hare PCL-R', subtitle: 'Psychopathy', icon: AlertTriangle, gradient: 'from-orange-500 to-red-600', category: ['personality'], description: 'Hare PCL-R — Psychopathy Checklist–Revised; 20-item interpersonal/affective and antisocial trait rating.' },
  { key: 'adhdScreener', name: 'ADHD Screener', subtitle: 'Age-aware: ASRS / Vanderbilt', icon: Focus, gradient: 'from-blue-600 to-indigo-600', category: ['cognitive'], description: 'Pick patient age range (child / adolescent / adult) and route to the appropriate ADHD screener (Vanderbilt or ASRS-v1.1) with adjusted interpretation and a SOAP-style clinician report.' },
  { key: 'adhd', name: 'ADHD DSM-5-TR', subtitle: 'Diagnostic Criteria', icon: Focus, gradient: 'from-indigo-500 to-blue-600', category: ['cognitive'], description: 'DSM-5-TR ADHD diagnostic criteria checklist (inattention + hyperactivity-impulsivity, criteria B–E).' },
  { key: 'asrs6', name: 'ASRS-v1.1 (6)', subtitle: 'Adult ADHD Screener', icon: Focus, gradient: 'from-blue-500 to-indigo-600', category: ['cognitive'], description: 'WHO/Harvard 6-item adult ADHD screener (Part A). Validated cutoff: ≥4 shaded responses = positive screen.' },
  { key: 'asrs18', name: 'ASRS-v1.1 (18)', subtitle: 'Full Symptom Checklist', icon: ClipboardList, gradient: 'from-indigo-500 to-purple-600', category: ['cognitive'], description: 'Full 18-item ASRS — 9 inattention + 9 hyperactivity-impulsivity items, mapped to DSM-5-TR symptom domains.' },
  { key: 'vanderbilt', name: 'Vanderbilt', subtitle: 'Parent (child 6–12)', icon: ClipboardCheck, gradient: 'from-cyan-500 to-blue-600', category: ['cognitive'], description: 'NICHQ Vanderbilt parent rating scale: inattention, hyperactivity, ODD/conduct, anxiety/depression, performance.' },
  { key: 'msibpd', name: 'MSI-BPD', subtitle: 'BPD Screening', icon: Heart, gradient: 'from-rose-500 to-pink-600', category: ['personality'], description: 'MSI-BPD — McLean Screening Instrument for Borderline Personality Disorder; 10 yes/no items.' },
  { key: 'mmpi', name: 'MMPI', subtitle: 'OPD Screener', icon: ClipboardList, gradient: 'from-violet-600 to-indigo-600', category: ['personality'], description: 'MMPI — Minnesota Multiphasic Personality Inventory; ultra-short OPD somatization screener.' },
  { key: 'delusions', name: 'Delusions', subtitle: 'Hallucinations', icon: Eye, gradient: 'from-violet-500 to-purple-700', category: ['personality'], description: 'Structured checklist for delusion themes and hallucination modalities with clinical context.' },
  { key: 'dementia', name: 'Dementia', subtitle: 'BEHAV5+ & Signs', icon: Stethoscope, gradient: 'from-violet-600 to-purple-600', category: ['cognitive'], description: 'BEHAV5+ behavioural screen plus localising neurological signs in dementia.' },
  { key: 'catatonia', name: 'Catatonia', subtitle: 'BFCRS + DSM-5', icon: Pause, gradient: 'from-cyan-500 to-teal-600', category: ['movement'], description: 'BFCRS — Bush-Francis Catatonia Rating Scale plus DSM-5 catatonia criteria.' },
  { key: 'nms', name: 'NMS', subtitle: 'Malignant Syndrome', icon: ThermometerSun, gradient: 'from-red-600 to-rose-700', category: ['adverse'], description: 'NMS — Neuroleptic Malignant Syndrome assessment (rigidity, hyperthermia, autonomic instability, altered mental state).' },
  { key: 'hunter', name: 'Hunter Criteria', subtitle: 'Serotonin Syndrome', icon: FlaskConical, gradient: 'from-rose-500 to-pink-600', category: ['adverse'], description: 'Hunter Serotonin Toxicity Criteria — diagnostic decision rule for serotonin syndrome.' },
  { key: 'smarts', name: 'SMARTS', subtitle: 'Treatment Side Effects', icon: ClipboardList, gradient: 'from-orange-500 to-amber-500', category: ['adverse'], description: 'SMARTS — Systematic Monitoring of Adverse events Related to TreatmentS; patient-reported side-effect checklist.' },
  { key: 'adverseEffects', name: 'Adverse Effects', subtitle: 'Drug-Class Checklist', icon: Pill, gradient: 'from-fuchsia-500 to-purple-600', category: ['adverse'], description: 'Drug-class adverse-effect checklist for psychotropic medications.' },
  { key: 'antipsychotic-metabolic', name: 'Antipsychotic Metabolic', subtitle: 'BMI · WHtR · Risk Triage', icon: Pill, gradient: 'from-blue-500 to-indigo-600', category: ['adverse'], description: 'Antipsychotic metabolic syndrome tracker — BMI, waist-to-height ratio, drug-specific metabolic/cardiac/QTc risk, monitoring schedule, and adverse-event flags.' },
  { key: 'ssri-adverse', name: 'SSRI Adverse Events', subtitle: 'Metabolic · Sexual · Bleeding', icon: Pill, gradient: 'from-cyan-500 to-blue-600', category: ['adverse'], description: 'SSRI adverse events tracker — screen metabolic, sexual, bleeding, sleep, and discontinuation effects for common SSRIs with monitoring schedule and suggested actions.' },
  { key: 'fallRisk', name: 'Fall Risk', subtitle: 'STEADI, Morse & FRAT', icon: Footprints, gradient: 'from-orange-500 to-red-600', category: ['adverse'], description: 'Fall risk assessment combining CDC STEADI, Morse Fall Scale and FRAT (Falls Risk Assessment Tool).' },
  { key: 'consciousness', name: 'Coma & Consciousness', subtitle: 'GCS · FOUR · RASS · ABS', icon: Activity, gradient: 'from-slate-600 to-zinc-700', category: ['cognitive'], description: 'Bedside scales of consciousness, sedation and agitation: Glasgow Coma Scale (GCS), FOUR Score for intubated patients, Richmond Agitation–Sedation Scale (RASS), and Agitated Behavior Scale (ABS) for traumatic brain injury.' },
  { key: 'substance', name: 'Withdrawal & Dependence', subtitle: 'CIWA-Ar · SDS', icon: FlaskConical, gradient: 'from-amber-500 to-orange-600', category: ['substance'], description: 'Substance-specific scales: CIWA-Ar quantifies severity of alcohol withdrawal (10 items, 0–67); SDS — Severity of Dependence Scale, 5 items measuring psychological dependence and compulsive use.' },

  // ─── Psychosis scales ───
  { key: 'late-onset-psychosis', name: 'Late-Onset Psychosis', subtitle: 'Classification & Workup', icon: Brain, gradient: 'from-indigo-500 to-purple-600', category: ['psychosis'], description: 'Decision-support tool for new-onset psychosis in later life — classifies delirium, dementia-related, secondary/organic, substance-induced, mood-related and late-onset schizophrenia spectrum presentations, with a full history, laboratory, targeted, neuroimaging and risk-management workup checklist.' },
  { key: 'bprs', name: 'BPRS', subtitle: 'Brief Psychiatric', icon: ClipboardList, gradient: 'from-indigo-500 to-violet-600', category: ['psychosis'], description: 'BPRS — 18-item Brief Psychiatric Rating Scale (1–7); tracks acute psychiatric symptom severity and treatment response.' },
  { key: 'sapsSans', name: 'SAPS / SANS', subtitle: 'Pos & Neg Symptoms', icon: Sparkles, gradient: 'from-purple-500 to-fuchsia-600', category: ['psychosis'], description: 'SAPS / SANS — Andreasen global ratings (0–5) of positive and negative schizophrenia symptoms; public-domain alternative to PANSS.' },
  { key: 'crdpss', name: 'CRDPSS', subtitle: 'DSM-5 Dimensions', icon: Gauge, gradient: 'from-sky-500 to-indigo-600', category: ['psychosis'], description: 'CRDPSS — DSM-5 Clinician-Rated Dimensions of Psychosis Symptom Severity; 8 items, past 7 days.' },
  { key: 'sops', name: 'SOPS', subtitle: 'Prodromal (SIPS)', icon: Lightbulb, gradient: 'from-amber-500 to-orange-600', category: ['psychosis'], description: 'SOPS — Scale of Prodromal Symptoms within SIPS; identifies attenuated / clinical-high-risk states for psychosis.' },
  { key: 'psyrats', name: 'PSYRATS', subtitle: 'AH & Delusions', icon: Ear, gradient: 'from-rose-500 to-red-600', category: ['psychosis'], description: 'PSYRATS — Psychotic Symptom Rating Scales for auditory hallucinations (11 items) and delusions (6 items), 0–4 each.' },
  { key: 'vagus', name: 'VAGUS-SR', subtitle: 'Insight Self-Report', icon: HelpCircle, gradient: 'from-teal-500 to-emerald-600', category: ['psychosis'], description: 'VAGUS-SR — 10-item self-report measure of insight into psychotic illness; higher = better insight.' },
  { key: 'panss', name: 'PANSS', subtitle: 'Pos & Neg Syndrome', icon: Sparkles, gradient: 'from-purple-500 to-fuchsia-600', category: ['psychosis'], description: 'PANSS — 30-item Positive and Negative Syndrome Scale (1–7); subscales for positive, negative and general psychopathology with composite (P−N) score.' },

  // ─── New scales ───
  { key: 'bdi', name: 'BDI-II', subtitle: 'Depression', icon: Frown, gradient: 'from-blue-600 to-indigo-700', category: ['mood'], description: 'BDI-II — Beck Depression Inventory–II; 21-item self-report rating depressive symptoms over the past two weeks. Score 0–63 with severity bands.' },
  { key: 'ybocs', name: 'Y-BOCS', subtitle: 'OCD Severity', icon: Activity, gradient: 'from-violet-500 to-purple-600', category: ['mood'], description: 'Y-BOCS — Yale-Brown Obsessive Compulsive Scale; 10 clinician-rated items (5 obsessions + 5 compulsions, 0–4 each). Total 0–40 with severity bands.' },
  { key: 'pid5-unified', name: 'Unified PID-5 Screener', subtitle: 'Traits, patterns & clusters', icon: Heart, gradient: 'from-indigo-500 to-purple-600', category: ['personality'], description: 'Unified PID-5 Trait and Personality Pattern Screener — original 30-item, non-diagnostic tool covering five broad trait domains, the ten traditional personality patterns, and Clusters A/B/C. Not the official PID-5-BF.' },
  { key: 'ipde', name: 'IPDE-SQ', subtitle: 'Personality Disorders', icon: Heart, gradient: 'from-rose-500 to-pink-600', category: ['personality'], description: 'IPDE Screening Questionnaire — DSM-IV self-report grouped by candidate PD across all 10 personality disorders; flags dimensions for structured interview.' },
  { key: 'cage', name: 'CAGE', subtitle: 'Alcohol Screen', icon: FlaskConical, gradient: 'from-amber-500 to-orange-600', category: ['substance'], description: 'CAGE — 4-item alcohol use screen (Cut-down, Annoyed, Guilty, Eye-opener). Score ≥ 2 = clinically significant.' },
  { key: 'cows', name: 'COWS', subtitle: 'Opiate Withdrawal', icon: Pill, gradient: 'from-orange-500 to-amber-600', category: ['substance'], description: 'COWS — Clinical Opiate Withdrawal Scale; 11-item clinician rating (0–48). Used to grade withdrawal severity and time buprenorphine induction.' },
  { key: 'audit', name: 'AUDIT', subtitle: 'Alcohol Use Disorders', icon: FlaskConical, gradient: 'from-amber-600 to-red-600', category: ['substance'], description: 'AUDIT — Alcohol Use Disorders Identification Test (WHO); 10-item screen for hazardous drinking, harmful use, and alcohol dependence. Score 0-40 with zone-based intervention guidance.' },
  { key: 'alcohol-units', name: 'Alcohol Units Calculator', subtitle: 'UK Units & Weekly Risk', icon: FlaskConical, gradient: 'from-amber-500 to-orange-600', category: ['substance'], description: 'Calculate UK alcohol units from drink volume and ABV. Estimates weekly intake against the 14-unit low-risk guideline with quick presets for common drinks.' },
  { key: 'smds-sf', name: 'SMDS-SF', subtitle: 'Social Media Disorder — PUI', icon: MessageCircle, gradient: 'from-fuchsia-500 to-pink-600', category: ['substance'], description: 'Social Media Disorder Scale — Short Form (van den Eijnden 2016). Nine yes/no items across DSM-5 IGD-analogous domains (preoccupation, tolerance, withdrawal, persistence, displacement, escape, problems, deception, conflict). ≥5 "yes" flags probable disordered social media use.' },
  { key: 'brain-fog', name: 'Brain Fog', subtitle: 'Clinical Algorithm', icon: Brain, gradient: 'from-slate-500 to-indigo-600', category: ['brainfog'], description: 'Structured 8-step diagnostic algorithm for brain fog — confirm symptom, screen red flags, characterize history, categorize cause, order investigations, and generate an exportable clinical note.' },
  { key: 'simpsonAngus', name: 'Simpson-Angus', subtitle: 'EPS — Parkinsonism', icon: Activity, gradient: 'from-cyan-500 to-blue-600', category: ['movement'], description: 'Simpson-Angus Scale (SAS) — 10-item clinician rating of antipsychotic-induced parkinsonism. Mean ≥ 0.3 = clinically significant.' },
  { key: 'eprs', name: 'EPRS', subtitle: 'Extrapyramidal Symptoms', icon: Zap, gradient: 'from-yellow-500 to-amber-600', category: ['movement'], description: 'EPRS — Extrapyramidal Symptom Rating Scale (Chouinard); brief CGI form across the four EPS dimensions: parkinsonism, akathisia, dystonia, dyskinesia.' },
  { key: 'fibromyalgia', name: 'Fibromyalgia', subtitle: 'ACR 2010 (WPI + SSS)', icon: Activity, gradient: 'from-rose-500 to-pink-600', category: ['fibromyalgia'], description: 'ACR 2010 preliminary diagnostic criteria for fibromyalgia. Widespread Pain Index (WPI, 0–19) plus Symptom Severity Scale (SSS, 0–12) covering fatigue, waking unrefreshed, cognitive symptoms, and somatic symptom burden.' },



  // ─── Movement Disorders ───
  { key: 'mds-updrs', name: 'MDS-UPDRS', subtitle: 'Parkinson\'s Assessment', icon: Activity, gradient: 'from-blue-500 to-cyan-600', category: ['movement'], description: 'MDS-UPDRS — Gold-standard comprehensive assessment for motor and non-motor symptoms in Parkinson\'s disease. 27 items across three parts.' },
  { key: 'hoehn-yahr', name: 'Hoehn & Yahr', subtitle: 'Parkinson\'s Staging', icon: Gauge, gradient: 'from-indigo-500 to-purple-600', category: ['movement'], description: 'Hoehn and Yahr Scale — Stages Parkinson\'s disease severity from 0 (no signs) to 5 (confined to bed/wheelchair).' },
  { key: 'aims', name: 'AIMS', subtitle: 'Dyskinesia Assessment', icon: Activity, gradient: 'from-orange-500 to-red-600', category: ['movement'], description: 'AIMS — Abnormal Involuntary Movement Scale; evaluates dyskinesia severity and involuntary movements across body regions.' },
  { key: 'twstrs', name: 'TWSTRS', subtitle: 'Cervical Dystonia', icon: Activity, gradient: 'from-rose-500 to-pink-600', category: ['movement'], description: 'TWSTRS — Toronto Western Spasmodic Torticollis Rating Scale; assesses cervical dystonia severity and disability.' },

  // ─── Sleep Disorders ───
  { key: 'epworth', name: 'Epworth Scale', subtitle: 'Daytime Sleepiness', icon: Pause, gradient: 'from-indigo-500 to-blue-600', category: ['sleep'], description: 'ESS — Epworth Sleepiness Scale; 8-item self-report of daytime sleepiness likelihood in various situations.' },
  { key: 'stop-bang', name: 'STOP-BANG', subtitle: 'Sleep Apnea Screening', icon: AlertTriangle, gradient: 'from-amber-500 to-orange-600', category: ['sleep'], description: 'STOP-BANG — Obstructive sleep apnea risk screening tool; 8 yes/no questions for rapid OSA risk assessment.' },
  { key: 'isi', name: 'ISI', subtitle: 'Insomnia Severity Index', icon: Pause, gradient: 'from-violet-500 to-purple-600', category: ['sleep'], description: 'ISI — Insomnia Severity Index; 7-item self-report measuring severity of insomnia symptoms, sleep dissatisfaction, and daytime interference.' },
  { key: 'berlin', name: 'Berlin', subtitle: 'Sleep Apnea Questionnaire', icon: AlertTriangle, gradient: 'from-rose-500 to-red-600', category: ['sleep'], description: 'Berlin Questionnaire — 11-item OSA screening across snoring, daytime sleepiness, and hypertension/BMI categories. High/low risk stratification.' },
  { key: 'psqi', name: 'PSQI', subtitle: 'Pittsburgh Sleep Quality Index', icon: Pause, gradient: 'from-sky-500 to-indigo-600', category: ['sleep'], description: 'PSQI — Pittsburgh Sleep Quality Index; 19-item self-report across 7 components assessing sleep quality over the past month. PSQI > 5 = poor sleep quality.' },
  { key: 'fosq', name: 'FOSQ', subtitle: 'Functional Outcomes of Sleep', icon: Activity, gradient: 'from-emerald-500 to-teal-600', category: ['sleep'], description: 'FOSQ — Functional Outcomes of Sleep Questionnaire; 30 items across 5 subscales measuring the impact of sleepiness on daily functioning.' },
  { key: 'irls', name: 'IRLS', subtitle: 'Restless Legs Scale', icon: Footprints, gradient: 'from-purple-500 to-violet-600', category: ['sleep'], description: 'IRLS — International Restless Legs Scale; 10-item clinician-rated scale assessing RLS symptom severity, frequency, and impact on sleep and mood.' },
  { key: 'asrs-sleep', name: 'ASRS', subtitle: 'Augmentation Severity', icon: TrendingUp, gradient: 'from-red-500 to-rose-600', category: ['sleep'], description: 'ASRS — Augmentation Severity Rating Scale for RLS patients on dopaminergic therapy. Assesses earlier onset, intensity increase, and symptom spread.' },
  { key: 'cataplexy', name: 'Cataplexy', subtitle: 'Narcolepsy Screening', icon: Zap, gradient: 'from-indigo-500 to-purple-600', category: ['sleep'], description: 'Cataplexy Questionnaire — 12-item screening for cataplexy in narcolepsy evaluation: emotional triggers, episode characteristics, and associated features.' },
  { key: 'sdq', name: 'SDQ', subtitle: 'Sleep Disorders Questionnaire', icon: ClipboardList, gradient: 'from-teal-500 to-cyan-600', category: ['sleep'], description: 'SDQ — Sleep Disorders Questionnaire; 30-item comprehensive screen across 5 domains: sleep apnea, insomnia, narcolepsy, parasomnias, and RLS/PLMD.' },

  // ─── Epilepsy & Seizures ───
  { key: 'ilae-seizure-classification', name: 'ILAE Seizure Classification', subtitle: '2025 Updated Guidelines', icon: Zap, gradient: 'from-fuchsia-500 to-cyan-500', category: ['epilepsy'], description: 'ILAE 2025 — Interactive guide to the updated classification of epileptic seizures with full taxonomic hierarchy, clinical descriptors, and diagnostic guidelines.' },
  { key: 'laep', name: 'LAEP', subtitle: 'Medication Side Effects', icon: Pill, gradient: 'from-cyan-500 to-blue-600', category: ['epilepsy'], description: 'LAEP — Likelihood of Adverse Effects Profile; self-report tool measuring side effects of antiseizure medications.' },
  { key: 'esgs', name: 'ESGS', subtitle: 'Surgery Outcome Prediction', icon: TrendingUp, gradient: 'from-emerald-500 to-teal-600', category: ['epilepsy'], description: 'ESGS — Epilepsy Surgery Grading Scale; predicts likelihood of seizure freedom after resective surgery for drug-resistant focal epilepsy.' },
  { key: 'cases', name: 'CASES Tool', subtitle: 'Surgery Appropriateness', icon: Search, gradient: 'from-purple-500 to-pink-600', category: ['epilepsy'], description: 'CASES — Clinical Appropriateness Scores; screening instrument to identify patients for specialized epilepsy surgery evaluation.' },
  { key: 'engel', name: 'Engel Scale', subtitle: 'Post-Surgical Outcome', icon: Activity, gradient: 'from-amber-500 to-orange-600', category: ['epilepsy'], description: 'Engel Scale — Standard classification for assessing seizure outcomes after epilepsy surgery.' },
  { key: 'sudep-7', name: 'SUDEP-7 Inventory', subtitle: 'SUDEP Risk Assessment', icon: AlertTriangle, gradient: 'from-red-500 to-orange-600', category: ['epilepsy'], description: 'SUDEP-7 Inventory — Risk stratification tool for Sudden Unexpected Death in Epilepsy based on 7 evidence-based factors.' },
  { key: 'sudep-safety', name: 'SUDEP Safety Checklist', subtitle: 'Risk Reduction Measures', icon: CheckCircle, gradient: 'from-orange-500 to-amber-600', category: ['epilepsy'], description: 'SUDEP Safety Checklist — Comprehensive implementation guide for evidence-based SUDEP risk reduction across 6 clinical domains.' },

  // ─── Parkinson's Disease - Advanced ───
  { key: 'five-two-one', name: '5-2-1 Criteria', subtitle: 'Advanced PD Identification', icon: AlertTriangle, gradient: 'from-purple-500 to-pink-500', category: ['movement'], description: '5-2-1 Criteria — Rule of thumb for identifying advanced PD: ≥5 levodopa doses, ≥2h off-time, or ≥1h dyskinesia daily.' },
  { key: 'anage-pd', name: 'ANAGE-PD', subtitle: 'Advanced PD Management', icon: Stethoscope, gradient: 'from-cyan-500 to-blue-600', category: ['movement'], description: 'ANAGE-PD — Clinician-based tool for timely identification and treatment of advanced PD with suboptimal symptom control.' },
  { key: 'd-dats', name: 'D-DATS', subtitle: 'DAT Eligibility Screening', icon: Gauge, gradient: 'from-emerald-500 to-green-600', category: ['movement'], description: 'D-DATS — Dutch DAT Screening Tool; identifies PD patients eligible for Device-Aided Therapy (DBS, LCIG, CSAI, LECIG).' },
  { key: 'stimulus-dbs', name: 'Stimulus DBS', subtitle: 'DBS Appropriateness', icon: Brain, gradient: 'from-amber-500 to-orange-600', category: ['movement'], description: 'Stimulus 2 — Evidence-based decision support for assessing appropriateness of Deep Brain Stimulation referral in PD.' },
];

const referenceKeyByAssessment: Partial<Record<AssessmentKey, string>> = {
  'mds-updrs': 'mdsUpdrs',
  'hoehn-yahr': 'hoehnYahr',
  'stop-bang': 'stopBang',
  'ilae-seizure-classification': 'ilaeSeizureClassification',
  'sudep-7': 'sudep7',
  'sudep-safety': 'sudepSafety',
  'five-two-one': 'fiveTwoOne',
  'anage-pd': 'anagePd',
  'd-dats': 'dDats',
  'stimulus-dbs': 'stimulusDbs',
  isi: 'isi',
  berlin: 'berlin',
  psqi: 'psqi',
  fosq: 'fosq',
  irls: 'irls',
  'asrs-sleep': 'asrsSleep',
  cataplexy: 'cataplexy',
  sdq: 'sdq',
  audit: 'audit',
};

const getAssessmentReference = (key: AssessmentKey) =>
  ASSESSMENT_REFERENCES[referenceKeyByAssessment[key] ?? key];

const categoryLabels: Record<Category, { en: string; ml: string; icon: React.ElementType }> = {
  all: { en: 'All', ml: 'എല്ലാം', icon: ClipboardList },
  cognitive: { en: 'Cognitive', ml: 'കോഗ്നിറ്റീവ്', icon: Brain },
  mood: { en: 'Mood', ml: 'മൂഡ്', icon: Frown },
  personality: { en: 'Personality', ml: 'വ്യക്തിത്വം', icon: Heart },
  psychosis: { en: 'Psychosis', ml: 'സൈക്കോസിസ്', icon: Sparkles },
  adverse: { en: 'Adverse reactions', ml: 'പ്രതികൂല പ്രതികരണങ്ങൾ', icon: Pill },
  movement: { en: 'Movement disorders', ml: 'ചലന വൈകല്യങ്ങൾ', icon: Activity },
  epilepsy: { en: 'Epilepsy', ml: 'എപിലപ്സി', icon: Zap },
  substance: { en: 'Substance abuse & PUI (internet addiction)', ml: 'ലഹരി ഉപയോഗം & ഇന്റർനെറ്റ് ആസക്തി', icon: FlaskConical },
  sleep: { en: 'Sleep', ml: 'ഉറക്കം', icon: Pause },
  fibromyalgia: { en: 'Fibromyalgia', ml: 'ഫൈബ്രോമിയൽജിയ', icon: Heart },
  brainfog: { en: 'Brain Fog', ml: 'ബ്രെയിൻ ഫോഗ്', icon: Cloud },
};

const categoryOrder: Exclude<Category, 'all'>[] = ['cognitive', 'mood', 'personality', 'adverse', 'movement', 'epilepsy', 'substance', 'sleep', 'psychosis', 'fibromyalgia', 'brainfog'];

const categoryAccent: Record<Exclude<Category, 'all'>, string> = {
  cognitive: 'from-sky-400/10 to-indigo-400/5',
  mood: 'from-rose-300/10 to-amber-300/5',
  personality: 'from-pink-300/10 to-violet-300/5',
  adverse: 'from-rose-300/10 to-amber-300/5',
  movement: 'from-cyan-300/10 to-blue-300/5',
  epilepsy: 'from-fuchsia-300/10 to-cyan-300/5',
  substance: 'from-amber-300/10 to-orange-300/5',
  sleep: 'from-indigo-300/10 to-blue-300/5',
  psychosis: 'from-amber-300/10 to-fuchsia-300/5',
  fibromyalgia: 'from-rose-300/10 to-pink-300/5',
  brainfog: 'from-slate-300/10 to-indigo-300/5',
};

export const AssessmentSelector = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, language, setLanguage } = useLanguage();
  const { clearPatientInfo } = usePatientInfo();
  const { showPaywall, setShowPaywall, initiatePurchase, subscription, demoUnlockAll: _demoUnlockAll } = useSubscription();
  const [selectedAssessment, setSelectedAssessment] = useState<AssessmentKey | null>(null);
  const [activeCategory, setActiveCategory] = useState<Category>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [deepLinkQuery, setDeepLinkQuery] = useState('');
  const [section, setSection] = useState<Section>('assessments');

  // Handle routing for deep links
  useEffect(() => {
    const path = location.pathname;
    const parts = path.split('/');
    
    if (path === '/history') setSection('results');
    else if (path === '/settings') setSection('settings');
    else if (path === '/glossary') {
      // Logic for glossary if needed
    }
    else if (path.startsWith('/assessment/')) {
      const id = parts[2] as AssessmentKey;
      if (id && id !== selectedAssessment) {
        setSelectedAssessment(id);
      }
    } else if (path === '/') {
      setSelectedAssessment(null);
      setSection('assessments');
    }
  }, [location.pathname]);

  // Sync section based on current selection for deep linked assessments
  useEffect(() => {
    if (selectedAssessment) {
      setSection('assessments');
    }
  }, [selectedAssessment]);
  const [pulseSections, setPulseSections] = useState<Set<Section>>(new Set());

  const handleToggleSidebar = (open: boolean) => {
    localStorage.setItem('sidebar_expanded', String(open));
  };

  // Pulse a sidebar item briefly when its area is focused / receives input.
  const pulse = (s: Section) => {
    setPulseSections((prev) => {
      if (prev.has(s)) return prev;
      const next = new Set(prev);
      next.add(s);
      return next;
    });
    window.setTimeout(() => {
      setPulseSections((prev) => {
        const next = new Set(prev);
        next.delete(s);
        return next;
      });
    }, 1600);
  };

  // Each questionnaire should default to English; user can toggle per-assessment.
  const openAssessment = (key: AssessmentKey) => {
    setLanguage('en');
    setSelectedAssessment(key);
    navigate(`/assessment/${key}`, { replace: false });
    window.scrollTo(0, 0);
  };

  const handleBackToMenu = () => {
    clearPatientInfo();
    setLanguage('en');
    setSelectedAssessment(null);
    setDeepLinkQuery('');
    navigate('/', { replace: true });
    window.scrollTo(0, 0);
  };

  const filteredAssessments = useMemo(() => {
    let filtered = assessments;


    if (activeCategory !== 'all') {
      filtered = filtered.filter(a => a.category.includes(activeCategory));
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(a =>
        a.name.toLowerCase().includes(q) ||
        a.subtitle.toLowerCase().includes(q)
      );
    }
    return filtered;
  }, [activeCategory, searchQuery, subscription?.priceId]);

  // Search the cognitive syndromes & frontal-lobe-tests reference library
  const syndromeMatches = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    const syn = cognitiveSyndromes
      .filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        (s.etymology?.toLowerCase().includes(q) ?? false) ||
        (s.clinicalNote?.toLowerCase().includes(q) ?? false)
      )
      .slice(0, 8)
      .map(s => ({ kind: 'syndrome' as const, id: s.id, name: s.name, hint: s.category, description: s.description }));
    const tests = frontalLobeTests
      .filter(t =>
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.domain.toLowerCase().includes(q)
      )
      .slice(0, 4)
      .map(t => ({ kind: 'test' as const, id: t.id, name: t.name, hint: t.domain, description: t.description }));
    return [...syn, ...tests];
  }, [searchQuery]);

  const openSyndromeReference = (term: string) => {
    setLanguage('en');
    setDeepLinkQuery(term);
    setSelectedAssessment('cognitiveSyndromes');
  };

  // Render selected assessment
  if (selectedAssessment) {
    const wrapWithBack = (component: React.ReactNode) => (
      <motion.div
        key={selectedAssessment}
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        drag="x"
        dragDirectionLock
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.05}
        onDragEnd={(_, info) => {
          if (info.offset.x > 150 || info.velocity.x > 500) {
            handleBackToMenu();
          }
        }}
        className="fixed inset-0 z-50 bg-background overflow-y-auto"
      >
        <div className="fixed left-3 z-30 print:hidden flex items-center gap-2 top-[max(0.75rem,env(safe-area-inset-top))]">
          <Button
            variant="outline"
            onClick={handleBackToMenu}
            className="flex items-center gap-2 bg-background/80 backdrop-blur-sm shadow-md"
            size="sm"
          >
            <Home className="h-4 w-4" />
            <span className="hidden sm:inline">{t('backToMenu')}</span>
          </Button>
        </div>
        {component}
      </motion.div>
    );

    const psychosisKeys: Record<string, keyof typeof PSYCHOSIS_SCALES> = {
      bprs: 'bprs',
      sapsSans: 'sapsSans',
      crdpss: 'crdpss',
      sops: 'sops',
      psyrats: 'psyrats',
      vagus: 'vagus',
    };
    if (selectedAssessment in psychosisKeys) {
      return wrapWithBack(
        <PsychosisScaleAssessment
          scale={PSYCHOSIS_SCALES[psychosisKeys[selectedAssessment]]}
          onBack={handleBackToMenu}
        />
      );
    }

    if (selectedAssessment === 'adhdScreener') {
      return wrapWithBack(<AdhdScreenerLanding onBack={handleBackToMenu} />);
    }

    if (selectedAssessment === 'dpdr') {
      return wrapWithBack(<DpdrLanding onBack={handleBackToMenu} />);
    }

    if (selectedAssessment === 'asrs6' || selectedAssessment === 'asrs18' || selectedAssessment === 'vanderbilt') {
      return wrapWithBack(
        <PsychosisScaleAssessment
          scale={ADHD_SCREENERS[selectedAssessment]}
          onBack={handleBackToMenu}
        />
      );
    }

    const withOnBack: Record<string, boolean> = {
      adhd: true, msibpd: true, hamd: true, hama: true, pss: true,
      dementia: true, catatonia: true, stressScreening: true,
      fallRisk: true, miniace: true, nms: true, mmpi: true, adam: true,
      hunter: true, smarts: true, adverseEffects: true, cognitiveSyndromes: true,
      callosal: true,
      mse: true,
      moca: true,
      consciousness: true,
      substance: true,
      iqcode: true,
      bdi: true, ybocs: true, ipde: true, cage: true, cows: true,
      simpsonAngus: true, eprs: true, panss: true,
      'mds-updrs': true, 'hoehn-yahr': true, aims: true, twstrs: true,
      epworth: true, 'stop-bang': true,
      'ilae-seizure-classification': true, laep: true, esgs: true, cases: true, engel: true,
      'five-two-one': true, 'anage-pd': true, 'd-dats': true, 'stimulus-dbs': true,
      'sudep-7': true, 'sudep-safety': true,
      isi: true, berlin: true, psqi: true, fosq: true, irls: true, 'asrs-sleep': true, cataplexy: true, sdq: true,
      audit: true,
      'alcohol-units': true,
      'smds-sf': true,
      'antipsychotic-metabolic': true,
      'ssri-adverse': true,
      'brain-fog': true,
      'late-onset-psychosis': true,
      fibromyalgia: true,
      'opd-psych-eval': true,
      'pid5-unified': true,
    };

    if (withOnBack[selectedAssessment]) {
      if (selectedAssessment === 'cognitiveSyndromes') {
        return wrapWithBack(<CognitiveSyndromesAssessment onBack={handleBackToMenu} initialSearchQuery={deepLinkQuery} />);
      }
      const ComponentMap: Record<string, React.ComponentType<any>> = {
        adhd: AdhdAssessment,
        msibpd: MsiBpdAssessment,
        hamd: HamdAssessment,
        hama: HamaAssessment,
        pss: PssAssessment,
        dementia: DementiaAssessment,
        catatonia: CatatoniaAssessment,
        stressScreening: StressScreeningAssessment,
        fallRisk: FallRiskAssessment,
        miniace: MiniAceAssessment,
        nms: NmsAssessment,
        mmpi: MmpiAssessment,
        adam: AdamAssessment,
        hunter: HunterAssessment,
        smarts: SmartsAssessment,
        adverseEffects: AdverseEffectsAssessment,
        callosal: CallosalAssessment,
        mse: MseAssessment,
        moca: CcsaAssessment,
        consciousness: ConsciousnessAssessment,
        substance: SubstanceAssessment,
        iqcode: IqcodeAssessment,
        bdi: BdiAssessment,
        ybocs: YbocsAssessment,
        ipde: IpdeAssessment,
        'pid5-unified': Pid5UnifiedAssessment,
        cage: CageAssessment,
        cows: CowsAssessment,
        simpsonAngus: SimpsonAngusAssessment,
        eprs: EprsAssessment,
        panss: PanssAssessment,
        'mds-updrs': MdsUpdrsAssessment,
        'hoehn-yahr': HoehnYahrAssessment,
        aims: AimsAssessment,
        twstrs: TwstrsAssessment,
        epworth: EpworthAssessment,
        'stop-bang': StopBangAssessment,
        'ilae-seizure-classification': IlaeSeizureClassificationAssessment,
        laep: LaepAssessment,
        esgs: EsgsAssessment,
        cases: CasesToolAssessment,
        engel: EngelScaleAssessment,
        'five-two-one': FiveTwoOneCriteriaAssessment,
        'anage-pd': AnagePdAssessment,
        'd-dats': DDatsAssessment,
        'stimulus-dbs': StimulusDbsAssessment,
        'sudep-7': Sudep7InventoryAssessment,
        'sudep-safety': SudepSafetyChecklistAssessment,
        isi: IsiAssessment,
        berlin: BerlinAssessment,
        psqi: PsqiAssessment,
        fosq: FosqAssessment,
        irls: IrlsAssessment,
        'asrs-sleep': AsrsAssessment,
        cataplexy: CataplexyAssessment,
        sdq: SdqAssessment,
        audit: AuditAssessment,
        'alcohol-units': AlcoholUnitsCalculator,
        'smds-sf': SmdsSfAssessment,
        'antipsychotic-metabolic': AntipsychoticMetabolicAssessment,
        'ssri-adverse': SsriAdverseEventsAssessment,
        'brain-fog': BrainFogAssessment,
        'late-onset-psychosis': LateOnsetPsychosisAssessment,
        fibromyalgia: FibromyalgiaAssessment,
        'opd-psych-eval': OpdPsychEvalAssessment,
      };
      const Comp = ComponentMap[selectedAssessment];
      return wrapWithBack(<Comp onBack={handleBackToMenu} />);
    }

    const wrapMap: Record<string, React.ReactNode> = {
      daphne: <DaphneAssessment />,
      
      minicog: <MiniCogAssessment />,
      hare: <HareAssessment />,
      tulia: <TuliaAssessment onBack={handleBackToMenu} />,
      fab: <FabAssessment />,
      pcl5: <Pcl5Assessment />,
      delusions: <DelusionsAssessment />,
    };

    return wrapWithBack(wrapMap[selectedAssessment]);
  }

  // Build category list with live counts
  const categoryList = (Object.keys(categoryLabels) as Category[]).map((key) => ({
    key,
    label: { en: categoryLabels[key].en, ml: categoryLabels[key].ml },
    icon: categoryLabels[key].icon,
    count: key === 'all'
      ? assessments.length
      : assessments.filter((a) => a.category.includes(key)).length,
  }));

  // Main shell — sticky header + three top-level sections (Assessments / Results / Settings)
  const sectionTitles: Record<Section, { en: string; ml: string }> = {
    assessments: { en: 'Assessments', ml: 'വിലയിരുത്തലുകൾ' },
    results: { en: 'Results', ml: 'ഫലങ്ങൾ' },
    settings: { en: 'Settings', ml: 'ക്രമീകരണങ്ങൾ' },
    suggestions: { en: 'Suggestions', ml: 'നിർദ്ദേശങ്ങൾ' },
  };

  // Read results count for sidebar badge (cheap localStorage read on render)
  let resultsCount = 0;
  try {
    const raw = typeof window !== 'undefined' ? localStorage.getItem('cognito.results.history.v1') : null;
    if (raw) resultsCount = JSON.parse(raw).length ?? 0;
  } catch { /* ignore */ }

  return (
    <SidebarProvider
      defaultOpen={typeof window === 'undefined' ? true : window.innerWidth >= 1024}
      onOpenChange={handleToggleSidebar}
      style={{ ['--sidebar-width' as any]: '17rem' }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key="main-content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="min-h-screen flex w-full bg-gradient-to-br from-background to-secondary dark:from-background dark:to-secondary"
        >
        <LanguageToggle />
        <MainSidebar
          section={section}
          onSectionChange={(s) => { setSection(s); pulse(s); }}
          categories={categoryList}
          activeCategory={activeCategory}
          onCategorySelect={(cat) => { setActiveCategory(cat); setSection('assessments'); pulse('assessments'); }}
          resultsCount={resultsCount}
          pulseSections={pulseSections}
        />

        <div className="flex-1 flex flex-col min-w-0">
          {/* Sticky header */}
          <header className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm border-b border-border px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-3">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center gap-2 mb-3">
                <SidebarTrigger className="shrink-0 hidden md:inline-flex" />
                <Brain className="h-6 w-6 text-primary shrink-0" />
                <h1 className="text-lg sm:text-2xl font-bold text-foreground truncate">
                  {language === 'en' ? sectionTitles[section].en : sectionTitles[section].ml}
                </h1>
                {section === 'assessments' && (
                  <span className="ml-auto text-xs text-muted-foreground hidden lg:inline">
                    {language === 'en' ? categoryLabels[activeCategory].en : categoryLabels[activeCategory].ml}
                  </span>
                )}
              </div>

              {/* Search — only on Assessments */}
              {section === 'assessments' && (
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row gap-3 items-center">
                    <MiniAppSearch onSearch={(q) => { setSearchQuery(q); pulse('assessments'); }} />
                    <div className="flex items-center gap-2 shrink-0">
                      <GlossaryDialog />
                    </div>
                  </div>

                  {/* Scrollable category chips — phones & tablets */}
                  <CategoryChips
                    categories={categoryList}
                    activeCategory={activeCategory}
                    onSelect={(cat) => { setActiveCategory(cat); pulse('assessments'); }}
                  />
                </div>
              )}
            </div>
          </header>

          <main
            className="flex-1 max-w-6xl w-full mx-auto px-4 py-4 space-y-4 pb-[calc(5.5rem+env(safe-area-inset-bottom))] md:pb-8"
            onFocusCapture={() => pulse(section)}
            onInput={() => pulse(section)}
          >

            {section === 'results' && <ResultsView onOpenAssessment={(k) => openAssessment(k as AssessmentKey)} />}
            {section === 'settings' && <SettingsView />}
            {section === 'suggestions' && <SuggestionsView />}

            {section === 'assessments' && (
              <>
                {/* Ad Banner for free users */}
                <AdBanner />

                {/* Hero banner — only when no search/filter */}
                {!searchQuery.trim() && activeCategory === 'all' && (
                  <div className="relative overflow-hidden rounded-2xl border border-border shadow-lg dark:border-primary/20 bg-card">
                    <img
                      src={cognitoHero}
                      alt={language === 'en' ? 'Clinician using Cognito on a tablet' : 'ടാബ്‌ലെറ്റിൽ Cognito ഉപയോഗിക്കുന്ന ക്ലിനിക്‌ഷ്യൻ'}
                      className="w-full h-auto block opacity-95"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 flex items-start justify-center pt-8 bg-gradient-to-b from-black/50 via-black/10 to-transparent rounded-2xl">
                      <h2 className="text-3xl sm:text-4xl font-extrabold text-white text-center px-4 leading-tight max-w-sm drop-shadow-2xl">
                        {language === 'en'
                          ? 'Neuropsychiatric\nEvaluation Companion'
                          : 'വിരിയറ്റ ഗ്രൂപ്പിനും\nവിലയിരുത്തലും'}
                      </h2>
                    </div>
                    <div className="sr-only">
                      {language === 'en'
                        ? 'Understand the brain and track progress. Scientifically validated neuropsychiatric assessments — confidential, multilingual, and clinician-ready.'
                        : 'മസ്തിഷ്കം മനസ്സിലാക്കുക, പുരോഗതി രേഖപ്പെടുത്തുക. ശാസ്ത്രീയമായി സാധൂകരിച്ച ന്യൂറോസൈക്യാട്രിക് വിലയിരുത്തലുകൾ — രഹസ്യാത്മകവും ബഹുഭാഷയും ക്ലിനിക്കൽ-റെഡിയും.'}
                    </div>
                  </div>
                )}

                {/* Reference library matches */}
                {searchQuery.trim() && syndromeMatches.length > 0 && (
                  <div className="rounded-2xl border border-primary/20 bg-primary/5 p-3">
                    <div className="flex items-center gap-2 mb-2 px-1">
                      <BookOpen className="h-4 w-4 text-primary" />
                      <span className="text-xs font-semibold text-primary uppercase tracking-wide">
                        {language === 'en' ? 'Found in reference library' : 'റഫറൻസ് ലൈബ്രറിയിൽ കണ്ടെത്തി'}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {syndromeMatches.map((m) => (
                        <button
                          key={`${m.kind}-${m.id}`}
                          onClick={() => openSyndromeReference(m.name)}
                          className="group flex items-start gap-2 text-left p-3 rounded-xl bg-card border border-border hover:border-primary/40 hover:shadow-sm transition-all"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-sm font-semibold text-foreground">{m.name}</span>
                              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-secondary text-muted-foreground">
                                {m.hint}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                              {m.description}
                            </p>
                          </div>
                          <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary shrink-0 mt-0.5 transition-colors" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Assessment grid — grouped by category when browsing All; banner + grid when filtered */}
                <TooltipProvider delayDuration={200}>
                  {(() => {
                    const neonColorPalette = [
                      { glow: 'glow-neon-magenta', bg: 'from-fuchsia-600 to-black', icon: 'rgba(255,0,255,0.8)' }, // Magenta
                      { glow: 'glow-neon-blue', bg: 'from-cyan-600 to-black', icon: 'rgba(0,255,255,0.8)' }, // Cyan
                      { glow: 'glow-neon-pink', bg: 'from-rose-600 to-black', icon: 'rgba(255,0,110,0.8)' }, // Pink
                      { glow: '', bg: 'from-lime-600 to-black', icon: 'rgba(0,255,0,0.8)', customGlow: 'box-shadow: 0_0_10px_rgba(0,255,0,0.5), 0_0_20px_rgba(0,255,0,0.3)' }, // Lime Green
                      { glow: '', bg: 'from-orange-600 to-black', icon: 'rgba(255,165,0,0.8)', customGlow: 'box-shadow: 0_0_10px_rgba(255,165,0,0.5), 0_0_20px_rgba(255,165,0,0.3)' }, // Orange
                      { glow: '', bg: 'from-violet-600 to-black', icon: 'rgba(139,92,246,0.8)', customGlow: 'box-shadow: 0_0_10px_rgba(139,92,246,0.5), 0_0_20px_rgba(139,92,246,0.3)' }, // Violet
                      { glow: '', bg: 'from-red-600 to-black', icon: 'rgba(255,0,0,0.8)', customGlow: 'box-shadow: 0_0_10px_rgba(255,0,0,0.5), 0_0_20px_rgba(255,0,0,0.3)' }, // Red
                      { glow: '', bg: 'from-yellow-500 to-black', icon: 'rgba(255,255,0,0.8)', customGlow: 'box-shadow: 0_0_10px_rgba(255,255,0,0.5), 0_0_20px_rgba(255,255,0,0.3)' }, // Yellow
                    ];

                    // const _isProSubscriber = true; // Always unlocked

                    const renderTile = (a: AssessmentInfo, index: number, locked = false) => {
                      const Icon = a.icon;
                      const color = neonColorPalette[index % neonColorPalette.length];
                      const customGlowStyle = color.customGlow ? { style: { boxShadow: color.customGlow } } : {};
                      const reference = getAssessmentReference(a.key);

                      return (
                        <Tooltip key={a.key}>
                          <TooltipTrigger asChild>
                            <button
                              onClick={() => locked ? setShowPaywall(true) : openAssessment(a.key)}
                              className={`group relative flex flex-col items-center justify-center text-center p-3 sm:p-4 min-h-[132px] rounded-2xl border shadow-sm transition-all duration-300 active:scale-[0.97] overflow-hidden ${
                                locked
                                  ? 'bg-card/50 border-border/50 opacity-60 cursor-pointer'
                                  : 'bg-card border-border hover:shadow-xl hover:border-primary/50 hover:bg-accent/5 dark:hover:bg-primary/5'
                              }`}
                            >
                              {/* Pro lock overlay removed — all assessments unlocked */}

                              <div className={`absolute inset-0 bg-gradient-to-br ${a.gradient} opacity-0 group-hover:opacity-[0.06] transition-opacity`} aria-hidden />
                              <div className={`relative w-12 h-12 rounded-xl bg-gradient-to-br ${color.bg} flex items-center justify-center mb-2.5 border group-hover:scale-110 transition-all ${color.glow}`} style={{ borderColor: color.icon, ...customGlowStyle.style }}>
                                <Icon className="h-6 w-6 text-white" style={{ filter: `drop-shadow(0 0 8px ${color.icon})` }} />
                              </div>
                              <span className="relative text-sm font-semibold text-foreground leading-tight">
                                {a.name}
                              </span>
                              <span className="relative text-[11px] text-muted-foreground mt-0.5 leading-tight">
                                {a.subtitle}
                              </span>
                              {reference && (
                                <span className="relative mt-1 inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                                  <BookOpen className="h-3 w-3" />
                                  Verified citation
                                </span>
                              )}
                            </button>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="max-w-xs text-xs leading-relaxed">
                            <div className="space-y-2">
                              <p>{locked ? `Pro feature — ${a.description}` : a.description}</p>
                              {reference && (
                                <p className="border-t border-border pt-2 text-muted-foreground">
                                  <span className="font-semibold text-foreground">Citation: </span>
                                  {reference.citation}
                                </p>
                              )}
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      );
                    };

                    const renderCategoryBanner = (cat: Exclude<Category, 'all'>, count: number) => {
                      const CatIcon = categoryLabels[cat].icon;
                      return (
                        <div className={`relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br ${categoryAccent[cat]} mb-5 h-32 sm:h-40 dark:shadow-inner dark:shadow-primary/5`}>
                          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent" />
                          <div className="relative h-full flex flex-col justify-end p-6 sm:p-8">
                            <div className="flex items-center gap-2 mb-2">
                              <CatIcon className="h-6 w-6 text-primary shrink-0" />
                              <h3 className="text-2xl sm:text-3xl font-bold text-foreground">
                                {language === 'en' ? categoryLabels[cat].en : categoryLabels[cat].ml}
                              </h3>
                              <span className="ml-auto text-sm font-semibold px-3 py-1 rounded-full bg-primary/90 text-white tabular-nums">
                                {count} assessments
                              </span>
                            </div>
                            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl">
                              {language === 'en'
                                ? (({
                                    cognitive: 'Memory, attention, executive function and dementia screens.',
                                    mood: 'Depression, anxiety, stress, trauma and related affective scales.',
                                    personality: 'Personality structure and disorder screening tools.',
                                    adverse: 'Adverse drug reactions, side-effect monitoring and safety risk tools.',
                                    movement: 'Parkinsonism, dyskinesia, dystonia and catatonia movement assessments.',
                                    epilepsy: 'Seizure classification, epilepsy surgery, medication effects and SUDEP tools.',
                                    substance: 'Alcohol, opioid, withdrawal, dependence and problematic internet/social media use screens.',
                                    sleep: 'Daytime sleepiness and obstructive sleep apnea screening.',
                                    psychosis: 'Positive, negative and prodromal symptom assessments.',
                                    fibromyalgia: 'Chronic pain and fibromyalgia diagnostic criteria.',
                                    brainfog: 'Clinical framework for evaluating cognitive fog and post-viral syndromes.',
                                  } as Record<string, string>)[cat] || '')
                                : ''}
                            </p>
                          </div>
                        </div>
                      );
                    };

                    // Filtered or searching → flat grid (with optional single banner)
                    if (searchQuery.trim() || activeCategory !== 'all') {
                      if (filteredAssessments.length === 0) {
                        return (
                          <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in slide-in-from-top-4">
                            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                              <Search className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">No matching tools found</h3>
                            <p className="text-muted-foreground max-w-sm">
                              We couldn't find any assessments matching "{searchQuery}". Try adjusting your keywords or category.
                            </p>
                            <Button 
                              variant="link" 
                              onClick={() => setSearchQuery('')}
                              className="mt-4 text-primary"
                            >
                              Clear search query
                            </Button>
                          </div>
                        );
                      }
                      return (
                        <>
                          {activeCategory !== 'all' && !searchQuery.trim() &&
                            renderCategoryBanner(
                              activeCategory as Exclude<Category, 'all'>,
                              filteredAssessments.length,
                            )}
                          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
                            {filteredAssessments.map((a, idx) => renderTile(a, idx, false))}
                          </div>
                        </>
                      );
                    }

                    // Browsing all → grouped by category with banners
                    return (
                      <div className="space-y-6">
                        {categoryOrder.map((cat) => {
                          const items = assessments.filter((a) => a.category.includes(cat));
                          if (items.length === 0) return null;
                          return (
                            <section key={cat} aria-labelledby={`cat-${cat}`}>
                              {renderCategoryBanner(cat, items.length)}
                              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
                                {items.map((a, idx) => renderTile(a, idx, false))}
                              </div>
                            </section>
                          );
                        })}
                      </div>
                    );
                  })()}
                </TooltipProvider>


                {filteredAssessments.length === 0 && syndromeMatches.length === 0 && (
                  <div className="text-center py-16 text-muted-foreground">
                    <Search className="h-10 w-10 mx-auto mb-3 opacity-40" />
                    <p className="text-sm">
                      {language === 'en' ? 'No matches found' : 'പൊരുത്തങ്ങളൊന്നും കണ്ടെത്തിയില്ല'}
                    </p>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
        </motion.div>
      </AnimatePresence>

      <MobileBottomNav
        section={section}
        onSectionChange={(s) => { setSection(s); pulse(s); }}
        resultsCount={resultsCount}
      />


      {/* Paywall Modal */}
      <PaywallModal
        isOpen={showPaywall}
        onClose={() => setShowPaywall(false)}
        onSelectPlan={initiatePurchase}
      />

      
      
      {!navigator.onLine && (
        <div className="fixed inset-0 z-[100] bg-background">
          <OfflineFallback />
        </div>
      )}
    </SidebarProvider>
  );
};
