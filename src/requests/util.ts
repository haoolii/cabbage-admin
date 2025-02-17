import { Code } from "./code";
import { ApiResponse } from "./types";

export const createApi = <R extends Record<string, string>, S extends string>(routes: R, service: S) => {
    const entries = Object.entries(routes) as [keyof R, R[keyof R]][];
    const apis: Record<keyof R, `${S}${R[keyof R]}`> = {} as Record<keyof R, `${S}${R[keyof R]}`>;
    for (const [key, route] of entries) {
        apis[key] = `${service}${route}`;
    }
    return apis
};

export const replacePathParams = (url: string, pathParams: Record<string, unknown>) => {
    let newUrl = url;
    Object.entries(pathParams).forEach(([key, value]) => {
        newUrl = newUrl.replace(`:${key}`, `${value}`);
    });
    return newUrl;
};

export const isSuccess = (response: ApiResponse<unknown>) => {
    return `${response.code}` === `${Code.SUCCESS}`;
}