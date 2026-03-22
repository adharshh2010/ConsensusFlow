"use server";

import * as z from "zod";

import { OTPSchema } from "@/schema/auth";

import { db, getUserByEmail, otptable } from "@workspace/consensusflow";
import { cookies } from "next/headers";
import { eq } from "drizzle-orm";

export const verify2FAotp = async (otp: z.infer<typeof OTPSchema>) => {
  try {
    const DataValidation = OTPSchema.safeParse(otp);

    if (!DataValidation.success) {
      return {
        error: "Invalid OTP format. OTP must be a 6-digit number.",
      };
    }

    const remember = (await cookies()).get("remember")?.value === "true";

    (await cookies()).delete("remember");

    const field = db.query.otptable.findFirst({
      where: eq(otptable.otp, DataValidation.data.otp),
    });

    const email = await field.then((res) => res?.email);

    const user = await getUserByEmail(email!);

    // Add session etc here

    await db.delete(otptable).where(eq(otptable.otp, DataValidation.data.otp));

    return {
      success: "OTP verified successfully. You are now logged in.",
    };
  } catch {
    return {
      error: "Something Went Wrong While Verifying The OTP!",
    };
  }
};
