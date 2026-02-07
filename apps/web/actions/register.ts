"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";

import { RegisterSchema } from "@/schema/auth";

import { db, getUserByEmail, usersTable } from "@workspace/consensusflow";

export const register = async (data: z.infer<typeof RegisterSchema>) => {
  // Todo: Add rate limiter by your own!
  // console.log(data);

  const { email, password } = data;

  const ExistingUser = await getUserByEmail(email);

  if (ExistingUser) {
    return {
      error: "User with this email already exists!",
      status: 409,
    };
  }

  const Hashpassword = await bcrypt.hash(password, 12);

  try {
    await db.insert(usersTable).values({
      name: email.split("@")[0],
      email: data.email,
      password: Hashpassword,
    });

    return {
      success: "Welcome to ConsensusFlow!",
      description: "Continue With Our On-boarding flow.",
      status: 200,
    };
  } catch {
    return {
      error: "Something Went Wrong While Trying to Register Your Account!",
      status: 500,
    };
  }
};
