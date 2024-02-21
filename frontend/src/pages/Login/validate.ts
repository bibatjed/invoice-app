import { z } from "zod";
const LoginSchema = z.object({
  email: z.string().email("Valid email is required"),
  password: z.string().min(8, "Password is required"),
});

export { LoginSchema };
export type LoginUserType = z.infer<typeof LoginSchema>;
