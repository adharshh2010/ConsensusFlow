import * as z from "zod";

export const LoginSchema = z.object({
  email: z.email({ error: "Invalid email address" }),
  password: z
    .string()
    .min(6, { error: "Password must be at least 6 characters" })
    .max(64, { error: "Password must be at most 64 characters" }),
  remember: z.boolean(),
});

export const RegisterSchema = z.object({
  email: z.email({ error: "Invalid email address" }),
  password: z
    .string()
    .min(6, { error: "Password must be at least 6 characters" })
    .max(64, { error: "Password must be at most 64 characters" }),
});

export const OTPSchema = z.object({
  otp: z.string().regex(/^\d{6}$/, { error: "OTP must be 6 digits" }),
});
