import { authenticate } from "@/server/modules/auth/service";
import { signSession, setSessionCookie } from "@/server/modules/auth/session";
import { credentialsSchema } from "@/shared/validation";
import { ok, fail, handleError } from "@/server/http/respond";

export async function POST(request: Request) {
  try {
    const { email, password } = credentialsSchema.parse(await request.json());
    const user = await authenticate(email, password);

    // Deliberately vague: don't reveal whether the email exists.
    if (!user) return fail("Email or password is incorrect.", 401);

    await setSessionCookie(await signSession({ userId: user.id }));
    return ok({ user: { id: user.id, email: user.email } });
  } catch (err) {
    return handleError(err);
  }
}
