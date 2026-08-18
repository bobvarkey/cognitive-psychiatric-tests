import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Settings as SettingsIcon, Languages, Trash2, Check, Unlock, ShieldAlert, Palette, Moon, Sun, Type } from 'lucide-react';
import { useLanguage, LANGUAGES } from '@/contexts/LanguageContext';
import { useResultsHistory } from '@/hooks/useResultsHistory';
import { usePatientInfo } from '@/contexts/PatientInfoContext';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { useThemeStore, AppTheme, FontSize } from '@/hooks/useThemeStore';


export const SettingsView = () => {
  const { language, setLanguage } = useLanguage();
  const isMl = language === 'ml';
  const { results, clear } = useResultsHistory();
  const { clearPatientInfo } = usePatientInfo();
  const { demoUnlockAll, toggleDemoUnlockAll } = useSubscription();
  const { mode, toggleMode, theme, setTheme, fontSize, setFontSize } = useThemeStore();

  const themes: { id: AppTheme; label: string; colors: string[] }[] = [
    { id: 'sunset', label: 'Sunset Blaze', colors: ['bg-[#ff4500]', 'bg-[#ff00ff]'] },
    { id: 'midnight', label: 'Midnight', colors: ['bg-[#007acc]', 'bg-[#00ffff]'] },
    { id: 'forest', label: 'Forest', colors: ['bg-[#22c55e]', 'bg-[#10b981]'] },
  ];

  const fontSizes: { id: FontSize; label: string; malayalam: string }[] = [
    { id: 'small', label: 'Small', malayalam: 'ചെറുത്' },
    { id: 'medium', label: 'Medium', malayalam: 'സാധാരണം' },
    { id: 'large', label: 'Large', malayalam: 'വലുത്' },
    { id: 'xlarge', label: 'X-Large', malayalam: 'ഏറ്റവും വലുത്' },
  ];


  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-500 to-zinc-600 flex items-center justify-center shadow-md">
              <SettingsIcon className="h-5 w-5 text-foreground" />
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

          {/* Appearance & Theme */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Palette className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold">{isMl ? 'രൂപഘടന' : 'Appearance'}</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-xl border border-border p-3">
                <div className="flex items-center gap-2">
                  {mode === 'dark' ? <Moon className="h-4 w-4 text-primary" /> : <Sun className="h-4 w-4 text-primary" />}
                  <span className="text-sm font-medium">{isMl ? 'ഡാർക്ക് മോഡ്' : 'Dark Mode'}</span>
                </div>
                <Switch
                  checked={mode === 'dark'}
                  onCheckedChange={toggleMode}
                  aria-label="Toggle dark mode"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                {themes.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t.id)}
                    className={`flex flex-col gap-2 rounded-xl border p-3 text-left transition-all ${
                      theme === t.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border bg-card hover:border-primary/40'
                    }`}
                  >
                    <div className="flex justify-between items-center w-full">
                      <span className="text-xs font-semibold">{t.label}</span>
                      {theme === t.id && <Check className="h-3 w-3 text-primary" />}
                    </div>
                    <div className="flex gap-1">
                      {t.colors.map((c, i) => (
                        <div key={i} className={`h-3 w-6 rounded-full ${c}`} />
                      ))}
                    </div>
                  </button>
                ))}
              </div>
              <div className="pt-4 border-t border-border">
                <div className="flex items-center gap-2 mb-3">
                  <Type className="h-4 w-4 text-primary" />
                  <span className="text-sm font-semibold">{isMl ? 'ഫോണ്ട് സൈസ്' : 'Font Size'}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {fontSizes.map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setFontSize(f.id)}
                      className={`flex items-center justify-between rounded-xl border px-3 py-2 text-left transition-all ${
                        fontSize === f.id
                          ? 'border-primary bg-primary/5'
                          : 'border-border bg-card hover:border-primary/40'
                      }`}
                    >
                      <span className={`font-medium ${
                        f.id === 'small' ? 'text-xs' : 
                        f.id === 'medium' ? 'text-sm' : 
                        f.id === 'large' ? 'text-base' : 
                        'text-lg'
                      }`}>
                        {isMl ? f.malayalam : f.label}
                      </span>
                      {fontSize === f.id && <Check className="h-4 w-4 text-primary" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>


          {/* Access mode */}
          <section>
            <div className="flex items-center gap-2 mb-2">
              <Unlock className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold">
                {isMl ? 'പ്രവേശന രീതി' : 'Access mode'}
              </h3>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-border p-3">
              <div className="min-w-0 pr-3">
                <p className="text-sm font-medium">
                  {isMl ? 'എല്ലാ ടെസ്റ്റുകളും അൺലോക്ക് ചെയ്യുക (ഡെമോ)' : 'Unlock all tests (demo)'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {demoUnlockAll
                    ? (isMl ? 'എല്ലാ പരിശോധനകളും പൂർണ്ണമായി ലഭ്യമാണ്.' : 'All assessments fully unlocked.')
                    : (isMl ? 'ഡെമോ പരിമിതി ബാധകം — Pro ടെസ്റ്റുകൾ ലോക്കാണ്.' : 'Demo limits apply — Pro tests are locked.')}
                </p>
              </div>
              <Switch
                checked={demoUnlockAll}
                onCheckedChange={toggleDemoUnlockAll}
                aria-label="Toggle demo unlock all"
              />
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

          {/* Delete account & all data */}
          <section>
            <div className="flex items-center gap-2 mb-2">
              <ShieldAlert className="h-4 w-4 text-destructive" />
              <h3 className="text-sm font-semibold">
                {isMl ? 'അക്കൗണ്ട് & ഡാറ്റ ഡിലീറ്റ് ചെയ്യുക' : 'Delete account & data'}
              </h3>
            </div>
            <div className="rounded-xl border border-destructive/40 bg-destructive/5 p-3 space-y-3">
              <p className="text-xs text-muted-foreground">
                {isMl
                  ? 'ഈ ഉപകരണത്തിലെ എല്ലാ ഡാറ്റയും (സംരക്ഷിച്ച ഫലങ്ങൾ, രോഗി വിവരങ്ങൾ, മുൻഗണനകൾ, സബ്‌സ്ക്രിപ്ഷൻ അവസ്ഥ) ശാശ്വതമായി മായ്ക്കും. ഈ പ്രവർത്തനം പഴയപടിയാക്കാൻ കഴിയില്ല.'
                  : 'Permanently erases all data stored on this device — saved results, patient identification, preferences, and subscription state. This action cannot be undone.'}
              </p>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm" className="w-full">
                    {isMl ? 'അക്കൗണ്ടും ഡാറ്റയും ഡിലീറ്റ് ചെയ്യുക' : 'Delete account & all data'}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      {isMl ? 'ഉറപ്പാണോ?' : 'Are you absolutely sure?'}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      {isMl
                        ? 'ഈ ഉപകരണത്തിലെ എല്ലാ പ്രാദേശിക ഡാറ്റയും ശാശ്വതമായി ഇല്ലാതാക്കും, തുടർന്ന് ആപ്പ് പുനഃസ്ഥാപിക്കും. ഇത് പഴയപടിയാക്കാൻ കഴിയില്ല.'
                        : 'This will permanently erase every piece of local data this app has stored on this device, then reload the app. This cannot be reversed.'}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>
                      {isMl ? 'റദ്ദാക്കുക' : 'Cancel'}
                    </AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      onClick={async () => {
                        try {
                          clear();
                          clearPatientInfo();
                          try { localStorage.clear(); } catch { /* ignore */ }
                          try { sessionStorage.clear(); } catch { /* ignore */ }
                          try {
                            if ('indexedDB' in window && typeof (indexedDB as unknown as { databases?: () => Promise<Array<{ name?: string }>> }).databases === 'function') {
                              const dbs = await (indexedDB as unknown as { databases: () => Promise<Array<{ name?: string }>> }).databases();
                              await Promise.all(
                                dbs.map((db) =>
                                  db.name
                                    ? new Promise<void>((resolve) => {
                                        const req = indexedDB.deleteDatabase(db.name!);
                                        req.onsuccess = req.onerror = req.onblocked = () => resolve();
                                      })
                                    : Promise.resolve()
                                )
                              );
                            }
                          } catch { /* ignore */ }
                          try {
                            if ('caches' in window) {
                              const keys = await caches.keys();
                              await Promise.all(keys.map((k) => caches.delete(k)));
                            }
                          } catch { /* ignore */ }
                          try {
                            document.cookie.split(';').forEach((c) => {
                              const eq = c.indexOf('=');
                              const name = (eq > -1 ? c.substr(0, eq) : c).trim();
                              if (name) {
                                document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
                              }
                            });
                          } catch { /* ignore */ }
                        } finally {
                          window.location.replace('/');
                        }
                      }}
                    >
                      {isMl ? 'ശാശ്വതമായി ഡിലീറ്റ് ചെയ്യുക' : 'Delete permanently'}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </section>
        </CardContent>
      </Card>
    </div>
  );
};
