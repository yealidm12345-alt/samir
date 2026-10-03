import React, { useState } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { INITIAL_TESTIMONIALS } from '../services/storage';
import { soundManager } from '../services/sound';

interface TestimonialSliderProps {
  language: 'en' | 'bn';
}

export const TestimonialSlider: React.FC<TestimonialSliderProps> = ({ language }) => {
  const isBangla = language === 'bn';
  const [currentIndex, setCurrentIndex] = useState(0);

  const prev = () => {
    soundManager.playClick();
    setCurrentIndex((i) => (i === 0 ? INITIAL_TESTIMONIALS.length - 1 : i - 1));
  };

  const next = () => {
    soundManager.playClick();
    setCurrentIndex((i) => (i === INITIAL_TESTIMONIALS.length - 1 ? 0 : i + 1));
  };

  const item = INITIAL_TESTIMONIALS[currentIndex];

  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 sm:p-8 relative overflow-hidden">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
            {isBangla ? 'গ্রাহক মতামত' : 'Developer Reviews & Social Proof'}
          </span>
          <h3 className="text-xl font-bold text-white mt-1">
            {isBangla ? 'নির্মাতাদের বাস্তব অভিজ্ঞতা' : 'Trusted by Leading Web & Mobile Engineers'}
          </h3>
        </div>

        {/* Carousel arrows */}
        <div className="flex items-center gap-2">
          <button
            onClick={prev}
            className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors cursor-pointer"
            title="Previous Review"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-mono text-neutral-400">
            {currentIndex + 1} / {INITIAL_TESTIMONIALS.length}
          </span>
          <button
            onClick={next}
            className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors cursor-pointer"
            title="Next Review"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Review Card */}
      <div className="space-y-4">
        <div className="flex items-center gap-1 text-amber-400">
          {[...Array(item.rating)].map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-current" />
          ))}
        </div>

        <p className="text-neutral-200 text-sm sm:text-base leading-relaxed italic">
          "{item.text}"
        </p>

        <div className="flex items-center gap-3 pt-2">
          <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center font-bold text-emerald-400 text-xs">
            {item.avatarText}
          </div>
          <div>
            <div className="font-bold text-white text-xs sm:text-sm">{item.name}</div>
            <div className="text-[11px] text-neutral-400">
              {item.role} · <span className="text-emerald-400">{item.company}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
