/**
 * Digitalization in Healthcare - Medical Library & Research Module
 * Authoritative medical textbooks, video masterclasses with timestamps, and clinical guidelines
 */

import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Video,
  FileCheck,
  Bookmark,
  Search,
  ExternalLink,
  Clock,
  User,
  Building,
  CheckCircle2,
  ChevronRight,
  Filter,
  Sparkles,
  Award,
  Layers,
  X,
  Play
} from 'lucide-react';
import {
  MEDICAL_TEXTBOOKS,
  VIDEO_LECTURES,
  CLINICAL_GUIDELINES,
  MedicalTextbook,
  VideoLecture,
  ClinicalGuideline,
  getBookmarkedResourceIds,
  toggleBookmarkedResourceId
} from '../data/libraryData';

export const MedicalLibraryHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'textbooks' | 'videos' | 'guidelines' | 'bookmarks'>('textbooks');
  const [searchQuery, setSearchQuery] = useState('');
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [selectedBook, setSelectedBook] = useState<MedicalTextbook | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<VideoLecture | null>(null);

  useEffect(() => {
    setBookmarkedIds(getBookmarkedResourceIds());
  }, []);

  const handleToggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = toggleBookmarkedResourceId(id);
    setBookmarkedIds(updated);
  };

  // Filtered lists
  const filteredBooks = MEDICAL_TEXTBOOKS.filter(b => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      b.title.toLowerCase().includes(q) ||
      b.authors.some(a => a.toLowerCase().includes(q)) ||
      b.category.toLowerCase().includes(q) ||
      b.description.toLowerCase().includes(q);
    return matchesSearch;
  });

  const filteredVideos = VIDEO_LECTURES.filter(v => {
    const q = searchQuery.toLowerCase();
    return (
      v.title.toLowerCase().includes(q) ||
      v.speaker.toLowerCase().includes(q) ||
      v.category.toLowerCase().includes(q) ||
      v.institution.toLowerCase().includes(q)
    );
  });

  const filteredGuidelines = CLINICAL_GUIDELINES.filter(g => {
    const q = searchQuery.toLowerCase();
    return (
      g.title.toLowerCase().includes(q) ||
      g.organization.toLowerCase().includes(q) ||
      g.targetCondition.toLowerCase().includes(q)
    );
  });

  const bookmarkedItemsCount = bookmarkedIds.length;

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Certified Academic Medical Repository</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Medical Library & Hepatobiliary Research Hub
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Access seminal medical textbooks authored by world-renowned hepatologists (Sherlock, Sleisenger, Robbins, Harrison), high-yield video masterclasses with chapter timestamps, and official clinical practice guidelines (AASLD, EASL, APASL).
            </p>
          </div>

          <div className="bg-slate-950/70 border border-slate-800 px-5 py-3 rounded-2xl flex items-center gap-3 shrink-0">
            <Bookmark className="w-5 h-5 text-cyan-400" />
            <div>
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Bookmarked</div>
              <div className="text-sm font-bold text-white">{bookmarkedItemsCount} Resources</div>
            </div>
          </div>
        </div>

        {/* Tab Selector & Search Bar */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <button
              onClick={() => setActiveTab('textbooks')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'textbooks'
                  ? 'bg-cyan-500 text-slate-950 shadow-md'
                  : 'bg-slate-950 text-slate-300 hover:text-white border border-slate-800'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Author Textbooks ({MEDICAL_TEXTBOOKS.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('videos')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'videos'
                  ? 'bg-cyan-500 text-slate-950 shadow-md'
                  : 'bg-slate-950 text-slate-300 hover:text-white border border-slate-800'
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>Video Masterclasses ({VIDEO_LECTURES.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('guidelines')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'guidelines'
                  ? 'bg-cyan-500 text-slate-950 shadow-md'
                  : 'bg-slate-950 text-slate-300 hover:text-white border border-slate-800'
              }`}
            >
              <FileCheck className="w-3.5 h-3.5" />
              <span>Clinical Guidelines ({CLINICAL_GUIDELINES.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('bookmarks')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'bookmarks'
                  ? 'bg-cyan-500 text-slate-950 shadow-md'
                  : 'bg-slate-950 text-slate-300 hover:text-white border border-slate-800'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>Saved ({bookmarkedItemsCount})</span>
            </button>
          </div>

          <div className="relative min-w-[260px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search books, authors, videos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-800 text-white pl-10 pr-4 py-2 rounded-xl text-xs focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* TEXTBOOKS TAB */}
      {(activeTab === 'textbooks' || activeTab === 'bookmarks') && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <span>Standard Medical Textbooks by Renowned Authors</span>
            </h2>
            <span className="text-xs text-slate-400">Complete curriculum chapters & summaries</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredBooks
              .filter(b => activeTab !== 'bookmarks' || bookmarkedIds.includes(b.id))
              .map((b) => {
                const isBookmarked = bookmarkedIds.includes(b.id);
                return (
                  <div
                    key={b.id}
                    onClick={() => setSelectedBook(b)}
                    className="bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 rounded-3xl p-6 transition-all duration-200 cursor-pointer shadow-lg hover:shadow-xl flex flex-col justify-between group"
                  >
                    <div className="space-y-4">
                      <div className="flex items-start gap-4">
                        <img
                          src={b.coverImage}
                          alt={b.title}
                          className="w-20 h-28 object-cover rounded-xl shadow-md border border-slate-800 shrink-0"
                        />
                        <div className="space-y-1.5 flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-cyan-950 text-cyan-400 border border-cyan-800/40">
                              {b.category} • {b.edition}
                            </span>
                            <button
                              type="button"
                              onClick={(e) => handleToggleBookmark(b.id, e)}
                              className={`p-1.5 rounded-lg border transition-colors ${
                                isBookmarked
                                  ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40'
                                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                              }`}
                              title={isBookmarked ? 'Remove bookmark' : 'Bookmark textbook'}
                            >
                              <Bookmark className="w-4 h-4 fill-current" />
                            </button>
                          </div>

                          <h3 className="text-base font-bold text-white group-hover:text-cyan-400 transition-colors leading-snug">
                            {b.title}
                          </h3>

                          <div className="text-xs text-slate-400 flex items-center gap-1.5 line-clamp-1">
                            <User className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                            <span>{b.authors.join(', ')}</span>
                          </div>

                          <div className="text-[11px] text-slate-400">
                            {b.publisher} ({b.year}) • ISBN: {b.isbn}
                          </div>
                        </div>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                        {b.description}
                      </p>

                      {/* Chapters snippet */}
                      <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-3 space-y-1">
                        <div className="text-[10px] uppercase font-bold text-slate-400">High-Yield Chapters Included:</div>
                        <div className="space-y-0.5">
                          {b.keyChapters.slice(0, 2).map((ch) => (
                            <div key={ch.chapterNumber} className="text-xs text-slate-300 truncate flex items-center gap-1.5">
                              <span className="text-cyan-400 font-mono font-bold text-[10px]">Ch.{ch.chapterNumber}</span>
                              <span className="truncate">{ch.title}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 mt-4 border-t border-slate-800/70 flex items-center justify-between text-xs">
                      <span className="text-cyan-400 font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        <span>Read Chapter Summaries</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                      <a
                        href={b.officialRefUrl}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-slate-400 hover:text-white flex items-center gap-1 text-[11px]"
                      >
                        <span>Official Catalog</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* VIDEOS TAB */}
      {(activeTab === 'videos' || activeTab === 'bookmarks') && (
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Video className="w-4 h-4 text-cyan-400" />
              <span>Video Masterclasses & Lecture Timestamps</span>
            </h2>
            <span className="text-xs text-slate-400">Taught by renowned chief hepatologists</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredVideos
              .filter(v => activeTab !== 'bookmarks' || bookmarkedIds.includes(v.id))
              .map((v) => {
                const isBookmarked = bookmarkedIds.includes(v.id);
                return (
                  <div
                    key={v.id}
                    onClick={() => setSelectedVideo(v)}
                    className="bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 rounded-3xl overflow-hidden transition-all duration-200 cursor-pointer shadow-lg hover:shadow-xl flex flex-col justify-between group"
                  >
                    <div>
                      <div className="relative aspect-video bg-slate-950 overflow-hidden">
                        <img
                          src={v.thumbnail}
                          alt={v.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white">
                          <span className="bg-slate-900/90 border border-slate-700 px-2.5 py-0.5 rounded-lg font-semibold flex items-center gap-1.5">
                            <Clock className="w-3 h-3 text-cyan-400" />
                            <span>{v.durationMinutes} mins</span>
                          </span>
                          <span className="bg-cyan-500 text-slate-950 font-bold px-2 py-0.5 rounded-lg text-[10px]">
                            {v.category}
                          </span>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-12 h-12 rounded-full bg-cyan-500/90 text-slate-950 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                            <Play className="w-5 h-5 fill-current ml-0.5" />
                          </div>
                        </div>
                      </div>

                      <div className="p-5 space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors line-clamp-2">
                            {v.title}
                          </h3>
                          <button
                            type="button"
                            onClick={(e) => handleToggleBookmark(v.id, e)}
                            className={`p-1.5 rounded-lg border transition-colors shrink-0 ${
                              isBookmarked
                                ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40'
                                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                            }`}
                          >
                            <Bookmark className="w-3.5 h-3.5 fill-current" />
                          </button>
                        </div>

                        <div className="text-xs text-slate-400 space-y-0.5">
                          <div className="font-semibold text-slate-300">{v.speaker}</div>
                          <div className="text-[11px] truncate">{v.speakerTitle}</div>
                          <div className="text-[10px] text-slate-400">{v.institution}</div>
                        </div>

                        <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                          {v.description}
                        </p>
                      </div>
                    </div>

                    <div className="p-5 pt-0">
                      <div className="border-t border-slate-800/80 pt-3 flex items-center justify-between text-xs text-cyan-400 font-semibold">
                        <span>View Timestamps & Pearls</span>
                        <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* GUIDELINES TAB */}
      {(activeTab === 'guidelines' || activeTab === 'bookmarks') && (
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-cyan-400" />
              <span>International Clinical Practice Guidelines (AASLD, EASL, APASL)</span>
            </h2>
            <span className="text-xs text-slate-400">Current gold-standard diagnostic protocols</span>
          </div>

          <div className="space-y-4">
            {filteredGuidelines
              .filter(g => activeTab !== 'bookmarks' || bookmarkedIds.includes(g.id))
              .map((g) => {
                const isBookmarked = bookmarkedIds.includes(g.id);
                return (
                  <div
                    key={g.id}
                    className="bg-slate-900/90 border border-slate-800 hover:border-cyan-500/40 rounded-3xl p-6 transition-all duration-200 shadow-lg space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-bold px-2.5 py-0.5 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-800/40">
                            {g.organization} Guidance
                          </span>
                          <span className="text-xs font-bold px-2.5 py-0.5 rounded-lg bg-emerald-950/60 text-emerald-400 border border-emerald-800/30">
                            {g.status} ({g.year})
                          </span>
                          <span className="text-xs text-slate-400 font-medium">
                            Target: {g.targetCondition}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-white pt-1">
                          {g.title}
                        </h3>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={(e) => handleToggleBookmark(g.id, e)}
                          className={`p-2 rounded-xl border transition-colors ${
                            isBookmarked
                              ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40'
                              : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                          }`}
                        >
                          <Bookmark className="w-4 h-4 fill-current" />
                        </button>
                        <a
                          href={g.pdfOrWebUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-4 py-2 rounded-xl flex items-center gap-1.5 transition-colors"
                        >
                          <span>Official Portal</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
                      {g.summary}
                    </p>

                    <div className="space-y-2">
                      <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Key Clinical Recommendations:</div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                        {g.recommendations.map((rec, rIdx) => (
                          <div key={rIdx} className="bg-slate-950/40 border border-slate-800/70 p-3 rounded-xl flex items-start gap-2 text-slate-300">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                            <span className="leading-relaxed">{rec}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* TEXTBOOK DETAIL MODAL */}
      {selectedBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl space-y-6 my-auto max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4">
              <div className="flex items-start gap-4">
                <img
                  src={selectedBook.coverImage}
                  alt={selectedBook.title}
                  className="w-16 h-24 object-cover rounded-xl shadow-md border border-slate-800 shrink-0"
                />
                <div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-cyan-950 text-cyan-400 border border-cyan-800/40">
                    {selectedBook.category} • {selectedBook.edition}
                  </span>
                  <h3 className="text-xl font-bold text-white pt-1">{selectedBook.title}</h3>
                  <p className="text-xs text-slate-400">Authors: {selectedBook.authors.join(', ')}</p>
                  <p className="text-[11px] text-slate-400">{selectedBook.publisher} • Year: {selectedBook.year}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedBook(null)}
                className="text-slate-400 hover:text-white p-2 rounded-xl bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Book Overview</h4>
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
                {selectedBook.description}
              </p>

              <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Core Clinical Curriculum Chapters</h4>
              <div className="space-y-3">
                {selectedBook.keyChapters.map((ch) => (
                  <div key={ch.chapterNumber} className="bg-slate-950/70 border border-slate-800 p-4 rounded-2xl space-y-2">
                    <div className="text-xs font-bold text-white flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 text-[10px] font-mono">
                        Chapter {ch.chapterNumber}
                      </span>
                      <span>{ch.title}</span>
                    </div>
                    <ul className="list-disc list-inside space-y-1 text-xs text-slate-300 pl-1">
                      {ch.highYieldPoints.map((pt, pIdx) => (
                        <li key={pIdx} className="leading-relaxed">{pt}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-800 text-xs">
              <span className="text-slate-400">ISBN: {selectedBook.isbn}</span>
              <div className="flex items-center gap-3">
                <a
                  href={selectedBook.officialRefUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow"
                >
                  <span>Publisher Catalog</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <button
                  type="button"
                  onClick={() => setSelectedBook(null)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-xl"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIDEO DETAIL MODAL */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl space-y-6 my-auto max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-cyan-950 text-cyan-400 border border-cyan-800/40">
                  {selectedVideo.category} • {selectedVideo.durationMinutes} Minutes
                </span>
                <h3 className="text-xl font-bold text-white pt-1">{selectedVideo.title}</h3>
                <p className="text-xs text-slate-300 font-semibold">{selectedVideo.speaker} • {selectedVideo.speakerTitle}</p>
                <p className="text-[11px] text-slate-400">{selectedVideo.institution}</p>
              </div>
              <button
                onClick={() => setSelectedVideo(null)}
                className="text-slate-400 hover:text-white p-2 rounded-xl bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 space-y-1">
                <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">Grand Rounds Topic Overview</div>
                <p className="text-xs text-slate-300 leading-relaxed">{selectedVideo.description}</p>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Lecture Timestamps & Chapter Milestones</span>
                </div>
                <div className="space-y-1.5">
                  {selectedVideo.timestamps.map((t, idx) => (
                    <div key={idx} className="flex items-center gap-3 bg-slate-950/50 border border-slate-800/80 p-2.5 rounded-xl text-xs">
                      <span className="font-mono font-bold text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800/40">
                        {t.time}
                      </span>
                      <span className="text-slate-200">{t.topic}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-cyan-950/30 border border-cyan-800/40 rounded-2xl p-4 space-y-2">
                <div className="text-xs font-bold text-cyan-300 uppercase tracking-wider">Clinical Takeaway Pearls</div>
                <ul className="space-y-1 text-xs text-slate-300">
                  {selectedVideo.keyPearls.map((p, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-cyan-400 font-bold">•</span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setSelectedVideo(null)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-xl text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
