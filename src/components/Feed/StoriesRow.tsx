// Placeholder Stories row — visual only until a stories API is wired up.

const MOCK_STORIES: { id: string; name: string; image?: string }[] = [
  { id: '1', name: 'roses_are_...' },
  { id: '2', name: 'junvu95' },
  { id: '3', name: 'iammaithuy' },
  { id: '4', name: '_rqje.gni' },
  { id: '5', name: '_0207.02' },
  { id: '6', name: 'thvu.u' },
  { id: '7', name: 'minh.an' },
  { id: '8', name: 'quynh.07' },
];

const RING =
  'p-[2px] rounded-full bg-[linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888,#8a3ab9)]';

function Story({ name, image }: { name: string; image?: string }) {
  return (
    <button
      type="button"
      className="flex flex-col items-center gap-1.5 shrink-0 w-[72px]"
      aria-label={`Story của ${name}`}
    >
      <span className={RING}>
        <span className="block bg-ig-bg p-[2px] rounded-full">
          {image ? (
            <img
              src={image}
              alt=""
              className="w-14 h-14 rounded-full object-cover"
            />
          ) : (
            <span className="block w-14 h-14 rounded-full bg-ig-hover" />
          )}
        </span>
      </span>
      <span className="text-[12px] text-ig-text truncate w-full text-center">
        {name}
      </span>
    </button>
  );
}

function StoriesRow() {
  return (
    <div className="border-b border-ig-border sm:border-b-0">
      <div className="flex gap-3 overflow-x-auto px-4 py-4 sm:px-0 [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
        {MOCK_STORIES.map((s) => (
          <Story key={s.id} name={s.name} image={s.image} />
        ))}
      </div>
    </div>
  );
}

export default StoriesRow;
