"use server";

import * as z from "zod";

import { OTPSchema } from "@/schema/auth";

import { db, getUserByEmail } from "@workspace/consensusflow";

export const verify2FAotp = async (otp: z.infer<typeof OTPSchema>) => {
  try {
    const DataValidation = OTPSchema.safeParse(otp);

    if (!DataValidation.success) {
      return {
        error: "Invalid OTP format. OTP must be a 6-digit number.",
      };
    }

    return {
      success: "OTP verified successfully. You are now logged in.",
    };
  } catch {
    return {
      error: "Something Went Wrong While Verifying The OTP!",
    };
  }
};
