import { eq } from "drizzle-orm";

import { db } from "@workspace/consensusflow";
import { usersTable } from "@workspace/consensusflow/db/schema";

export const getUserByEmail = async (email: string) => {
  try {
    const user = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .limit(1);

    return user[0];
  } catch {
    return null;
  }
};

export const getUserById = async (uuid: string) => {
  try {
    const user = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.uuid, uuid))
      .limit(1);

    return user[0];
  } catch {
    return null;
  }
};
