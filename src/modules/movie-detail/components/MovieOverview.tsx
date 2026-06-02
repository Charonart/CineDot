import React from 'react';
import { ScrollTextSlideLeft, HighlightText } from '@/shared/components/visual';

interface MovieOverviewProps {
  overview: string;
}

export const MovieOverview: React.FC<MovieOverviewProps> = ({ overview }) => {
  // Split paragraph by newline if any to make it readable in multiple paragraph tags
  const paragraphs = overview.split('\n').filter(p => p.trim() !== '');

  return (
    <section className="section-detail-content fade-up in-view">
      <ScrollTextSlideLeft as="h2" className="detail-section-title">
        Nội dung{' '}
        <HighlightText variant="underline" color="primary">
          phim
        </HighlightText>
      </ScrollTextSlideLeft>
      <div className="detail-article">
        {paragraphs.map((p, idx) => (
          <p key={idx}>{p}</p>
        ))}
      </div>
    </section>
  );
};
