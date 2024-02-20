import { z } from "zod";
const loginUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
export function validateLogin(userDetails: z.infer<typeof loginUserSchema>) {
  return loginUserSchema.parse(userDetails);
}
