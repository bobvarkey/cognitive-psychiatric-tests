# Clinical Assessment Reordering Plan

Reorder all 79+ assessments into a logical clinical flow to improve navigation and accessibility, ensuring all implemented tools are represented in the grid.

## Proposed Assessment Order

### 1. Triage & Core Flows
- Psychiatric Triage
- ADHD Outpatient Flow
- OPD Psych Evaluation

### 2. Dementia & Cognitive
- CDR (Clinical Dementia Rating)
- FAST (Functional Staging)
- Dementia Screen (BEHAV5+)
- DAPHNE (bvFTD)
- CCSA (Comprehensive Cognitive Screening)
- Mini-ACE
- Mini-Cog
- FAB (Frontal Battery)
- Mental Status Exam (MSE)
- Cognitive Syndromes library
- Short IQCODE
- TULIA (Apraxia)
- CDS (Callosal Disconnection)
- Coma & Consciousness (GCS, FOUR, RASS, ABS)

### 3. Psychosis
- Late-Onset Psychosis classification
- BPRS
- SAPS / SANS
- CRDPSS (DSM-5 Dimensions)
- SOPS (Prodromal)
- PSYRATS
- VAGUS-SR (Insight)
- PANSS

### 4. Mood & Anxiety
- HAM-D (Hamilton Depression)
- HAM-A (Hamilton Anxiety)
- BDI (Beck Depression Inventory)
- Y-BOCS (Obsessive-Compulsive)
- PSS (Perceived Stress)
- Stress Screening
- DPDR (Depersonalization-Derealization)
- PCL-5 (PTSD)

### 5. Personality
- IPDE (Personality Disorder)
- MSI-BPD (Borderline)
- PID-5 Unified Trait Screener
- HARE (Psychopathy)

### 6. Substance Abuse & PUI
- CAGE (Alcohol)
- AUDIT (Alcohol Use Disorders)
- Alcohol Units Calculator
- COWS (Opiate Withdrawal)
- CIWA-Ar (Alcohol Withdrawal)
- SDS (Severity of Dependence)
- SMDS-SF (Social Media Disorder)

### 7. Movement Disorders
- MDS-UPDRS (Parkinson's)
- Hoehn & Yahr staging
- AIMS (Dyskinesia)
- TWSTRS (Cervical Dystonia)
- SAS (Simpson-Angus)
- EPRS (Extrapyramidal Symptoms)
- Catatonia (BFCRS)
- 5-2-1 Criteria (Advanced PD)
- ANAGE-PD
- D-DATS
- Stimulus 2 DBS

### 8. Epilepsy
- ILAE Seizure Classification (2025)
- LAEP (Medication Side Effects)
- ESGS (Surgery Outcome)
- CASES Tool (Surgery Appropriateness)
- Engel Scale (Post-Surgical)
- SUDEP-7 Inventory
- SUDEP Safety Checklist

### 9. Sleep
- Epworth Sleepiness Scale (ESS)
- STOP-BANG (Sleep Apnea)
- Insomnia Severity Index (ISI)
- Berlin Questionnaire (OSA)
- PSQI (Pittsburgh Sleep Quality)
- FOSQ (Functional Outcomes)
- IRLS (Restless Legs)
- ASRS (Augmentation Severity)
- Cataplexy Questionnaire
- SDQ (Sleep Disorders Questionnaire)

### 10. Adverse Reactions
- NMS (Neuroleptic Malignant Syndrome)
- Hunter Criteria (Serotonin Syndrome)
- SMARTS checklist
- Adverse Effects drug-class checklist
- Antipsychotic Metabolic tracker
- SSRI Adverse Events tracker
- Fall Risk (STEADI, Morse, FRAT)

### 11. Specialty / Misc
- ACR 2010 Fibromyalgia
- Brain Fog algorithm

## Technical Details

- **File:** `src/components/AssessmentSelector.tsx`
- **Cleanup:** Remove duplicate `consciousness` and `fibromyalgia` entries.
- **Additions:** Ensure `hamd`, `hama`, `bdi`, `ybocs`, `ipde`, `pcl5`, `pss`, `bprs`, `mmpi`, and others are correctly registered in the `assessments` array.
- **Icons & Gradients:** Standardize icons and color gradients across related clinical domains.
