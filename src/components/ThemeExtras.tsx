import { useState } from 'react';
import { Search, Book, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export const MiniAppSearch = ({ onSearch }: { onSearch: (q: string) => void }) => {
  const [query, setQuery] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <div className="relative group w-full max-w-md">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
      <Input
        type="search"
        placeholder="Quick search tools..."
        value={query}
        onChange={handleChange}
        className="pl-10 pr-4 h-11 bg-background/50 border-border focus:ring-primary focus:border-primary rounded-xl transition-all"
      />
      {query && (
        <button
          onClick={() => { setQuery(''); onSearch(''); }}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

export const GlossaryDialog = () => {
  const terms = [
    { term: 'Aprosexia', definition: 'Inability to maintain attention.' },
    { term: 'Agraphia', definition: 'Loss of ability to write.' },
    { term: 'Apraxia', definition: 'Inability to perform learned purposeful movements.' },
    { term: 'Gegenhalten', definition: 'Form of hypertonia where resistance increases with velocity.' },
    { term: 'Mitgehen', definition: 'Automatic compliance with movements induced by others.' },
    { term: 'Anomia', definition: 'Difficulty in recalling names of objects.' },
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
          <Book className="h-4 w-4" />
          Glossary
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md bg-background/95 backdrop-blur-xl border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Book className="h-5 w-5 text-primary" />
            Clinical Glossary
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 scrollbar-none">
          {terms.map((t) => (
            <div key={t.term} className="border-b border-border/50 pb-3 last:border-0">
              <h4 className="font-bold text-primary mb-1">{t.term}</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">{t.definition}</p>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
