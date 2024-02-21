import http from "../../../http";
import { RegisterUserType } from "../validate";
export const registerUser = (data: RegisterUserType) => {
  return http.post("/v1/users/register", {
    ...data,
  });
};
