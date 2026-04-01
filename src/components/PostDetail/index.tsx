/* eslint-disable @typescript-eslint/no-explicit-any */
// import React from 'react';

// const PostDetail = () => {
//   return <div>PostDetail</div>;
// };

// export default PostDetail;

// @components/PostDetail.tsx
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  CircularProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate, useParams } from 'react-router-dom';
import {
  useCommentPostMutation,
  useGetPostsByIdQuery,
  useLikePostMutation,
  useUnlikePostMutation,
} from '@services/postApi';
import { useEffect, useState } from 'react';
import { Bounce, toast } from 'react-toastify';
import { useCreateNotification } from '@hooks/index';
import { useUserInfo } from '@hooks/getUserinfo';
import Post from '@components/PostList/Post';

// Hàm giả lập fetch data đã được loại bỏ vì hook sẽ được dùng trực tiếp trong component

export default function PostDetail() {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const { data, isLoading } = useGetPostsByIdQuery(postId ?? '');
  const [commentPost, { isSuccess, error }] = useCommentPostMutation();
  const [resetComment, setResetComment] = useState(false);
  const { handleCreateNotification } = useCreateNotification();
  const { _id } = useUserInfo() as { _id: string };
  const [likePost] = useLikePostMutation();
  const [unlikePost] = useUnlikePostMutation();
  const handleClose = () => {
    // Chỉ cần quay lại một bước trong history, tức là backgroundLocation cũ
    navigate(-1);
  };
  const notifySuccess = () =>
    toast.success('Comment successfully!', {
      position: 'bottom-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      theme: 'light',
      transition: Bounce,
    });

  useEffect(() => {
    if (isSuccess) {
      setResetComment(true);
      notifySuccess();
    } else if (error) {
      toast.error('Comment failed!', {
        position: 'bottom-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        theme: 'light',
        transition: Bounce,
      });
    }
  }, [isSuccess, error]);

  useEffect(() => {
    // Reset comment state when post data changes
    if (data) {
      setResetComment(false);
    }
    console.log('data changed', data);
  }, [data]);

  console.log('PostDetail', data, isLoading);

  const postData = data
    ? {
        title: `Bài viết của  ${data?.author?.fullName || 'Người dùng'}`,
      }
    : null;

  return (
    <Dialog open={true} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {isLoading ? 'Đang tải...' : postData?.title}
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <CircularProgress />
          </div>
        ) : (
          // <div>
          //   <div className="flex gap-4">
          //     <img
          //       src={data?.author?.image || '/default-avatar.png'}
          //       alt="User Avatar"
          //       className="w-12 h-12 rounded-full"
          //     />
          //     <div>
          //       <span className="text-[16px] hover:underline cursor-pointer">
          //         {data?.author?.fullName || 'Unknown User'}
          //       </span>
          //       <div className="flex text-[16px] rounded-lg">
          //         <span className="text-[#4B465C] text-[13px]">
          //           {new Date(data?.createdAt).toLocaleDateString('en-US', {
          //             year: 'numeric',
          //             month: '2-digit',
          //             day: '2-digit',
          //           })}
          //         </span>
          //       </div>
          //     </div>
          //   </div>
          //   <div className="mt-4">
          //     <p className="text-[16px]">{data?.content}</p>
          //     <div>
          //       {data?.image && (
          //         <img
          //           src={data.image}
          //           alt="Post"
          //           className="w-full h-full object-cover rounded-lg"
          //         />
          //       )}
          //     </div>
          //   </div>
          //   <div className="flex justify-between items-center mt-2">
          //     <span className="text-gray-500">{data?.likes?.length} Likes</span>
          //     <span className="text-gray-500">
          //       {data?.comments?.length} Comments
          //     </span>
          //   </div>

          //   {/* Ở đây bạn có thể hiển thị comment, like button, v.v. */}
          //   <div className="flex gap-4 mt-2 justify-between border-t border-[#DBDADE] pt-3 px-6">
          //     <div
          //       className="flex gap-2 items-center cursor-pointer"
          //       onClick={() => handleLike(postId || '')}
          //     >
          //       {isLiked ? (
          //         <img
          //           src="/icons/Liked.svg"
          //           alt="like"
          //           width={20}
          //           height={20}
          //         />
          //       ) : (
          //         <LikeIcon width={20} height={20} />
          //       )}

          //       <span className="text-[16px] text-[#4B465C]">Like</span>
          //     </div>

          //     <div className="flex gap-2 items-center cursor-pointer">
          //       <CommentIcon width={20} height={20} />
          //       <span className="text-[16px] text-[#4B465C]">Comments</span>
          //     </div>

          //     <div className="flex gap-2 items-center">
          //       <ShareIcon width={20} height={20} />
          //       <span className="text-[16px] text-[#4B465C]">Shares</span>
          //     </div>
          //   </div>
          //   <div className="mt-4">
          //     <CommentSection
          //       comments={data?.comments || []}
          //       postId={postId || ''}
          //       handleComment={async (postId: string, comment: string) => {
          //         const res = await commentPost({
          //           postId,
          //           comment: comment,
          //         }).unwrap();
          //         console.log('res', res);

          //         handleCreateNotification({
          //           userId: data.author?._id,
          //           postId: data._id,
          //           type: 'comment',
          //           typeId: res._id,
          //         });
          //       }}
          //       resetComment={resetComment}
          //     />
          //   </div>
          // </div>
          <Post
            fullName={data.author?.fullName}
            createAt={data?.createdAt}
            content={data.content}
            image={data?.author?.image}
            imagePost={data?.image}
            likes={data?.likes}
            comments={data?.comments}
            postId={data._id}
            auhorId={data.author?._id}
            isLiked={data.likes.some((like: any) => like.author?._id === _id)}
            handleLike={async (postId: string) => {
              if (data.likes.some((like: any) => like.author?._id === _id)) {
                unlikePost(postId);
              } else {
                const res = await likePost(postId).unwrap();
                console.log('res', res, data);

                handleCreateNotification({
                  userId: data.author?._id,
                  postId: data._id,
                  type: 'like',
                  typeId: res._id,
                });
              }
            }}
            handleComment={async (postId: string, comment: string) => {
              const res = await commentPost({
                postId,
                comment: comment,
              }).unwrap();
              console.log('res', res, data);

              handleCreateNotification({
                userId: data.author?._id,
                postId: data._id,
                type: 'comment',
                typeId: res._id,
              });
            }}
            resetComment={resetComment}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
