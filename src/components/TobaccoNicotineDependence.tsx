import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Cigarette, RefreshCw } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { ExportButtons } from './ExportButtons';
import type { ReportData } from '@/utils/reportGenerator';

type Bilingual = { en: string; ml: string };
type Option = { value: number; en: string; ml: string };

interface NicotineItem {
  id: string;
  question: Bilingual;
  options: Option[];
}

interface NicotineTab {
  key: 'ftnd' | 'hsi' | 'ftndst' | 'psecdi' | 'honc';
  label: string;
  title: Bilingual;
  subtitle: Bilingual;
  maxScore: number | null; // null = count-based (yes/no)
  items: NicotineItem[];
  cutoffNote: Bilingual;
  interpret: (total: number) => { en: string; ml: string; tone: 'secondary' | 'default' | 'destructive' };
}

// ─── FTND — Fagerström Test for Nicotine Dependence (6 items, 0–10) ────
const TIME_TO_FIRST_OPTIONS: Option[] = [
  { value: 3, en: 'Within 5 minutes', ml: '5 മിനിറ്റിനുള്ളിൽ' },
  { value: 2, en: '6–30 minutes', ml: '6–30 മിനിറ്റ്' },
  { value: 1, en: '31–60 minutes', ml: '31–60 മിനിറ്റ്' },
  { value: 0, en: 'After 60 minutes', ml: '60 മിനിറ്റിനുശേഷം' },
];

const FTND_ITEMS: NicotineItem[] = [
  {
    id: 'ttfc',
    question: {
      en: 'How soon after you wake up do you smoke your first cigarette?',
      ml: 'ഉണർന്നതിനുശേഷം എത്ര വേഗം ആദ്യ സിഗരറ്റ് വലിക്കുന്നു?',
    },
    options: TIME_TO_FIRST_OPTIONS,
  },
  {
    id: 'forbidden',
    question: {
      en: 'Do you find it difficult to refrain from smoking in places where it is forbidden?',
      ml: 'വിലക്കുള്ള സ്ഥലങ്ങളിൽ പുകവലി ഒഴിവാക്കാൻ ബുദ്ധിമുട്ടാണോ?',
    },
    options: [
      { value: 1, en: 'Yes', ml: 'അതെ' },
      { value: 0, en: 'No', ml: 'ഇല്ല' },
    ],
  },
  {
    id: 'firstmorning',
    question: {
      en: 'Do you smoke more frequently during the first hours after waking than during the rest of the day?',
      ml: 'ഉണർന്നതിനുശേഷമുള്ള ആദ്യ മണിക്കൂറുകളിൽ ബാക്കി ദിവസത്തേക്കാൾ കൂടുതൽ വലിക്കുന്നുണ്ടോ?',
    },
    options: [
      { value: 1, en: 'Yes', ml: 'അതെ' },
      { value: 0, en: 'No', ml: 'ഇല്ല' },
    ],
  },
  {
    id: 'cpd',
    question: {
      en: 'How many cigarettes per day do you smoke?',
      ml: 'ഒരു ദിവസം എത്ര സിഗരറ്റ് വലിക്കുന്നു?',
    },
    options: [
      { value: 0, en: '10 or fewer', ml: '10 അല്ലെങ്കിൽ കുറവ്' },
      { value: 1, en: '11–20', ml: '11–20' },
      { value: 2, en: '21–30', ml: '21–30' },
      { value: 3, en: '31 or more', ml: '31 അല്ലെങ്കിൽ കൂടുതൽ' },
    ],
  },
  {
    id: 'morningfirst',
    question: {
      en: 'Do you smoke more in the morning than during the rest of the day?',
      ml: 'രാവിലെ ബാക്കി ദിവസത്തേക്കാൾ കൂടുതൽ വലിക്കുന്നുണ്ടോ?',
    },
    options: [
      { value: 1, en: 'Yes', ml: 'അതെ' },
      { value: 0, en: 'No', ml: 'ഇല്ല' },
    ],
  },
  {
    id: 'sick',
    question: {
      en: 'Do you smoke even if you are so ill that you are in bed most of the day?',
      ml: 'ദിവസം മുഴുവൻ കിടക്കയിലായിരിക്കുന്ന അസുഖമുള്ളപ്പോഴും വലിക്കുന്നുണ്ടോ?',
    },
    options: [
      { value: 1, en: 'Yes', ml: 'അതെ' },
      { value: 0, en: 'No', ml: 'ഇല്ല' },
    ],
  },
];

