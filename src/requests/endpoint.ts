import env from "@/core/env";
import { createApi } from "./util";

const base = `${env.CLIENT_API_BASE}/d/admin`;

const paths = {
  postLogin: "/auth/login",
  getRecords: "/records",
};

export const api = createApi(paths, base);
