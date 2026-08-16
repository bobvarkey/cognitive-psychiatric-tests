import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export type Language = 'en' | 'ml';

export const LANGUAGES: { code: Language; label: string; native: string }[] = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'ml', label: 'Malayalam', native: 'മലയാളം' },
];

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void; // legacy: cycles through languages
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Languages: English (default) and Malayalam only.

const translations = {
  en: {
    // Assessment titles and labels
    'assessment.title': 'DAPHNE Scale Assessment',
    'assessment.subtitle': 'A New Tool for the Assessment of the Behavioral Variant of Frontotemporal Dementia',
    'assessment.badge': '10 Items • 6 Domains • 5-Point Scale',
    'assessment.header': 'DAPHNE Assessment',
    'assessment.results.title': 'DAPHNE Assessment Results',
    
    // Form labels
    'form.patient.name': 'Patient Name *',
    'form.patient.age': 'Patient Age (optional)',
    'form.assessor.name': 'Assessor Name *',
    'form.patient.name.placeholder': 'Enter patient name',
    'form.patient.age.placeholder': 'Enter patient age',
    'form.assessor.name.placeholder': 'Enter your name',
    'form.begin': 'Begin Assessment',
    
    // Navigation
    'nav.previous': 'Previous',
    'nav.next': 'Next',
    'nav.complete': 'Complete Assessment',
    'nav.patient': 'Patient',
    'nav.assessor': 'Assessor',
    'nav.age': 'Age',
    
    // Scoring options
    'score.normal': 'Normal (0)',
    'score.very.mild': 'Very Mild (1)',
    'score.mild': 'Mild (2)',
    'score.moderate': 'Moderate (3)',
    'score.severe': 'Severe (4)',
    
    // Results
    'results.screening': 'DAPHNE-6 (Screening)',
    'results.diagnostic': 'DAPHNE-40 (Diagnostic)',
    'results.domain.analysis': 'Domain Analysis',
    'results.clinical.notes': 'Clinical Notes',
    'results.scoring.method': 'Scoring Method:',
    'results.assessment.domains': 'Assessment Domains:',
    'results.print': 'Print Results',
    'results.new': 'New Assessment',
    'results.present': 'Present',
    'results.absent': 'Absent',
    'results.assessed.by': 'Assessed by',
    
    // Interpretations
    'interp.no.behavioral': 'No behavioral symptoms',
    'interp.mild.behavioral': 'Mild behavioral symptoms',
    'interp.moderate.behavioral': 'Moderate behavioral symptoms',
    'interp.severe.behavioral': 'Severe behavioral symptoms',
    'interp.no.symptoms': 'No symptoms',
    'interp.mild.severity': 'Mild severity',
    'interp.moderate.severity': 'Moderate severity',
    'interp.high.severity': 'High severity',
    'interp.no.domains': 'No domains affected',
    'interp.domain.affected': 'domain affected',
    'interp.domains.affected': 'domains affected',
    'interp.all.normal': 'All items scored as normal',
    'interp.low.severity': 'Low overall symptom severity',
    'interp.moderate.overall': 'Moderate overall symptom severity',
    'interp.high.overall': 'High overall symptom severity',
    
    // Domain names
    'domain.disinhibition': 'Disinhibition',
    'domain.apathy': 'Apathy',
    'domain.empathy': 'Loss of Empathy',
    'domain.perseverations': 'Perseverations',
    'domain.hyperorality': 'Hyperorality',
    'domain.neglect': 'Personal Neglect',
    
    // Clinical notes
    'clinical.scoring.daphne6': 'DAPHNE-6 (Screening): Binary scoring of 6 domains (0-6 max). Score 1 point if any symptom present in domain.',
    'clinical.scoring.daphne40': 'DAPHNE-40 (Diagnostic): Sum of all 10 items (0-40 max). Each item scored 0-4 based on severity.',
    'clinical.domains.description': 'The DAPHNE scale explores six behavioral domains based on Rascovsky\'s criteria for behavioral variant frontotemporal dementia (bvFTD): disinhibition, apathy, perseverations, hyperorality, personal neglect, and loss of empathy.',
    'clinical.item': 'item',
    'clinical.items': 'items',
    
    // MoCA translations
    mocaDescription: 'A comprehensive cognitive screening tool for detecting mild cognitive impairment and dementia.',
    mocaNormal: 'Cognitive performance within normal limits',
    mocaMildImpairment: 'Mild cognitive impairment detected',
    mocaModerateImpairment: 'Moderate cognitive impairment detected',
    mocaResults: 'MoCA Assessment Results',
    overallScore: 'Overall Score',
    domainScores: 'Cognitive Domain Scores',
    educationAdjustment: 'Education Adjustment',
    normalCutoff: 'Normal cutoff',
    yearsOfEducation: 'Years of Education',
    enterEducation: 'Enter years of education',
    enterSex: 'Enter M/F',
    visuospatial: 'Visuospatial/Executive',
    naming: 'Naming',
    memory: 'Memory',
    attention: 'Attention',
    language: 'Language',
    abstraction: 'Abstraction',
    delayedRecall: 'Delayed Recall',
    orientation: 'Orientation',
    mocaClinicalNote1: 'The MoCA is a validated cognitive screening tool with high sensitivity for detecting mild cognitive impairment.',
    mocaClinicalNote2: 'Education adjustment: Add 1 point if ≤12 years of education. Normal score: ≥26/30.',
    mocaRecommendation: 'Further neuropsychological evaluation recommended for scores <26/30.',
    cognitiveAssessments: 'Cognito',
    selectAssessmentDescription: 'Choose the appropriate assessment tool based on your clinical needs and patient presentation.',
    keyFeatures: 'Key Features',
    startDaphneAssessment: 'Start DAPHNE Assessment',
    startMocaAssessment: 'Start MoCA Assessment',
    whichAssessmentToUse: 'Which Assessment Should I Use?',
    backToMenu: 'Back to Menu',
    
    // MSI-BPD translations
    msiBpdTitle: 'McLean Screening Instrument for BPD (MSI-BPD)',
    msiBpdDescription: 'A 10-item self-report screening tool for Borderline Personality Disorder. Answer yes or no based on your experiences.',
    msiBpdInstructions: 'Answer each question with Yes (1 point) or No (0 points). A score of 7 or higher suggests BPD symptoms.',
    msiBpdResults: 'MSI-BPD Results',
    msiBpdNotConsistent: 'Symptoms not consistent with BPD. Scores 0-4 indicate low likelihood of borderline personality features.',
    msiBpdFurtherEval: 'Further evaluation recommended. Scores 5-6 suggest possible BPD features requiring clinical assessment.',
    msiBpdAboveCutoff: 'Above clinical cutoff for BPD. Score ≥7 indicates significant BPD symptoms requiring professional evaluation.',
    msiBpdNote: 'This is a screening tool only. A positive result does not confirm a diagnosis and should be followed by comprehensive clinical evaluation.',
    yes: 'Yes',
    no: 'No',
    
    // HAM-D translations
    hamdTitle: 'Hamilton Depression Rating Scale (HAM-D)',
    hamdDescription: 'A 17-item clinician-administered assessment tool for measuring the severity of depression.',
    hamdInstructions: 'Rate each item based on the patient\'s condition over the past week. Select the option that best describes the patient\'s state.',
    hamdResults: 'HAM-D Assessment Results',
    hamdNormal: 'Normal - No significant depression. Scores 0-7 indicate minimal or no depressive symptoms.',
    hamdMild: 'Mild Depression - Scores 8-13 suggest mild depressive symptoms requiring monitoring.',
    hamdModerate: 'Moderate Depression - Scores 14-18 indicate moderate depression requiring treatment.',
    hamdSevere: 'Severe Depression - Scores 19-22 suggest severe depression requiring immediate intervention.',
    hamdVerySevere: 'Very Severe Depression - Scores ≥23 indicate very severe depression requiring urgent psychiatric care.',
    hamdNote: 'The HAM-D is a clinician-rated scale. Scores should be interpreted in the context of a comprehensive clinical assessment.',
    
    // PSS translations
    pssTitle: 'Perceived Stress Scale (PSS-10)',
    pssDescription: 'A 10-item self-report questionnaire measuring the perception of stress over the past month.',
    pssInstructions: 'For each question, indicate how often you have felt or thought a certain way during the last month.',
    pssResults: 'PSS-10 Assessment Results',
    pssLow: 'Low perceived stress. Scores 0-13 suggest you are managing stress well.',
    pssModerate: 'Moderate perceived stress. Scores 14-26 indicate a typical stress level that may benefit from stress management techniques.',
    pssHigh: 'High perceived stress. Scores 27-40 suggest significant stress that may benefit from professional support.',
    pssNote: 'The PSS is a self-report measure. Consider comprehensive clinical assessment for elevated scores.',
    
    // Physical Findings translations
    physicalFindingsTitle: 'Physical Findings Assessment',
    physicalFindingsDescription: 'Assessment of metabolic risk indicators including waist circumference and physical findings.',
    physicalFindingsResults: 'Physical Findings Results',
    metabolicRiskLevel: 'Metabolic Risk Level',
    riskLow: 'Low',
    riskModerate: 'Moderate', 
    riskHigh: 'High',
    noMetabolicRiskFactors: 'No metabolic risk factors identified.',
    riskFactorsIdentified: 'risk factor(s) identified',
    identifiedRiskFactors: 'Identified Risk Factors',
    assessmentDetails: 'Assessment Details',
    selectSex: 'Select Sex',
    male: 'Male',
    female: 'Female',
    waistCircumference: 'Waist Circumference',
    enterMeasurement: 'Enter measurement',
    waistThresholdInfo: 'Elevated threshold: >80cm for women, >90cm for men',
    abdominalObesity: 'Abdominal Obesity',
    abdominalObesityDescription: 'Central adiposity observed on physical examination',
    cervicalHump: 'Cervical Hump (Buffalo Hump)',
    cervicalHumpDescription: 'Dorsocervical fat pad accumulation at the base of the neck',
    notMeasured: 'Not measured',
    physicalFindingsNote: 'These findings may indicate metabolic syndrome, Cushing syndrome, or other endocrine disorders. Further workup recommended if risk factors present.',
    sex: 'Sex',

    // General translations
    progress: 'Progress',
    instructions: 'Instructions',
    submitAssessment: 'Submit Assessment',
    totalScore: 'Total Score',
    scoringGuide: 'Scoring Guide',
    note: 'Note',
    retakeAssessment: 'Retake Assessment'
  },
  ml: {
    // Assessment titles and labels
    'assessment.title': 'DAPHNE സ്കെയിൽ മൂല്യനിർണ്ണയം',
    'assessment.subtitle': 'ഫ്രണ്ടോടെമ്പറൽ ഡിമെൻഷ്യയുടെ പെരുമാറ്റ വേരിയന്റിന്റെ മൂല്യനിർണ്ണയത്തിനുള്ള പുതിയ ഉപകരണം',
    'assessment.badge': '൧൦ ഇനങ്ങൾ • ൬ ഡൊമെയിനുകൾ • ൫-പോയിന്റ് സ്കെയിൽ',
    'assessment.header': 'DAPHNE മൂല്യനിർണ്ണയം',
    'assessment.results.title': 'DAPHNE മൂല്യനിർണ്ണയ ഫലങ്ങൾ',
    
    // Form labels
    'form.patient.name': 'രോഗിയുടെ പേര് *',
    'form.patient.age': 'രോഗിയുടെ പ്രായം (ഓപ്ഷണൽ)',
    'form.assessor.name': 'മൂല്യനിർണ്ണയകന്റെ പേര് *',
    'form.patient.name.placeholder': 'രോഗിയുടെ പേര് നൽകുക',
    'form.patient.age.placeholder': 'രോഗിയുടെ പ്രായം നൽകുക',
    'form.assessor.name.placeholder': 'നിങ്ങളുടെ പേര് നൽകുക',
    'form.begin': 'മൂല്യനിർണ്ണയം ആരംഭിക്കുക',
    
    // Navigation
    'nav.previous': 'മുമ്പത്തേത്',
    'nav.next': 'അടുത്തത്',
    'nav.complete': 'മൂല്യനിർണ്ണയം പൂർത്തിയാക്കുക',
    'nav.patient': 'രോഗി',
    'nav.assessor': 'മൂല്യനിർണ്ണയകൻ',
    'nav.age': 'പ്രായം',
    
    // Scoring options
    'score.normal': 'സാധാരണം (0)',
    'score.very.mild': 'വളരെ കുറഞ്ഞ (1)',
    'score.mild': 'കുറഞ്ഞ (2)',
    'score.moderate': 'മധ്യമം (3)',
    'score.severe': 'ഗുരുതരം (4)',
    
    // Results
    'results.screening': 'DAPHNE-6 (സ്ക്രീനിംഗ്)',
    'results.diagnostic': 'DAPHNE-40 (രോഗനിർണയം)',
    'results.domain.analysis': 'ഡൊമെയിൻ വിശകലനം',
    'results.clinical.notes': 'ക്ലിനിക്കൽ കുറിപ്പുകൾ',
    'results.scoring.method': 'സ്കോറിംഗ് രീതി:',
    'results.assessment.domains': 'മൂল്യനിർണ്ണയ ഡൊമെയിനുകൾ:',
    'results.print': 'ഫലങ്ങൾ പ്രിന്റ് ചെയ്യുക',
    'results.new': 'പുതിയ മൂല്യനിർണ്ണയം',
    'results.present': 'ഉണ്ട്',
    'results.absent': 'ഇല്ല',
    'results.assessed.by': 'മൂല്യനിർണ്ണയകൻ',
    
    // Interpretations
    'interp.no.behavioral': 'പെരുമാറ്റ ലക്ഷണങ്ങൾ ഇല്ല',
    'interp.mild.behavioral': 'കുറഞ്ഞ പെരുമാറ്റ ലക്ഷണങ്ങൾ',
    'interp.moderate.behavioral': 'മധ്യമമായ പെരുമാറ്റ ലക്ഷണങ്ങൾ',
    'interp.severe.behavioral': 'ഗുരുതരമായ പെരുമാറ്റ ലക്ഷണങ്ങൾ',
    'interp.no.symptoms': 'ലക്ഷണങ്ങൾ ഇല്ല',
    'interp.mild.severity': 'കുറഞ്ഞ തീവ്രത',
    'interp.moderate.severity': 'മധ്യമ തീവ്രത',
    'interp.high.severity': 'ഉയർന്ന തീവ്രത',
    'interp.no.domains': 'ഡൊമെയിനുകൾ ബാധിച്ചിട്ടില്ല',
    'interp.domain.affected': 'ഡൊമെയിൻ ബാധിച്ചിട്ടുണ്ട്',
    'interp.domains.affected': 'ഡൊമെയിനുകൾ ബാധിച്ചിട്ടുണ്ട്',
    'interp.all.normal': 'എല്ലാ ഇനങ്ങളും സാധാരണയായി സ്കോർ ചെയ്തു',
    'interp.low.severity': 'മൊത്തത്തിലുള്ള കുറഞ്ഞ ലക്ഷണ തീവ്രത',
    'interp.moderate.overall': 'മൊത്തത്തിലുള്ള മധ്യമ ലക്ഷണ തീവ്രത',
    'interp.high.overall': 'മൊത്തത്തിലുള്ള ഉയർന്ന ലക്ഷണ തീവ്രത',
    
    // Domain names
    'domain.disinhibition': 'അനിയന്ത്രണം',
    'domain.apathy': 'നിസ്സംഗത',
    'domain.empathy': 'സഹാനുഭൂതി നഷ്ടം',
    'domain.perseverations': 'ആവർത്തനം',
    'domain.hyperorality': 'അമിത വായ്ക്കോളിത്തം',
    'domain.neglect': 'വ്യക്തിഗത അവഗണന',
    
    // Clinical notes
    'clinical.scoring.daphne6': 'DAPHNE-6 (സ്ക്രീനിംഗ്): ൬ ഡൊമെയിനുകളുടെ ബൈനറി സ്കോറിംഗ് (0-6 പരമാവധി). ഡൊമെയിനിൽ ഏതെങ്കിലും ലക്ഷണം ഉണ്ടെങ്കിൽ ൧ പോയിന്റ് സ്കോർ ചെയ്യുക.',
    'clinical.scoring.daphne40': 'DAPHNE-40 (രോഗനിർണയം): എല്ലാ ൧൦ ഇനങ്ങളുടെയും ആകെത്തുക (0-40 പരമാവധി). ഓരോ ഇനവും തീവ്രതയെ അടിസ്ഥാനമാക്കി 0-4 സ്കോർ ചെയ്യുന്നു.',
    'clinical.domains.description': 'DAPHNE സ്കെയിൽ റാസ്കോവ്സ്കിയുടെ മാനദണ്ഡങ്ങളെ അടിസ്ഥാനമാക്കി ആറ് പെരുമാറ്റ ഡൊമെയിനുകൾ പര്യവേക്ഷണം ചെയ്യുന്നു: അനിയന്ത്രണം, നിസ്സംഗത, ആവർത്തനം, അമിത വായ്ക്കോളിത്തം, വ്യക്തിഗത അവഗണന, സഹാനുഭൂതി നഷ്ടം.',
    'clinical.item': 'ഇനം',
    'clinical.items': 'ഇനങ്ങൾ',
    
    // MSI-BPD Malayalam translations
    msiBpdTitle: 'മക്ലീൻ സ്ക്രീനിംഗ് ഇൻസ്ട്രുമെന്റ് ഫോർ ബിപിഡി (MSI-BPD)',
    msiBpdDescription: 'ബോർഡർലൈൻ പേഴ്സണാലിറ്റി ഡിസോർഡറിനുള്ള 10-ഇനം സ്വയം-റിപ്പോർട്ട് സ്ക്രീനിംഗ് ടൂൾ. നിങ്ങളുടെ അനുഭവങ്ങളെ അടിസ്ഥാനമാക്കി അതെ അല്ലെങ്കിൽ ഇല്ല എന്ന് ഉത്തരം നൽകുക.',
    msiBpdInstructions: 'ഓരോ ചോദ്യത്തിനും അതെ (1 പോയിന്റ്) അല്ലെങ്കിൽ ഇല്ല (0 പോയിന്റ്) എന്ന് ഉത്തരം നൽകുക. 7 അല്ലെങ്കിൽ അതിൽ കൂടുതൽ സ്കോർ ബിപിഡി ലക്ഷണങ്ങൾ സൂചിപ്പിക്കുന്നു.',
    msiBpdResults: 'MSI-BPD ഫലങ്ങൾ',
    msiBpdNotConsistent: 'ലക്ഷണങ്ങൾ ബിപിഡിയുമായി പൊരുത്തപ്പെടുന്നില്ല. 0-4 സ്കോറുകൾ ബോർഡർലൈൻ പേഴ്സണാലിറ്റി സവിശേഷതകളുടെ കുറഞ്ഞ സാധ്യത സൂചിപ്പിക്കുന്നു.',
    msiBpdFurtherEval: 'കൂടുതൽ മൂല്യനിർണ്ണയം ശുപാർശ ചെയ്യുന്നു. 5-6 സ്കോറുകൾ ക്ലിനിക്കൽ അസെസ്മെന്റ് ആവശ്യമുള്ള സാധ്യമായ ബിപിഡി സവിശേഷതകൾ സൂചിപ്പിക്കുന്നു.',
    msiBpdAboveCutoff: 'ബിപിഡിക്കുള്ള ക്ലിനിക്കൽ കട്ട്ഓഫിനു മുകളിൽ. സ്കോർ ≥7 പ്രൊഫഷണൽ മൂല്യനിർണ്ണയം ആവശ്യമായ കാര്യമായ ബിപിഡി ലക്ഷണങ്ങൾ സൂചിപ്പിക്കുന്നു.',
    msiBpdNote: 'ഇത് ഒരു സ്ക്രീനിംഗ് ടൂൾ മാത്രമാണ്. പോസിറ്റീവ് ഫലം രോഗനിർണയം സ്ഥിരീകരിക്കുന്നില്ല, സമഗ്ര ക്ലിനിക്കൽ മൂല്യനിർണ്ണയം പിന്തുടരണം.',
    yes: 'അതെ',
    no: 'ഇല്ല',
    
    // HAM-D Malayalam translations
    hamdTitle: 'ഹാമിൽട്ടൺ ഡിപ്രഷൻ റേറ്റിംഗ് സ്കെയിൽ (HAM-D)',
    hamdDescription: 'വിഷാദത്തിന്റെ തീവ്രത അളക്കുന്നതിനുള്ള 17-ഇനം ക്ലിനിഷ്യൻ-നിർവഹിച്ച അസെസ്മെന്റ് ടൂൾ.',
    hamdInstructions: 'കഴിഞ്ഞ ആഴ്ചയിലെ രോഗിയുടെ അവസ്ഥയെ അടിസ്ഥാനമാക്കി ഓരോ ഇനവും റേറ്റ് ചെയ്യുക. രോഗിയുടെ അവസ്ഥയെ ഏറ്റവും നന്നായി വിവരിക്കുന്ന ഓപ്ഷൻ തിരഞ്ഞെടുക്കുക.',
    hamdResults: 'HAM-D അസെസ്മെന്റ് ഫലങ്ങൾ',
    hamdNormal: 'സാധാരണം - കാര്യമായ വിഷാദമില്ല. 0-7 സ്കോറുകൾ ഏറ്റവും കുറഞ്ഞതോ അല്ലെങ്കിൽ വിഷാദ ലക്ഷണങ്ങൾ ഇല്ലാത്തതോ സൂചിപ്പിക്കുന്നു.',
    hamdMild: 'കുറഞ്ഞ വിഷാദം - 8-13 സ്കോറുകൾ നിരീക്ഷണം ആവശ്യമായ കുറഞ്ഞ വിഷാദ ലക്ഷണങ്ങൾ സൂചിപ്പിക്കുന്നു.',
    hamdModerate: 'മധ്യമ വിഷാദം - 14-18 സ്കോറുകൾ ചികിത്സ ആവശ്യമായ മധ്യമ വിഷാദം സൂചിപ്പിക്കുന്നു.',
    hamdSevere: 'കഠിനമായ വിഷാദം - 19-22 സ്കോറുകൾ ഉടനടി ഇടപെടൽ ആവശ്യമായ കഠിനമായ വിഷാദം സൂചിപ്പിക്കുന്നു.',
    hamdVerySevere: 'വളരെ കഠിനമായ വിഷാദം - സ്കോറുകൾ ≥23 അടിയന്തിര മാനസിക പരിചരണം ആവശ്യമായ വളരെ കഠിനമായ വിഷാദം സൂചിപ്പിക്കുന്നു.',
    hamdNote: 'HAM-D ഒരു ക്ലിനിഷ്യൻ-റേറ്റഡ് സ്കെയിൽ ആണ്. സ്കോറുകൾ സമഗ്ര ക്ലിനിക്കൽ അസെസ്മെന്റിന്റെ സന്ദർഭത്തിൽ വ്യാഖ്യാനിക്കണം.',
    
    // PSS Malayalam translations
    pssTitle: 'പെർസീവ്ഡ് സ്ട്രെസ് സ്കെയിൽ (PSS-10)',
    pssDescription: 'കഴിഞ്ഞ മാസത്തിലെ സമ്മർദ്ദത്തിന്റെ ധാരണ അളക്കുന്ന 10-ഇനം സ്വയം-റിപ്പോർട്ട് ചോദ്യാവലി.',
    pssInstructions: 'ഓരോ ചോദ്യത്തിനും, കഴിഞ്ഞ മാസത്തിൽ നിങ്ങൾക്ക് എത്ര തവണ ഒരു പ്രത്യേക രീതിയിൽ തോന്നിയോ അല്ലെങ്കിൽ ചിന്തിച്ചോ എന്ന് സൂചിപ്പിക്കുക.',
    pssResults: 'PSS-10 അസെസ്മെന്റ് ഫലങ്ങൾ',
    pssLow: 'കുറഞ്ഞ സമ്മർദ്ദ ധാരണ. 0-13 സ്കോറുകൾ നിങ്ങൾ സമ്മർദ്ദം നന്നായി കൈകാര്യം ചെയ്യുന്നുണ്ടെന്ന് സൂചിപ്പിക്കുന്നു.',
    pssModerate: 'മധ്യമ സമ്മർദ്ദ ധാരണ. 14-26 സ്കോറുകൾ സമ്മർദ്ദ മാനേജ്മെന്റ് ടെക്നിക്കുകൾ പ്രയോജനപ്പെടുത്താവുന്ന സാധാരണ സമ്മർദ്ദ നിലയെ സൂചിപ്പിക്കുന്നു.',
    pssHigh: 'ഉയർന്ന സമ്മർദ്ദ ധാരണ. 27-40 സ്കോറുകൾ പ്രൊഫഷണൽ പിന്തുണയിൽ നിന്ന് പ്രയോജനം നേടാവുന്ന കാര്യമായ സമ്മർദ്ദം സൂചിപ്പിക്കുന്നു.',
    pssNote: 'PSS ഒരു സ്വയം-റിപ്പോർട്ട് അളവുകോലാണ്. ഉയർന്ന സ്കോറുകൾക്ക് സമഗ്ര ക്ലിനിക്കൽ അസെസ്മെന്റ് പരിഗണിക്കുക.',
    
    // Physical Findings Malayalam translations
    physicalFindingsTitle: 'ശാരീരിക കണ്ടെത്തലുകൾ അസെസ്മെന്റ്',
    physicalFindingsDescription: 'അരക്കെട്ട് ചുറ്റളവും ശാരീരിക കണ്ടെത്തലുകളും ഉൾപ്പെടെ ഉപാപചയ അപകട സൂചകങ്ങളുടെ അസെസ്മെന്റ്.',
    physicalFindingsResults: 'ശാരീരിക കണ്ടെത്തലുകൾ ഫലങ്ങൾ',
    metabolicRiskLevel: 'ഉപാപചയ അപകട നില',
    riskLow: 'കുറഞ്ഞ',
    riskModerate: 'മധ്യമ',
    riskHigh: 'ഉയർന്ന',
    noMetabolicRiskFactors: 'ഉപാപചയ അപകട ഘടകങ്ങളൊന്നും കണ്ടെത്തിയില്ല.',
    riskFactorsIdentified: 'അപകട ഘടകം(ങ്ങൾ) തിരിച്ചറിഞ്ഞു',
    identifiedRiskFactors: 'തിരിച്ചറിഞ്ഞ അപകട ഘടകങ്ങൾ',
    assessmentDetails: 'അസെസ്മെന്റ് വിശദാംശങ്ങൾ',
    selectSex: 'ലിംഗം തിരഞ്ഞെടുക്കുക',
    male: 'പുരുഷൻ',
    female: 'സ്ത്രീ',
    waistCircumference: 'അരക്കെട്ട് ചുറ്റളവ്',
    enterMeasurement: 'അളവ് നൽകുക',
    waistThresholdInfo: 'ഉയർന്ന പരിധി: സ്ത്രീകൾക്ക് >80cm, പുരുഷന്മാർക്ക് >90cm',
    abdominalObesity: 'വയറ്റിലെ അമിതഭാരം',
    abdominalObesityDescription: 'ശാരീരിക പരിശോധനയിൽ നിരീക്ഷിച്ച കേന്ദ്ര അഡിപ്പോസിറ്റി',
    cervicalHump: 'കഴുത്തിലെ മുഴ (ബഫലോ ഹമ്പ്)',
    cervicalHumpDescription: 'കഴുത്തിന്റെ അടിഭാഗത്ത് ഡോർസോസെർവിക്കൽ ഫാറ്റ് പാഡ് ശേഖരണം',
    notMeasured: 'അളന്നിട്ടില്ല',
    physicalFindingsNote: 'ഈ കണ്ടെത്തലുകൾ മെറ്റബോളിക് സിൻഡ്രോം, കുഷിംഗ് സിൻഡ്രോം അല്ലെങ്കിൽ മറ്റ് എൻഡോക്രൈൻ വൈകല്യങ്ങൾ സൂചിപ്പിക്കാം. അപകട ഘടകങ്ങൾ ഉണ്ടെങ്കിൽ കൂടുതൽ പരിശോധന ശുപാർശ ചെയ്യുന്നു.',
    sex: 'ലിംഗം',

    // General Malayalam translations
    progress: 'പുരോഗതി',
    instructions: 'നിർദ്ദേശങ്ങൾ',
    submitAssessment: 'അസെസ്മെന്റ് സമർപ്പിക്കുക',
    totalScore: 'മൊത്തം സ്കോർ',
    scoringGuide: 'സ്കോറിംഗ് ഗൈഡ്',
    note: 'കുറിപ്പ്',
    retakeAssessment: 'വീണ്ടും അസെസ്മെന്റ് ചെയ്യുക'
  }
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  // Add a safety check to ensure React hooks work correctly
  useEffect(() => {
    console.log('LanguageProvider mounted');
  }, []);

  const toggleLanguage = () => {
    setLanguage(prev => {
      const idx = LANGUAGES.findIndex(l => l.code === prev);
      return LANGUAGES[(idx + 1) % LANGUAGES.length].code;
    });
  };

  const t = (key: string): string => {
    const dict = translations[language] as Record<string, string>;
    return dict[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
