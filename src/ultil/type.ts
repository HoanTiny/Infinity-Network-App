/* eslint-disable @typescript-eslint/no-explicit-any */
export type UserInfoSearch = {
  _id: string;
  isFriend: boolean;
  fullName: string;
  image?: string;
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
  author: { _id: string; fullName: string; image?: string };
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
  limit?: number; // nếu API có trả về limit
  offset?: number; // nếu API có trả về offset
  total?: number; // nếu API có trả về tổng số lượng
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
  meta?: {
    limit: number;
    offset: number;
    total: number;
  };
  posts?: PostProps[]; // nếu bạn cần truyền post object đầy đủ
}

export interface Comment {
  _id: string;
  comment: string;
  author: {
    _id: string;
    fullName: string;
    image?: string;
  };
  post: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
