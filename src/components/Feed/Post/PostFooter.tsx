type Props = {
  fullName: string;
  content: string;
  commentsCount: number;
  createdAt: string;
  onToggleComments: () => void;
};

function PostFooter({ fullName, content }: Props) {
  return (
    <div className="px-4 pb-3 space-y-1.5">
      {content && (
        <p className="text-[14px] text-ig-text leading-snug">
          <span className="font-semibold mr-1.5">{fullName}</span>
          <span className="whitespace-pre-wrap break-words">{content}</span>
        </p>
      )}
    </div>
  );
}

export default PostFooter;
