import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { TuliaItem, TuliaScore } from '@/types/tulia';
import { useLanguage } from '@/contexts/LanguageContext';
import { Info } from 'lucide-react';

interface TuliaItemCardProps {
  item: TuliaItem;
  value: TuliaScore | null;
  onChange: (score: TuliaScore) => void;
}

export const TuliaItemCard = ({ item, value, onChange }: TuliaItemCardProps) => {
  const { language } = useLanguage();

  const getCategoryColor = () => {
    switch (item.category) {
      case 'meaningless':
        return 'from-gray-500 to-slate-600';
      case 'intransitive':
        return 'from-blue-500 to-indigo-600';
      case 'transitive':
        return 'from-teal-500 to-cyan-600';
    }
  };

  const getCategoryLabel = () => {
    switch (item.category) {
      case 'meaningless':
        return language === 'en' ? 'Meaningless' : 'അർത്ഥരഹിതം';
      case 'intransitive':
        return language === 'en' ? 'Intransitive (Communicative)' : 'ഇൻട്രാൻസിറ്റീവ് (ആശയവിനിമയം)';
      case 'transitive':
        return language === 'en' ? 'Transitive (Tool related)' : 'ട്രാൻസിറ്റീവ് (ഉപകരണ ബന്ധിതം)';
    }
  };

  const getDomainBadge = () => {
    const colors = item.domain === 'imitation' 
      ? 'bg-purple-100 text-purple-800' 
      : 'bg-orange-100 text-orange-800';
    
    return (
      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${colors}`}>
        {item.domain === 'imitation' ? 
          (language === 'en' ? 'Imitation' : 'അനുകരണം') : 
          (language === 'en' ? 'Pantomime' : 'പാന്റോമൈം')}
      </span>
    );
  };

  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow">
      <div className={`h-2 bg-gradient-to-r ${getCategoryColor()}`} />
      <CardContent className="p-6 space-y-4">
        <div>
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="text-lg font-bold text-slate-700">Item {item.id}</span>
            {getDomainBadge()}
            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getCategoryColor()} text-white`}>
              {getCategoryLabel()}
            </span>
          </div>
          <p className="text-sm text-slate-600 italic mb-2">
            {language === 'en' ? item.instruction.en : item.instruction.ml}
          </p>
          <p className="text-base font-medium text-slate-800">
            {language === 'en' ? item.description.en : item.description.ml}
          </p>
          {item.note && (
            <div className="mt-3 p-3 bg-blue-50 rounded-lg flex gap-2">
              <Info className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-blue-800">
                {language === 'en' ? item.note.en : item.note.ml}
              </p>
            </div>
          )}
        </div>

        <div className="pt-4 border-t">
          <Label className="text-sm font-medium text-slate-700 mb-3 block">
            {language === 'en' ? 'Performance:' : 'പ്രകടനം:'}
          </Label>
          <RadioGroup
            value={value?.toString()}
            onValueChange={(val) => onChange(parseInt(val) as TuliaScore)}
            className="flex gap-6"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="0" id={`item-${item.id}-fail`} />
              <Label 
                htmlFor={`item-${item.id}-fail`}
                className="text-sm font-medium cursor-pointer"
              >
                {language === 'en' ? 'Fail (0)' : 'പരാജയം (0)'}
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="1" id={`item-${item.id}-pass`} />
              <Label 
                htmlFor={`item-${item.id}-pass`}
                className="text-sm font-medium cursor-pointer"
              >
                {language === 'en' ? 'Pass (1)' : 'വിജയം (1)'}
              </Label>
            </div>
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
  );
};
