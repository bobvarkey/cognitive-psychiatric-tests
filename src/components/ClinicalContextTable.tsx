import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { visualHallucinationContexts } from '@/data/visualHallucinationContexts';
import { useLanguage } from '@/contexts/LanguageContext';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export const ClinicalContextTable = () => {
  const { language } = useLanguage();

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-lg">
          {language === 'en' 
            ? 'Visual Hallucinations in Clinical and Non-Clinical Context' 
            : 'ക്ലിനിക്കൽ, നോൺ-ക്ലിനിക്കൽ സന്ദർഭത്തിൽ വിഷ്വൽ ഹാലൂസിനേഷനുകൾ'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold">
                  {language === 'en' ? 'Condition' : 'അവസ്ഥ'}
                </TableHead>
                <TableHead className="font-semibold">
                  {language === 'en' ? 'Key Features' : 'പ്രധാന സവിശേഷതകൾ'}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visualHallucinationContexts.map((context, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">
                    {language === 'en' ? context.condition : context.conditionMl}
                  </TableCell>
                  <TableCell>
                    {language === 'en' ? context.keyFeatures : context.keyFeaturesMl}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="mt-4 text-xs text-muted-foreground">
          <p>
            {language === 'en' 
              ? 'AD, Alzheimer\'s disease; DLB, dementia with Lewy bodies; PD, Parkinson\'s disease; PDD, Parkinson\'s disease dementia; VaD, vascular dementia; VH, visual hallucinations.'
              : 'AD, അൽഷിമേഴ്‌സ് രോഗം; DLB, ലെവി ബോഡികളുള്ള ഡിമെൻഷ്യ; PD, പാർക്കിൻസൺസ് രോഗം; PDD, പാർക്കിൻസൺസ് രോഗ ഡിമെൻഷ്യ; VaD, വാസ്കുലർ ഡിമെൻഷ്യ; VH, വിഷ്വൽ ഹാലൂസിനേഷനുകൾ.'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
