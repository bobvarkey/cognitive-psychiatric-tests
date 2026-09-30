import terms from '../../TERMS_OF_USE.md?raw';
import privacy from '../../PRIVACY_POLICY.md?raw';

export const LegalPage = ({ kind }: { kind: 'terms' | 'privacy' }) => (
  <main className="min-h-screen bg-background px-4 py-8 pt-[max(2rem,env(safe-area-inset-top))]">
    <article className="mx-auto max-w-3xl">
      <a href="/" className="text-sm font-medium text-primary hover:underline">← Back</a>
      <pre className="mt-4 whitespace-pre-wrap break-words font-sans text-sm leading-relaxed text-foreground">
        {kind === 'terms' ? terms : privacy}
      </pre>
    </article>
  </main>
);

export default LegalPage;
