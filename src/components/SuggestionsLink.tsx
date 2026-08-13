import { Lightbulb, RefreshCw, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';
import { toast } from 'sonner';

interface SuggestionsLinkProps {
  variant?: 'button' | 'link' | 'icon';
  className?: string;
}

export const SuggestionsLink = ({ variant = 'link', className = '' }: SuggestionsLinkProps) => {
  const [isRetrying, setIsRetrying] = useState(false);
  const suggestionsUrl = 'https://forms.gle/vPqf8m9z5jS2e6S78';

  const openSuggestions = async () => {
    setIsRetrying(true);
    try {
      window.open(suggestionsUrl, '_blank', 'noopener,noreferrer');
      toast.success("Opening feedback form...");
    } catch (err) {
      toast.error("Could not open feedback form. Please try again.");
    } finally {
      // Small delay to show state
      setTimeout(() => setIsRetrying(false), 500);
    }
  };

  if (variant === 'icon') {
    return (
      <button
        onClick={openSuggestions}
        className={`p-2 rounded-lg hover:bg-indigo-500/20 transition text-indigo-400 hover:text-indigo-300 ${className}`}
        title="Send us your suggestions"
      >
        <Lightbulb className="w-5 h-5" />
      </button>
    );
  }

  if (variant === 'button') {
    return (
      <button
        onClick={openSuggestions}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 hover:text-indigo-200 transition border border-indigo-500/30 hover:border-indigo-400/50 ${className}`}
      >
        <Lightbulb className="w-4 h-4" />
        <span className="text-sm font-medium">Suggestions</span>
      </button>
    );
  }

  return (
    <a
      href={suggestionsUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`text-indigo-400 hover:text-indigo-300 font-medium text-xs transition ${className}`}
    >
      Suggestions
    </a>
  );
};
