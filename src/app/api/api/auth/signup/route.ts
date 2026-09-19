import { eq } from "drizzle-orm";
import { db } from "@/server/db/client";
import { users } from "@/server/db/schema";
import { hashPassword } from "@/server/modules/auth/service";
import { signSession, setSessionCookie } from "@/server/modules/auth/session";
import { credentialsSchema } from "@/shared/validation";
import { ok, fail, handleError } from "@/server/http/respond";

export async function POST(request: Request) {
  try {
    const { email, password } = credentialsSchema.parse(await request.json());

    const [existing] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existing) return fail("That email is already registered.", 409);

    const [user] = await db
      .insert(users)
      .values({ email, passwordHash: await hashPassword(password) })
      .returning({ id: users.id, email: users.email });

    await setSessionCookie(await signSession({ userId: user.id }));
    return ok({ user }, 201);
  } catch (err) {
    return handleError(err);
  }
}
