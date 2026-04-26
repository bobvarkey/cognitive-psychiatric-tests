import { Link } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card } from '@/components/ui/card';
import { getAssessmentsByCategory, getAllCategories, ASSESSMENT_CATEGORIES } from '@/config/assessments';
import { ArrowRight, BookOpen, Shield, Zap, Languages, Star, ChevronDown, Check, Sparkles, Brain } from 'lucide-react';

const categoryIcons: Record<string, string> = {
  [ASSESSMENT_CATEGORIES.COGNITIVE]: '🧠',
  [ASSESSMENT_CATEGORIES.PSYCHIATRIC]: '😞',
  [ASSESSMENT_CATEGORIES.NEUROLOGICAL]: '🔬',
  [ASSESSMENT_CATEGORIES.SUBSTANCE]: '💊',
  [ASSESSMENT_CATEGORIES.RISK]: '⚠️',
  [ASSESSMENT_CATEGORIES.MOVEMENT]: '🚶',
  [ASSESSMENT_CATEGORIES.SLEEP]: '💤',
  [ASSESSMENT_CATEGORIES.PEDIATRIC]: '👶',
  [ASSESSMENT_CATEGORIES.GENERAL]: '🏥',
};

export default function Landing() {
  const categories = getAllCategories();

  return (
    <div className="flex flex-col min-h-screen bg-black">
      <Header dark />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative min-h-[85vh] flex flex-col items-center justify-center px-4 overflow-hidden">
          {/* Ambient gradient blobs */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-fuchsia-600/20 blur-[120px] rounded-full" />
            <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-cyan-500/15 blur-[100px] rounded-full" />
          </div>

          {/* App icon */}
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-600 to-cyan-500 rounded-3xl blur-xl opacity-60" />
            <div className="relative w-24 h-24 bg-gradient-to-br from-fuchsia-600 to-cyan-500 rounded-3xl flex items-center justify-center shadow-[0_0_40px_rgba(255,0,255,0.4)]">
              <Brain className="w-12 h-12 text-white drop-shadow-[0_0_10px_rgba(0,255,255,0.8)]" />
            </div>
          </div>

          {/* Eyebrow badge */}
          <div className="mb-5 inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-fuchsia-500/30 text-sm text-gray-300">
            <Sparkles className="w-4 h-4 text-fuchsia-400" />
            Clinical Assessment Platform
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-white text-center leading-tight mb-4 max-w-3xl">
            Every Neuro-Psych Scale.<br />
            <span className="neon-purple">One App.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg text-gray-400 text-center max-w-xl mb-8">
            65 evidence-based assessments for psychiatric, cognitive, and neurological evaluation — scored instantly, built for clinicians.
          </p>

          {/* Star rating */}
          <div className="flex items-center gap-2 mb-8">
            <div className="flex gap-1">{[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 star-pulse fill-yellow-400 text-yellow-400" />)}</div>
            <span className="text-sm text-gray-400">49 ratings · Used by 1,000+ clinicians</span>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/assessment/home">
              <button className="btn-neon">Start Free — 25 Assessments</button>
            </Link>
            <button className="px-6 py-3 rounded-xl border border-white/20 text-white hover:bg-white/10 transition font-semibold">
              View Pro Plans
            </button>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 animate-bounce text-gray-600">
            <ChevronDown className="w-5 h-5" />
          </div>
        </section>

        {/* Features Pills Section */}
        <section className="py-16 px-4 border-t border-white/5">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-white text-center mb-10">
              Built for the Clinical Workflow
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { icon: Zap, title: 'Instant Scoring', desc: 'Auto-calculated scores with severity banding and clinical interpretation.', color: 'text-yellow-400' },
                { icon: Shield, title: 'HIPAA Compliant', desc: 'No PHI stored — all data stays on-device. No login required.', color: 'text-cyan-400' },
                { icon: BookOpen, title: '65 Validated Scales', desc: 'From MoCA to PANSS — every major neuropsychiatric and neurological assessment included.', color: 'text-fuchsia-400' },
                { icon: Languages, title: 'Multilingual', desc: 'Malayalam and English support; more languages planned.', color: 'text-green-400' },
              ].map(({ icon: Icon, title, desc, color }) => (
                <div key={title} className="flex gap-4 p-5 rounded-2xl glass-dark border border-white/5">
                  <Icon className={`w-6 h-6 shrink-0 mt-0.5 ${color}`} />
                  <div>
                    <h3 className="font-semibold text-white mb-1">{title}</h3>
                    <p className="text-sm text-gray-400">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Bar */}
        <section className="py-10 px-4 border-y border-white/5">
          <div className="max-w-4xl mx-auto flex flex-wrap justify-center gap-8 text-center">
            {[['65+', 'Assessment Scales'], ['9', 'Specialty Categories'], ['600+', 'Clinical Items'], ['Free', 'To Start']].map(([stat, label]) => (
              <div key={label}>
                <div className="text-3xl font-bold neon-blue">{stat}</div>
                <div className="text-sm text-gray-500">{label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing Preview Section */}
        <section className="py-16 px-4 border-t border-white/5">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-3">Simple Pricing</h2>
            <p className="text-gray-400 mb-8">Start free with 25 tools. Go Pro for all 65.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Lite card */}
              <div className="p-6 rounded-2xl glass-dark border border-white/10 text-left">
                <div className="text-sm text-gray-400 mb-1">Lite — Free to try</div>
                <div className="text-4xl font-bold text-white mb-1">$19.99<span className="text-base text-gray-500">/yr</span></div>
                <div className="text-xs text-gray-500 mb-4">Then $16.99/yr · or $2.99/mo</div>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li className="flex gap-2 items-center"><Check className="w-4 h-4 text-cyan-400" />25 core assessments</li>
                  <li className="flex gap-2 items-center"><Check className="w-4 h-4 text-cyan-400" />PDF export</li>
                  <li className="flex gap-2 items-center"><Check className="w-4 h-4 text-cyan-400" />Offline access</li>
                </ul>
              </div>
              {/* Pro card */}
              <div className="relative p-6 rounded-2xl border border-fuchsia-500/40 text-left bg-gradient-to-br from-fuchsia-600/10 to-cyan-600/5 shadow-[0_0_30px_rgba(255,0,255,0.15)]">
                <div className="absolute -top-3 left-4 px-3 py-1 rounded-full bg-gradient-to-r from-fuchsia-600 to-cyan-500 text-xs font-bold text-white">RECOMMENDED</div>
                <div className="text-sm text-gray-400 mb-1">Pro</div>
                <div className="text-4xl font-bold text-white mb-1">$29.99<span className="text-base text-gray-500">/yr</span></div>
                <div className="text-xs text-gray-500 mb-4">Then $19.99/yr · or $3.99/mo</div>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li className="flex gap-2 items-center"><Check className="w-4 h-4 text-fuchsia-400" />All 65 assessments</li>
                  <li className="flex gap-2 items-center"><Check className="w-4 h-4 text-fuchsia-400" />PDF & DOCX export</li>
                  <li className="flex gap-2 items-center"><Check className="w-4 h-4 text-fuchsia-400" />Patient tracking</li>
                  <li className="flex gap-2 items-center"><Check className="w-4 h-4 text-fuchsia-400" />Priority support</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Grid */}
        <section className="py-16 px-4 border-t border-white/5">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-4 text-white">Assessment Categories</h2>
            <p className="text-gray-400 mb-12 max-w-2xl">
              Organized assessment tools covering cognitive, psychiatric, neurological, and specialized evaluations.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category) => {
                const assessmentsInCategory = getAssessmentsByCategory(category);
                return (
                  <Link
                    key={category}
                    to={`/category/${encodeURIComponent(category)}`}
                    className="group"
                  >
                    <Card className="p-6 h-full hover:shadow-lg transition-all cursor-pointer border-2 border-slate-700 hover:border-fuchsia-500 bg-slate-800/50 glass-dark">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="text-5xl">{categoryIcons[category]}</div>
                        <div>
                          <h3 className="font-bold text-white group-hover:text-fuchsia-400 transition-colors">
                            {category}
                          </h3>
                          <p className="text-sm text-gray-400">
                            {assessmentsInCategory.length} assessments
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-400 mb-4">
                        {assessmentsInCategory.slice(0, 2).map(a => a.abbreviation).join(', ')}
                        {assessmentsInCategory.length > 2 && '...'}
                      </p>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-fuchsia-600 to-cyan-600 py-16 px-4 border-t border-white/5">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to elevate your clinical workflow?
            </h2>
            <p className="text-white/90 mb-8 max-w-2xl mx-auto">
              Get started with 25 core assessments free, or upgrade to Pro for all 65.
            </p>
            <Link to="/assessment/home">
              <button className="px-8 py-3 rounded-xl bg-white text-fuchsia-600 hover:bg-gray-100 font-semibold transition">
                Start Free Now <ArrowRight className="ml-2 h-5 w-5 inline" />
              </button>
            </Link>
          </div>
        </section>
      </main>

      <Footer dark />
    </div>
  );
}
