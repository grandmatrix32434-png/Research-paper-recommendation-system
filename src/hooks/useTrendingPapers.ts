import { useState, useEffect, useCallback } from 'react';
import { Paper } from '../types/paper';
import {
  TrendingPaper,
  TrendingTimeframe,
  getTrendingPapers,
  trackPaperInteraction,
} from '../services/trendingService';

interface UseTrendingPapersResult {
  timeframe: TrendingTimeframe;
  setTimeframe: (tf: TrendingTimeframe) => void;
  trendingPapers: TrendingPaper[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
  recordInteraction: (paperId: string, type?: 'search' | 'inspect') => void;
}

export function useTrendingPapers(knownPapers: Paper[] = []): UseTrendingPapersResult {
  const [timeframe, setTimeframe] = useState<TrendingTimeframe>('week');
  const [trendingPapers, setTrendingPapers] = useState<TrendingPaper[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTrending = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const papers = await getTrendingPapers(timeframe, knownPapers);
      setTrendingPapers(papers);
    } catch (err: any) {
      console.error('Failed to load trending papers:', err);
      setError('Unable to retrieve trending papers right now.');
    } finally {
      setIsLoading(false);
    }
  }, [timeframe, knownPapers]);

  useEffect(() => {
    fetchTrending();
  }, [fetchTrending]);

  const handleRecordInteraction = useCallback((paperId: string, type: 'search' | 'inspect' = 'search') => {
    trackPaperInteraction(paperId, type);
  }, []);

  return {
    timeframe,
    setTimeframe,
    trendingPapers,
    isLoading,
    error,
    refetch: fetchTrending,
    recordInteraction: handleRecordInteraction,
  };
}
