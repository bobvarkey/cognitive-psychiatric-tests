import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Settings as SettingsIcon, Languages, Trash2, Check, Unlock } from 'lucide-react';
import { useLanguage, LANGUAGES } from '@/contexts/LanguageContext';
import { useResultsHistory } from '@/hooks/useResultsHistory';
import { usePatientInfo } from '@/contexts/PatientInfoContext';
import { useSubscription } from '@/contexts/SubscriptionContext';

export const SettingsView = () => {
  const { language, setLanguage } = useLanguage();
  const isMl = language === 'ml';
  const { results, clear } = useResultsHistory();
  const { clearPatientInfo } = usePatientInfo();
  const { demoUnlockAll, toggleDemoUnlockAll } = useSubscription();

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-500 to-zinc-600 flex items-center justify-center shadow-md">
              <SettingsIcon className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg">
                {isMl ? 'ക്രമീകരണങ്ങൾ' : 'Settings'}
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                {isMl ? 'ഭാഷയും പ്രാദേശിക ഡാറ്റയും.' : 'Language and local data.'}
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Language */}
          <section>
            <div className="flex items-center gap-2 mb-2">
              <Languages className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold">{isMl ? 'ഭാഷ' : 'Language'}</h3>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {LANGUAGES.map((lang) => {
                const active = language === lang.code;
                return (
                  <button
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    className={`flex items-center justify-between rounded-xl border px-3 py-2.5 text-left transition-colors ${
                      active
                        ? 'border-primary bg-primary/5 text-foreground'
                        : 'border-border bg-card hover:border-primary/40'
                    }`}
                  >
                    <span className="flex flex-col">
                      <span className="text-sm font-medium">{lang.native}</span>
                      <span className="text-[11px] text-muted-foreground">{lang.label}</span>
                    </span>
                    {active && <Check className="h-4 w-4 text-primary" />}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Data */}
          <section>
            <div className="flex items-center gap-2 mb-2">
              <Trash2 className="h-4 w-4 text-destructive" />
              <h3 className="text-sm font-semibold">{isMl ? 'ഡാറ്റ' : 'Data'}</h3>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between rounded-xl border border-border p-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium">
                    {isMl ? 'സംരക്ഷിച്ച ഫലങ്ങൾ' : 'Saved results'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {results.length} {isMl ? 'എണ്ണം ഈ ഉപകരണത്തിൽ' : 'on this device'}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clear}
                  disabled={results.length === 0}
                >
                  {isMl ? 'മായ്ക്കുക' : 'Clear'}
                </Button>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-border p-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium">
                    {isMl ? 'രോഗി തിരിച്ചറിയൽ വിവരങ്ങൾ' : 'Patient identification'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {isMl ? 'നിലവിലുള്ള സെഷനിൽ നിന്ന് മായ്ക്കുക.' : 'Clear from current session.'}
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={clearPatientInfo}>
                  {isMl ? 'മായ്ക്കുക' : 'Clear'}
                </Button>
              </div>
            </div>
          </section>
        </CardContent>
      </Card>
    </div>
  );
};