const ftndInterpret = (total: number) => {
  if (total <= 2) return { en: 'Very low dependence', ml: 'വളരെ കുറഞ്ഞ ആശ്രിതത്വം', tone: 'secondary' as const };
  if (total <= 4) return { en: 'Low dependence', ml: 'കുറഞ്ഞ ആശ്രിതത്വം', tone: 'secondary' as const };
  if (total === 5) return { en: 'Moderate dependence', ml: 'ഇടത്തരം ആശ്രിതത്വം', tone: 'default' as const };
  if (total <= 7) return { en: 'High dependence', ml: 'ഉയർന്ന ആശ്രിതത്വം', tone: 'destructive' as const };
  return { en: 'Very high dependence', ml: 'വളരെ ഉയർന്ന ആശ്രിതത്വം', tone: 'destructive' as const };
};

// ─── HSI — Heaviness of Smoking Index (2 FTND items, 0–6) ──────────────
const HSI_ITEMS: NicotineItem[] = [
  {
    id: 'hsi-ttfc',
    question: {
      en: 'How soon after you wake up do you smoke your first cigarette?',
      ml: 'ഉണർന്നതിനുശേഷം എത്ര വേഗം ആദ്യ സിഗരറ്റ് വലിക്കുന്നു?',
    },
    options: [
      { value: 3, en: 'Within 5 minutes', ml: '5 മിനിറ്റിനുള്ളിൽ' },
      { value: 2, en: '6–30 minutes', ml: '6–30 മിനിറ്റ്' },
      { value: 1, en: '31–60 minutes', ml: '31–60 മിനിറ്റ്' },
      { value: 0, en: 'After 60 minutes', ml: '60 മിനിറ്റിനുശേഷം' },
    ],
  },
  {
    id: 'hsi-cpd',
    question: {
      en: 'How many cigarettes per day do you smoke?',
      ml: 'ഒരു ദിവസം എത്ര സിഗരറ്റ് വലിക്കുന്നു?',
    },
    options: [
      { value: 0, en: '10 or fewer', ml: '10 അല്ലെങ്കിൽ കുറവ്' },
      { value: 1, en: '11–20', ml: '11–20' },
      { value: 2, en: '21–30', ml: '21–30' },
      { value: 3, en: '31 or more', ml: '31 അല്ലെങ്കിൽ കൂടുതൽ' },
    ],
  },
];

const hsiInterpret = (total: number) => {
  if (total <= 1) return { en: 'Low dependence', ml: 'കുറഞ്ഞ ആശ്രിതത്വം', tone: 'secondary' as const };
  if (total <= 3) return { en: 'Moderate dependence', ml: 'ഇടത്തരം ആശ്രിതത്വം', tone: 'default' as const };
  return { en: 'High dependence (score ≥4)', ml: 'ഉയർന്ന ആശ്രിതത്വം (സ്കോർ ≥4)', tone: 'destructive' as const };
};

// ─── FTND-ST — Fagerström for Smokeless Tobacco (6 items, 0–10) ────────
const FTNDST_ITEMS: NicotineItem[] = [
  {
    id: 'st-ttfc',
    question: {
      en: 'How soon after you wake up do you use your first smokeless tobacco?',
      ml: 'ഉണർന്നതിനുശേഷം എത്ര വേഗം ആദ്യ പുകയില ഉപയോഗിക്കുന്നു?',
    },
    options: TIME_TO_FIRST_OPTIONS,
  },
  {
    id: 'st-forbidden',
    question: {
      en: 'Do you find it difficult to refrain from using smokeless tobacco where it is forbidden?',
      ml: 'വിലക്കുള്ള സ്ഥലങ്ങളിൽ പുകയില ഉപയോഗം ഒഴിവാക്കാൻ ബുദ്ധിമുട്ടാണോ?',
    },
    options: [
      { value: 1, en: 'Yes', ml: 'അതെ' },
      { value: 0, en: 'No', ml: 'ഇല്ല' },
    ],
  },
  {
    id: 'st-firstmorning',
    question: {
      en: 'Do you use smokeless tobacco more frequently in the first hours after waking?',
      ml: 'ഉണർന്നതിനുശേഷമുള്ള ആദ്യ മണിക്കൂറുകളിൽ കൂടുതൽ ഉപയോഗിക്കുന്നുണ്ടോ?',
    },
    options: [
      { value: 1, en: 'Yes', ml: 'അതെ' },
      { value: 0, en: 'No', ml: 'ഇല്ല' },
    ],
  },
  {
    id: 'st-cans',
    question: {
      en: 'How many tins/cans of smokeless tobacco do you use per week?',
      ml: 'ആഴ്ചയിൽ എത്ര ഡിബ്ബ/പാക്കറ്റ് പുകയില ഉപയോഗിക്കുന്നു?',
    },
    options: [
      { value: 0, en: '10 or fewer', ml: '10 അല്ലെങ്കിൽ കുറവ്' },
      { value: 1, en: '11–20', ml: '11–20' },
      { value: 2, en: '21–30', ml: '21–30' },
      { value: 3, en: '31 or more', ml: '31 അല്ലെങ്കിൽ കൂടുതൽ' },
    ],
  },
  {
    id: 'st-morningfirst',
    question: {
      en: 'Do you use smokeless tobacco more in the morning than during the rest of the day?',
      ml: 'രാവിലെ ബാക്കി ദിവസത്തേക്കാൾ കൂടുതൽ ഉപയോഗിക്കുന്നുണ്ടോ?',
    },
    options: [
      { value: 1, en: 'Yes', ml: 'അതെ' },
      { value: 0, en: 'No', ml: 'ഇല്ല' },
    ],
  },
  {
    id: 'st-sick',
    question: {
      en: 'Do you use smokeless tobacco even when you are ill and in bed most of the day?',
      ml: 'ദിവസം മുഴുവൻ കിടക്കയിലായിരിക്കുന്ന അസുഖമുള്ളപ്പോഴും ഉപയോഗിക്കുന്നുണ്ടോ?',
    },
    options: [
      { value: 1, en: 'Yes', ml: 'അതെ' },
      { value: 0, en: 'No', ml: 'ഇല്ല' },
    ],
  },
];

