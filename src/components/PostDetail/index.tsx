/* eslint-disable @typescript-eslint/no-explicit-any */
import TimeAgo from '@components/TimeAgo';
import UserAvatar from '@components/UserAvatar';
import { useCreateNotification } from '@hooks/index';
import { useUserInfo } from '@hooks/getUserinfo';
import {
  useCommentPostMutation,
  useGetPostsByIdQuery,
  useLikePostMutation,
  useUnlikePostMutation,
} from '@services/postApi';
import {
  Bookmark,
  Heart,
  Loader2,
  MessageCircle,
  MoreHorizontal,
  Send,
  Smile,
  X,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Bounce, toast } from 'react-toastify';
import { Comment } from 'src/ultil/type';

export default function PostDetail() {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const { data, isLoading } = useGetPostsByIdQuery(postId ?? '');
  const [commentPost, { isSuccess, error }] = useCommentPostMutation();
  const { handleCreateNotification } = useCreateNotification();
  const { _id: currentUserId } = useUserInfo() as { _id: string };
  const [likePost] = useLikePostMutation();
  const [unlikePost] = useUnlikePostMutation();
  const [newComment, setNewComment] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleClose = () => navigate(-1);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    const toastOpts = { position: 'bottom-right' as const, autoClose: 3000, transition: Bounce };
    if (isSuccess) {
      setNewComment('');
      toast.success('Đã bình luận!', toastOpts);
    } else if (error) {
      toast.error('Bình luận thất bại!', toastOpts);
    }
  }, [isSuccess, error]);

  const isLiked = data?.likes?.some((l: any) => l.author?._id === currentUserId) ?? false;

  const handleLike = async () => {
    if (!data) return;
    if (isLiked) {
      unlikePost(data._id);
    } else {
      const res = await likePost(data._id).unwrap();
      handleCreateNotification({
        userId: data.author?._id,
        postId: data._id,
        type: 'like',
        typeId: res._id,
      });
    }
  };

  const submitComment = async () => {
    const trimmed = newComment.trim();
    if (!trimmed || !data) return;
    const res = await commentPost({ postId: data._id, comment: trimmed }).unwrap();
    handleCreateNotification({
      userId: data.author?._id,
      postId: data._id,
      type: 'comment',
      typeId: res._id,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
      onClick={handleClose}
    >
      <button
        onClick={(e) => { e.stopPropagation(); handleClose(); }}
        className="absolute top-4 right-4 z-50 text-white hover:opacity-70 transition-opacity"
        aria-label="Đóng"
      >
        <X size={28} strokeWidth={1.75} />
      </button>

      <div
        className="flex bg-ig-bg w-full max-w-[935px] max-h-[90vh] rounded-xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center py-20">
            <Loader2 size={32} className="text-ig-muted animate-spin" />
          </div>
        ) : data ? (
          <>
            {data.image && (
              <div className="flex-1 bg-black flex items-center justify-center min-w-0 min-h-[400px]">
                <img
                  src={data.image}
                  alt="Post"
                  className="w-full h-full object-contain max-h-[90vh]"
                />
              </div>
            )}

            <div
              className={`flex flex-col border-l border-ig-border ${
                data.image ? 'w-[360px] shrink-0' : 'flex-1'
              }`}
            >
              {/* Header */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-ig-border shrink-0">
                <Link to={`/user/${data.author?._id}`} onClick={handleClose} className="shrink-0">
                  <div className="p-[2px] rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600">
                    <div className="p-[2px] rounded-full bg-ig-bg">
                      <UserAvatar src={data.author?.image} size="sm" />
                    </div>
                  </div>
                </Link>

                <div className="flex-1 min-w-0">
                  <Link
                    to={`/user/${data.author?._id}`}
                    onClick={handleClose}
                    className="text-[14px] font-semibold text-ig-text hover:opacity-70 truncate block"
                  >
                    {data.author?.fullName}
                  </Link>
                </div>

                <button
                  type="button"
                  className="shrink-0 text-ig-text hover:opacity-60 transition-opacity"
                  aria-label="Tùy chọn"
                >
                  <MoreHorizontal size={20} strokeWidth={1.75} />
                </button>
              </div>

              {/* Comments scroll area */}
              <div className="flex-1 overflow-y-auto">
                {/* Caption */}
                {data.content && (
                  <div className="flex gap-3 px-4 py-4">
                    <Link to={`/user/${data.author?._id}`} onClick={handleClose} className="shrink-0 pt-0.5">
                      <UserAvatar src={data.author?.image} size="sm" />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] text-ig-text leading-snug">
                        <Link
                          to={`/user/${data.author?._id}`}
                          onClick={handleClose}
                          className="font-semibold mr-1.5 hover:opacity-70"
                        >
                          {data.author?.fullName}
                        </Link>
                        <span className="whitespace-pre-wrap break-words">{data.content}</span>
                      </p>
                      <p className="text-[11px] text-ig-muted mt-1.5">
                        <TimeAgo date={data.createdAt} />
                      </p>
                    </div>
                  </div>
                )}

                {/* Comments list */}
                {data.comments?.length > 0 && (
                  <ul className="pb-2">
                    {[...data.comments]
                      .sort(
                        (a: Comment, b: Comment) =>
                          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
                      )
                      .map((c: Comment) => (
                        <li key={c._id} className="flex gap-3 px-4 py-2">
                          <Link to={`/user/${c.author._id}`} onClick={handleClose} className="shrink-0 pt-0.5">
                            <UserAvatar src={c.author.image} size="sm" />
                          </Link>
                          <div className="flex-1 min-w-0">
                            <p className="text-[14px] text-ig-text leading-snug">
                              <Link
                                to={`/user/${c.author._id}`}
                                onClick={handleClose}
                                className="font-semibold mr-1.5 hover:opacity-70"
                              >
                                {c.author.fullName}
                              </Link>
                              <span className="whitespace-pre-wrap break-words">{c.comment}</span>
                            </p>
                            <div className="flex items-center gap-4 mt-1 text-[12px] text-ig-muted">
                              <TimeAgo date={c.updatedAt} />
                              <button
                                type="button"
                                className="font-semibold hover:text-ig-text transition-colors"
                              >
                                Trả lời
                              </button>
                            </div>
                          </div>
                          <button
                            type="button"
                            className="shrink-0 self-center text-ig-muted hover:text-ig-text transition-colors"
                            aria-label="Like comment"
                          >
                            <Heart size={12} strokeWidth={1.75} />
                          </button>
                        </li>
                      ))}
                  </ul>
                )}
              </div>

              {/* Bottom panel */}
              <div className="shrink-0 border-t border-ig-border">
                {/* Actions */}
                <div className="flex items-center gap-1 px-3 pt-3 pb-1">
                  <button
                    type="button"
                    onClick={handleLike}
                    aria-label={isLiked ? 'Bỏ thích' : 'Thích'}
                    className={`flex items-center gap-1.5 px-1 py-1 rounded-md hover:bg-ig-hover transition-colors ${
                      isLiked ? 'text-ig-heart' : 'text-ig-text'
                    }`}
                  >
                    <Heart
                      size={22}
                      strokeWidth={isLiked ? 0 : 1.75}
                      fill={isLiked ? 'currentColor' : 'none'}
                      className="transition-transform active:scale-90"
                    />
                  </button>

                  <button
                    type="button"
                    onClick={() => textareaRef.current?.focus()}
                    className="flex items-center px-1 py-1 rounded-md text-ig-text hover:bg-ig-hover transition-colors"
                    aria-label="Bình luận"
                  >
                    <MessageCircle size={22} strokeWidth={1.75} className="-scale-x-100" />
                  </button>

                  <button
                    type="button"
                    className="flex items-center px-1 py-1 rounded-md text-ig-text hover:bg-ig-hover transition-colors"
                    aria-label="Chia sẻ"
                  >
                    <Send size={22} strokeWidth={1.75} />
                  </button>

                  <button
                    type="button"
                    className="flex items-center px-1 py-1 rounded-md text-ig-text hover:bg-ig-hover transition-colors ml-auto"
                    aria-label="Lưu"
                  >
                    <Bookmark size={22} strokeWidth={1.75} />
                  </button>
                </div>

                {/* Likes count */}
                {data.likes?.length > 0 && (
                  <p className="px-4 pb-1 text-[14px] font-semibold text-ig-text">
                    {data.likes.length.toLocaleString()} lượt thích
                  </p>
                )}

                {/* Date */}
                <p className="px-4 pb-3 text-[11px] uppercase tracking-wider text-ig-muted">
                  <TimeAgo date={data.createdAt} />
                </p>

                {/* Comment input */}
                <div className="flex items-center gap-2 px-4 py-3 border-t border-ig-border">
                  <button
                    type="button"
                    className="shrink-0 text-ig-muted hover:text-ig-text transition-colors"
                    aria-label="Emoji"
                  >
                    <Smile size={22} strokeWidth={1.75} />
                  </button>

                  <textarea
                    ref={textareaRef}
                    rows={1}
                    placeholder="Bình luận..."
                    value={newComment}
                    onChange={(e) => {
                      setNewComment(e.target.value);
                      e.target.style.height = 'auto';
                      e.target.style.height = `${Math.min(e.target.scrollHeight, 80)}px`;
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        submitComment();
                      }
                    }}
                    className="flex-1 resize-none bg-transparent text-[14px] text-ig-text placeholder:text-ig-muted outline-none border-0 leading-snug py-0.5 max-h-20"
                  />

                  {newComment.trim() && (
                    <button
                      type="button"
                      onClick={submitComment}
                      className="shrink-0 text-[14px] font-semibold text-ig-accent hover:opacity-70 transition-opacity"
                    >
                      Đăng
                    </button>
                  )}
                </div>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
