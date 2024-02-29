import { LoginUserType } from "../validate";
import http from "@src/http";
export const loginUser = (data: LoginUserType) => {
  return http.post(
    "/v1/auth/login",
    {
      ...data,
    },
    {
      withCredentials: true,
    }
  );
};
