import { Comment } from 'src/ultil/type';

export type PostLike = { author?: { _id: string } };

export type PostProps = {
  postId: string;
  authorId: string;
  fullName: string;
  authorImage?: string;
  createdAt: string;
  content: string;
  imagePost?: string;
  likes: PostLike[];
  comments: Comment[];
  isLiked?: boolean;
  resetComment?: boolean;
  onLike: (postId: string) => void;
  onComment: (postId: string, comment: string) => void;
};
