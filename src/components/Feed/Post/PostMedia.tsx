type Props = {
  src: string;
  alt?: string;
};

function PostMedia({ src, alt = 'Post media' }: Props) {
  return (
    <div className="w-full bg-black rounded-xl">
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className="block w-full h-auto object-cover max-h-[600px] rounded-xl"
      />
    </div>
  );
}

export default PostMedia;
