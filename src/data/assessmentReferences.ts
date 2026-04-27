// Classic / original-publication citations for every assessment in the app.
// Keep these short (one-line citation), authoritative, and stable.

export interface AssessmentReference {
  /** Original / classic publication */
  citation: string;
  /** Optional permalink (DOI, PubMed, official PDF) */
  url?: string;
  /** Short note: what the scale was designed for */
  note?: string;
}

export const ASSESSMENT_REFERENCES: Record<string, AssessmentReference> = {
  daphne: {
    citation:
      'Boutoleau-Bretonnière C, Evrard C, Hardouin JB, et al. DAPHNE: a new tool for the assessment of the behavioral variant of frontotemporal dementia. Dement Geriatr Cogn Dis Extra. 2015;5(3):503–516.',
    url: 'https://doi.org/10.1159/000440859',
  },
  minicog: {
    citation:
      'Borson S, Scanlan J, Brush M, Vitaliano P, Dokmak A. The Mini-Cog: a cognitive "vital signs" measure for dementia screening in multi-lingual elderly. Int J Geriatr Psychiatry. 2000;15(11):1021–1027.',
    url: 'https://doi.org/10.1002/1099-1166(200011)15:11%3C1021::AID-GPS234%3E3.0.CO;2-6',
  },
  miniace: {
    citation:
      "Hsieh S, McGrory S, Leslie F, et al. The Mini-Addenbrooke's Cognitive Examination: a new assessment tool for dementia. Dement Geriatr Cogn Disord. 2015;39(1-2):1–11.",
    url: 'https://doi.org/10.1159/000366040',
  },
  fab: {
    citation:
      'Dubois B, Slachevsky A, Litvan I, Pillon B. The FAB: a Frontal Assessment Battery at bedside. Neurology. 2000;55(11):1621–1626.',
    url: 'https://doi.org/10.1212/wnl.55.11.1621',
  },
  cognitiveSyndromes: {
    citation:
      'Compiled from: Cummings JL & Mega MS. Neuropsychiatry and Behavioral Neuroscience. Oxford University Press; 2003. Includes classic eponymous syndromes (Capgras 1923; Cotard 1880; Othello — Shakespeare/Todd & Dewhurst 1955; Charles Bonnet 1760).',
  },
  tulia: {
    citation:
      'Vanbellingen T, Kersten B, Van Hemelrijk B, et al. Comprehensive assessment of gesture production: a new test of upper limb apraxia (TULIA). Eur J Neurol. 2010;17(1):59–66.',
    url: 'https://doi.org/10.1111/j.1468-1331.2009.02741.x',
  },
  hamd: {
    citation:
      'Hamilton M. A rating scale for depression. J Neurol Neurosurg Psychiatry. 1960;23(1):56–62.',
    url: 'https://doi.org/10.1136/jnnp.23.1.56',
  },
  pss: {
    citation:
      'Cohen S, Kamarck T, Mermelstein R. A global measure of perceived stress. J Health Soc Behav. 1983;24(4):385–396.',
    url: 'https://doi.org/10.2307/2136404',
  },
  pcl5: {
    citation:
      'Weathers FW, Litz BT, Keane TM, Palmieri PA, Marx BP, Schnurr PP. The PTSD Checklist for DSM-5 (PCL-5). National Center for PTSD; 2013.',
    url: 'https://www.ptsd.va.gov/professional/assessment/adult-sr/ptsd-checklist.asp',
  },
  dpdr: {
    citation:
      'Sierra M, Berrios GE. The Cambridge Depersonalisation Scale. Psychiatry Res. 2000;93(2):153–164. Bernstein EM, Putnam FW. Development, reliability, and validity of a dissociation scale. J Nerv Ment Dis. 1986;174(12):727–735. Carlson EB, Putnam FW. Dissociative Experiences Scale-II. 1993.',
    url: 'https://doi.org/10.1016/s0165-1781(00)00100-1',
  },
  stressScreening: {
    citation:
      'Adapted from DSM-5-TR criteria distinguishing adjustment disorder, acute stress disorder, and PTSD (American Psychiatric Association, 2022).',
  },
  adam: {
    citation:
      'Morley JE, Charlton E, Patrick P, et al. Validation of a screening questionnaire for androgen deficiency in aging males (ADAM). Metabolism. 2000;49(9):1239–1242.',
    url: 'https://doi.org/10.1053/meta.2000.8625',
  },
  hare: {
    citation:
      'Hare RD. The Hare Psychopathy Checklist–Revised (PCL-R). 2nd ed. Toronto: Multi-Health Systems; 2003. (Original: Hare 1991.)',
  },
  adhd: {
    citation:
      'Kessler RC, Adler L, Ames M, et al. The World Health Organization Adult ADHD Self-Report Scale (ASRS): a short screening scale for use in the general population. Psychol Med. 2005;35(2):245–256.',
    url: 'https://doi.org/10.1017/s0033291704002892',
  },
  msibpd: {
    citation:
      'Zanarini MC, Vujanovic AA, Parachini EA, Boulanger JL, Frankenburg FR, Hennen J. A screening measure for BPD: the McLean Screening Instrument for Borderline Personality Disorder (MSI-BPD). J Pers Disord. 2003;17(6):568–573.',
    url: 'https://doi.org/10.1521/pedi.17.6.568.25355',
  },
  mmpi: {
    citation:
      'Hathaway SR, McKinley JC. Minnesota Multiphasic Personality Inventory. Minneapolis: University of Minnesota Press; 1943. (Brief OPD screener adapted for somatization.)',
  },
  delusions: {
    citation:
      'Kendler KS, Glazer WM, Morgenstern H. Dimensions of delusional experience. Am J Psychiatry. 1983;140(4):466–469. Hallucination contexts adapted from Manford & Andermann, Brain. 1998;121(10):1819–1840.',
    url: 'https://doi.org/10.1176/ajp.140.4.466',
  },
  dementia: {
    citation:
      'McKhann GM, Knopman DS, Chertkow H, et al. The diagnosis of dementia due to Alzheimer\'s disease: NIA-AA workgroup. Alzheimers Dement. 2011;7(3):263–269. BEHAV5+ adapted from de Medeiros K, et al. Int Psychogeriatr. 2010;22(6):984–994.',
    url: 'https://doi.org/10.1016/j.jalz.2011.03.005',
  },
  catatoniaBfcrs: {
    citation:
      'Bush G, Fink M, Petrides G, Dowling F, Francis A. Catatonia. I. Rating scale and standardized examination (BFCRS). Acta Psychiatr Scand. 1996;93(2):129–136.',
    url: 'https://doi.org/10.1111/j.1600-0447.1996.tb09814.x',
  },
  catatoniaDsm5: {
    citation:
      'American Psychiatric Association. Diagnostic and Statistical Manual of Mental Disorders, 5th ed., text revision (DSM-5-TR). Catatonia (293.89). Washington, DC: APA; 2022.',
  },
  catatonia: {
    citation:
      'Bush G, Fink M, Petrides G, Dowling F, Francis A. Catatonia. I. Rating scale and standardized examination. Acta Psychiatr Scand. 1996;93(2):129–136. Diagnostic criteria: DSM-5-TR (APA, 2022).',
    url: 'https://doi.org/10.1111/j.1600-0447.1996.tb09814.x',
  },
  nms: {
    citation:
      'Sachdev PS. A rating scale for neuroleptic malignant syndrome. Psychiatry Res. 2005;135(3):249–256.',
    url: 'https://doi.org/10.1016/j.psychres.2005.05.003',
  },
  hunter: {
    citation:
      'Dunkley EJC, Isbister GK, Sibbritt D, Dawson AH, Whyte IM. The Hunter Serotonin Toxicity Criteria: simple and accurate diagnostic decision rules for serotonin toxicity. QJM. 2003;96(9):635–642.',
    url: 'https://doi.org/10.1093/qjmed/hcg109',
  },
  smarts: {
    citation:
      'Weiden PJ, Miller AL, Lambert TJR, Chant D, Williams S, Citrome L, et al. The Systematic Monitoring of Adverse events Related to TreatmentS (SMARTS) checklist. World Psychiatry. 2010;9(2):124–125. (See PMC3896136 for application notes.)',
    url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3896136/',
  },
  fallRisk: {
    citation:
      'Centers for Disease Control and Prevention. STEADI algorithm. Atlanta: CDC; 2017. Morse JE. Preventing Patient Falls. 2nd ed. Springer; 2009. Stapleton C, Hough P, Oldmeadow L, et al. Four-item Fall Risk Screening Tool (FRAT). Australas J Ageing. 2009;28(3):139–143. Clinical update: BMJ 2025;392:s223.',
    url: 'https://www.cdc.gov/steadi/',
  },
  adverseEffects: {
    citation:
      "Stahl SM. Stahl's Essential Psychopharmacology: Neuroscientific Basis and Practical Applications. 5th ed. Cambridge University Press; 2021. Taylor DM, Barnes TRE, Young AH. The Maudsley Prescribing Guidelines in Psychiatry. 14th ed. Wiley-Blackwell; 2021.",
  },
  ciwaAr: {
    citation:
      'Sullivan JT, Sykora K, Schneiderman J, Naranjo CA, Sellers EM. Assessment of alcohol withdrawal: the revised Clinical Institute Withdrawal Assessment for Alcohol scale (CIWA-Ar). Br J Addict. 1989;84(11):1353–1357.',
    url: 'https://doi.org/10.1111/j.1360-0443.1989.tb00737.x',
  },
  sds: {
    citation:
      'Gossop M, Darke S, Griffiths P, Hando J, Powis B, Hall W, Strang J. The Severity of Dependence Scale (SDS): psychometric properties of the SDS in English and Australian samples of heroin, cocaine and amphetamine users. Addiction. 1995;90(5):607–614.',
    url: 'https://doi.org/10.1046/j.1360-0443.1995.9056072.x',
  },
  iqcode: {
    citation:
      'Jorm AF. A short form of the Informant Questionnaire on Cognitive Decline in the Elderly (IQCODE): development and cross-validation. Psychol Med. 1994;24(1):145–153.',
    url: 'https://doi.org/10.1017/s003329170002691x',
  },
  bdi: {
    citation:
      'Beck AT, Steer RA, Brown GK. Manual for the Beck Depression Inventory–II. San Antonio, TX: Psychological Corporation; 1996.',
    url: 'https://doi.org/10.1037/t00742-000',
  },
  ybocs: {
    citation:
      'Goodman WK, Price LH, Rasmussen SA, et al. The Yale-Brown Obsessive Compulsive Scale. I. Development, use, and reliability. Arch Gen Psychiatry. 1989;46(11):1006–1011.',
    url: 'https://doi.org/10.1001/archpsyc.1989.01810110048007',
  },
  ipde: {
    citation:
      'Loranger AW, Sartorius N, Andreoli A, et al. The International Personality Disorder Examination (IPDE): the WHO/ADAMHA international pilot study of personality disorders. Arch Gen Psychiatry. 1994;51(3):215–224.',
    url: 'https://doi.org/10.1001/archpsyc.1994.03950030051005',
  },
  cage: {
    citation:
      'Ewing JA. Detecting alcoholism: the CAGE questionnaire. JAMA. 1984;252(14):1905–1907.',
    url: 'https://doi.org/10.1001/jama.1984.03350140051025',
  },
  cows: {
    citation:
      'Wesson DR, Ling W. The Clinical Opiate Withdrawal Scale (COWS). J Psychoactive Drugs. 2003;35(2):253–259.',
    url: 'https://doi.org/10.1080/02791072.2003.10400007',
  },
  simpsonAngus: {
    citation:
      'Simpson GM, Angus JWS. A rating scale for extrapyramidal side effects. Acta Psychiatr Scand Suppl. 1970;212:11–19.',
    url: 'https://doi.org/10.1111/j.1600-0447.1970.tb02066.x',
  },
  eprs: {
    citation:
      'Chouinard G, Margolese HC. Manual for the Extrapyramidal Symptom Rating Scale (ESRS). Schizophr Res. 2005;76(2-3):247–265.',
    url: 'https://doi.org/10.1016/j.schres.2005.02.013',
  },
  panss: {
    citation:
      'Kay SR, Fiszbein A, Opler LA. The Positive and Negative Syndrome Scale (PANSS) for schizophrenia. Schizophr Bull. 1987;13(2):261–276.',
    url: 'https://doi.org/10.1093/schbul/13.2.261',
  },
  moca: {
    citation:
      'Nasreddine ZS, Phillips NA, Bédirian V, et al. The Montreal Cognitive Assessment, MoCA: a brief screening tool for mild cognitive impairment. J Am Geriatr Soc. 2005;53(4):695–699.',
    url: 'https://doi.org/10.1111/j.1532-5415.2005.53221.x',
  },
  callosal: {
    citation:
      'Sperry RW. Cerebral organization and behavior. Science. 1961;133(3466):1749–1757. Gazzaniga MS, Bogen JE, Sperry RW. Observations on visual perception after disconnexion of the cerebral hemispheres in man. Brain. 1965;88(2):221–236.',
    url: 'https://doi.org/10.1126/science.133.3466.1749',
  },
  mse: {
    citation:
      'Trzepacz PT, Baker RW. The Psychiatric Mental Status Examination. Oxford University Press; 1993. Strub RL, Black FW. The Mental Status Examination in Neurology. 4th ed. F.A. Davis; 2000.',
  },
  consciousness: {
    citation:
      'Teasdale G, Jennett B. Assessment of coma and impaired consciousness. Lancet. 1974;2(7872):81–84. Wijdicks EFM, Bamlet WR, Maramattom BV, Manno EM, McClelland RL. Validation of a new coma scale: The FOUR score. Ann Neurol. 2005;58(4):585–593. Sessler CN, Gosnell MS, Grap MJ, et al. The Richmond Agitation-Sedation Scale. Am J Respir Crit Care Med. 2002;166(10):1338–1344.',
    url: 'https://doi.org/10.1016/S0140-6736(74)91639-0',
  },
  substance: {
    citation:
      'Sullivan JT, Sykora K, Schneiderman J, Naranjo CA, Sellers EM. CIWA-Ar. Br J Addict. 1989;84(11):1353–1357. Gossop M, Darke S, Griffiths P, et al. Severity of Dependence Scale. Addiction. 1995;90(5):607–614.',
    url: 'https://doi.org/10.1111/j.1360-0443.1989.tb00737.x',
  },
  bprs: {
    citation:
      'Overall JE, Gorham DR. The Brief Psychiatric Rating Scale. Psychol Rep. 1962;10(3):799–812.',
    url: 'https://doi.org/10.2466/pr0.1962.10.3.799',
  },
  sapsSans: {
    citation:
      'Andreasen NC. The Scale for the Assessment of Negative Symptoms (SANS) and the Scale for the Assessment of Positive Symptoms (SAPS). University of Iowa; 1983–1984.',
  },
  crdpss: {
    citation:
      'American Psychiatric Association. Clinician-Rated Dimensions of Psychosis Symptom Severity. DSM-5 Section III Assessment Measures; 2013.',
    url: 'https://www.psychiatry.org/psychiatrists/practice/dsm/educational-resources/assessment-measures',
  },
  sops: {
    citation:
      'Miller TJ, McGlashan TH, Rosen JL, et al. Prodromal assessment with the SIPS and SOPS: predictive validity, interrater reliability, and training to reliability. Schizophr Bull. 2003;29(4):703–715.',
    url: 'https://doi.org/10.1093/oxfordjournals.schbul.a007040',
  },
  psyrats: {
    citation:
      'Haddock G, McCarron J, Tarrier N, Faragher EB. Scales to measure dimensions of hallucinations and delusions: the PSYRATS. Psychol Med. 1999;29(4):879–889.',
    url: 'https://doi.org/10.1017/s0033291799008661',
  },
  vagus: {
    citation:
      'Gerretsen P, Remington G, Borlido C, et al. The VAGUS Insight into Psychosis Scale—self-report and clinician-rated versions. Psychiatry Res. 2014;220(3):1010–1015.',
    url: 'https://doi.org/10.1016/j.psychres.2014.08.005',
  },
  adhdScreener: {
    citation:
      'Kessler RC, Adler L, Ames M, et al. WHO Adult ADHD Self-Report Scale (ASRS). Psychol Med. 2005;35(2):245–256. Wolraich ML, Feurer ID, Hannah JN, et al. Vanderbilt ADHD Diagnostic Parent Rating Scale. Pediatrics. 2003;112(6):1594–1604.',
    url: 'https://doi.org/10.1017/s0033291704002892',
  },
  asrs6: {
    citation:
      'Kessler RC, Adler L, Ames M, et al. The World Health Organization Adult ADHD Self-Report Scale (ASRS): a short screening scale. Psychol Med. 2005;35(2):245–256.',
    url: 'https://doi.org/10.1017/s0033291704002892',
  },
  asrs18: {
    citation:
      'Kessler RC, Adler LA, Gruber MJ, Sarawate CA, Spencer T, Van Brunt DL. Validity of the World Health Organization Adult ADHD Self-Report Scale (ASRS). Int J Methods Psychiatr Res. 2007;16(2):52–65.',
    url: 'https://doi.org/10.1002/mpr.208',
  },
  vanderbilt: {
    citation:
      'Wolraich ML, Feurer ID, Hannah JN, Baumgaertel A, Pinnock TY. Obtaining systematic teacher reports of disruptive behavior disorders utilizing DSM-IV. J Abnorm Child Psychol. 1998;26(2):141–152. NICHQ Vanderbilt Assessment Scales.',
    url: 'https://nichq.org/downloadable/nichq-vanderbilt-assessment-scales/',
  },
};

export const getReference = (key: string): AssessmentReference | undefined =>
  ASSESSMENT_REFERENCES[key];
