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
