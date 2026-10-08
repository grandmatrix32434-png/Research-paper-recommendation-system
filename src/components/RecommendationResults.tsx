import React, { useState } from 'react';
import { Paper, RecommendationMode, SortOption } from '../types/paper';

interface RecommendationResultsProps {
  query: string;
  papers: Paper[];
  isLoading: boolean;
  onSelectPaper: (paper: Paper) => void;
  savedPaperIds: string[];
  onToggleSave: (paper: Paper) => void;
  onNewSearch: (query: string) => void;
  recommendationMode: RecommendationMode;
  onChangeMode: (mode: RecommendationMode) => void;
}

export const RecommendationResults: React.FC<RecommendationResultsProps> = ({
  query,
  papers,
  isLoading,
  onSelectPaper,
  savedPaperIds,
  onToggleSave,
  onNewSearch,
  recommendationMode,
  onChangeMode,
}) => {
  const [searchInput, setSearchInput] = useState(query);
  const [sortOption, setSortOption] = useState<SortOption>('relevance');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Extract categories for filter
  const categories = ['all', ...Array.from(new Set(papers.map((p) => p.primaryCategory)))];

  // Filter & Sort
  const filteredPapers = papers.filter((p) => {
    if (selectedCategory === 'all') return true;
    return p.primaryCategory === selectedCategory;
  });

  const sortedPapers = [...filteredPapers].sort((a, b) => {
    if (sortOption === 'relevance') return b.similarityScore - a.similarityScore;
    if (sortOption === 'year') return b.publicationYear - a.publicationYear;
    if (sortOption === 'citations') return b.citationCount - a.citationCount;
    return 0;
  });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onNewSearch(searchInput.trim());
    }
  };

  return (
    <section className="w-full max-w-[1440px] mx-auto px-6 md:px-12 py-8 md:py-12">
      {/* Top Query Header Bar */}
      <div className="mb-10 pb-8 border-b border-[#122b1e]/15">
        
        {/* Editorial Subtitle / Kicker */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
          <div className="flex items-center gap-2 text-xs font-editorial-mono text-[#122b1e]/60 uppercase tracking-wider">
            <div className="w-2 h-2 rounded-full bg-[#dc5b34]" />
            <span>Recommended for you · Hybrid Intelligence</span>
          </div>
          
          <div className="text-xs font-editorial-mono text-[#122b1e]/60">
            {papers.length} papers retrieved · 250M+ Academic Graph
          </div>
        </div>

        {/* Search Input Bar for Refinement */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="flex-1 max-w-2xl">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#122b1e] tracking-tight leading-tight mb-4">
              {query ? `Recommendations for "${query}"` : 'Curated Research Recommendations'}
            </h1>
            <p className="text-xs md:text-sm text-[#122b1e]/70 leading-relaxed">
              Synthesized using deep semantic embeddings from titles, abstracts, and concept graphs fused with collaborative citation affinity.
            </p>
          </div>

          <form onSubmit={handleSearchSubmit} className="flex gap-2 w-full lg:w-auto">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Refine topic, author, or keyword..."
              className="px-4 py-2 text-sm bg-[#f5f8f4] border border-[#122b1e]/20 rounded-md text-[#122b1e] focus:outline-none focus:border-[#122b1e] w-full lg:w-72 font-medium"
            />
            <button
              type="submit"
              disabled={isLoading || !searchInput.trim()}
              className="px-4 py-2 bg-[#122b1e] hover:bg-[#1a3d2e] text-white text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap shadow-sm disabled:opacity-50"
            >
              {isLoading ? 'Updating...' : 'Search'}
            </button>
          </form>
        </div>

        {/* Control Bar: Recommendation Mode & Sort Options (Zero-Pill: Clean Segmented Controls) */}
        <div className="mt-8 pt-6 border-t border-[#122b1e]/10 flex flex-wrap items-center justify-between gap-4">
          
          {/* Mode Selector */}
          <div className="flex items-center gap-1 p-1 bg-[#e2ebe0]/70 rounded-lg text-xs font-medium">
            <span className="px-2.5 py-1 text-[#122b1e]/50 font-editorial-mono text-[11px] uppercase tracking-wider">
              Mode:
            </span>
            <button
              onClick={() => onChangeMode('hybrid')}
              className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                recommendationMode === 'hybrid'
                  ? 'bg-white text-[#122b1e] font-semibold shadow-xs'
                  : 'text-[#122b1e]/70 hover:text-[#122b1e]'
              }`}
            >
              Hybrid (Recommended)
            </button>
            <button
              onClick={() => onChangeMode('content')}
              className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                recommendationMode === 'content'
                  ? 'bg-white text-[#122b1e] font-semibold shadow-xs'
                  : 'text-[#122b1e]/70 hover:text-[#122b1e]'
              }`}
            >
              Content Similarity
            </button>
            <button
              onClick={() => onChangeMode('collaborative')}
              className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                recommendationMode === 'collaborative'
                  ? 'bg-white text-[#122b1e] font-semibold shadow-xs'
                  : 'text-[#122b1e]/70 hover:text-[#122b1e]'
              }`}
            >
              Reader Citations
            </button>
          </div>

          {/* Sort & Category Controls */}
          <div className="flex flex-wrap items-center gap-4 text-xs">
            {categories.length > 2 && (
              <div className="flex items-center gap-2">
                <span className="text-[#122b1e]/50 font-editorial-mono uppercase text-[11px]">Category:</span>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-transparent border-b border-[#122b1e]/30 text-[#122b1e] font-medium py-1 px-1 focus:outline-none cursor-pointer"
                >
                  {categories.map((c) => (
                    <option key={c} value={c} className="bg-[#edf2ec] text-[#122b1e]">
                      {c === 'all' ? 'All Disciplines' : c}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="flex items-center gap-2">
              <span className="text-[#122b1e]/50 font-editorial-mono uppercase text-[11px]">Sort By:</span>
              <div className="flex items-center gap-1">
                {(['relevance', 'year', 'citations'] as SortOption[]).map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setSortOption(opt)}
                    className={`px-2 py-1 rounded transition-colors cursor-pointer capitalize font-medium ${
                      sortOption === opt
                        ? 'text-[#122b1e] font-bold underline underline-offset-4'
                        : 'text-[#122b1e]/60 hover:text-[#122b1e]'
                    }`}
                  >
                    {opt === 'relevance' ? 'Match' : opt}
                  </button>
                ))}
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Loading Skeleton / Status */}
      {isLoading && (
        <div className="py-16 text-center space-y-4">
          <div className="inline-block w-8 h-8 border-3 border-[#122b1e]/20 border-t-[#122b1e] rounded-full animate-spin" />
          <p className="text-sm font-editorial-mono text-[#122b1e]/70">
            Synthesizing hybrid semantic recommendations from academic repository...
          </p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && sortedPapers.length === 0 && (
        <div className="py-16 text-center space-y-3 bg-[#f5f8f4] border border-[#122b1e]/10 rounded-xl p-8">
          <h3 className="text-lg font-bold text-[#122b1e]">No matching research papers found</h3>
          <p className="text-xs text-[#122b1e]/70 max-w-md mx-auto">
            Try adjusting your search query, selecting "All Disciplines", or exploring one of the suggested benchmark topics.
          </p>
          <button
            onClick={() => onNewSearch('machine learning for medical diagnosis')}
            className="mt-4 px-4 py-2 bg-[#122b1e] text-white text-xs font-semibold rounded cursor-pointer hover:bg-[#1a3d2e]"
          >
            Explore Medical Machine Learning
          </button>
        </div>
      )}

      {/* Results List: Papers rendered using exact card language of the Reference Design */}
      {!isLoading && sortedPapers.length > 0 && (
        <div className="space-y-5">
          {sortedPapers.map((paper, idx) => {
            const isSaved = savedPaperIds.includes(paper.id);
            const matchPercent = Math.round(paper.similarityScore * 100);

            return (
              <article
                key={paper.id}
                className="bg-[#f5f8f4] border border-[#122b1e]/15 rounded-xl p-6 md:p-8 hover:border-[#122b1e]/40 transition-all duration-200 shadow-xs hover:shadow-md relative group flex flex-col justify-between"
              >
                <div>
                  {/* Top Metadata Row (Zero-Pill: Clean unboxed text with subtle dividers) */}
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-3 text-xs text-[#122b1e]/65">
                    
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-editorial-mono text-[#122b1e]/50 text-[11px] font-medium">
                        [{String(idx + 1).padStart(2, '0')}]
                      </span>
                      <span className="font-semibold text-[#122b1e]">
                        {paper.primaryCategory}
                      </span>
                      <span aria-hidden="true" className="text-[#122b1e]/30">·</span>
                      <span>{paper.publicationYear}</span>
                      {paper.venue && (
                        <>
                          <span aria-hidden="true" className="text-[#122b1e]/30">·</span>
                          <span className="italic">{paper.venue}</span>
                        </>
                      )}
                      <span aria-hidden="true" className="text-[#122b1e]/30">·</span>
                      <span className="font-editorial-mono tabular-nums">{paper.citationCount.toLocaleString()} citations</span>
                    </div>

                    {/* Relevance / Match Metric */}
                    <div className="flex items-center gap-1.5 font-editorial-mono text-xs">
                      <span className="w-2 h-2 rounded-full bg-[#dc5b34]" />
                      <span className="font-bold text-[#122b1e] tabular-nums">
                        {matchPercent}% Match
                      </span>
                    </div>
                  </div>

                  {/* Paper Title (Deep Pine Typography with Hover Underline) */}
                  <h2
                    onClick={() => onSelectPaper(paper)}
                    className="text-lg md:text-xl lg:text-2xl font-bold text-[#122b1e] leading-snug tracking-tight hover:underline cursor-pointer mb-3"
                  >
                    {paper.title}
                  </h2>

                  {/* Authors Line */}
                  <p className="text-xs md:text-sm text-[#122b1e]/80 font-medium mb-3">
                    {paper.authors.join(', ')}
                  </p>

                  {/* Abstract / Snippet Preview */}
                  <p className="text-xs md:text-sm text-[#122b1e]/75 leading-relaxed line-clamp-3 mb-4 font-normal">
                    {paper.abstract}
                  </p>

                  {/* Topics (Unboxed metadata with slashes) */}
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#122b1e]/60 mb-5">
                    <span className="font-editorial-mono uppercase text-[10px] text-[#122b1e]/40 mr-1">
                      Topics:
                    </span>
                    {paper.topics.slice(0, 4).map((topic, i) => (
                      <React.Fragment key={topic}>
                        <span className="font-medium text-[#122b1e]/80">{topic}</span>
                        {i < Math.min(paper.topics.length, 4) - 1 && (
                          <span className="text-[#122b1e]/25 select-none">/</span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                {/* Card Footer: "Why this paper?" Explanation + Primary Actions */}
                <div className="pt-4 border-t border-[#122b1e]/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  
                  {/* Subtle "Why this paper?" explanation */}
                  <div className="flex items-center gap-2 text-xs text-[#122b1e]/75 font-editorial-mono">
                    <span className="w-1.5 h-1.5 bg-[#122b1e]/40 rounded-full shrink-0" />
                    <span>{paper.whyThisPaper}</span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
                    <button
                      onClick={() => onToggleSave(paper)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors cursor-pointer ${
                        isSaved
                          ? 'bg-[#dc5b34] text-white hover:bg-[#c44f2b]'
                          : 'bg-[#122b1e]/5 text-[#122b1e] hover:bg-[#122b1e]/15'
                      }`}
                    >
                      {isSaved ? 'Saved ✓' : 'Save'}
                    </button>

                    <button
                      onClick={() => onSelectPaper(paper)}
                      className="px-4 py-1.5 text-xs font-semibold bg-[#122b1e] hover:bg-[#1a3d2e] text-white rounded transition-colors cursor-pointer flex items-center gap-1 shadow-xs"
                    >
                      <span>Inspect Paper</span>
                      <span aria-hidden="true">→</span>
                    </button>
                  </div>

                </div>

              </article>
            );
          })}
        </div>
      )}

    </section>
  );
};
