import { useState, useRef, useEffect, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import StoryViewer, { type StoryItem } from './StoryViewer';

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_STORIES: StoryItem[] = [
  { id: '1', name: 'phw.darne' },
  { id: '2', name: 'hhuong227' },
  { id: '3', name: 'nt_hiphip' },
  { id: '4', name: 'quyynf_ch' },
  { id: '5', name: 'hamssbis' },
  { id: '6', name: 'hongnhun' },
  { id: '7', name: 'minh.an' },
  { id: '8', name: 'thvu.u' },
  { id: '9', name: 'sferein' },
  { id: '10', name: '_tna15_' },
  { id: '11', name: '_0207.02' },
  { id: '12', name: '18dec.hz' },
  { id: '13', name: 'khanhvyccf' },
];

// ─── Ring gradient (Instagram style) ─────────────────────────────────────────

const RING_CLS =
  'p-[2.5px] rounded-full bg-[linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888,#8a3ab9)]';

// ─── Single story bubble ──────────────────────────────────────────────────────

function Story({ story, onClick }: { story: StoryItem; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col items-center gap-1.5 shrink-0 w-[72px] group"
      aria-label={`Xem tin của ${story.name}`}
    >
      <span className={RING_CLS}>
        <span className="block bg-ig-bg p-[2.5px] rounded-full">
          <span className="block w-14 h-14 rounded-full bg-ig-hover overflow-hidden group-hover:scale-95 transition-transform duration-200">
            {story.image ? (
              <img
                src={story.image}
                alt={story.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="w-full h-full flex items-center justify-center text-ig-muted">
                <svg
                  viewBox="0 0 56 56"
                  fill="currentColor"
                  className="w-8 h-8 opacity-50"
                >
                  <circle cx="28" cy="22" r="10" />
                  <path d="M8 48c0-11 9-19 20-19s20 8 20 19" />
                </svg>
              </span>
            )}
          </span>
        </span>
      </span>
      <span className="text-[11px] text-ig-text truncate w-full text-center font-medium">
        {story.name}
      </span>
    </button>
  );
}

// ─── Stories row ──────────────────────────────────────────────────────────────

const SCROLL_AMOUNT = 300;

function StoriesRow() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  const updateArrows = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 4);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateArrows();
    el.addEventListener('scroll', updateArrows, { passive: true });
    const ro = new ResizeObserver(updateArrows);
    ro.observe(el);
    return () => {
      el.removeEventListener('scroll', updateArrows);
      ro.disconnect();
    };
  }, [updateArrows]);

  const scrollBy = (dir: 'left' | 'right') => {
    scrollRef.current?.scrollBy({
      left: dir === 'left' ? -SCROLL_AMOUNT : SCROLL_AMOUNT,
      behavior: 'smooth',
    });
  };

  return (
    <>
      <div className="border-b border-ig-border sm:border-b-0 flex items-center gap-1 px-2 py-2 w-full">
        {/* Left arrow — sits outside the track */}
        <button
          type="button"
          onClick={() => scrollBy('left')}
          aria-label="Cuộn trái"
          className={[
            'shrink-0 w-8 h-8 flex items-center justify-center',
            'rounded-full bg-ig-surface shadow-sm',
            'text-ig-text hover:bg-ig-hover transition-all duration-200',
            canLeft
              ? 'opacity-100 pointer-events-auto'
              : 'opacity-0 pointer-events-none',
          ].join(' ')}
        >
          <ChevronLeft size={16} strokeWidth={2} />
        </button>

        {/* Scrollable track */}
        <div
          ref={scrollRef}
          className="flex flex-1 min-w-0 gap-3 overflow-x-auto py-2 [&::-webkit-scrollbar]:hidden [scrollbar-width:none]"
        >
          {MOCK_STORIES.map((s, i) => (
            <Story key={s.id} story={s} onClick={() => setOpenIdx(i)} />
          ))}
        </div>

        {/* Right arrow — sits outside the track */}
        <button
          type="button"
          onClick={() => scrollBy('right')}
          aria-label="Cuộn phải"
          className={[
            'shrink-0 w-8 h-8 flex items-center justify-center',
            'rounded-full bg-ig-surface  shadow-sm',
            'text-ig-text hover:bg-ig-hover transition-all duration-200',
            canRight
              ? 'opacity-100 pointer-events-auto'
              : 'opacity-0 pointer-events-none',
          ].join(' ')}
        >
          <ChevronRight size={16} strokeWidth={2} />
        </button>
      </div>

      <AnimatePresence>
        {openIdx !== null && (
          <StoryViewer
            stories={MOCK_STORIES}
            activeIndex={openIdx}
            onClose={() => setOpenIdx(null)}
            onChange={setOpenIdx}
          />
        )}
      </AnimatePresence>
    </>
  );
}

export default StoriesRow;
