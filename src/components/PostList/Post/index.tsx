import { CommentIcon, LikeIcon, ShareIcon } from '@components/Icon';
import { Avatar } from '@mui/material';
import { deepOrange } from '@mui/material/colors';
import dayjs from 'dayjs';

export type PostProps = {
  fullName: string;
  createAt: string;
  content: string;
  image: string;
  likes: Array<string>;
  comments: Array<string>;
};
function Post({
  fullName,
  createAt,
  content,
  image,
  likes = [],
  comments = [],
}: PostProps) {
  return (
    <div className="flex flex-col gap-4 card mt-4">
      <div className="flex gap-4 ">
        <Avatar sx={{ bgcolor: deepOrange[500] }}>H</Avatar>
        <div className="">
          <span className="text-[16px]">{fullName}</span>
          <div className="flex text-[16px] rounded-lg">
            <span className="text-[#4B465C] text-[13px]">
              {dayjs(createAt).format('DD/MM/YYYY HH:mm')}
            </span>
          </div>
        </div>
      </div>

      <div>
        <p className="text-[16px]">{content}</p>
      </div>

      <div>
        {image && (
          <img
            src={image}
            alt="random"
            className="w-full h-full object-cover rounded-lg"
          />
        )}
      </div>

      <div className="flex gap-4 justify-between">
        <div className="flex gap-2 items-center">
          <LikeIcon width={20} height={20} />
          <span className="text-[16px] text-[#4B465C]">{likes.length}</span>
        </div>

        <div className="flex gap-2 items-center">
          <span className="text-[16px] text-[#4B465C]">{comments.length}</span>
          <span className="text-[16px] text-[#4B465C]">Comments</span>
        </div>
      </div>

      <div className="flex gap-4 justify-between border-t border-[#DBDADE] pt-3 px-6">
        <div className="flex gap-2 items-center">
          <LikeIcon width={20} height={20} />
          <span className="text-[16px] text-[#4B465C]">Like</span>
        </div>

        <div className="flex gap-2 items-center">
          <CommentIcon width={20} height={20} />
          <span className="text-[16px] text-[#4B465C]">Comments</span>
        </div>

        <div className="flex gap-2 items-center">
          <ShareIcon width={20} height={20} />
          <span className="text-[16px] text-[#4B465C]">Shares</span>
        </div>
      </div>
    </div>
  );
}

export default Post;
