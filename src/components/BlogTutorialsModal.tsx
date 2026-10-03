import React, { useState } from 'react';
import { BookOpen, X, Clock, Tag, ArrowRight, Sparkles } from 'lucide-react';
import { INITIAL_BLOGS } from '../services/storage';
import { BlogPost } from '../types';
import { soundManager } from '../services/sound';

interface BlogTutorialsModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'en' | 'bn';
}

export const BlogTutorialsModal: React.FC<BlogTutorialsModalProps> = ({
  isOpen,
  onClose,
  language,
}) => {
  const isBangla = language === 'bn';
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-2xl border border-neutral-800 bg-neutral-900 p-6 sm:p-8 shadow-2xl my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                {isBangla ? 'ডেভেলপার ব্লগ ও টিউটোরিয়াল হাব' : 'Developer Knowledge & Tutorial Hub'}
              </h3>
              <p className="text-xs text-neutral-400">
                {isBangla ? 'অ্যান্ড্রয়েড আর্কিটেকচার, পারমিশন ও প্লে-স্টোর গাইড' : 'Android WebView architectures, ProGuard recipes & packaging guides'}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              soundManager.playClick();
              if (selectedPost) setSelectedPost(null);
              else onClose();
            }}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content View */}
        <div className="flex-1 overflow-y-auto pr-1">
          {selectedPost ? (
            <div className="space-y-4 text-xs sm:text-sm">
              <button
                onClick={() => setSelectedPost(null)}
                className="text-xs text-emerald-400 hover:underline flex items-center gap-1 font-semibold mb-2"
              >
                ← {isBangla ? 'সবগুলো আর্টিকেলে ফিরে যান' : 'Back to Article List'}
              </button>
              <div className="flex items-center gap-2 text-neutral-400 text-xs">
                <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 font-mono text-[10px] font-bold">
                  {selectedPost.tag}
                </span>
                <span>·</span>
                <span>{selectedPost.date}</span>
                <span>·</span>
                <span>{selectedPost.readTime}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">{selectedPost.title}</h2>
              <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-300 leading-relaxed text-xs sm:text-sm space-y-3 font-sans">
                <p>{selectedPost.content}</p>
                <p>
                  When building production Android applications from Web code, ensuring your Manifest declares explicit exported attributes and uses modern WebKit dependencies (`androidx.webkit:webkit:1.12.0`) is vital for zero crashes.
                </p>
                <div className="p-3 bg-neutral-900 rounded-lg font-mono text-xs text-emerald-400">
                  targetSdk = 35 // Android 15 Vanilla Ice Cream<br />
                  compileSdk = 35<br />
                  minSdk = 24 // Android 7.0 Nougat
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {INITIAL_BLOGS.map((post) => (
                <div
                  key={post.id}
                  onClick={() => {
                    soundManager.playClick();
                    setSelectedPost(post);
                  }}
                  className="p-5 rounded-xl border border-neutral-800 bg-neutral-950/60 hover:border-emerald-500/50 transition-all cursor-pointer flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold tracking-wider">
                        {post.tag}
                      </span>
                      <span className="text-[10px] text-neutral-500">{post.readTime}</span>
                    </div>
                    <h4 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors mb-2">
                      {post.title}
                    </h4>
                    <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-emerald-400 font-semibold mt-4">
                    <span>{isBangla ? 'সম্পূর্ণ পড়ুন' : 'Read Article'}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
