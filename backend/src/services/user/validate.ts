import { z } from "zod";
const RegisterUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string(),
  middleName: z.string().optional(),
  lastName: z.string(),
});
export function validateRegisterUser(userDetails: z.infer<typeof RegisterUserSchema>) {
  return RegisterUserSchema.parse(userDetails);
}