const ftndstInterpret = ftndInterpret;

// ─── PS-ECDI — Penn State Electronic Cigarette Dependence Index (10 items, 0–20)
const PSECDI_ITEMS: NicotineItem[] = [
  {
    id: 'ec-use',
    question: {
      en: 'How many times a day do you use your e-cigarette?',
      ml: 'ഒരു ദിവസം എത്ര തവണ ഇ-സിഗരറ്റ് ഉപയോഗിക്കുന്നു?',
    },
    options: [
      { value: 0, en: '0–4 times', ml: '0–4 തവണ' },
      { value: 1, en: '5–9 times', ml: '5–9 തവണ' },
      { value: 2, en: '10–14 times', ml: '10–14 തവണ' },
      { value: 3, en: '15–19 times', ml: '15–19 തവണ' },
      { value: 4, en: '20 or more times', ml: '20 അല്ലെങ്കിൽ കൂടുതൽ' },
    ],
  },
  {
    id: 'ec-ttfv',
    question: {
      en: 'How soon after you wake up do you first use your e-cigarette?',
      ml: 'ഉണർന്നതിനുശേഷം എത്ര വേഗം ആദ്യ ഇ-സിഗരറ്റ് ഉപയോഗിക്കുന്നു?',
    },
    options: [
      { value: 0, en: 'After 60 minutes', ml: '60 മിനിറ്റിനുശേഷം' },
      { value: 1, en: '31–60 minutes', ml: '31–60 മിനിറ്റ്' },
      { value: 2, en: '6–30 minutes', ml: '6–30 മിനിറ്റ്' },
      { value: 3, en: 'Within 5 minutes', ml: '5 മിനിറ്റിനുള്ളിൽ' },
    ],
  },
  {
    id: 'ec-morning',
    question: {
      en: 'Do you use your e-cigarette more in the morning than during the rest of the day?',
      ml: 'രാവിലെ ബാക്കി ദിവസത്തേക്കാൾ കൂടുതൽ ഉപയോഗിക്കുന്നുണ്ടോ?',
    },
    options: [
      { value: 1, en: 'Yes', ml: 'അതെ' },
      { value: 0, en: 'No', ml: 'ഇല്ല' },
    ],
  },
  {
    id: 'ec-forbidden',
    question: {
      en: 'Do you find it difficult to refrain from using your e-cigarette where it is forbidden?',
      ml: 'വിലക്കുള്ള സ്ഥലങ്ങളിൽ ഇ-സിഗരറ്റ് ഉപയോഗം ഒഴിവാക്കാൻ ബുദ്ധിമുട്ടാണോ?',
    },
    options: [
      { value: 1, en: 'Yes', ml: 'അതെ' },
      { value: 0, en: 'No', ml: 'ഇല്ല' },
    ],
  },
  {
    id: 'ec-cravings',
    question: {
      en: 'Do you ever have strong cravings to use your e-cigarette?',
      ml: 'ഇ-സിഗരറ്റ് ഉപയോഗിക്കാനുള്ള ശക്തമായ ആഗ്രഹം ഉണ്ടാകാറുണ്ടോ?',
    },
    options: [
      { value: 1, en: 'Yes', ml: 'അതെ' },
      { value: 0, en: 'No', ml: 'ഇല്ല' },
    ],
  },
  {
    id: 'ec-hooked',
    question: {
      en: 'Do you feel hooked on your e-cigarette?',
      ml: 'ഇ-സിഗരറ്റിൽ അടിമപ്പെട്ടതായി തോന്നുന്നുണ്ടോ?',
    },
    options: [
      { value: 1, en: 'Yes', ml: 'അതെ' },
      { value: 0, en: 'No', ml: 'ഇല്ല' },
    ],
  },
  {
    id: 'ec-crave-diff',
    question: {
      en: 'How difficult would it be to go without your e-cigarette for a whole day?',
      ml: 'ഒരു ദിവസം മുഴുവൻ ഇ-സിഗരറ്റ് ഇല്ലാതെ കഴിയാൻ എത്ര ബുദ്ധിമുട്ടാണ്?',
    },
    options: [
      { value: 0, en: 'Not difficult', ml: 'ബുദ്ധിമുട്ടല്ല' },
      { value: 1, en: 'Quite difficult', ml: 'കുറച്ച് ബുദ്ധിമുട്ട്' },
      { value: 2, en: 'Very difficult', ml: 'വളരെ ബുദ്ധിമുട്ട്' },
      { value: 3, en: 'Impossible', ml: 'അസാധ്യം' },
      { value: 4, en: 'Would not go without', ml: 'ഒരിക്കലും ഒഴിവാക്കില്ല' },
    ],
  },
  {
    id: 'ec-withdrawal',
    question: {
      en: 'Do you feel more irritable or restless when you cannot vape?',
      ml: 'വേപ്പ് ചെയ്യാൻ കഴിയാത്തപ്പോൾ കൂടുതൽ ക്ഷോഭമോ അസ്വസ്ഥതയോ തോന്നുന്നുണ്ടോ?',
    },
    options: [
      { value: 0, en: 'None of the time', ml: 'ഒരിക്കലുമില്ല' },
      { value: 1, en: 'A little of the time', ml: 'അല്പം' },
      { value: 2, en: 'Some of the time', ml: 'ചിലപ്പോൾ' },
      { value: 3, en: 'Most of the time', ml: 'മിക്കപ്പോഴും' },
      { value: 4, en: 'All of the time', ml: 'എപ്പോഴും' },
    ],
  },
  {
    id: 'ec-concentration',
    question: {
      en: 'Do you have trouble concentrating when you cannot vape?',
      ml: 'വേപ്പ് ചെയ്യാൻ കഴിയാത്തപ്പോൾ ശ്രദ്ധ കേന്ദ്രീകരിക്കാൻ ബുദ്ധിമുട്ടുണ്ടോ?',
    },
    options: [
      { value: 0, en: 'None of the time', ml: 'ഒരിക്കലുമില്ല' },
      { value: 1, en: 'A little of the time', ml: 'അല്പം' },
      { value: 2, en: 'Some of the time', ml: 'ചിലപ്പോൾ' },
      { value: 3, en: 'Most of the time', ml: 'മിക്കപ്പോഴും' },
      { value: 4, en: 'All of the time', ml: 'എപ്പോഴും' },
    ],
  },
  {
    id: 'ec-quit',
    question: {
      en: 'Are you currently considering quitting e-cigarettes?',
      ml: 'ഇ-സിഗരറ്റ് നിർത്തുന്നതിനെക്കുറിച്ച് ഇപ്പോൾ ആലോചിക്കുന്നുണ്ടോ?',
    },
    options: [
      { value: 1, en: 'Not at all / not thinking about it', ml: 'ഒട്ടുമില്ല / ആലോചിക്കുന്നില്ല' },
      { value: 0, en: 'Yes, considering or actively quitting', ml: 'അതെ, ആലോചിക്കുന്നു / നിർത്തുന്നു' },
    ],
  },
];

