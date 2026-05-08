type Props = {
  src: string;
  alt?: string;
};

function PostMedia({ src, alt = 'Post media' }: Props) {
  return (
    <div className="w-full bg-black">
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className="block w-full h-auto aspect-square object-cover sm:aspect-auto sm:max-h-[585px]"
      />
    </div>
  );
}

export default PostMedia;
