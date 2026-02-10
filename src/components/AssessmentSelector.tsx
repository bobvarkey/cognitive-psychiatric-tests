import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { DaphneAssessment } from '@/components/DaphneAssessment';
import { MocaAssessment } from '@/components/MocaAssessment';
import { HareAssessment } from '@/components/HareAssessment';
import { AdhdAssessment } from '@/components/AdhdAssessment';
import { TuliaAssessment } from '@/components/TuliaAssessment';
import { MsiBpdAssessment } from '@/components/MsiBpdAssessment';
import { HamdAssessment } from '@/components/HamdAssessment';
import { DelusionsAssessment } from '@/components/DelusionsAssessment';
import { FabAssessment } from '@/components/FabAssessment';
import { DpdrAssessment } from '@/components/DpdrAssessment';
import { MiniCogAssessment } from '@/components/MiniCogAssessment';
import { Pcl5Assessment } from '@/components/Pcl5Assessment';
import { PssAssessment } from '@/components/PssAssessment';
import { PhysicalFindingsAssessment } from '@/components/PhysicalFindingsAssessment';
import { DementiaAssessment } from '@/components/DementiaAssessment';
import { CatatoniaAssessment } from '@/components/CatatoniaAssessment';
import { StressScreeningAssessment } from '@/components/StressScreeningAssessment';
import { FallRiskAssessment } from '@/components/FallRiskAssessment';
import { MiniAceAssessment } from '@/components/MiniAceAssessment';
import { NmsAssessment } from '@/components/NmsAssessment';
import { Brain, Calculator, ArrowRight, Home, AlertTriangle, Focus, Hand, Heart, Frown, Eye, Zap, Shield, Gauge, Activity, Stethoscope, Pause, Scale, Footprints, ClipboardCheck, ThermometerSun } from 'lucide-react';
import { LanguageToggle } from './LanguageToggle';
import delusionsMirrorImage from '@/assets/delusions-mirror.png';

