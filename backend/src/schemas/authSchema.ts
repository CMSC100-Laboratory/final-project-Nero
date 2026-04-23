import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    firstname: z.string().nonempty("First name is required"),
    middlename: z.string().optional(),
    lastname: z.string().nonempty("Last name is required"),
    email: z.string().email("Invalid email address").nonempty("Email is required"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .nonempty("Password is required"),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email address").nonempty("Email is required"),
    password: z.string().nonempty("Password is required"),
  }),
});
