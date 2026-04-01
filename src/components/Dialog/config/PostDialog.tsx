import { useGetPostsByIdQuery } from '@services/postApi';

/* eslint-disable @typescript-eslint/no-explicit-any */
const PostDetailDialog = ({ data }: { data?: any }) => {
  const { data: dataPost } = useGetPostsByIdQuery(data.post);
  console.log('dataPost in PostDetailDialog', dataPost);
  return (
    <div>
      <div className="flex flex-col gap-4 bg-light-100 card mt-4 rounded-lg">
        <div className="flex gap-4 ">
          <img
            src={dataPost?.author?.image || '/default-avatar.png'}
            alt="User Avatar"
            className="w-12 h-12 rounded-full"
          />
          <div>
            <span className="text-[16px] hover:underline cursor-pointer">
              {dataPost?.author?.fullName || 'Unknown User'}
            </span>
            <div className="flex text-[16px] rounded-lg">
              <span className="text-[#4B465C] text-[13px]">
                {/* Assuming createAt is a date string */}
                {new Date(dataPost?.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                })}
              </span>
            </div>
          </div>
        </div>
        <div>
          <p className="text-[16px]">
            {dataPost?.content || 'No content available'}
          </p>
        </div>
        <div>
          {dataPost?.image && (
            <img
              src={dataPost.image}
              alt="Post"
              className="w-full h-full object-cover rounded-lg"
            />
          )}
        </div>
        <div className="flex justify-between items-center mt-2">
          <span className="text-gray-500">
            {dataPost?.likes?.length || 0} Likes
          </span>
          <span className="text-gray-500">
            {dataPost?.comments?.length || 0} Comments
          </span>
        </div>
        <div className="flex gap-2 items-center mt-2">
          <img src="/icons/Liked.svg" alt="like" width={20} height={20} />
          <span className="text-[16px] text-[#4B465C]">
            {dataPost?.likes?.length || 0}
          </span>
        </div>
        <div className="flex gap-2 items-center cursor-pointer">
          <span className="text-[16px] text-[#4B465C]">
            {dataPost?.comments?.length || 0} Comments
          </span>
        </div>
      </div>
    </div>
  );
};

export default PostDetailDialog;
