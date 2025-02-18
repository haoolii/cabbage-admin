export type ApiResponse<T> = {
  message: string;
  data: T;
  code: string;
};

export type PostLoginBody = {
  email: string;
  password: string;
  captchToken: string;
};

export type PostLoginResponse = ApiResponse<{
  token: string;
}>;

export type GetRecordsParams = {
  page: number;
  size: number;
};

export type RecordType = {
  id: string;
  uniqueId: string;
  prompt: string;
  password: string;
  passwordRequired: boolean;
  type: string;
  expireIn: number;
  expireAt: string;
  createdAt: string;
  updatedAt: string;
};

export type GetRecordsResponse = ApiResponse<{
  records: RecordType[];
  total: number;
}>;
