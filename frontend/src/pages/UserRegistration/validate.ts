import { z } from "zod";
const RegisterUserSchema = z
  .object({
    email: z.string().email("Valid email is required"),
    password: z.string().min(8, "Password is required"),
    confirmPassword: z.string().min(8, "Confirm password is required"),
    firstName: z.string().min(1, "First Name is required"),
    middleName: z.string().optional(),
    lastName: z.string().min(1, "Last Name is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export { RegisterUserSchema };
export type RegisterUserType = z.infer<typeof RegisterUserSchema>;
