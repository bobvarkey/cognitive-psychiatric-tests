import { Lightbulb, ExternalLink, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export const SuggestionsView = () => {
  const suggestionsUrl = 'https://forms.gle/suggestions-psycognito';

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
            <Lightbulb className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Send us your suggestions</h1>
            <p className="text-gray-400 text-sm">Help us improve Cognito with your feedback</p>
          </div>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid gap-4">
        <Card className="bg-slate-800/40 border-indigo-500/20 p-6">
          <div className="flex gap-4">
            <div className="flex-shrink-0 text-2xl">💡</div>
            <div>
              <h3 className="font-semibold text-white mb-1">New Features</h3>
              <p className="text-sm text-gray-400">
                Suggest new assessments, tools, or clinical features you'd like to see.
              </p>
            </div>
          </div>
        </Card>

        <Card className="bg-slate-800/40 border-indigo-500/20 p-6">
          <div className="flex gap-4">
            <div className="flex-shrink-0 text-2xl">🐛</div>
            <div>
              <h3 className="font-semibold text-white mb-1">Bug Reports</h3>
              <p className="text-sm text-gray-400">
                Found an issue? Let us know so we can fix it quickly.
              </p>
            </div>
          </div>
        </Card>

        <Card className="bg-slate-800/40 border-indigo-500/20 p-6">
          <div className="flex gap-4">
            <div className="flex-shrink-0 text-2xl">⚙️</div>
            <div>
              <h3 className="font-semibold text-white mb-1">Improvements</h3>
              <p className="text-sm text-gray-400">
                Have ideas to make the interface better or faster?
              </p>
            </div>
          </div>
        </Card>

        <Card className="bg-slate-800/40 border-indigo-500/20 p-6">
          <div className="flex gap-4">
            <div className="flex-shrink-0 text-2xl">❓</div>
            <div>
              <h3 className="font-semibold text-white mb-1">Questions</h3>
              <p className="text-sm text-gray-400">
                Not sure about a feature? Ask us directly in the feedback form.
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* CTA Section */}
      <Card className="bg-gradient-to-br from-indigo-600/20 to-purple-600/20 border-indigo-500/40 p-8 text-center">
        <MessageSquare className="w-12 h-12 text-indigo-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Your feedback matters</h2>
        <p className="text-gray-400 mb-6">
          Help shape the future of clinical assessment tools. Share your thoughts and ideas with our team.
        </p>
        <a href={suggestionsUrl} target="_blank" rel="noopener noreferrer">
          <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold px-8 py-3 rounded-xl inline-flex items-center gap-2">
            Open Feedback Form
            <ExternalLink className="w-4 h-4" />
          </Button>
        </a>
      </Card>

      {/* Footer Note */}
      <div className="bg-slate-800/20 border border-slate-700/40 rounded-lg p-4 text-center">
        <p className="text-xs text-gray-500">
          Feedback is reviewed by our team and prioritized based on community interest.
        </p>
      </div>
    </div>
  );
};
