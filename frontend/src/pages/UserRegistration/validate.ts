import { z } from "zod";
const RegisterUserSchema = z
  .object({
    email: z.string().email("Valid email is required"),
    password: z.string().min(8, "Password is required"),
    confirm_password: z.string().min(8, "Confirm password is required"),
    first_name: z.string().min(1, "First Name is required"),
    middle_name: z.string().optional(),
    last_name: z.string().min(1, "Last Name is required"),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export { RegisterUserSchema };
export type RegisterUserType = z.infer<typeof RegisterUserSchema>;