const psecdiInterpret = (total: number) => {
  if (total <= 3) return { en: 'Not dependent', ml: 'ആശ്രിതത്വം ഇല്ല', tone: 'secondary' as const };
  if (total <= 8) return { en: 'Low dependence', ml: 'കുറഞ്ഞ ആശ്രിതത്വം', tone: 'secondary' as const };
  if (total <= 12) return { en: 'Medium dependence', ml: 'ഇടത്തരം ആശ്രിതത്വം', tone: 'default' as const };
  return { en: 'High dependence', ml: 'ഉയർന്ന ആശ്രിതത്വം', tone: 'destructive' as const };
};

// ─── HONC — Hooked on Nicotine Checklist (10 yes/no, autonomy) ─────────
const HONC_ITEMS: NicotineItem[] = [
  { id: 'honc-1', question: { en: 'Have you ever tried to quit but could not?', ml: 'നിർത്താൻ ശ്രമിച്ചിട്ട് കഴിഞ്ഞിട്ടില്ലേ?' }, options: [{ value: 1, en: 'Yes', ml: 'അതെ' }, { value: 0, en: 'No', ml: 'ഇല്ല' }] },
  { id: 'honc-2', question: { en: 'Do you smoke/use now because it is really hard to quit?', ml: 'നിർത്താൻ ബുദ്ധിമുട്ടായതിനാൽ ഇപ്പോൾ ഉപയോഗിക്കുന്നുണ്ടോ?' }, options: [{ value: 1, en: 'Yes', ml: 'അതെ' }, { value: 0, en: 'No', ml: 'ഇല്ല' }] },
  { id: 'honc-3', question: { en: 'Have you ever felt addicted?', ml: 'അടിമപ്പെട്ടതായി തോന്നിയിട്ടുണ്ടോ?' }, options: [{ value: 1, en: 'Yes', ml: 'അതെ' }, { value: 0, en: 'No', ml: 'ഇല്ല' }] },
  { id: 'honc-4', question: { en: 'Do you ever have strong cravings?', ml: 'ശക്തമായ ആഗ്രഹം ഉണ്ടാകാറുണ്ടോ?' }, options: [{ value: 1, en: 'Yes', ml: 'അതെ' }, { value: 0, en: 'No', ml: 'ഇല്ല' }] },
  { id: 'honc-5', question: { en: 'Have you ever felt like you needed a cigarette/nicotine?', ml: 'ഒരു സിഗരറ്റ്/നിക്കോട്ടിൻ ആവശ്യമാണെന്ന് തോന്നിയിട്ടുണ്ടോ?' }, options: [{ value: 1, en: 'Yes', ml: 'അതെ' }, { value: 0, en: 'No', ml: 'ഇല്ല' }] },
  { id: 'honc-6', question: { en: 'When you go too long without one, do you feel nervous or anxious?', ml: 'ദീർഘനേരം ഉപയോഗിക്കാതിരുന്നാൽ ഉത്കണ്ഠ തോന്നുന്നുണ്ടോ?' }, options: [{ value: 1, en: 'Yes', ml: 'അതെ' }, { value: 0, en: 'No', ml: 'ഇല്ല' }] },
  { id: 'honc-7', question: { en: 'Do you feel restless or irritable when you try to stop?', ml: 'നിർത്താൻ ശ്രമിക്കുമ്പോൾ അസ്വസ്ഥതയോ ക്ഷോഭമോ തോന്നുന്നുണ്ടോ?' }, options: [{ value: 1, en: 'Yes', ml: 'അതെ' }, { value: 0, en: 'No', ml: 'ഇല്ല' }] },
  { id: 'honc-8', question: { en: 'Do you feel like you are hooked or controlled by it?', ml: 'ഇതിൽ അടിമപ്പെട്ടതായി തോന്നുന്നുണ്ടോ?' }, options: [{ value: 1, en: 'Yes', ml: 'അതെ' }, { value: 0, en: 'No', ml: 'ഇല്ല' }] },
  { id: 'honc-9', question: { en: 'Do you find it hard to keep from smoking/using in forbidden places?', ml: 'വിലക്കുള്ള സ്ഥലങ്ങളിൽ ഉപയോഗിക്കാതിരിക്കാൻ ബുദ്ധിമുട്ടാണോ?' }, options: [{ value: 1, en: 'Yes', ml: 'അതെ' }, { value: 0, en: 'No', ml: 'ഇല്ല' }] },
  { id: 'honc-10', question: { en: 'Have you noticed that you smoke/use more than you intended?', ml: 'ഉദ്ദേശിച്ചതിലും കൂടുതൽ ഉപയോഗിക്കുന്നതായി ശ്രദ്ധിച്ചിട്ടുണ്ടോ?' }, options: [{ value: 1, en: 'Yes', ml: 'അതെ' }, { value: 0, en: 'No', ml: 'ഇല്ല' }] },
];

