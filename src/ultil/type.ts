/* eslint-disable @typescript-eslint/no-explicit-any */
export type UserInfoSearch = {
  _id: string;
  isFriend: boolean;
  fullName: string;
  avatar: string;
  requestSent?: boolean;
  requestReceived?: boolean;
};

export type SearchUsersResponse = {
  users: UserInfoSearch[];
};

// Định nghĩa trước các interface cho likes và comments
export interface Like {
  _id: string;
  author: {
    _id: string;
    fullName: string;
  };
  post: string;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  /* tuỳ vào shape của comment API, ví dụ: */
  _id: string;
  author: { _id: string; fullName: string };
  content: string;
  createdAt: string;
  updatedAt: string;
}

// Type đại diện cho object post như API trả về
export interface RawPost {
  _id: string;
  content: string;
  author: {
    _id: string;
    fullName: string;
    notifications: any[];
  };
  createdAt: string;
  updatedAt: string;
  likes: Like[];
  comments: Comment[];
  image?: string;
  imagePublicId?: string;
  __v: number;
}

// Type mà component của bạn sẽ dùng
export interface PostProps {
  postId: string; // map từ `_id`
  fullName: string; // author.fullName
  createAt: string; // API là createdAt
  content: string;
  image?: string;
  likes: Like[]; // lưu nguyên object nếu bạn cần hiển thị chi tiết
  comments: Comment[];
  handleLike: (postId: string) => void;
  isLiked?: boolean;
}

export interface PostResponsive {
  ids: string[];
  entities: Record<string, PostProps>;
}
