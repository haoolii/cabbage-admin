import axios from "axios";
import { api } from "./endpoint";
import {
  DeleteRecordBody,
  DeleteRecordParams,
  DeleteRecordResponse,
  GetAssetsParams,
  GetAssetsResponse,
  GetRecordsParams,
  GetRecordsResponse,
  GetUrlsParams,
  GetUrlsResponse,
  PostLoginBody,
  PostLoginResponse,
} from "./types";
import { replacePathParams } from "./util";

const publicAxios = axios.create({});

const authAxios = axios.create({});

authAxios.interceptors.request.use(
  (config) => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("Authorization="))
      ?.split("=")[1];

    console.log("token", token);

    if (token) {
      config.headers["Authorization"] = token;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const postLogin = async ({
  email,
  password,
  captchToken,
}: PostLoginBody) => {
  return publicAxios.post<PostLoginResponse>(api.postLogin, {
    email,
    password,
    captchToken,
  });
};

export const getRecords = async ({
  page,
  size,
  uniqueId,
  createdAtGt,
  createdAtLt
}: GetRecordsParams) => {
  return authAxios.get<GetRecordsResponse>(api.getRecords, {
    params: {
      page,
      size,
      uniqueId,
      createdAtGt,
      createdAtLt
    },
  });
};

export const deleteRecord = async (
  { id }: DeleteRecordParams,
  { soft }: DeleteRecordBody
) => {
  const url = replacePathParams(api.deleteRecord, { id });

  return authAxios.delete<DeleteRecordResponse>(url, {
    data: {
      soft,
    },
  });
};

export const getUrls = async ({
  page,
  size,
  recordId,
  content,
}: GetUrlsParams) => {
  return authAxios.get<GetUrlsResponse>(api.getUrls, {
    params: {
      page,
      size,
      recordId,
      content,
    },
  });
};

export const getAssets = async ({
  page,
  size,
  recordId,
  key,
}: GetAssetsParams) => {
  return authAxios.get<GetAssetsResponse>(api.getAssets, {
    params: {
      page,
      size,
      recordId,
      key,
    },
  });
};