const honcInterpret = (total: number) => {
  if (total === 0) return { en: 'No loss of autonomy', ml: 'സ്വയംനിയന്ത്രണ നഷ്ടം ഇല്ല', tone: 'secondary' as const };
  if (total <= 2) return { en: 'Early loss of autonomy', ml: 'സ്വയംനിയന്ത്രണ നഷ്ടം ആരംഭം', tone: 'default' as const };
  return { en: 'Established dependence (any yes = loss of autonomy)', ml: 'സ്ഥിരപ്പെട്ട ആശ്രിതത്വം', tone: 'destructive' as const };
};

const NICOTINE_TABS: NicotineTab[] = [
  {
    key: 'ftnd',
    label: 'FTND',
    title: { en: 'FTND — Fagerström Test for Nicotine Dependence', ml: 'FTND — ഫാഗർസ്ട്രോം നിക്കോട്ടിൻ ആശ്രിതത്വ പരിശോധന' },
    subtitle: { en: 'Cigarette smoking. 6 items, total 0–10.', ml: 'സിഗരറ്റ് പുകവലി. 6 ഇനങ്ങൾ, ആകെ 0–10.' },
    maxScore: 10,
    items: FTND_ITEMS,
    cutoffNote: {
      en: 'Higher scores indicate greater dependence. ≥6 = high dependence; supports planning of cessation pharmacotherapy.',
      ml: 'ഉയർന്ന സ്കോർ കൂടുതൽ ആശ്രിതത്വം. ≥6 = ഉയർന്ന ആശ്രിതത്വം; നിർത്തൽ ഫാർമക്കോതെറാപ്പി ആസൂത്രണത്തെ സഹായിക്കുന്നു.',
    },
    interpret: ftndInterpret,
  },
  {
    key: 'hsi',
    label: 'HSI',
    title: { en: 'HSI — Heaviness of Smoking Index', ml: 'HSI — പുകവലി തീവ്രത സൂചിക' },
    subtitle: { en: 'Quick cigarette assessment. 2 items, total 0–6.', ml: 'ദ്രുത സിഗരറ്റ് വിലയിരുത്തൽ. 2 ഇനങ്ങൾ, ആകെ 0–6.' },
    maxScore: 6,
    items: HSI_ITEMS,
    cutoffNote: {
      en: 'A score ≥4 is commonly used to flag high dependence.',
      ml: 'സ്കോർ ≥4 ഉയർന്ന ആശ്രിതത്വം സൂചിപ്പിക്കാൻ സാധാരണയായി ഉപയോഗിക്കുന്നു.',
    },
    interpret: hsiInterpret,
  },
  {
    key: 'ftndst',
    label: 'FTND-ST',
    title: { en: 'FTND-ST — Fagerström for Smokeless Tobacco', ml: 'FTND-ST — പുകയില രഹിത പുകയിലയ്ക്കുള്ള ഫാഗർസ്ട്രോം' },
    subtitle: { en: 'Smokeless tobacco. 6 items, total 0–10.', ml: 'പുകയില രഹിത പുകയില. 6 ഇനങ്ങൾ, ആകെ 0–10.' },
    maxScore: 10,
    items: FTNDST_ITEMS,
    cutoffNote: {
      en: 'Use this rather than the cigarette FTND when assessing chewing/smokeless tobacco.',
      ml: 'ചവയ്ക്കുന്ന/പുകയില രഹിത പുകയില വിലയിരുത്തുമ്പോൾ സിഗരറ്റ് FTND-യ്ക്കു പകരം ഇത് ഉപയോഗിക്കുക.',
    },
    interpret: ftndstInterpret,
  },
  {
    key: 'psecdi',
    label: 'PS-ECDI',
    title: { en: 'PS-ECDI — Penn State Electronic Cigarette Dependence Index', ml: 'PS-ECDI — പെൻ സ്റ്റേറ്റ് ഇ-സിഗരറ്റ് ആശ്രിതത്വ സൂചിക' },
    subtitle: { en: 'Vaping. 10 items, total 0–20.', ml: 'വേപ്പിംഗ്. 10 ഇനങ്ങൾ, ആകെ 0–20.' },
    maxScore: 20,
    items: PSECDI_ITEMS,
    cutoffNote: {
      en: 'Covers use frequency, time to first vape, cravings and withdrawal. Higher scores = greater e-cigarette dependence.',
      ml: 'ഉപയോഗ ആവൃത്തി, ആദ്യ വേപ്പ്, ആഗ്രഹങ്ങൾ, പിൻവാങ്ങൽ എന്നിവ ഉൾക്കൊള്ളുന്നു. ഉയർന്ന സ്കോർ = കൂടുതൽ ആശ്രിതത്വം.',
    },
    interpret: psecdiInterpret,
  },
  {
    key: 'honc',
    label: 'HONC',
    title: { en: 'HONC — Hooked on Nicotine Checklist', ml: 'HONC — നിക്കോട്ടിൻ ചെക്ക്‌ലിസ്റ്റ്' },
    subtitle: { en: 'Early loss of autonomy (esp. youth). 10 yes/no items.', ml: 'നേരത്തെയുള്ള സ്വയംനിയന്ത്രണ നഷ്ടം (പ്രത്യേകിച്ച് യുവാക്കൾ). 10 അതെ/ഇല്ല ഇനങ്ങൾ.' },
    maxScore: null,
    items: HONC_ITEMS,
    cutoffNote: {
      en: 'Any "yes" indicates some loss of autonomy over nicotine use. Endorsing 1+ item is clinically meaningful.',
      ml: 'ഏതെങ്കിലും "അതെ" സ്വയംനിയന്ത്രണ നഷ്ടം സൂചിപ്പിക്കുന്നു. 1+ ഇനം പോലും ക്ലിനിക്കലായി പ്രസക്തം.',
    },
    interpret: honcInterpret,
  },
];

