import { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  VolumeX,
  Pause,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────

export type StoryItem = { id: string; name: string; image?: string };

type Props = {
  stories: StoryItem[];
  activeIndex: number;
  onClose: () => void;
  onChange: (idx: number) => void;
};

// ─── Gradient palette ────────────────────────────────────────────────────────

const GRADIENTS = [
  'linear-gradient(135deg,#f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)',
  'linear-gradient(135deg,#667eea 0%,#764ba2 100%)',
  'linear-gradient(135deg,#f093fb 0%,#f5576c 100%)',
  'linear-gradient(135deg,#4facfe 0%,#00f2fe 100%)',
  'linear-gradient(135deg,#43e97b 0%,#38f9d7 100%)',
  'linear-gradient(135deg,#fa709a 0%,#fee140 100%)',
  'linear-gradient(135deg,#a18cd1 0%,#fbc2eb 100%)',
  'linear-gradient(135deg,#30cfd0 0%,#667eea 100%)',
];

// ─── Avatar helper ───────────────────────────────────────────────────────────

function Avatar({ story, size = 'md' }: { story: StoryItem; size?: 'sm' | 'md' }) {
  const cls = size === 'sm' ? 'w-8 h-8 text-xs' : 'w-9 h-9 text-sm';
  return (
    <div
      className={`${cls} rounded-full border-2 border-white/80 bg-white/20 flex-shrink-0 flex items-center justify-center overflow-hidden font-bold text-white`}
    >
      {story.image ? (
        <img src={story.image} alt="" className="w-full h-full object-cover" />
      ) : (
        story.name[0].toUpperCase()
      )}
    </div>
  );
}

// ─── Side panel (prev / next peek) ───────────────────────────────────────────

function SidePanel({
  story,
  gradientIdx,
  onClick,
  label,
}: {
  story: StoryItem;
  gradientIdx: number;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="relative rounded-2xl overflow-hidden opacity-55 hover:opacity-75 transition-opacity cursor-pointer flex-shrink-0"
      style={{ height: 'min(62vh, 480px)', aspectRatio: '9/16' }}
    >
      <div
        className="absolute inset-0"
        style={{ background: GRADIENTS[gradientIdx % GRADIENTS.length] }}
      />
      <div className="absolute inset-0 bg-black/20 rounded-2xl" />

      {/* User info overlay */}
      <div className="absolute bottom-4 left-3 right-3 flex items-center gap-2">
        <Avatar story={story} size="sm" />
        <div className="flex flex-col min-w-0">
          <span className="text-white text-xs font-semibold drop-shadow truncate">
            {story.name}
          </span>
          <span className="text-white/60 text-[11px]">5 giờ</span>
        </div>
      </div>
    </button>
  );
}

// ─── Main viewer ─────────────────────────────────────────────────────────────

function StoryViewer({ stories, activeIndex, onClose, onChange }: Props) {
  const prev = activeIndex > 0 ? activeIndex - 1 : null;
  const next = activeIndex < stories.length - 1 ? activeIndex + 1 : null;
  const story = stories[activeIndex];
  const gradient = GRADIENTS[activeIndex % GRADIENTS.length];

  const goNext = useCallback(() => {
    if (next !== null) onChange(next);
    else onClose();
  }, [next, onChange, onClose]);

  const goPrev = useCallback(() => {
    if (prev !== null) onChange(prev);
  }, [prev, onChange]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [goPrev, goNext, onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 bg-black flex items-center justify-center"
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-30 w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
        aria-label="Đóng"
      >
        <X size={20} strokeWidth={1.8} />
      </button>

      {/* ── 3-column layout ── */}
      <div className="flex items-center justify-center w-full h-full gap-4 px-4">

        {/* Left column */}
        <div className="hidden md:flex items-center justify-end flex-1 gap-3">
          {prev !== null ? (
            <>
              <button
                type="button"
                onClick={goPrev}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-white/15 hover:bg-white/25 text-white transition-colors flex-shrink-0"
                aria-label="Tin trước"
              >
                <ChevronLeft size={20} strokeWidth={1.8} />
              </button>
              <SidePanel
                story={stories[prev]}
                gradientIdx={prev}
                onClick={goPrev}
                label="Xem tin trước"
              />
            </>
          ) : (
            <div className="w-[240px]" />
          )}
        </div>

        {/* ── Center story ── */}
        <div
          className="relative flex-shrink-0 rounded-2xl overflow-hidden shadow-2xl"
          style={{ height: 'min(90vh, 680px)', aspectRatio: '9/16' }}
        >
          {/* Story content with transition */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0.6, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="absolute inset-0"
              style={{ background: gradient }}
            >
              {story.image ? (
                <img
                  src={story.image}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                /* Placeholder when no image */
                <div className="absolute inset-0 flex items-center justify-center select-none">
                  <span className="text-white/15 font-black text-[10rem] leading-none">
                    {story.name[0].toUpperCase()}
                  </span>
                </div>
              )}
              {/* Bottom gradient for readability */}
              <div className="absolute bottom-0 inset-x-0 h-28 bg-gradient-to-t from-black/50 to-transparent" />
            </motion.div>
          </AnimatePresence>

          {/* ── Progress bars ── */}
          <div className="absolute top-3 left-3 right-3 flex gap-1 z-20">
            {stories.map((_, i) => (
              <div
                key={i}
                className="flex-1 h-[2.5px] bg-white/30 rounded-full overflow-hidden"
              >
                {i < activeIndex && <div className="h-full w-full bg-white" />}
                {i === activeIndex && (
                  <motion.div
                    key={`prog-${activeIndex}`}
                    className="h-full bg-white rounded-full origin-left"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 5, ease: 'linear' }}
                    onAnimationComplete={goNext}
                    style={{ transformOrigin: 'left' }}
                  />
                )}
              </div>
            ))}
          </div>

          {/* ── Story header ── */}
          <div className="absolute top-8 left-3 right-3 flex items-center gap-2 z-20">
            <Avatar story={story} size="md" />
            <div className="flex-1 min-w-0">
              <span className="text-white text-sm font-semibold drop-shadow">
                {story.name}
              </span>
              <span className="text-white/60 text-xs ml-1.5">5 giờ</span>
            </div>
            <button
              className="text-white/80 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-colors"
              aria-label="Tắt tiếng"
            >
              <VolumeX size={16} strokeWidth={1.8} />
            </button>
            <button
              className="text-white/80 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-colors"
              aria-label="Dừng"
            >
              <Pause size={16} strokeWidth={1.8} />
            </button>
            <button
              className="text-white/80 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-colors"
              aria-label="Tùy chọn"
            >
              <MoreHorizontal size={16} strokeWidth={1.8} />
            </button>
          </div>

          {/* ── Tap zones (left ⅓ back, right ⅔ forward) ── */}
          <div className="absolute inset-0 flex z-10">
            <button
              type="button"
              className="w-1/3 h-full"
              onClick={goPrev}
              aria-label="Tin trước"
            />
            <button
              type="button"
              className="w-2/3 h-full"
              onClick={goNext}
              aria-label="Tin tiếp theo"
            />
          </div>
        </div>

        {/* Right column */}
        <div className="hidden md:flex items-center justify-start flex-1 gap-3">
          {next !== null ? (
            <>
              <SidePanel
                story={stories[next]}
                gradientIdx={next}
                onClick={goNext}
                label="Xem tin tiếp theo"
              />
              <button
                type="button"
                onClick={goNext}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-white/15 hover:bg-white/25 text-white transition-colors flex-shrink-0"
                aria-label="Tin tiếp theo"
              >
                <ChevronRight size={20} strokeWidth={1.8} />
              </button>
            </>
          ) : (
            <div className="w-[240px]" />
          )}
        </div>
      </div>

      {/* Mobile nav arrows (outside the story, at screen edges) */}
      {prev !== null && (
        <button
          onClick={goPrev}
          className="md:hidden absolute left-2 top-1/2 -translate-y-1/2 z-30 w-9 h-9 flex items-center justify-center rounded-full bg-white/15 hover:bg-white/25 text-white transition-colors"
        >
          <ChevronLeft size={20} strokeWidth={1.8} />
        </button>
      )}
      {next !== null && (
        <button
          onClick={goNext}
          className="md:hidden absolute right-2 top-1/2 -translate-y-1/2 z-30 w-9 h-9 flex items-center justify-center rounded-full bg-white/15 hover:bg-white/25 text-white transition-colors"
        >
          <ChevronRight size={20} strokeWidth={1.8} />
        </button>
      )}
    </motion.div>
  );
}

export default StoryViewer;
