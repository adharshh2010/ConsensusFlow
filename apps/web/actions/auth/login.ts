"use server";

import * as z from "zod";

import { LoginSchema } from "@/schema/auth";

import { getUserByEmail } from "@workspace/consensusflow";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { send2FAOTP } from "@workspace/consensusflow/utils/email/send2FAOTP";

export const login = async (data: z.infer<typeof LoginSchema>) => {
  // Todo: Add rate limiter by your own!
  // console.log(data);
  try {
    const { email, password, remember } = data;

    const ExistingUser = await getUserByEmail(email);

    if (!ExistingUser) {
      return {
        error: "Invalid email or password.",
        status: 401,
      };
    }

    const hashedPassword = ExistingUser.password;

    if (!hashedPassword) {
      return {
        error: "Invalid email or password.",
        status: 401,
      };
    }

    const isPasswordValid = await bcrypt.compare(password, hashedPassword);

    if (!isPasswordValid) {
      return {
        error: "Invalid email or password.",
        status: 401,
      };
    }

    if (ExistingUser.twoFactorEnabled) {
      // Handle 2FA flow here (e.g., send OTP, verify OTP, etc.)
      // For simplicity, we'll just return a message indicating that 2FA is required.

      // What i mean is to sent a OTP to  the user then the page with switch to OTP verification page and then after successful verification the user will be logged in. the login system will be like it will find whom the otp belong to then it will log in that user. and the OTP will be valid for 5 minutes only and it can be used only once. and if the user try to use the same OTP again it will return an error message that the OTP is invalid or expired.

      (await cookies()).set("remember", String(remember), {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: remember ? 60 * 60 * 24 * 30 : undefined, // 30 days if remember is true, otherwise session cookie
      });

      await send2FAOTP(email).then((state) => {
        if (state.error) {
          return { error: state.error };
        }
      });

      return {
        success:
          "Verification code sent to your email. Please verify to continue.",
        OTP: true,
        status: 403,
      };
    } else {
      return {
        success: "Welcome back!",
        description: "Continue With Our Service.",
        status: 200,
      };
    }
  } catch {
    return {
      error: "Something Went Wrong While Trying Handling Authentication",
      status: 500,
    };
  }
};