export const AssessmentSelector = () => {
  const { t, language } = useLanguage();
  const [selectedAssessment, setSelectedAssessment] = useState<'daphne' | 'moca' | 'minicog' | 'hare' | 'adhd' | 'tulia' | 'msibpd' | 'hamd' | 'delusions' | 'fab' | 'dpdr' | 'pcl5' | 'pss' | 'physical' | 'dementia' | 'catatonia' | 'stressScreening' | 'fallRisk' | 'miniace' | 'nms' | null>(null);

  const handleBackToMenu = () => {
    setSelectedAssessment(null);
  };

  if (selectedAssessment === 'daphne') {
    return (
      <div>
        <div className="fixed top-4 left-4 z-10 print:hidden">
          <Button 
            variant="outline" 
            onClick={handleBackToMenu}
            className="flex items-center gap-2 bg-white/80 backdrop-blur-sm"
          >
            <Home className="h-4 w-4" />
            {t('backToMenu')}
          </Button>
        </div>
        <DaphneAssessment />
      </div>
    );
  }

  if (selectedAssessment === 'moca') {
    return (
      <div>
        <div className="fixed top-4 left-4 z-10 print:hidden">
          <Button 
            variant="outline" 
            onClick={handleBackToMenu}
            className="flex items-center gap-2 bg-white/80 backdrop-blur-sm"
          >
            <Home className="h-4 w-4" />
            {t('backToMenu')}
          </Button>
        </div>
        <MocaAssessment />
      </div>
    );
  }

  if (selectedAssessment === 'hare') {
    return (
      <div>
        <div className="fixed top-4 left-4 z-10 print:hidden">
          <Button 
            variant="outline" 
            onClick={handleBackToMenu}
            className="flex items-center gap-2 bg-white/80 backdrop-blur-sm"
          >
            <Home className="h-4 w-4" />
            {t('backToMenu')}
          </Button>
        </div>
        <HareAssessment />
      </div>
    );
  }

  if (selectedAssessment === 'adhd') {
    return <AdhdAssessment onBack={handleBackToMenu} />;
  }

  if (selectedAssessment === 'tulia') {
    return (
      <div>
        <div className="fixed top-4 left-4 z-10 print:hidden">
          <Button 
            variant="outline" 
            onClick={handleBackToMenu}
            className="flex items-center gap-2 bg-white/80 backdrop-blur-sm"
          >
            <Home className="h-4 w-4" />
            {t('backToMenu')}
          </Button>
        </div>
        <TuliaAssessment />
      </div>
    );
  }

  if (selectedAssessment === 'msibpd') {
    return <MsiBpdAssessment onBack={handleBackToMenu} />;
  }

  if (selectedAssessment === 'hamd') {
    return <HamdAssessment onBack={handleBackToMenu} />;
  }

  if (selectedAssessment === 'delusions') {
    return (
      <div>
        <div className="fixed top-4 left-4 z-10 print:hidden">
          <Button 
            variant="outline" 
            onClick={handleBackToMenu}
            className="flex items-center gap-2 bg-white/80 backdrop-blur-sm"
          >
            <Home className="h-4 w-4" />
            {t('backToMenu')}
          </Button>
        </div>
        <DelusionsAssessment />
      </div>
    );
  }

  if (selectedAssessment === 'fab') {
    return (
      <div>
        <div className="fixed top-4 left-4 z-10 print:hidden">
          <Button 
            variant="outline" 
            onClick={handleBackToMenu}
            className="flex items-center gap-2 bg-white/80 backdrop-blur-sm"
          >
            <Home className="h-4 w-4" />
            {t('backToMenu')}
          </Button>
        </div>
        <FabAssessment />
      </div>
    );
  }

  if (selectedAssessment === 'dpdr') {
    return <DpdrAssessment onBack={handleBackToMenu} />;
  }

  if (selectedAssessment === 'minicog') {
    return (
      <div>
        <div className="fixed top-4 left-4 z-10 print:hidden">
          <Button 
            variant="outline" 
            onClick={handleBackToMenu}
            className="flex items-center gap-2 bg-white/80 backdrop-blur-sm"
          >
            <Home className="h-4 w-4" />
            {t('backToMenu')}
          </Button>
        </div>
        <MiniCogAssessment />
      </div>
    );
  }

  if (selectedAssessment === 'pcl5') {
    return (
      <div>
        <div className="fixed top-4 left-4 z-10 print:hidden">
          <Button 
            variant="outline" 
            onClick={handleBackToMenu}
            className="flex items-center gap-2 bg-white/80 backdrop-blur-sm"
          >
            <Home className="h-4 w-4" />
            {t('backToMenu')}
          </Button>
        </div>
        <Pcl5Assessment />
      </div>
    );
  }

  if (selectedAssessment === 'pss') {
    return <PssAssessment onBack={handleBackToMenu} />;
  }

  if (selectedAssessment === 'physical') {
    return <PhysicalFindingsAssessment onBack={handleBackToMenu} />;
  }

  if (selectedAssessment === 'dementia') {
    return <DementiaAssessment onBack={handleBackToMenu} />;
  }

  if (selectedAssessment === 'catatonia') {
    return <CatatoniaAssessment onBack={handleBackToMenu} />;
  }

  if (selectedAssessment === 'stressScreening') {
    return <StressScreeningAssessment onBack={handleBackToMenu} />;
  }

  if (selectedAssessment === 'fallRisk') {
    return <FallRiskAssessment onBack={handleBackToMenu} />;
  }

  if (selectedAssessment === 'miniace') {
    return <MiniAceAssessment onBack={handleBackToMenu} />;
  }

  if (selectedAssessment === 'nms') {
    return <NmsAssessment onBack={handleBackToMenu} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <LanguageToggle />
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Brain className="h-10 w-10 text-blue-600" />
            <h1 className="text-4xl font-bold text-slate-800">
              {t('cognitiveAssessments')}
            </h1>
          </div>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            {t('selectAssessmentDescription')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* DAPHNE Assessment Card */}
          <Card className="shadow-lg border-0 hover:shadow-xl transition-all duration-300 group cursor-pointer" onClick={() => setSelectedAssessment('daphne')}>
            <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-600 text-white pb-4">
              <div className="flex items-center gap-3">
                <Brain className="h-7 w-7" />
                <div>
                  <CardTitle className="text-xl">DAPHNE Scale</CardTitle>
                  <p className="text-purple-100 text-xs">Dementia Apraxia Assessment</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <Button 
                onClick={(e) => { e.stopPropagation(); setSelectedAssessment('daphne'); }}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
              >
                Start Assessment
              </Button>
            </CardContent>
          </Card>

          {/* MoCA Assessment Card */}
          <Card className="shadow-lg border-0 hover:shadow-xl transition-all duration-300 group cursor-pointer" onClick={() => setSelectedAssessment('moca')}>
            <CardHeader className="bg-gradient-to-r from-green-500 to-teal-600 text-white pb-4">
              <div className="flex items-center gap-3">
                <Calculator className="h-7 w-7" />
                <div>
                  <CardTitle className="text-xl">MoCA Assessment</CardTitle>
                  <p className="text-green-100 text-xs">Montreal Cognitive Assessment</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <Button 
                onClick={(e) => { e.stopPropagation(); setSelectedAssessment('moca'); }}
                className="w-full bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700"
              >
                Start Assessment
              </Button>
            </CardContent>
          </Card>

          {/* Mini-Cog Assessment Card */}
          <Card className="shadow-lg border-0 hover:shadow-xl transition-all duration-300 group cursor-pointer" onClick={() => setSelectedAssessment('minicog')}>
            <CardHeader className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white pb-4">
              <div className="flex items-center gap-3">
                <Brain className="h-7 w-7" />
                <div>
                  <CardTitle className="text-xl">Mini-Cog™</CardTitle>
                  <p className="text-blue-100 text-xs">Brief Cognitive Screening</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <Button 
                onClick={(e) => { e.stopPropagation(); setSelectedAssessment('minicog'); }}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700"
              >
                Start Assessment
              </Button>
            </CardContent>
          </Card>

          {/* Hare PCL-R Assessment Card */}
          <Card className="shadow-lg border-0 hover:shadow-xl transition-all duration-300 group cursor-pointer" onClick={() => setSelectedAssessment('hare')}>
            <CardHeader className="bg-gradient-to-r from-orange-500 to-red-600 text-white pb-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-7 w-7" />
                <div>
                  <CardTitle className="text-xl">Hare PCL-R</CardTitle>
                  <p className="text-orange-100 text-xs">Psychopathy Checklist</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <Button 
                onClick={(e) => { e.stopPropagation(); setSelectedAssessment('hare'); }}
                className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
              >
                Start Assessment
              </Button>
            </CardContent>
          </Card>

          {/* ADHD Assessment Card */}
          <Card className="shadow-lg border-0 hover:shadow-xl transition-all duration-300 group cursor-pointer" onClick={() => setSelectedAssessment('adhd')}>
            <CardHeader className="bg-gradient-to-r from-indigo-500 to-blue-600 text-white pb-4">
              <div className="flex items-center gap-3">
                <Focus className="h-7 w-7" />
                <div>
                  <CardTitle className="text-xl">DSM-5-TR ADHD</CardTitle>
                  <p className="text-indigo-100 text-xs">Diagnostic Criteria Checklist</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <Button 
                onClick={(e) => { e.stopPropagation(); setSelectedAssessment('adhd'); }}
                className="w-full bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700"
              >
                Start Assessment
              </Button>
            </CardContent>
          </Card>

          {/* TULIA Assessment Card */}
          <Card className="shadow-lg border-0 hover:shadow-xl transition-all duration-300 group cursor-pointer" onClick={() => setSelectedAssessment('tulia')}>
            <CardHeader className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white pb-4">
              <div className="flex items-center gap-3">
                <Hand className="h-7 w-7" />
                <div>
                  <CardTitle className="text-xl">TULIA AST</CardTitle>
                  <p className="text-teal-100 text-xs">Apraxia Screen of TULIA</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <Button 
                onClick={(e) => { e.stopPropagation(); setSelectedAssessment('tulia'); }}
                className="w-full bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700"
              >
                Start Assessment
              </Button>
            </CardContent>
          </Card>

          {/* MSI-BPD Assessment Card */}
          <Card className="shadow-lg border-0 hover:shadow-xl transition-all duration-300 group cursor-pointer" onClick={() => setSelectedAssessment('msibpd')}>
            <CardHeader className="bg-gradient-to-r from-rose-500 to-pink-600 text-white pb-4">
              <div className="flex items-center gap-3">
                <Heart className="h-7 w-7" />
                <div>
                  <CardTitle className="text-xl">MSI-BPD</CardTitle>
                  <p className="text-rose-100 text-xs">McLean Screening Instrument</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <Button 
                onClick={(e) => { e.stopPropagation(); setSelectedAssessment('msibpd'); }}
                className="w-full bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700"
              >
                Start Assessment
              </Button>
            </CardContent>
          </Card>

          {/* HAM-D Assessment Card */}
          <Card className="shadow-lg border-0 hover:shadow-xl transition-all duration-300 group cursor-pointer" onClick={() => setSelectedAssessment('hamd')}>
            <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white pb-4">
              <div className="flex items-center gap-3">
                <Frown className="h-7 w-7" />
                <div>
                  <CardTitle className="text-xl">HAM-D</CardTitle>
                  <p className="text-blue-100 text-xs">Hamilton Depression Scale</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <Button 
                onClick={(e) => { e.stopPropagation(); setSelectedAssessment('hamd'); }}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
              >
                Start Assessment
              </Button>
            </CardContent>
          </Card>
          {/* Delusional Syndromes and Hallucinations Assessment Card */}
          <Card className="shadow-lg border-0 hover:shadow-xl transition-all duration-300 group cursor-pointer overflow-hidden" onClick={() => setSelectedAssessment('delusions')}>
            <div className="relative h-32 overflow-hidden">
              <img 
                src={delusionsMirrorImage} 
                alt="Delusional syndromes and hallucinations representation" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-violet-900/90 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <div className="flex items-center gap-2 mb-1">
                  <Eye className="h-6 w-6" />
                  <CardTitle className="text-lg">Delusions & Hallucinations</CardTitle>
                </div>
                <p className="text-violet-100 text-xs">Comprehensive Assessment</p>
              </div>
            </div>
            <CardContent className="p-4">
              <Button 
                onClick={(e) => { e.stopPropagation(); setSelectedAssessment('delusions'); }}
                className="w-full bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700"
              >
                Start Assessment
              </Button>
            </CardContent>
          </Card>

          {/* FAB Assessment Card */}
          <Card className="shadow-lg border-0 hover:shadow-xl transition-all duration-300 group cursor-pointer" onClick={() => setSelectedAssessment('fab')}>
            <CardHeader className="bg-gradient-to-r from-amber-500 to-yellow-600 text-white pb-4">
              <div className="flex items-center gap-3">
                <Zap className="h-7 w-7" />
                <div>
                  <CardTitle className="text-xl">FAB</CardTitle>
                  <p className="text-amber-100 text-xs">Frontal Assessment Battery</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <Button 
                onClick={(e) => { e.stopPropagation(); setSelectedAssessment('fab'); }}
                className="w-full bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700"
              >
                Start Assessment
              </Button>
            </CardContent>
          </Card>

          {/* DPDR Assessment Card */}
          <Card className="shadow-lg border-0 hover:shadow-xl transition-all duration-300 group cursor-pointer" onClick={() => setSelectedAssessment('dpdr')}>
            <CardHeader className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white pb-4">
              <div className="flex items-center gap-3">
                <Eye className="h-7 w-7" />
                <div>
                  <CardTitle className="text-xl">DPDR</CardTitle>
                  <p className="text-cyan-100 text-xs">Depersonalization-Derealization</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <Button 
                onClick={(e) => { e.stopPropagation(); setSelectedAssessment('dpdr'); }}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
              >
                Start Assessment
              </Button>
            </CardContent>
          </Card>

          {/* PC-PTSD-5 Assessment Card */}
          <Card className="shadow-lg border-0 hover:shadow-xl transition-all duration-300 group cursor-pointer" onClick={() => setSelectedAssessment('pcl5')}>
            <CardHeader className="bg-gradient-to-r from-red-500 to-rose-600 text-white pb-4">
              <div className="flex items-center gap-3">
                <Shield className="h-7 w-7" />
                <div>
                  <CardTitle className="text-xl">PC-PTSD-5</CardTitle>
                  <p className="text-red-100 text-xs">
                    {language === 'en' ? 'Primary Care PTSD Screen' : 'പ്രൈമറി കെയർ PTSD സ്ക്രീൻ'}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <Button 
                onClick={(e) => { e.stopPropagation(); setSelectedAssessment('pcl5'); }}
                className="w-full bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700"
              >
                Start Assessment
              </Button>
            </CardContent>
          </Card>

          {/* PSS Assessment Card */}
          <Card className="shadow-lg border-0 hover:shadow-xl transition-all duration-300 group cursor-pointer" onClick={() => setSelectedAssessment('pss')}>
            <CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white pb-4">
              <div className="flex items-center gap-3">
                <Gauge className="h-7 w-7" />
                <div>
                  <CardTitle className="text-xl">PSS-10</CardTitle>
                  <p className="text-emerald-100 text-xs">
                    {language === 'en' ? 'Perceived Stress Scale' : 'പെർസീവ്ഡ് സ്ട്രെസ് സ്കെയിൽ'}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <Button 
                onClick={(e) => { e.stopPropagation(); setSelectedAssessment('pss'); }}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
              >
                Start Assessment
              </Button>
            </CardContent>
          </Card>

          {/* Physical Findings Assessment Card */}
          <Card className="shadow-lg border-0 hover:shadow-xl transition-all duration-300 group cursor-pointer" onClick={() => setSelectedAssessment('physical')}>
            <CardHeader className="bg-gradient-to-r from-orange-500 to-amber-500 text-white pb-4">
              <div className="flex items-center gap-3">
                <Activity className="h-7 w-7" />
                <div>
                  <CardTitle className="text-xl">{language === 'en' ? 'Physical Findings' : 'ശാരീരിക കണ്ടെത്തലുകൾ'}</CardTitle>
                  <p className="text-orange-100 text-xs">
                    {language === 'en' ? 'Metabolic Risk Indicators' : 'ഉപാപചയ അപകട സൂചകങ്ങൾ'}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <Button 
                onClick={(e) => { e.stopPropagation(); setSelectedAssessment('physical'); }}
                className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
              >
                Start Assessment
              </Button>
            </CardContent>
          </Card>

          {/* Dementia Evaluation Card */}
          <Card className="shadow-lg border-0 hover:shadow-xl transition-all duration-300 group cursor-pointer" onClick={() => setSelectedAssessment('dementia')}>
            <CardHeader className="bg-gradient-to-r from-violet-600 to-purple-600 text-white pb-4">
              <div className="flex items-center gap-3">
                <Stethoscope className="h-7 w-7" />
                <div>
                  <CardTitle className="text-xl">{language === 'en' ? 'Dementia Evaluation' : 'ഡിമെൻഷ്യ മൂല്യനിർണ്ണയം'}</CardTitle>
                  <p className="text-violet-100 text-xs">
                    {language === 'en' ? 'BEHAV5+ & Soft Signs' : 'BEHAV5+ & സോഫ്റ്റ് സൈൻസ്'}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <p className="text-sm text-slate-600 mb-3">
                {language === 'en' 
                  ? 'Comprehensive dementia screening with behavioral assessment, neurological soft signs (MHD, STS, HTS), history, and test recommendations.'
                  : 'ബിഹേവിയറൽ അസെസ്മെന്റ്, ന്യൂറോളജിക്കൽ സോഫ്റ്റ് സൈൻസ് (MHD, STS, HTS), ഹിസ്റ്ററി, ടെസ്റ്റ് ശുപാർശകൾ എന്നിവയുള്ള സമഗ്ര ഡിമെൻഷ്യ സ്ക്രീനിംഗ്.'}
              </p>
              <Button 
                onClick={(e) => { e.stopPropagation(); setSelectedAssessment('dementia'); }}
                className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
              >
                Start Evaluation
              </Button>
            </CardContent>
          </Card>

          {/* Bush Francis Catatonia Rating Scale Card */}
          <Card className="shadow-lg border-0 hover:shadow-xl transition-all duration-300 group cursor-pointer" onClick={() => setSelectedAssessment('catatonia')}>
            <CardHeader className="bg-gradient-to-r from-cyan-500 to-teal-600 text-white pb-4">
              <div className="flex items-center gap-3">
                <Pause className="h-7 w-7" />
                <div>
                  <CardTitle className="text-xl">BFCRS</CardTitle>
                  <p className="text-cyan-100 text-xs">
                    {language === 'en' ? 'Bush Francis Catatonia Scale' : 'ബുഷ് ഫ്രാൻസിസ് കാറ്ററ്റോണിയ സ്കെയിൽ'}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <p className="text-sm text-slate-600 mb-3">
                {language === 'en' 
                  ? '23-item scale for catatonia screening (14 items) and severity rating. Essential for detecting catatonic features.'
                  : 'കാറ്ററ്റോണിയ സ്ക്രീനിംഗ് (14 ഇനങ്ങൾ), തീവ്രത റേറ്റിംഗ് എന്നിവയ്ക്കുള്ള 23-ഇന സ്കെയിൽ.'}
              </p>
              <Button 
                onClick={(e) => { e.stopPropagation(); setSelectedAssessment('catatonia'); }}
                className="w-full bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700"
              >
                Start Assessment
              </Button>
            </CardContent>
          </Card>

          {/* Stress vs Mental Disorder Screening Card */}
          <Card className="shadow-lg border-0 hover:shadow-xl transition-all duration-300 group cursor-pointer" onClick={() => setSelectedAssessment('stressScreening')}>
            <CardHeader className="bg-gradient-to-r from-violet-500 to-purple-600 text-white pb-4">
              <div className="flex items-center gap-3">
                <Scale className="h-7 w-7" />
                <div>
                  <CardTitle className="text-xl">{language === 'en' ? 'Stress vs Disorder' : 'സ്ട്രെസ് vs വൈകല്യം'}</CardTitle>
                  <p className="text-violet-100 text-xs">
                    {language === 'en' ? 'Differentiation Screening' : 'വ്യത്യാസ സ്ക്രീനിംഗ്'}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <p className="text-sm text-slate-600 mb-3">
                {language === 'en' 
                  ? 'Identify red flags differentiating ordinary stress from underlying mental health conditions using clinical criteria.'
                  : 'ക്ലിനിക്കൽ മാനദണ്ഡങ്ങൾ ഉപയോഗിച്ച് സാധാരണ സ്ട്രെസിനെ മാനസികാരോഗ്യ അവസ്ഥകളിൽ നിന്ന് വേർതിരിക്കുന്ന റെഡ് ഫ്ലാഗുകൾ തിരിച്ചറിയുക.'}
              </p>
              <Button 
                onClick={(e) => { e.stopPropagation(); setSelectedAssessment('stressScreening'); }}
                className="w-full bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700"
              >
                Start Screening
              </Button>
            </CardContent>
          </Card>

          {/* Fall Risk Assessment Card */}
          <Card className="shadow-lg border-0 hover:shadow-xl transition-all duration-300 group cursor-pointer" onClick={() => setSelectedAssessment('fallRisk')}>
            <CardHeader className="bg-gradient-to-r from-orange-500 to-red-600 text-white pb-4">
              <div className="flex items-center gap-3">
                <Footprints className="h-7 w-7" />
                <div>
                  <CardTitle className="text-xl">{language === 'en' ? 'Fall Risk' : 'വീഴ്ച അപകടസാധ്യത'}</CardTitle>
                  <p className="text-orange-100 text-xs">
                    {language === 'en' ? 'STEADI & Morse Scale' : 'STEADI & മോഴ്സ് സ്കെയിൽ'}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <p className="text-sm text-slate-600 mb-3">
                {language === 'en' 
                  ? 'Comprehensive fall risk evaluation with STEADI algorithm, Morse Fall Scale, and physical assessments.'
                  : 'STEADI അൽഗോരിതം, മോഴ്സ് ഫാൾ സ്കെയിൽ, ശാരീരിക വിലയിരുത്തലുകൾ എന്നിവ ഉപയോഗിച്ച് സമഗ്ര വീഴ്ച അപകട മൂല്യനിർണ്ണയം.'}
              </p>
              <Button 
                onClick={(e) => { e.stopPropagation(); setSelectedAssessment('fallRisk'); }}
                className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
              >
                Start Assessment
              </Button>
            </CardContent>
          </Card>

          {/* Mini-ACE Assessment Card */}
          <Card className="shadow-lg border-0 hover:shadow-xl transition-all duration-300 group cursor-pointer" onClick={() => setSelectedAssessment('miniace')}>
            <CardHeader className="bg-gradient-to-r from-emerald-500 to-green-600 text-white pb-4">
              <div className="flex items-center gap-3">
                <ClipboardCheck className="h-7 w-7" />
                <div>
                  <CardTitle className="text-xl">Mini-ACE</CardTitle>
                  <p className="text-emerald-100 text-xs">
                    {language === 'en' ? 'Mini-Addenbrooke\'s Cognitive' : 'മിനി-ആഡൻബ്രൂക്ക് കോഗ്നിറ്റീവ്'}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <p className="text-sm text-slate-600 mb-3">
                {language === 'en' 
                  ? 'Brief cognitive screening with 3 versions (A, B, C). Adapted for Indian context with Malayalam translation.'
                  : '3 പതിപ്പുകളുള്ള (A, B, C) ചെറിയ വൈജ്ഞാനിക സ്ക്രീനിംഗ്. ഇന്ത്യൻ സന്ദർഭത്തിന് അനുയോജ്യമാക്കി.'}
              </p>
              <Button 
                onClick={(e) => { e.stopPropagation(); setSelectedAssessment('miniace'); }}
                className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700"
              >
                Start Assessment
              </Button>
            </CardContent>
          </Card>

          {/* NMS Rating Scale Card */}
          <Card className="shadow-lg border-0 hover:shadow-xl transition-all duration-300 group cursor-pointer" onClick={() => setSelectedAssessment('nms')}>
            <CardHeader className="bg-gradient-to-r from-red-600 to-rose-700 text-white pb-4">
              <div className="flex items-center gap-3">
                <ThermometerSun className="h-7 w-7" />
                <div>
                  <CardTitle className="text-xl">{language === 'en' ? 'NMS Rating Scale' : 'NMS റേറ്റിംഗ് സ്കെയിൽ'}</CardTitle>
                  <p className="text-red-100 text-xs">
                    {language === 'en' ? 'Neuroleptic Malignant Syndrome' : 'ന്യൂറോലെപ്റ്റിക് മാലിഗ്നന്റ് സിൻഡ്രോം'}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <p className="text-sm text-slate-600 mb-3">
                {language === 'en' 
                  ? 'Assessment for suspected or diagnosed NMS including temperature, extrapyramidal symptoms, autonomic instability, and lab findings.'
                  : 'സംശയിക്കപ്പെടുന്ന അല്ലെങ്കിൽ രോഗനിർണയം നടത്തിയ NMS-നുള്ള വിലയിരുത്തൽ.'}
              </p>
              <Button 
                onClick={(e) => { e.stopPropagation(); setSelectedAssessment('nms'); }}
                className="w-full bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-700 hover:to-rose-800"
              >
                Start Assessment
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-12">
          <Card className="shadow-lg border-0 bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold text-slate-800 mb-3">
                {t('whichAssessmentToUse')}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm text-slate-700">
                <div className="text-left">
                  <h4 className="font-semibold text-purple-600 mb-2">Use DAPHNE when:</h4>
                  <ul className="space-y-1">
                    <li>• Suspected frontotemporal dementia</li>
                    <li>• Behavioral symptoms present</li>
                    <li>• Need detailed behavioral assessment</li>
                    <li>• Family reports personality changes</li>
                  </ul>
                </div>
                <div className="text-left">
                  <h4 className="font-semibold text-green-600 mb-2">Use MoCA when:</h4>
                  <ul className="space-y-1">
                    <li>• General cognitive screening needed</li>
                    <li>• Suspected mild cognitive impairment</li>
                    <li>• Memory concerns reported</li>
                    <li>• Baseline cognitive assessment</li>
                  </ul>
                </div>
                <div className="text-left">
                  <h4 className="font-semibold text-orange-600 mb-2">Use Hare PCL-R when:</h4>
                  <ul className="space-y-1">
                    <li>• Educational assessment purposes</li>
                    <li>• Understanding psychopathy traits</li>
                    <li>• Research or training context</li>
                    <li>• Professional supervision available</li>
                  </ul>
                </div>
                <div className="text-left">
                  <h4 className="font-semibold text-indigo-600 mb-2">Use ADHD ASRS when:</h4>
                  <ul className="space-y-1">
                    <li>• Attention/concentration concerns</li>
                    <li>• Hyperactivity or impulsivity issues</li>
                    <li>• Adult ADHD screening needed</li>
                    <li>• Organization/focus difficulties</li>
                  </ul>
                </div>
                <div className="text-left">
                  <h4 className="font-semibold text-teal-600 mb-2">Use TULIA AST when:</h4>
                  <ul className="space-y-1">
                    <li>• Post-stroke gesture difficulties</li>
                    <li>• Suspected upper limb apraxia</li>
                    <li>• Difficulty with tool use</li>
                    <li>• Impaired gesture imitation</li>
                  </ul>
                </div>
                <div className="text-left">
                  <h4 className="font-semibold text-rose-600 mb-2">Use MSI-BPD when:</h4>
                  <ul className="space-y-1">
                    <li>• Screening for BPD needed</li>
                    <li>• Relationship instability present</li>
                    <li>• Emotional dysregulation observed</li>
                    <li>• Quick screening required (ages 15+)</li>
                  </ul>
                </div>
                <div className="text-left">
                  <h4 className="font-semibold text-blue-600 mb-2">Use HAM-D when:</h4>
                  <ul className="space-y-1">
                    <li>• Depression severity assessment</li>
                    <li>• Treatment response monitoring</li>
                    <li>• Clinical trial measurements</li>
                    <li>• Comprehensive mood evaluation</li>
                  </ul>
                </div>
                <div className="text-left">
                  <h4 className="font-semibold text-amber-600 mb-2">Use FAB when:</h4>
                  <ul className="space-y-1">
                    <li>• Frontal lobe dysfunction suspected</li>
                    <li>• Differentiating dementia types</li>
                    <li>• Executive function assessment</li>
                    <li>• Quick bedside screening needed</li>
                  </ul>
                </div>
                <div className="text-left">
                  <h4 className="font-semibold text-cyan-600 mb-2">Use DPDR when:</h4>
                  <ul className="space-y-1">
                    <li>• Feeling detached from self</li>
                    <li>• Surroundings seem unreal or dreamlike</li>
                    <li>• Dissociative symptoms present</li>
                    <li>• Reality perception concerns</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};