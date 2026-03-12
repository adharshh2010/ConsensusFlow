"use server";

import { cookies } from "next/headers";
import { send2FAOTP } from "@workspace/consensusflow/utils/email/send2FAOTP";

export const resendOTP = async () => {
  // Todo: Add rate limiter by your own!
  // console.log(data);
  try {
    const email = (await cookies()).get("email")?.value;

    if (!email) {
      return {
        error: "Something Went Wrong While Trying Handling resending OTP!",
        status: 500,
      };
    }

    await send2FAOTP(email);

    return {
      success: "Verification code resent!",
      description: "Check your email for the OTP.",
      status: 200,
    };
  } catch {
    return {
      error: "Something Went Wrong While Trying Handling resending OTP!",
      status: 500,
    };
  }
};
