import { Search, HelpCircle, History, Settings, Book, Info } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';

export const MiniAppSearch = () => {
  return (
    <div className="relative w-full max-w-xl mx-auto mb-8">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
      <Input 
        placeholder="Quick search mini-apps (e.g., Alcohol, SSRI, Metabolism)..." 
        className="pl-10 h-12 text-lg rounded-2xl shadow-sm border-primary/20 focus:ring-primary/30"
      />
    </div>
  );
};

export const GlossaryDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Book className="h-4 w-4" /> Glossary
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Clinical Glossary</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <h4 className="font-bold">Aprosexia</h4>
            <p className="text-sm text-muted-foreground">Inability to pay attention.</p>
          </div>
          {/* More glossary items... */}
        </div>
      </DialogContent>
    </Dialog>
  );
};
