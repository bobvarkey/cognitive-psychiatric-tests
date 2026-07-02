/**
 * Clinical interpretation, psychometric properties, and recommended clinical
 * actions for each assessment. Surfaced beneath the reference citation by the
 * shared <AssessmentReference /> component.
 */

export interface AssessmentInterpretation {
  /** Cut-offs and what scores mean clinically. */
  interpretation: string;
  /** Published sensitivity / specificity / reliability data. */
  psychometrics?: string;
  /** Recommended next steps for the clinician. */
  clinicalAction?: string;
}

export const ASSESSMENT_INTERPRETATIONS: Record<string, AssessmentInterpretation> = {
  cage: {
    interpretation: 'A score of ≥ 2 is clinically significant and warrants further evaluation for an alcohol use disorder. Even one positive answer should prompt discussion.',
    psychometrics: 'Scores of 2 or higher had a 93% sensitivity / 76% specificity for the identification of "excessive drinking" and a 91% sensitivity / 77% specificity for the identification of alcoholism.',
    clinicalAction: 'Take a detailed drinking history (quantity, frequency, last drink), screen for withdrawal risk (CIWA-Ar), assess comorbid mood/anxiety, and consider AUDIT for severity grading. Offer brief intervention, pharmacotherapy (naltrexone, acamprosate, disulfiram) where indicated, and referral to addiction services.',
  },
  audit: {
    interpretation: 'Score 0–7: low-risk drinking. 8–15: hazardous drinking — give brief advice. 16–19: harmful drinking — brief counselling + monitoring. ≥ 20: likely dependence — refer for diagnostic evaluation and treatment.',
    psychometrics: 'At a cut-off of 8, sensitivity 92% and specificity 94% for detecting hazardous/harmful drinking across primary care populations (Saunders 1993; Reinert & Allen 2007).',
    clinicalAction: 'For scores ≥ 8 deliver brief intervention; for ≥ 16 add structured follow-up; for ≥ 20 refer to addiction services and consider pharmacotherapy (naltrexone, acamprosate) plus relapse-prevention counselling.',
  },
  cows: {
    interpretation: '5–12: mild withdrawal. 13–24: moderate. 25–36: moderately severe. > 36: severe withdrawal.',
    psychometrics: 'COWS is a validated 11-item clinician-rated instrument with high inter-rater reliability (ICC > 0.9) used to time buprenorphine induction (Wesson & Ling 2003).',
    clinicalAction: 'A score ≥ 8 with objective signs is generally sufficient to begin buprenorphine induction. Treat symptomatically (clonidine, loperamide, NSAIDs, ondansetron). Reassess every 1–2 hours during induction.',
  },
  bdi: {
    interpretation: '0–13: minimal depression. 14–19: mild. 20–28: moderate. 29–63: severe.',
    psychometrics: 'BDI-II has internal consistency α ≈ 0.91 and 1-week test–retest reliability ≈ 0.93. Cut-off ≥ 20 has sensitivity ~81% and specificity ~92% for major depression (Beck 1996).',
    clinicalAction: 'For moderate–severe scores initiate evidence-based treatment (SSRI/SNRI ± CBT), screen for suicide risk (item 9), and re-administer every 2–4 weeks to track response.',
  },
  hamd: {
    interpretation: '0–7: normal/remission. 8–13: mild. 14–18: moderate. 19–22: severe. ≥ 23: very severe depression.',
    psychometrics: 'HAM-D-17 inter-rater reliability ICC 0.81–0.98; widely used as primary efficacy endpoint in antidepressant trials. ≥ 50% reduction = response; score ≤ 7 = remission.',
    clinicalAction: 'Use serial scores to track treatment response. Optimize antidepressant dose, augment (lithium, atypical antipsychotic, T3) or switch class if < 25% reduction at 4–6 weeks. Consider ECT/rTMS for severe, psychotic, or treatment-resistant depression.',
  },
  hama: {
    interpretation: '< 17: mild anxiety. 18–24: mild–moderate. 25–30: moderate–severe. > 30: severe.',
    psychometrics: 'HAM-A inter-rater reliability ICC ≈ 0.74–0.96; well-validated as anxiolytic-trial endpoint (Hamilton 1959). ≥ 50% reduction commonly defines response.',
    clinicalAction: 'Offer SSRI/SNRI plus CBT for moderate-to-severe anxiety. Short-term benzodiazepines only when essential. Address comorbid depression, substance use and sleep.',
  },
  pss: {
    interpretation: '0–13: low perceived stress. 14–26: moderate. 27–40: high perceived stress.',
    psychometrics: 'PSS-10 internal consistency α 0.78–0.91; 2-week test–retest 0.85 (Cohen 1983; Lee 2012). Validated across cultures.',
    clinicalAction: 'Offer stress-management strategies, mindfulness/relaxation training, sleep hygiene, and activity scheduling. Screen for comorbid depression/anxiety when scores are high.',
  },
  pcl5: {
    interpretation: 'Provisional PTSD diagnosis: ≥ 1 B-item (Q1), ≥ 1 C-item (Q2), ≥ 2 D-items, ≥ 2 E-items rated moderately or higher, plus total ≥ 31–33.',
    psychometrics: 'PCL-5 internal consistency α 0.94; test–retest 0.82. Cut-off ≥ 33 sensitivity 0.78–0.82, specificity 0.84 against CAPS-5 (Bovin 2016).',
    clinicalAction: 'For provisional PTSD, refer for trauma-focused psychotherapy (PE, CPT, or EMDR). Pharmacotherapy: SSRI (sertraline, paroxetine) or venlafaxine. Address sleep, substance use and suicide risk.',
  },
  mmpi: {
    interpretation: 'This is a 10-item screening surrogate, not the full MMPI. ≥ 4 true responses across clinical scales indicates high risk and warrants full MMPI-2-RF / formal psychiatric assessment. Elevations on Hs, D and Hy suggest somatization.',
    psychometrics: 'Full MMPI-2-RF clinical scales have α 0.62–0.87 and 1-week test–retest 0.66–0.91. This brief screener is for triage only and should not replace the validated form.',
    clinicalAction: 'For high-risk screens, arrange administration of the complete MMPI-2-RF by a qualified psychologist and incorporate findings into a comprehensive psychiatric formulation.',
  },
  msibpd: {
    interpretation: 'Score ≥ 7 (out of 10) suggests a probable diagnosis of borderline personality disorder and warrants structured diagnostic interview.',
    psychometrics: 'At cut-off ≥ 7, sensitivity ≈ 0.81 and specificity ≈ 0.85 against SCID-II BPD diagnosis (Zanarini 2003).',
    clinicalAction: 'Confirm with SCID-5-PD or IPDE. Refer for evidence-based psychotherapy (DBT, MBT, schema therapy, TFP). Pharmacotherapy is symptom-targeted; avoid polypharmacy and long-term benzodiazepines.',
  },
  ybocs: {
    interpretation: '0–7: subclinical. 8–15: mild. 16–23: moderate. 24–31: severe. 32–40: extreme OCD.',
    psychometrics: 'Y-BOCS internal consistency α 0.69–0.91; inter-rater ICC 0.80–0.99. ≥ 35% reduction is the standard response definition in trials (Goodman 1989).',
    clinicalAction: 'Offer ERP (exposure and response prevention) as first-line. Pharmacotherapy: high-dose SSRI (or clomipramine); augment with atypical antipsychotic if partial response. Consider TMS or deep brain stimulation for treatment-refractory OCD.',
  },
  panss: {
    interpretation: 'Positive (7–49), Negative (7–49) and General (16–112) subscales sum to a total (30–210). ≥ 75 = markedly ill; ≤ 58 = mildly ill; ≥ 20% reduction commonly defines treatment response.',
    psychometrics: 'PANSS internal consistency α 0.73–0.83; inter-rater ICC > 0.80 with training. Standard outcome measure in antipsychotic trials (Kay 1987).',
    clinicalAction: 'Optimize antipsychotic monotherapy at adequate dose × ≥ 4–6 weeks before switching. Consider clozapine if two adequate trials fail. Combine with psychosocial interventions (CBTp, family work, supported employment).',
  },
  hare: {
    interpretation: 'PCL-R total 0–40. ≥ 30 in North America (≥ 25 in Europe) is the conventional threshold for psychopathy. Factor 1 = interpersonal/affective; Factor 2 = lifestyle/antisocial.',
    psychometrics: 'PCL-R inter-rater ICC 0.86–0.94; internal consistency α 0.85; strong predictor of violent recidivism (AUC ≈ 0.70).',
    clinicalAction: 'Must be administered by a trained clinician with collateral records. Use cautiously; informs risk-management and forensic decisions but is not a stand-alone basis for sentencing or treatment denial.',
  },
  adhd: {
    interpretation: 'DSM-5 ADHD requires ≥ 5 (adults) / ≥ 6 (children) symptoms in inattention and/or hyperactivity-impulsivity domains, onset before age 12, ≥ 2 settings, and functional impairment.',
    psychometrics: 'ASRS-v1.1 6-item screener has sensitivity 68.7% and specificity 99.5% against clinician diagnosis (Kessler 2005). Full DSM-5 criteria remain the diagnostic gold standard.',
    clinicalAction: 'Confirm with structured interview (DIVA-5, CAADID). Rule out mimics (sleep disorders, anxiety, mood, substance use, thyroid). First-line: stimulants (methylphenidate, lisdexamfetamine); second-line: atomoxetine, guanfacine. Combine with CBT/coaching and occupational accommodations.',
  },
  adam: {
    interpretation: '≥ 3 "yes" answers (or yes to questions 1 or 7) suggests symptomatic androgen deficiency in the ageing male and warrants morning total testosterone testing.',
    psychometrics: 'ADAM has high sensitivity (~88%) but low specificity (~60%) for biochemical hypogonadism (Morley 2000); use as screening tool only.',
    clinicalAction: 'Confirm with two morning total testosterone levels (and free T if SHBG abnormal), LH/FSH, prolactin, and DEXA where appropriate. Treat reversible causes (sleep apnoea, obesity, opioids) before considering testosterone replacement.',
  },
  daphne: {
    interpretation: 'Higher scores on each Big-Five-derived domain (Disinhibition, Anankastia, Negative affectivity, Detachment, Dissocial, Psychoticism) indicate greater trait expression and severity of personality dysfunction per ICD-11.',
    psychometrics: 'DAPHNE was developed against the ICD-11 personality trait model; internal consistency α 0.79–0.88 across domains (Bach 2021).',
    clinicalAction: 'Use alongside the ICD-11 severity rating (mild / moderate / severe / personality difficulty). Match psychotherapy modality to dominant trait (e.g. DBT for negative affectivity, schema therapy for detachment).',
  },
  catatoniaBfcrs: {
    interpretation: 'BFCRS screening: ≥ 2 of the first 14 items present indicates probable catatonia. Full 23-item severity scale guides treatment response.',
    psychometrics: 'BFCRS inter-rater reliability ICC 0.93–0.95; sensitivity for catatonia > 90% against DSM-5 criteria (Bush 1996).',
    clinicalAction: 'Confirm with lorazepam challenge (1–2 mg IM/IV — ≥ 50% reduction in BFCRS within 10–30 min supports diagnosis). First-line: scheduled lorazepam 6–24 mg/day. ECT if benzodiazepine-refractory, malignant catatonia, or NMS-like features.',
  },
  catatoniaDsm5: {
    interpretation: 'DSM-5 requires ≥ 3 of 12 catatonic features (stupor, catalepsy, waxy flexibility, mutism, negativism, posturing, mannerisms, stereotypies, agitation, grimacing, echolalia, echopraxia).',
    psychometrics: 'DSM-5 specifier shows fair agreement with BFCRS-defined catatonia (κ 0.61–0.78) but may under-detect mild cases.',
    clinicalAction: 'Always pair with BFCRS for severity. Discontinue antipsychotics if possible, exclude NMS, malignant catatonia and autoimmune encephalitis. Treat with lorazepam ± ECT.',
  },
  dementia: {
    interpretation: 'Integrate cognitive test scores (MoCA, Mini-ACE), functional decline (IQCODE), and neuropsychiatric features to support a syndromic diagnosis (AD, vascular, DLB, FTD, mixed).',
    psychometrics: 'MoCA ≥ 26 = normal (sens 90%, spec 87% for MCI). Mini-ACE < 21/30 specificity 100%, sens 84.6% for dementia. IQCODE ≥ 3.31 sens 86%, spec 81%.',
    clinicalAction: 'Order baseline bloods (B12, folate, TSH, calcium, HIV/syphilis where indicated) and structural imaging (MRI). Refer to memory clinic; consider cholinesterase inhibitors for AD/DLB, memantine for moderate-severe AD; address vascular risk factors and behavioural symptoms.',
  },
  cognitiveSyndromes: {
    interpretation: 'Pattern of deficits across frontal, temporal, parietal and subcortical domains localises pathology and narrows the differential (e.g. AD, FTD-bv, PSP, CBD, vascular cognitive impairment).',
    psychometrics: 'Bedside frontal lobe tests (FAB, Luria, go/no-go) have moderate sensitivity (~70%) but high specificity for frontal dysfunction when ≥ 2 items abnormal.',
    clinicalAction: 'Confirm with formal neuropsychology, structural and functional imaging (MRI, FDG-PET, amyloid/tau PET, DaTscan where indicated). Refer to cognitive neurology / neuropsychiatry for syndromic diagnosis.',
  },
  miniace: {
    interpretation: 'Cut-offs: < 21/30 has 100% specificity and 84.6% sensitivity for dementia; < 25/30 has 85% sensitivity and 87% specificity for dementia.',
    psychometrics: 'Mini-ACE validated in mixed memory clinic cohorts (Hsieh 2015). Less ceiling effect than MMSE.',
    clinicalAction: 'Use as bedside screen; confirm impairment with full ACE-III or neuropsychological testing. Proceed to bloods, imaging and specialist referral as for dementia work-up.',
  },
  minicog: {
    interpretation: 'Total 0–2 / 5: positive screen for cognitive impairment. 3–5: negative screen. (3-item recall 0 = positive regardless of clock.)',
    psychometrics: 'Sensitivity 76–99% and specificity 89–93% for dementia in community-dwelling older adults; less education-biased than MMSE (Borson 2003).',
    clinicalAction: 'For positive screens, complete a full cognitive assessment (MoCA/ACE-III), collateral history (IQCODE), bloods and imaging. Avoid using Mini-Cog as a stand-alone diagnostic test.',
  },
  iqcode: {
    interpretation: 'Mean item score ≥ 3.31/5 suggests significant cognitive decline relative to 10 years prior.',
    psychometrics: 'At ≥ 3.31, sensitivity ≈ 86% and specificity ≈ 81% for dementia; complements direct cognitive testing and is less affected by education and culture (Jorm 2004).',
    clinicalAction: 'Combine with objective cognitive testing. Investigate reversible causes and refer to memory clinic if decline is confirmed.',
  },
  fab: {
    interpretation: 'Total 0–18. ≤ 12 suggests frontal dysfunction; ≤ 11 differentiates FTD from AD with reasonable accuracy.',
    psychometrics: 'FAB ≤ 12 sensitivity 77%, specificity 87% for frontal lobe dysfunction. ≤ 11 distinguishes FTD from AD with sens 77%, spec 87% (Dubois 2000).',
    clinicalAction: 'For abnormal scores pursue structural/functional imaging (MRI, FDG-PET), formal neuropsychology, and consider FTD, vascular cognitive impairment, PSP/CBD, or other frontal pathologies.',
  },
  tulia: {
    interpretation: 'Total 0–48. ≤ 32 = apraxia; ≤ 27 = severe apraxia. Separate imitation and pantomime subscores localise the deficit.',
    psychometrics: 'TULIA inter-rater reliability ICC 0.94, internal consistency α 0.96; sensitivity 95% and specificity 82% for limb apraxia (Vanbellingen 2010).',
    clinicalAction: 'Refer to occupational therapy for activity-based rehabilitation. Correlate with imaging (parietal/frontal pathology) and consider underlying stroke, CBD, AD or callosal lesions.',
  },
  delusions: {
    interpretation: 'Endorsed delusional themes (persecutory, grandiose, religious, somatic, jealous, erotomanic, reference, control, nihilistic, misidentification) anchor the differential between primary psychotic, mood-related and organic causes.',
    psychometrics: 'Structured delusion checklists improve detection compared with unstructured interview (κ 0.65–0.80) but are not diagnostic on their own.',
    clinicalAction: 'Exclude organic causes (delirium, dementia, substance use, autoimmune encephalitis, temporal lobe pathology). Treat the underlying disorder; antipsychotic monotherapy for primary psychosis with adjunctive psychosocial care.',
  },
  dpdr: {
    interpretation: 'Higher CDS-29 / DSS scores reflect greater frequency and duration of depersonalisation/derealisation symptoms. Clinically significant DPDR requires persistent/recurrent symptoms with intact reality testing and functional impairment.',
    psychometrics: 'CDS-29 ≥ 70 has sensitivity 75%, specificity 87% for DPDR disorder (Sierra & Berrios 2000). Internal consistency α 0.89.',
    clinicalAction: 'Screen for trauma, anxiety, depression and substance use (especially cannabis/ketamine). Offer psychoeducation, CBT or grounding-based therapy; SSRIs and lamotrigine augmentation have limited but supportive evidence.',
  },
  hunter: {
    interpretation: 'Serotonin syndrome is present if a serotonergic agent has been taken and ONE of: spontaneous clonus; inducible clonus + agitation/diaphoresis; ocular clonus + agitation/diaphoresis; tremor + hyperreflexia; or hypertonia + temperature > 38 °C + ocular/inducible clonus.',
    psychometrics: 'Hunter criteria sensitivity 84% and specificity 97% against gold-standard toxicologist diagnosis — superior to Sternbach criteria (Dunkley 2003).',
    clinicalAction: 'Discontinue all serotonergic agents, supportive care (IV fluids, cooling, benzodiazepines for agitation/clonus). Cyproheptadine 12 mg PO then 2 mg q2h for moderate–severe cases. Admit to monitored bed; intubation and paralysis for hyperthermia > 41.1 °C.',
  },
  simpsonAngus: {
    interpretation: 'Mean item score (total / 10). ≥ 0.3 indicates clinically significant antipsychotic-induced parkinsonism.',
    psychometrics: 'SAS inter-rater ICC 0.71–0.96; widely used in antipsychotic trials (Simpson & Angus 1970).',
    clinicalAction: 'Reduce antipsychotic dose, switch to a lower-EPS agent (e.g. quetiapine, clozapine, aripiprazole), or add an anticholinergic (procyclidine, trihexyphenidyl) — balancing against cognitive side effects.',
  },
  adverseEffects: {
    interpretation: 'Higher Glasgow / LUNSERS / UKU / SMARTS scores reflect greater antipsychotic-related side-effect burden across neurological, autonomic, metabolic, hormonal and psychic domains.',
    psychometrics: 'GASS internal consistency α 0.87; SMARTS has high face validity and brevity for routine clinical monitoring (Hynes 2015).',
    clinicalAction: 'Address modifiable side effects (dose reduction, switch, anticholinergic for EPS, metformin/lifestyle for metabolic, dose-time change for sedation). Monitor weight, lipids, glucose, prolactin, ECG (QTc) at baseline and at 3/6/12 months.',
  },
  smarts: {
    interpretation: 'Any "yes" indicates a side effect requiring clinical attention; the higher the total, the greater the cumulative burden.',
    psychometrics: 'SMARTS is a brief (11-item) self-report screen designed for routine antipsychotic monitoring, with good acceptability and concordance with longer instruments (Hynes 2015).',
    clinicalAction: 'For each endorsed item, quantify severity, attribute to drug vs illness, and intervene: dose adjustment, switch, anticholinergic for EPS, lifestyle/metformin for metabolic, dose-timing change for sedation, etc.',
  },
  eprs: {
    interpretation: 'Total score categorises extrapyramidal symptom severity: 0 = absent; mild, moderate or severe based on item count and intensity.',
    psychometrics: 'Clinician-rated EPS scales (SAS, AIMS, BARS) collectively have inter-rater ICC > 0.80 with training; serial use detects emergence of tardive syndromes.',
    clinicalAction: 'For drug-induced parkinsonism reduce dose / switch antipsychotic / add anticholinergic. For akathisia: dose reduction, propranolol, mirtazapine or benzodiazepine. For acute dystonia: IM/IV anticholinergic. Reassess for tardive dyskinesia with AIMS at ≥ 3-month intervals.',
  },
  fallRisk: {
    interpretation: 'Risk stratification combines history of falls, balance/gait, medication review, vision, cognition and home hazards. Higher composite scores indicate higher 12-month fall risk.',
    psychometrics: 'Multifactorial fall assessment tools (FRAT, Morse, STRATIFY) have sensitivity 70–93% and specificity 50–88% for predicting falls in older adults.',
    clinicalAction: 'Review fall-risk medications (benzodiazepines, antipsychotics, antihypertensives), optimise vision, vitamin D and bone health, prescribe strength/balance exercise (Otago, Tai Chi), and arrange home-hazard assessment.',
  },
  stressScreening: {
    interpretation: 'Higher composite scores reflect greater perceived stress and risk of stress-related disorders (adjustment, anxiety, depression, somatic).',
    psychometrics: 'Multidimensional stress screens typically achieve internal consistency α 0.80–0.92 and correlate strongly with PSS and GAD-7.',
    clinicalAction: 'Offer psychoeducation, sleep and lifestyle optimisation, mindfulness/CBT-based stress management. Treat any comorbid depression or anxiety. Re-screen at 4–6 weeks to track response.',
  },
  nms: {
    interpretation: 'Diagnose NMS when there is exposure to a dopamine antagonist (or dopamine agonist withdrawal) + hyperthermia + rigidity + ≥ 2 of: altered mental status, autonomic instability, tachypnoea, raised CK, leukocytosis, metabolic acidosis.',
    psychometrics: 'The 2011 international expert consensus criteria have high inter-rater agreement (κ > 0.8) and better sensitivity than older DSM-IV criteria.',
    clinicalAction: 'Stop the offending agent immediately. ICU-level supportive care (cooling, IV fluids, electrolytes, DVT prophylaxis). Dantrolene, bromocriptine or amantadine for moderate–severe cases; ECT for refractory or catatonia-overlap presentations. Rechallenge cautiously with a low-potency agent after ≥ 2 weeks.',
  },
  fibromyalgia: {
    interpretation: 'ACR 2016 criteria require Widespread Pain Index ≥ 7 + Symptom Severity Score ≥ 5 (or WPI 4–6 + SSS ≥ 9), generalised pain in ≥ 4 of 5 regions, symptoms present ≥ 3 months.',
    psychometrics: 'ACR 2016 criteria sensitivity 86% and specificity 90% against clinician diagnosis (Wolfe 2016). Replaces tender-point exam.',
    clinicalAction: 'Multimodal management: patient education, graded aerobic + strengthening exercise, CBT, sleep optimisation. Pharmacotherapy: duloxetine, milnacipran, pregabalin or low-dose amitriptyline. Avoid opioids and chronic benzodiazepines.',
  },
  ipde: {
    interpretation: 'IPDE Screen flags possible personality pathology; ≥ 3 "true" answers per disorder cluster warrants the full IPDE structured interview.',
    psychometrics: 'IPDE has good cross-cultural reliability (κ 0.65–0.84) and is the WHO-endorsed instrument for ICD-10/DSM-IV personality disorder diagnosis (Loranger 1994).',
    clinicalAction: 'Confirm with the full IPDE or SCID-5-PD. Map traits to the ICD-11 dimensional model and severity grading. Match psychotherapy (DBT, MBT, schema, CAT) to dominant features.',
  },
  mdsupdrs: {
    interpretation: 'Total MDS-UPDRS sums Parts I (non-motor experiences), II (motor experiences), III (motor exam) and IV (motor complications). Higher scores indicate greater Parkinson’s disease burden; minimal clinically important difference for Part III ≈ 3.25 points.',
    psychometrics: 'MDS-UPDRS Part III inter-rater ICC > 0.90; total score α > 0.79 (Goetz 2008).',
    clinicalAction: 'Use serial scores to titrate levodopa and adjuncts (MAO-B inhibitors, dopamine agonists, COMT inhibitors, amantadine). Refer for DBS or device-aided therapies when motor fluctuations are not controlled. Address non-motor symptoms (mood, sleep, autonomic).',
  },
  brainFog: {
    interpretation: 'Brain fog is a symptom, not a diagnosis. Confirm the phenotype (attention, memory, processing-speed and executive complaints), rule out red flags (delirium, focal deficit, seizure, rapid decline), then work through sleep, metabolic/endocrine, psychiatric, neurological, autoimmune, medication/substance, and lifestyle causes systematically.',
    psychometrics: 'No single validated scale; use MoCA (≤ 25 abnormal), MMSE, or Mini-Cog for cognitive screening; PHQ-9 and GAD-7 for mood; Epworth/STOP-BANG for sleep contribution.',
    clinicalAction: 'Treat the underlying cause. Optimise sleep, exercise, Mediterranean diet, correct B12/iron/vitamin D deficiencies, review sedating and anticholinergic medications, treat comorbid anxiety/depression, and refer for neuropsychology or specialist input if symptoms persist beyond 3 months or worsen.',
  },
};
