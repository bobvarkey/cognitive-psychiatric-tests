import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { PhysicalFindingsData, PhysicalFindingsResult, Sex } from '@/types/physicalFindings';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowLeft, AlertCircle, CheckCircle, AlertTriangle, RotateCcw, Ruler, Activity } from 'lucide-react';

interface PhysicalFindingsAssessmentProps {
  onBack?: () => void;
}

export const PhysicalFindingsAssessment = ({ onBack }: PhysicalFindingsAssessmentProps) => {
  const { t, language } = useLanguage();
  const [data, setData] = useState<PhysicalFindingsData>({
    sex: null,
    waistCircumference: null,
    hasAbdominalObesity: false,
    hasCervicalHump: false
  });
  const [showResults, setShowResults] = useState(false);

  const calculateResults = (): PhysicalFindingsResult => {
    const metabolicRiskFactors: string[] = [];
    let waistCircumferenceElevated = false;

    // Check waist circumference based on sex
    if (data.sex && data.waistCircumference !== null) {
      const threshold = data.sex === 'female' ? 80 : 90;
      if (data.waistCircumference > threshold) {
        waistCircumferenceElevated = true;
        metabolicRiskFactors.push(
          language === 'en' 
            ? `Elevated waist circumference (>${threshold}cm for ${data.sex === 'female' ? 'women' : 'men'})`
            : `ഉയർന്ന അരക്കെട്ട് ചുറ്റളവ് (${data.sex === 'female' ? 'സ്ത്രീകൾക്ക്' : 'പുരുഷന്മാർക്ക്'} >${threshold}cm)`
        );
      }
    }

    if (data.hasAbdominalObesity) {
      metabolicRiskFactors.push(language === 'en' ? 'Abdominal obesity present' : 'വയറ്റിലെ അമിതഭാരം');
    }

    if (data.hasCervicalHump) {
      metabolicRiskFactors.push(language === 'en' ? 'Cervical hump (dorsocervical fat pad) present' : 'കഴുത്തിന്റെ പിൻഭാഗത്തെ മുഴ (ഡോർസോസെർവിക്കൽ ഫാറ്റ് പാഡ്)');
    }

    let riskLevel: PhysicalFindingsResult['riskLevel'] = 'low';
    if (metabolicRiskFactors.length >= 2) {
      riskLevel = 'high';
    } else if (metabolicRiskFactors.length === 1) {
      riskLevel = 'moderate';
    }

    return {
      data,
      waistCircumferenceElevated,
      metabolicRiskFactors,
      riskLevel
    };
  };

  const handleSubmit = () => {
    if (data.sex) {
      setShowResults(true);
    }
  };

  const handleReset = () => {
    setData({
      sex: null,
      waistCircumference: null,
      hasAbdominalObesity: false,
      hasCervicalHump: false
    });
    setShowResults(false);
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'low':
        return <CheckCircle className="h-8 w-8 text-green-600" />;
      case 'moderate':
        return <AlertTriangle className="h-8 w-8 text-amber-600" />;
      case 'high':
        return <AlertCircle className="h-8 w-8 text-red-600" />;
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low':
        return 'bg-green-50 border-green-200';
      case 'moderate':
        return 'bg-amber-50 border-amber-200';
      case 'high':
        return 'bg-red-50 border-red-200';
    }
  };

  if (showResults) {
    const result = calculateResults();
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 p-4 md:p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {onBack && (
            <Button variant="ghost" onClick={onBack}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('backToMenu')}
            </Button>
          )}

          <Card className="shadow-xl">
            <CardHeader className="bg-gradient-to-r from-orange-500 to-amber-500 text-white">
              <CardTitle className="text-2xl">{t('physicalFindingsResults')}</CardTitle>
            </CardHeader>
            <CardContent className="p-6 md:p-8 space-y-6">
              <div className={`p-6 rounded-lg border-2 ${getRiskColor(result.riskLevel)} flex items-start gap-4`}>
                {getRiskIcon(result.riskLevel)}
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">
                    {t('metabolicRiskLevel')}: {t(`risk${result.riskLevel.charAt(0).toUpperCase() + result.riskLevel.slice(1)}`)}
                  </h3>
                  <p className="text-slate-700">
                    {result.metabolicRiskFactors.length === 0
                      ? t('noMetabolicRiskFactors')
                      : `${result.metabolicRiskFactors.length} ${t('riskFactorsIdentified')}`
                    }
                  </p>
                </div>
              </div>

              {result.metabolicRiskFactors.length > 0 && (
                <div className="bg-slate-50 p-6 rounded-lg">
                  <h4 className="font-bold text-slate-800 mb-3">{t('identifiedRiskFactors')}:</h4>
                  <ul className="space-y-2 text-sm text-slate-700">
                    {result.metabolicRiskFactors.map((factor, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                        <span>{factor}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="bg-slate-50 p-6 rounded-lg">
                <h4 className="font-bold text-slate-800 mb-3">{t('assessmentDetails')}:</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-500">{t('sex')}:</span>
                    <span className="ml-2 font-medium">{data.sex === 'male' ? t('male') : t('female')}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">{t('waistCircumference')}:</span>
                    <span className="ml-2 font-medium">
                      {data.waistCircumference ? `${data.waistCircumference} cm` : t('notMeasured')}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500">{t('abdominalObesity')}:</span>
                    <span className="ml-2 font-medium">{data.hasAbdominalObesity ? t('yes') : t('no')}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">{t('cervicalHump')}:</span>
                    <span className="ml-2 font-medium">{data.hasCervicalHump ? t('yes') : t('no')}</span>
                  </div>
                </div>
              </div>

              <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded">
                <p className="text-sm text-orange-900">
                  <strong>{t('note')}:</strong> {t('physicalFindingsNote')}
                </p>
              </div>

              <div className="flex gap-3">
                <Button onClick={handleReset} variant="outline" className="flex-1">
                  <RotateCcw className="mr-2 h-4 w-4" />
                  {t('retakeAssessment')}
                </Button>
                {onBack && (
                  <Button onClick={onBack} variant="default" className="flex-1">
                    {t('backToMenu')}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {onBack && (
          <Button variant="ghost" onClick={onBack} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('backToMenu')}
          </Button>
        )}

        <Card className="shadow-xl">
          <CardHeader className="bg-gradient-to-r from-orange-500 to-amber-500 text-white">
            <div className="flex items-center gap-3">
              <Activity className="h-7 w-7" />
              <div>
                <CardTitle className="text-2xl">{t('physicalFindingsTitle')}</CardTitle>
                <p className="text-orange-100 text-sm mt-1">{t('physicalFindingsDescription')}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 md:p-8 space-y-6">
            {/* Sex Selection */}
            <div className="space-y-3">
              <Label className="text-lg font-semibold text-slate-700">{t('selectSex')} *</Label>
              <RadioGroup
                value={data.sex || ''}
                onValueChange={(value) => setData(prev => ({ ...prev, sex: value as Sex }))}
              >
                <div className="flex gap-4">
                  <div className="flex items-center space-x-2 p-4 rounded-lg border hover:bg-slate-50 transition-colors cursor-pointer flex-1">
                    <RadioGroupItem value="male" id="male" />
                    <Label htmlFor="male" className="cursor-pointer font-medium">{t('male')}</Label>
                  </div>
                  <div className="flex items-center space-x-2 p-4 rounded-lg border hover:bg-slate-50 transition-colors cursor-pointer flex-1">
                    <RadioGroupItem value="female" id="female" />
                    <Label htmlFor="female" className="cursor-pointer font-medium">{t('female')}</Label>
                  </div>
                </div>
              </RadioGroup>
            </div>

            {/* Waist Circumference */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Ruler className="h-5 w-5 text-orange-600" />
                <Label className="text-lg font-semibold text-slate-700">{t('waistCircumference')}</Label>
              </div>
              <div className="flex items-center gap-3">
                <Input
                  type="number"
                  placeholder={t('enterMeasurement')}
                  value={data.waistCircumference || ''}
                  onChange={(e) => setData(prev => ({ 
                    ...prev, 
                    waistCircumference: e.target.value ? parseFloat(e.target.value) : null 
                  }))}
                  className="max-w-xs"
                />
                <span className="text-slate-600">cm</span>
              </div>
              <p className="text-sm text-slate-500">
                {t('waistThresholdInfo')}
              </p>
            </div>

            {/* Abdominal Obesity */}
            <div className="p-4 rounded-lg border hover:bg-slate-50 transition-colors">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="abdominal-obesity"
                  checked={data.hasAbdominalObesity}
                  onCheckedChange={(checked) => setData(prev => ({ 
                    ...prev, 
                    hasAbdominalObesity: checked === true 
                  }))}
                />
                <div>
                  <Label htmlFor="abdominal-obesity" className="text-lg font-medium cursor-pointer">
                    {t('abdominalObesity')}
                  </Label>
                  <p className="text-sm text-slate-500 mt-1">{t('abdominalObesityDescription')}</p>
                </div>
              </div>
            </div>

            {/* Cervical Hump */}
            <div className="p-4 rounded-lg border hover:bg-slate-50 transition-colors">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="cervical-hump"
                  checked={data.hasCervicalHump}
                  onCheckedChange={(checked) => setData(prev => ({ 
                    ...prev, 
                    hasCervicalHump: checked === true 
                  }))}
                />
                <div>
                  <Label htmlFor="cervical-hump" className="text-lg font-medium cursor-pointer">
                    {t('cervicalHump')}
                  </Label>
                  <p className="text-sm text-slate-500 mt-1">{t('cervicalHumpDescription')}</p>
                </div>
              </div>
            </div>

            <Button 
              onClick={handleSubmit}
              disabled={!data.sex}
              className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
              size="lg"
            >
              {t('submitAssessment')}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
