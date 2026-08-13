import { Lightbulb, ExternalLink, MessageSquare, AlertCircle, RefreshCw, Send, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { toast } from 'sonner';

export const SuggestionsView = () => {
  const [showFallback, setShowFallback] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const suggestionsUrl = 'https://forms.gle/vPqf8m9z5jS2e6S78';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.message) {
      toast.error("Please fill in both name and message");
      return;
    }
    
    // Simulate submission
    console.log('Local feedback submitted:', formData);
    setSubmitted(true);
    toast.success("Feedback sent successfully!");
    
    // Reset form after a delay
    setTimeout(() => {
      setSubmitted(false);
      setShowFallback(false);
      setFormData({ name: '', email: '', message: '' });
    }, 3000);
  };

  return (
    <div className="space-y-6 max-w-2xl pb-20">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sunset-orange to-sunset-purple flex items-center justify-center">
            <Lightbulb className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Send us your suggestions</h1>
            <p className="text-gray-400 text-sm">Help us improve Cognito with your feedback</p>
          </div>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { emoji: '💡', title: 'New Features', desc: "Suggest new assessments, tools, or clinical features." },
          { emoji: '🐛', title: 'Bug Reports', desc: "Found an issue? Let us know so we can fix it quickly." },
          { emoji: '⚙️', title: 'Improvements', desc: "Ideas to make the interface better or faster." },
          { emoji: '❓', title: 'Questions', desc: "Not sure about a feature? Ask us directly." }
        ].map((item, idx) => (
          <Card key={idx} className="bg-slate-900/40 border-slate-800/60 p-5 hover:border-sunset-orange/30 transition-colors">
            <div className="flex gap-4">
              <div className="flex-shrink-0 text-2xl">{item.emoji}</div>
              <div>
                <h3 className="font-semibold text-white mb-1">{item.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Main Feedback Section */}
      <Card className="bg-gradient-to-br from-slate-900/60 to-slate-800/40 border-slate-700/50 p-8">
        {!showFallback ? (
          <div className="text-center">
            <MessageSquare className="w-12 h-12 text-sunset-orange mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Your feedback matters</h2>
            <p className="text-gray-400 mb-6 max-w-md mx-auto">
              Help shape the future of clinical assessment tools. Use our Google Form for detailed feedback.
            </p>
            <div className="flex flex-col items-center gap-4">
              <a 
                href={suggestionsUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full sm:w-auto"
              >
                <Button className="w-full bg-gradient-to-r from-sunset-orange to-sunset-purple hover:opacity-90 text-white font-semibold px-8 py-6 rounded-xl inline-flex items-center justify-center gap-2 shadow-lg shadow-orange-950/20">
                  Open Google Form
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </a>
              
              <button 
                onClick={() => setShowFallback(true)}
                className="text-sm text-gray-500 hover:text-sunset-orange transition-colors flex items-center gap-2"
              >
                Link not working? Use local form instead
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-sunset-orange" />
                Local Feedback Form
              </h2>
              <button 
                onClick={() => setShowFallback(false)}
                className="text-xs text-gray-500 hover:text-white"
              >
                Back to Google Form
              </button>
            </div>

            {submitted ? (
              <div className="py-10 text-center space-y-4 animate-in fade-in zoom-in duration-300">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8 text-green-500" />
                </div>
                <h3 className="text-xl font-semibold text-white">Thank You!</h3>
                <p className="text-gray-400">Your feedback has been received locally.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Name *</label>
                    <Input 
                      placeholder="Your name"
                      className="bg-slate-950/50 border-slate-700 focus:border-sunset-orange"
                      value={formData.name}
                      onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Email (Optional)</label>
                    <Input 
                      type="email"
                      placeholder="your@email.com"
                      className="bg-slate-950/50 border-slate-700 focus:border-sunset-orange"
                      value={formData.email}
                      onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Message *</label>
                  <Textarea 
                    placeholder="Tell us what you think..."
                    className="bg-slate-950/50 border-slate-700 focus:border-sunset-orange min-h-[120px]"
                    value={formData.message}
                    onChange={e => setFormData(prev => ({ ...prev, message: e.target.value }))}
                    required
                  />
                </div>
                <Button 
                  type="submit"
                  className="w-full bg-sunset-orange hover:bg-sunset-orange/90 text-white gap-2 py-6 rounded-xl font-bold"
                >
                  <Send className="w-4 h-4" />
                  Submit Feedback
                </Button>
              </form>
            )}
          </div>
        )}
      </Card>

      {/* Footer Note */}
      <div className="bg-slate-900/20 border border-slate-800/40 rounded-xl p-4 text-center">
        <p className="text-xs text-gray-500 leading-relaxed">
          Feedback is reviewed by our team and used to prioritize future updates.<br />
          Thank you for contributing to the Psycognito community.
        </p>
      </div>
    </div>
  );
};
