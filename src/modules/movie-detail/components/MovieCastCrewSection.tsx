'use client';

import React from 'react';
import Link from 'next/link';
import { User, ChevronRight, Sparkles } from 'lucide-react';
import { MovieCastMember, MovieCrewMember } from '../types/movie-detail.types';

interface MovieCastCrewSectionProps {
  castMembers?: MovieCastMember[];
  crewMembers?: MovieCrewMember[];
  director?: string;
  directorId?: string | number | null;
}

export const MovieCastCrewSection: React.FC<MovieCastCrewSectionProps> = ({
  castMembers = [],
  crewMembers = [],
  director,
  directorId,
}) => {
  const hasCast = castMembers.length > 0;
  const hasCrew = crewMembers.length > 0;

  if (!hasCast && !hasCrew && !director) {
    return null;
  }

  return (
    <div className="py-8 border-b border-gray-200 flex flex-col gap-6">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-6 bg-[#7C6FE8] rounded-full shadow-[0_0_10px_rgba(124,111,232,0.6)]" />
          <h3 className="text-lg font-bold text-[#131413] uppercase tracking-wider flex items-center gap-2">
            <span>Diễn Viên & Đoàn Làm Phim</span>
            <Sparkles className="w-4 h-4 text-[#7C6FE8]" />
          </h3>
        </div>
      </div>

      {/* Cast Cards Horizontal Grid */}
      {hasCast && (
        <div className="flex flex-col gap-3">
          <span className="text-xs font-extrabold uppercase tracking-widest text-slate-400">
            Dàn Diễn Viên (Cast)
          </span>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {castMembers.map((actor, idx) => {
              const personHref = actor.personId ? `/persons/${actor.personId}` : null;
              
              const CardContent = (
                <div className="group flex items-center gap-3.5 p-3 rounded-2xl bg-slate-50 hover:bg-white border border-slate-100 hover:border-purple-200 shadow-xs hover:shadow-md transition-all duration-300">
                  {/* Actor Avatar */}
                  <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 bg-slate-200 ring-2 ring-purple-100 group-hover:ring-[#7C6FE8] transition-all">
                    {actor.profileUrl ? (
                      <img
                        src={actor.profileUrl}
                        alt={actor.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        <User className="w-6 h-6" />
                      </div>
                    )}
                  </div>

                  {/* Actor Details */}
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-[#7C6FE8] transition-colors truncate">
                      {actor.name}
                    </span>
                    {actor.character && (
                      <span className="text-[11px] text-slate-500 font-medium truncate mt-0.5" title={actor.character}>
                        vai <strong className="text-slate-700 font-semibold">{actor.character}</strong>
                      </span>
                    )}
                  </div>

                  {personHref && (
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#7C6FE8] group-hover:translate-x-0.5 transition-all shrink-0" />
                  )}
                </div>
              );

              return personHref ? (
                <Link key={actor.id || idx} href={personHref} className="block cursor-pointer">
                  {CardContent}
                </Link>
              ) : (
                <div key={actor.id || idx}>{CardContent}</div>
              );
            })}
          </div>
        </div>
      )}

      {/* Crew (Director, Producer, etc.) */}
      {(hasCrew || director) && (
        <div className="flex flex-col gap-3 pt-2">
          <span className="text-xs font-extrabold uppercase tracking-widest text-slate-400">
            Đạo Diễn & Sản Xuất (Crew)
          </span>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {director && (
              <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-purple-50/60 border border-purple-100">
                <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 bg-[#7C6FE8]/15 text-[#7C6FE8] flex items-center justify-center font-bold text-base ring-2 ring-purple-200">
                  🎬
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                  {directorId ? (
                    <Link
                      href={`/persons/${directorId}`}
                      className="text-xs sm:text-sm font-bold text-slate-900 hover:text-[#7C6FE8] transition-colors truncate"
                    >
                      {director}
                    </Link>
                  ) : (
                    <span className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                      {director}
                    </span>
                  )}
                  <span className="text-[11px] font-bold text-[#7C6FE8] uppercase tracking-wider">
                    ĐẠO DIỄN
                  </span>
                </div>
              </div>
            )}

            {crewMembers.slice(0, 3).map((crew, idx) => {
              const personHref = crew.personId ? `/persons/${crew.personId}` : null;
              
              const Content = (
                <div className="group flex items-center gap-3.5 p-3 rounded-2xl bg-slate-50 hover:bg-white border border-slate-100 hover:border-purple-200 shadow-xs hover:shadow-md transition-all">
                  <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 bg-slate-200 ring-2 ring-purple-100 group-hover:ring-[#7C6FE8] transition-all">
                    {crew.profileUrl ? (
                      <img
                        src={crew.profileUrl}
                        alt={crew.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        <User className="w-6 h-6" />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-[#7C6FE8] transition-colors truncate">
                      {crew.name}
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium truncate">
                      {crew.job || crew.department || 'Đoàn làm phim'}
                    </span>
                  </div>
                </div>
              );

              return personHref ? (
                <Link key={crew.id || idx} href={personHref} className="block cursor-pointer">
                  {Content}
                </Link>
              ) : (
                <div key={crew.id || idx}>{Content}</div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
