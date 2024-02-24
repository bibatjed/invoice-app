import { z } from "zod";
const RegisterUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  first_name: z.string(),
  middle_name: z.string().optional(),
  last_name: z.string(),
});
export function validateRegisterUser(userDetails: z.infer<typeof RegisterUserSchema>) {
  return RegisterUserSchema.parse(userDetails);
}
