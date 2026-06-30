import { ImagePlus } from 'lucide-react';

const PLACEHOLDER_PHOTOS = Array.from({ length: 9 }, (_, i) => i);

const PhotosTab = () => {
  return (
    <div className="mt-4 bg-ig-bg border border-ig-border rounded-xl py-4 px-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-bold text-ig-text">Ảnh</h1>
        <p className="text-sm text-ig-accent cursor-pointer hover:underline">
          Xem tất cả
        </p>
      </div>

      {PLACEHOLDER_PHOTOS.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-48 gap-2 text-ig-muted">
          <ImagePlus size={32} />
          <p className="text-sm">Chưa có ảnh nào</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-2">
          {PLACEHOLDER_PHOTOS.map((i) => (
            <div
              key={i}
              className="aspect-square overflow-hidden rounded-md border border-ig-border bg-ig-hover"
            >
              <img
                src="/img/car.jpg"
                alt="Photo"
                className="w-full h-full object-cover hover:opacity-90 transition-opacity cursor-pointer"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PhotosTab;
