import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';
import { usePatientInfo } from '@/contexts/PatientInfoContext';
import { User } from 'lucide-react';

export const PatientInfoForm = () => {
  const { language } = useLanguage();
  const { patientInfo, setPatientInfo } = usePatientInfo();

  return (
    <Card className="shadow-md border-0 print:hidden">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <User className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">
            {language === 'ml' ? 'രോഗിയുടെ വിവരങ്ങൾ (ഓപ്ഷണൽ)' : 'Patient Information (Optional)'}
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <Label htmlFor="patient-name" className="text-xs text-muted-foreground">
              {language === 'ml' ? 'രോഗിയുടെ പേര്' : 'Patient Name'}
            </Label>
            <Input
              id="patient-name"
              placeholder={language === 'ml' ? 'പേര് നൽകുക' : 'Enter name'}
              value={patientInfo.name}
              onChange={(e) => setPatientInfo({ ...patientInfo, name: e.target.value.slice(0, 100) })}
              className="h-9 text-sm"
              maxLength={100}
            />
          </div>
          <div>
            <Label htmlFor="patient-id" className="text-xs text-muted-foreground">
              {language === 'ml' ? 'രോഗി ഐഡി' : 'Patient ID'}
            </Label>
            <Input
              id="patient-id"
              placeholder={language === 'ml' ? 'ഐഡി നൽകുക' : 'Enter ID'}
              value={patientInfo.id}
              onChange={(e) => setPatientInfo({ ...patientInfo, id: e.target.value.slice(0, 50) })}
              className="h-9 text-sm"
              maxLength={50}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
