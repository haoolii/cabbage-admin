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
  uniqueId?: string;
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

export type GetUrlsParams = {
  page: number;
  size: number;
  recordId?: string;
  content?: string;
};

export type UrlType = {
  id: string;
  recordId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};

export type GetUrlsResponse = ApiResponse<{
  urls: UrlType[];
  total: number;
}>;

export type GetAssetsParams = {
  page: number;
  size: number;
  recordId?: string;
  key?: string;
};

export type AssetType = {
  id: string;
  recordId: string;
  key: string;
  createdAt: string;
  updatedAt: string;
};

export type GetAssetsResponse = ApiResponse<{
  assets: AssetType[];
  total: number;
}>;