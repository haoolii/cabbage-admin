import axios from "axios";
import { api } from "./endpoint";
import {
  GetRecordsParams,
  GetRecordsResponse,
  PostLoginBody,
  PostLoginResponse,
} from "./types";

const publicAxios = axios.create({});

const authAxios = axios.create({});

authAxios.interceptors.request.use(
  (config) => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("Authorization="))
      ?.split("=")[1];

      console.log('token', token);

    if (token) {
      config.headers["Authorization"] = token;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const postLogin = async ({ email, password }: PostLoginBody) => {
  return publicAxios.post<PostLoginResponse>(api.postLogin, {
    email,
    password,
  });
};

export const getRecords = async ({ page, size }: GetRecordsParams) => {
  return authAxios.get<GetRecordsResponse>(api.getRecords, {
    params: {
      page,
      size,
    },
  });
};
