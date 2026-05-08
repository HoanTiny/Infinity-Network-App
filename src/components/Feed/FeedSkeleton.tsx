function PostSkeleton() {
  return (
    <article className="bg-ig-bg border-b border-ig-border sm:border-b-0 sm:mb-10 animate-pulse">
      <header className="flex items-center gap-3 px-4 py-3">
        <div className="w-8 h-8 rounded-full bg-ig-hover" />
        <div className="h-3 bg-ig-hover rounded w-24" />
      </header>
      <div className="w-full aspect-square bg-ig-hover sm:aspect-auto sm:h-[585px]" />
      <div className="flex gap-4 px-4 pt-3 pb-2">
        <div className="w-6 h-6 bg-ig-hover rounded" />
        <div className="w-6 h-6 bg-ig-hover rounded" />
        <div className="w-6 h-6 bg-ig-hover rounded" />
      </div>
      <div className="px-4 pb-4 space-y-2">
        <div className="h-3 bg-ig-hover rounded w-20" />
        <div className="h-3 bg-ig-hover rounded w-3/4" />
        <div className="h-2 bg-ig-hover rounded w-16" />
      </div>
    </article>
  );
}

function FeedSkeleton({ count = 3 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <PostSkeleton key={i} />
      ))}
    </>
  );
}

export default FeedSkeleton;