const TOBACCO_PRODUCT_OPTIONS: Option[] = [
  { value: 0, en: 'Cigarettes', ml: 'സിഗരറ്റ്' },
  { value: 1, en: 'Smokeless / chewing tobacco', ml: 'പുകയില രഹിത / ചവയ്ക്കുന്ന പുകയില' },
  { value: 2, en: 'E-cigarette / vaping', ml: 'ഇ-സിഗരറ്റ് / വേപ്പിംഗ്' },
  { value: 3, en: 'Mixed / other', ml: 'മിശ്രിതം / മറ്റുള്ളവ' },
];

const PRODUCT_RECOMMENDATION: Record<number, 'ftnd' | 'ftndst' | 'psecdi'> = {
  0: 'ftnd',
  1: 'ftndst',
  2: 'psecdi',
};

export const TobaccoNicotineDependence = ({ onBack, initialTab }: { onBack?: () => void; initialTab?: NicotineTab['key'] }) => {
  const { language } = useLanguage();
  const isMl = language === 'ml';
  const tr = (b: Bilingual) => (isMl ? b.ml : b.en);

  const [tab, setTab] = useState<NicotineTab['key']>(initialTab ?? 'ftnd');
  const [product, setProduct] = useState<number | undefined>(undefined);
  const [answers, setAnswers] = useState<Record<string, number | undefined>>({});

  const recommended = product !== undefined ? PRODUCT_RECOMMENDATION[product] : undefined;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary p-4 pb-24 md:pb-8">
      <div className="max-w-4xl mx-auto space-y-4">
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-md">
                <Cigarette className="h-6 w-6 text-foreground" />
              </div>
              <div>
                <CardTitle className="text-xl">
                  {isMl ? 'പുകയില & നിക്കോട്ടിൻ ആശ്രിതത്വ സ്കെയിലുകൾ' : 'Tobacco & Nicotine Dependence Scales'}
                </CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">FTND · HSI · FTND-ST · PS-ECDI · HONC</p>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Product-first intake (per clinical guidance) */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {isMl ? 'ഏത് പുകയില ഉൽപ്പന്നമാണ് ഉപയോഗിക്കുന്നത്?' : 'Which tobacco product is used first?'}
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-1">
              {isMl
                ? 'ഉൽപ്പന്നം തിരഞ്ഞെടുത്താൽ ഏറ്റവും അനുയോജ്യമായ സ്കെയിൽ നിർദ്ദേശിക്കും.'
                : 'Pick the primary product — we will recommend the best-matched scale. Use a product-specific tool rather than applying a cigarette score unchanged to chewing tobacco or vaping.'}
            </p>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={product?.toString() ?? ''}
              onValueChange={(v) => setProduct(Number(v))}
              className="grid gap-1"
            >
              {TOBACCO_PRODUCT_OPTIONS.map((o) => (
                <div key={o.value} className="flex items-start gap-2 min-w-0">
                  <RadioGroupItem value={o.value.toString()} id={`product-${o.value}`} className="mt-0.5 shrink-0" />
                  <Label htmlFor={`product-${o.value}`} className="text-sm font-normal cursor-pointer min-w-0 break-words leading-snug">
                    {tr(o)}
                  </Label>
                </div>
              ))}
            </RadioGroup>
            {recommended && (
              <div className="mt-3 rounded-lg bg-secondary px-3 py-2 text-xs">
                {isMl ? 'നിർദ്ദേശിച്ച സ്കെയിൽ: ' : 'Recommended scale: '}
                <button
                  className="font-semibold text-primary hover:underline"
                  onClick={() => setTab(recommended)}
                >
                  {NICOTINE_TABS.find((t) => t.key === recommended)?.label}
                </button>
              </div>
            )}
          </CardContent>
        </Card>

        <Tabs value={tab} onValueChange={(v) => setTab(v as NicotineTab['key'])} className="w-full">
          <TabsList className="grid grid-cols-2 sm:grid-cols-5 w-full h-auto">
            {NICOTINE_TABS.map((t) => (
              <TabsTrigger key={t.key} value={t.key} className="text-xs">
                {t.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {NICOTINE_TABS.map((t) => {
            const tTotal = t.items.reduce((s, item) => s + (answers[`${t.key}:${item.id}`] ?? 0), 0);
            const tSev = t.interpret(tTotal);
            const tAnswered = t.items.filter((item) => answers[`${t.key}:${item.id}`] !== undefined).length;
            const tReset = () =>
              setAnswers((s) => {
                const next = { ...s };
                t.items.forEach((item) => delete next[`${t.key}:${item.id}`]);
                return next;
              });
            return (
              <TabsContent key={t.key} value={t.key} className="space-y-3 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">{tr(t.title)}</CardTitle>
                    <p className="text-xs text-muted-foreground mt-1">{tr(t.subtitle)}</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {t.items.map((item, idx) => (
                      <div key={item.id} className="border-b border-border pb-3 last:border-b-0">
                        <Label className="text-sm font-semibold">
                          {t.items.length > 1 ? `${idx + 1}. ` : ''}{tr(item.question)}
                        </Label>
                        <RadioGroup
                          value={answers[`${t.key}:${item.id}`]?.toString() ?? ''}
                          onValueChange={(v) => setAnswers((s) => ({ ...s, [`${t.key}:${item.id}`]: Number(v) }))}
                          className="mt-2 grid gap-1"
                        >
                          {item.options.map((o) => (
                            <div key={o.value} className="flex items-start gap-2 min-w-0">
                              <RadioGroupItem value={o.value.toString()} id={`${t.key}-${item.id}-${o.value}`} className="mt-0.5 shrink-0" />
                              <Label htmlFor={`${t.key}-${item.id}-${o.value}`} className="text-xs font-normal cursor-pointer min-w-0 break-words leading-snug">
                                {o.value} – {tr(o)}
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </div>
                    ))}

                    <div className="rounded-xl bg-secondary p-4 flex items-center justify-between flex-wrap gap-3">
                      <div>
                        <div className="text-xs text-muted-foreground">{isMl ? 'ആകെ സ്കോർ' : 'Total score'}</div>
                        <div className="text-2xl font-bold">
                          {tTotal}{' '}
                          <span className="text-sm font-normal text-muted-foreground">
                            {t.maxScore !== null ? `/ ${t.maxScore}` : `/ ${t.items.length}`}
                          </span>
                        </div>
                        <div className="text-[11px] text-muted-foreground mt-0.5">
                          {tAnswered}/{t.items.length} {isMl ? 'ഇനങ്ങൾ ഉത്തരം നൽകി' : 'items answered'}
                        </div>
                      </div>
                      <Badge variant={tSev.tone} className="text-xs">{tr(tSev)}</Badge>
                      <Button variant="outline" size="sm" onClick={tReset}>
                        <RefreshCw className="h-3.5 w-3.5 mr-1" />{isMl ? 'പുനഃസജ്ജമാക്കുക' : 'Reset'}
                      </Button>
                    </div>
                    <p className="text-[11px] text-muted-foreground">{tr(t.cutoffNote)}</p>
                    <ExportButtons
                      className="justify-start"
                      data={{
                        assessmentName: tr(t.title),
                        date: new Date().toLocaleString(),
                        totalScore: t.maxScore !== null ? `${tTotal}/${t.maxScore}` : `${tTotal} yes/${t.items.length}`,
                        interpretation: tr(tSev),
                        sections: [
                          {
                            title: `${t.label} Items`,
                            items: t.items.map((item, idx) => {
                              const score = answers[`${t.key}:${item.id}`];
                              return `${idx + 1}. ${tr(item.question)}: ${score ?? 'not answered'}`;
                            }),
                            type: tSev.tone === 'destructive' ? 'positive' : tSev.tone === 'secondary' ? 'negative' : 'info',
                          },
                        ],
                        disclaimer:
                          'Tobacco/nicotine dependence scales are screening and grading tools; combine with a full clinical assessment. Record cravings and withdrawal separately during follow-up.',
                      } as ReportData}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            );
          })}
        </Tabs>

        {/* Related clinical scales (reference) */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {isMl ? 'ബന്ധപ്പെട്ട ക്ലിനിക്കൽ സ്കെയിലുകൾ' : 'Related clinical scales'}
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-1">
              {isMl
                ? 'ഇവ വ്യത്യസ്ത ചോദ്യങ്ങൾക്ക് ഉത്തരം നൽകുന്നു; ആശ്രിതത്വ സ്കോറുമായി പരസ്പരം മാറ്റിസ്ഥാപിക്കരുത്.'
                : 'These answer different questions and should not be treated as interchangeable with a dependence score.'}
            </p>
          </CardHeader>
          <CardContent className="space-y-2 text-xs text-muted-foreground">
            <p>
              <span className="font-semibold text-foreground">MNWS / MTWS</span> —{' '}
              {tr({
                en: 'Minnesota Nicotine/Tobacco Withdrawal Scale; tracks withdrawal symptoms during a quit attempt.',
                ml: 'മിനസോട്ട നിക്കോട്ടിൻ/പുകയില പിൻവാങ്ങൽ സ്കെയിൽ; നിർത്തൽ ശ്രമത്തിനിടെയുള്ള ലക്ഷണങ്ങൾ.',
              })}
            </p>
            <p>
              <span className="font-semibold text-foreground">CDS-5 / CDS-12</span> —{' '}
              {tr({
                en: 'Cigarette Dependence Scale; broader dependence measure when a fuller assessment is needed than a brief clinic screen.',
                ml: 'സിഗരറ്റ് ആശ്രിതത്വ സ്കെയിൽ; ചെറിയ സ്ക്രീനിനേക്കാൾ സമഗ്രമായ വിലയിരുത്തൽ ആവശ്യമുള്ളപ്പോൾ.',
              })}
            </p>
            <p>
              <span className="font-semibold text-foreground">NDSS</span> —{' '}
              {tr({
                en: 'Nicotine Dependence Syndrome Scale; multidimensional dependence measure.',
                ml: 'നിക്കോട്ടിൻ ആശ്രിതത്വ സിൻഡ്രോം സ്കെയിൽ; ബഹുമാന വിലയിരുത്തൽ.',
              })}
            </p>
          </CardContent>
        </Card>

        {onBack && (
          <div className="text-center pt-2">
            <Button variant="ghost" size="sm" onClick={onBack}>
              ← {isMl ? 'പ്രധാന മെനുവിലേക്ക്' : 'Back to menu'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
