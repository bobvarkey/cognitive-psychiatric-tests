import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Sidebar } from '@/components/layout/Sidebar';
import { AssessmentCard } from '@/components/AssessmentCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getAssessmentsByCategory, getSubcategoriesByCategory } from '@/config/assessments';
import { Search, ChevronLeft } from 'lucide-react';

export default function CategoryBrowser() {
  const { category: encodedCategory } = useParams();
  const category = decodeURIComponent(encodedCategory || '');
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);

  const assessments = getAssessmentsByCategory(category);
  const subcategories = getSubcategoriesByCategory(category);

  const filteredAssessments = assessments.filter(a => {
    const matchesSearch = a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.abbreviation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubcategory = !selectedSubcategory || a.subcategory === selectedSubcategory;
    return matchesSearch && matchesSubcategory;
  });

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header
        onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
        showSearch={false}
      />

      <div className="flex flex-1">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          activeCategory={category}
        />

        <main className="flex-1">
          {/* Breadcrumb & Header */}
          <div className="bg-white border-b sticky top-16 z-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="flex items-center gap-4 mb-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/')}
                  className="gap-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Back
                </Button>
              </div>
              <h1 className="text-3xl font-bold text-gray-900">{category}</h1>
              <p className="text-gray-600 mt-2">
                {assessments.length} assessment{assessments.length !== 1 ? 's' : ''} available in this category
              </p>
            </div>
          </div>

          {/* Filters & Search */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Search Bar */}
            <div className="mb-8">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Search assessments..."
                  className="pl-10 bg-white"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Subcategory Filters */}
            {subcategories.length > 0 && (
              <div className="mb-8">
                <p className="text-sm font-semibold text-gray-700 mb-3">Filter by Type:</p>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={selectedSubcategory === null ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedSubcategory(null)}
                  >
                    All
                  </Button>
                  {subcategories.map(subcategory => (
                    <Button
                      key={subcategory}
                      variant={selectedSubcategory === subcategory ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedSubcategory(
                        selectedSubcategory === subcategory ? null : subcategory
                      )}
                    >
                      {subcategory}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Results */}
            {filteredAssessments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAssessments.map(assessment => (
                  <AssessmentCard
                    key={assessment.id}
                    assessment={assessment}
                    onClick={() => navigate(`/assessment/${assessment.id}`)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600">No assessments found matching your criteria.</p>
              </div>
            )}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
