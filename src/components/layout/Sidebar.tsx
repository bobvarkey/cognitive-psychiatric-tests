import { Link } from 'react-router-dom';
import { getAllCategories, ASSESSMENT_CATEGORIES } from '@/config/assessments';
import { cn } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  activeCategory?: string;
}

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

export const Sidebar = ({ isOpen = true, onClose, activeCategory }: SidebarProps) => {
  const categories = getAllCategories();

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 border-r bg-white transition-transform duration-200 md:static md:translate-x-0 z-40 overflow-y-auto',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <nav className="p-4 space-y-2">
          {/* Back to Home */}
          <Link
            to="/"
            className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 text-gray-700 hover:text-blue-600 transition-colors mb-6"
            onClick={onClose}
          >
            <span>← Home</span>
          </Link>

          {/* Categories */}
          <div className="space-y-1">
            {categories.map((category) => (
              <Link
                key={category}
                to={`/category/${encodeURIComponent(category)}`}
                onClick={onClose}
                className={cn(
                  'flex items-center justify-between px-4 py-3 rounded-lg transition-colors',
                  activeCategory === category
                    ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                    : 'text-gray-700 hover:bg-gray-100'
                )}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{categoryIcons[category]}</span>
                  <span className="text-sm font-medium">{category}</span>
                </div>
                <ChevronRight className="h-4 w-4" />
              </Link>
            ))}
          </div>

          {/* Divider */}
          <div className="my-6 border-t" />

          {/* Quick Links */}
          <div className="space-y-2">
            <h3 className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase">
              Quick Actions
            </h3>
            <a
              href="#recent"
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors text-sm"
            >
              <span>📋</span>
              <span>Recent Assessments</span>
            </a>
            <a
              href="#favorites"
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors text-sm"
            >
              <span>⭐</span>
              <span>Favorites</span>
            </a>
            <a
              href="#patients"
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors text-sm"
            >
              <span>👥</span>
              <span>Patient Info</span>
            </a>
          </div>
        </nav>
      </aside>
    </>
  );
};
