/**
 * Digitalization in Healthcare - Medical Blogs & Intellectual Discussion Forum
 * Interactive platform for medical students, professors, and intellectuals to share doubts, cases, and research
 */

import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  ThumbsUp,
  Share2,
  Bookmark,
  Sparkles,
  Search,
  PlusCircle,
  CheckCircle2,
  User,
  Building,
  Tag,
  Clock,
  Send,
  X,
  Filter,
  Eye,
  Award,
  HelpCircle,
  GraduationCap
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { BlogPost, BlogComment, getStoredBlogs, saveStoredBlogs } from '../data/blogsData';
import { useAuth } from '../context/AuthContext';
import { useProgress } from '../context/ProgressContext';

export const MedicalBlogsForum: React.FC = () => {
  const { currentUser } = useAuth();
  const { awardXP } = useProgress();

  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activePost, setActivePost] = useState<BlogPost | null>(null);

  // New Post Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<BlogPost['category']>('Clinical Doubts & Questions');
  const [newSummary, setNewSummary] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newTags, setNewTags] = useState('Hepatology, Medical Education');

  // Comment input state
  const [commentText, setCommentText] = useState('');

  useEffect(() => {
    setBlogs(getStoredBlogs());
  }, []);

  const handleUpvotePost = (postId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = blogs.map(b => {
      if (b.id === postId) {
        return { ...b, upvotes: b.upvotes + 1 };
      }
      return b;
    });
    setBlogs(updated);
    saveStoredBlogs(updated);
    if (activePost?.id === postId) {
      setActivePost({ ...activePost, upvotes: activePost.upvotes + 1 });
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !activePost) return;

    const newComment: BlogComment = {
      id: `comm_${Date.now()}`,
      authorName: currentUser ? `${currentUser.titlePrefix} ${currentUser.fullName}` : 'Dr. Clinical Fellow',
      authorRole: currentUser?.role || 'Medical Student (MBBS)',
      authorType: currentUser?.userType || 'student',
      authorInstitution: currentUser?.institution || 'Teaching Hospital',
      authorAvatar: currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=240&auto=format&fit=crop&q=80',
      content: commentText.trim(),
      createdAt: new Date().toISOString(),
      upvotes: 0,
      isFacultyEndorsed: currentUser?.userType === 'faculty'
    };

    const updatedPost = {
      ...activePost,
      comments: [...activePost.comments, newComment]
    };

    const updatedBlogs = blogs.map(b => (b.id === activePost.id ? updatedPost : b));
    setBlogs(updatedBlogs);
    saveStoredBlogs(updatedBlogs);
    setActivePost(updatedPost);
    setCommentText('');
    awardXP(30);
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) {
      alert('Please fill out the title and content.');
      return;
    }

    const created: BlogPost = {
      id: `post-${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      authorName: currentUser ? `${currentUser.titlePrefix} ${currentUser.fullName}` : 'Dr. Clinical Scholar',
      authorRole: currentUser?.role || 'Medical Student (MBBS)',
      authorType: currentUser?.userType || 'student',
      authorInstitution: currentUser?.institution || 'Medical College',
      authorAvatar: currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=240&auto=format&fit=crop&q=80',
      summary: newSummary.trim() || newContent.substring(0, 160) + '...',
      content: newContent.trim(),
      tags: newTags.split(',').map(t => t.trim()).filter(Boolean),
      createdAt: new Date().toISOString(),
      readTime: `${Math.max(2, Math.round(newContent.split(' ').length / 150))} min read`,
      upvotes: 1,
      views: 12,
      isCertified: currentUser?.userType === 'faculty',
      comments: []
    };

    const updated = [created, ...blogs];
    setBlogs(updated);
    saveStoredBlogs(updated);
    setShowCreateModal(false);
    setNewTitle('');
    setNewContent('');
    setNewSummary('');
    awardXP(100);
    confetti({ particleCount: 50, spread: 60 });
  };

  const categories = [
    'All',
    'Clinical Doubts & Questions',
    'Case Discussions',
    'Hepatology Research',
    'Faculty Insights',
    'Medical Education'
  ];

  const filteredBlogs = blogs.filter(b => {
    const matchesCategory = selectedCategory === 'All' || b.category === selectedCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      b.title.toLowerCase().includes(q) ||
      b.authorName.toLowerCase().includes(q) ||
      b.summary.toLowerCase().includes(q) ||
      b.tags.some(t => t.toLowerCase().includes(q));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Medical Scholars & Faculty Intellectual Exchange</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Medical Blogs & Clinical Discussion Forum
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Connect directly with professors, gastroenterology consultants, and fellow medical students. Share diagnostic doubts, post challenging hospital case experiences, discuss drug trial developments, and review peer-reviewed hepatology literature.
            </p>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-5 py-3 rounded-2xl text-xs flex items-center gap-2 shadow-lg transition-all shrink-0 self-start md:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Post Doubt or Experience</span>
          </button>
        </div>

        {/* Filter and Search Bar */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
                    : 'bg-slate-950/80 text-slate-300 hover:text-white border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative min-w-[260px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search forum topics, doubts, tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-800 text-white pl-10 pr-4 py-2 rounded-xl text-xs focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Blogs & Discussions List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredBlogs.map((b) => (
          <div
            key={b.id}
            onClick={() => setActivePost(b)}
            className="bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 rounded-3xl p-6 transition-all duration-200 cursor-pointer shadow-lg hover:shadow-xl flex flex-col justify-between group"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-800/40">
                  {b.category}
                </span>

                <div className="flex items-center gap-2">
                  {b.isCertified && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-800/40 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Faculty Certified
                    </span>
                  )}
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{b.readTime}</span>
                  </span>
                </div>
              </div>

              <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors leading-snug">
                {b.title}
              </h3>

              <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                {b.summary}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {b.tags.map(t => (
                  <span key={t} className="text-[10px] bg-slate-950 text-slate-400 px-2 py-0.5 rounded-md border border-slate-800">
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-5 mt-4 border-t border-slate-800/70 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <img
                  src={b.authorAvatar}
                  alt={b.authorName}
                  className="w-8 h-8 rounded-full object-cover border border-slate-700"
                />
                <div>
                  <div className="font-semibold text-slate-200 text-xs flex items-center gap-1.5">
                    <span>{b.authorName}</span>
                    {b.authorType === 'faculty' && (
                      <span className="text-[9px] bg-purple-500/10 text-purple-400 border border-purple-500/20 px-1 rounded">
                        Faculty
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate max-w-[150px]">
                    {b.authorInstitution}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={(e) => handleUpvotePost(b.id, e)}
                  className="flex items-center gap-1 text-slate-400 hover:text-cyan-400 bg-slate-950 px-2.5 py-1 rounded-xl border border-slate-800 transition-colors"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span className="text-xs font-bold">{b.upvotes}</span>
                </button>

                <div className="flex items-center gap-1 text-slate-400 bg-slate-950 px-2.5 py-1 rounded-xl border border-slate-800">
                  <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="text-xs font-bold">{b.comments.length}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* FULL POST & INTERACTIVE COMMENTS MODAL */}
      {activePost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl space-y-6 my-auto max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-800/40">
                    {activePost.category}
                  </span>
                  {activePost.isCertified && (
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-800/40 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Certified Clinical Content
                    </span>
                  )}
                  <span className="text-xs text-slate-400">{activePost.readTime}</span>
                </div>

                <h2 className="text-xl sm:text-2xl font-bold text-white">{activePost.title}</h2>

                <div className="flex items-center gap-3 pt-1">
                  <img
                    src={activePost.authorAvatar}
                    alt={activePost.authorName}
                    className="w-10 h-10 rounded-full object-cover border border-slate-700"
                  />
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-2">
                      <span>{activePost.authorName}</span>
                      <span className="text-[10px] text-cyan-400">({activePost.authorRole})</span>
                    </div>
                    <div className="text-[11px] text-slate-400">{activePost.authorInstitution}</div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setActivePost(null)}
                className="text-slate-400 hover:text-white p-2 rounded-xl bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Post Content */}
            <div className="text-xs text-slate-200 leading-relaxed whitespace-pre-line bg-slate-950/60 p-5 rounded-2xl border border-slate-800 space-y-3 font-sans">
              {activePost.content}
            </div>

            {/* Tags Strip */}
            <div className="flex flex-wrap gap-2 pt-1">
              {activePost.tags.map(t => (
                <span key={t} className="text-xs bg-slate-950 text-cyan-400 px-3 py-1 rounded-xl border border-slate-800 font-mono">
                  #{t}
                </span>
              ))}
            </div>

            {/* Upvote & Interaction Bar */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={(e) => handleUpvotePost(activePost.id, e)}
                className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 shadow"
              >
                <ThumbsUp className="w-4 h-4" />
                <span>Upvote ({activePost.upvotes})</span>
              </button>

              <span className="text-xs text-slate-400">
                {activePost.comments.length} Clinical Discussion Replies
              </span>
            </div>

            {/* Comments & Peer Responses Section */}
            <div className="space-y-4 pt-2">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-cyan-400" />
                <span>Responses & Faculty Opinions</span>
              </h4>

              {activePost.comments.length === 0 ? (
                <div className="text-xs text-slate-400 bg-slate-950/40 p-4 rounded-2xl border border-slate-800/80 text-center">
                  No responses yet. Be the first faculty or student to share your clinical opinion!
                </div>
              ) : (
                <div className="space-y-3">
                  {activePost.comments.map(c => (
                    <div key={c.id} className="bg-slate-950/70 border border-slate-800 p-4 rounded-2xl space-y-2 text-xs">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <img src={c.authorAvatar} alt={c.authorName} className="w-6 h-6 rounded-full object-cover" />
                          <span className="font-bold text-white">{c.authorName}</span>
                          <span className="text-[10px] text-slate-400">({c.authorRole})</span>
                        </div>
                        {c.isFacultyEndorsed && (
                          <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800/40 px-2 py-0.5 rounded-lg flex items-center gap-1 font-semibold">
                            <CheckCircle2 className="w-3 h-3" /> Faculty Endorsed
                          </span>
                        )}
                      </div>
                      <p className="text-slate-300 leading-relaxed pl-8">{c.content}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Comment Form */}
              <form onSubmit={handleAddComment} className="flex gap-2 pt-2">
                <input
                  type="text"
                  placeholder="Share clinical perspective, literature citations, or query..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
                <button
                  type="submit"
                  disabled={!commentText.trim()}
                  className="bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Reply</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* CREATE NEW POST MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 my-auto max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <PlusCircle className="w-5 h-5 text-cyan-400" />
                  <span>Post Medical Doubt or Clinical Knowledge</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Share cases, ask faculty for diagnostic input, or discuss new papers.
                </p>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Topic Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Clinical Doubt: Interpreting isolated alkaline phosphatase in pregnancy"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                  >
                    <option value="Clinical Doubts & Questions">Clinical Doubts & Questions</option>
                    <option value="Case Discussions">Case Discussions</option>
                    <option value="Hepatology Research">Hepatology Research</option>
                    <option value="Faculty Insights">Faculty Insights</option>
                    <option value="Medical Education">Medical Education</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Tags (comma separated)</label>
                  <input
                    type="text"
                    value={newTags}
                    onChange={(e) => setNewTags(e.target.value)}
                    placeholder="e.g. LFT, Cirrhosis, Biomarkers"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Short Summary</label>
                <input
                  type="text"
                  placeholder="Brief one-sentence overview..."
                  value={newSummary}
                  onChange={(e) => setNewSummary(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Detailed Clinical Description & Findings</label>
                <textarea
                  rows={6}
                  required
                  placeholder="Describe patient scenario, laboratory findings, diagnostic dilemma, or literature questions..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-5 py-2 rounded-xl"
                >
                  Publish Discussion (+100 XP)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
