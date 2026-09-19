import { clearSessionCookie } from "@/server/modules/auth/session";
import { ok, handleError } from "@/server/http/respond";

export async function POST() {
  try {
    await clearSessionCookie();
    return ok({ ok: true });
  } catch (err) {
    return handleError(err);
  }
}
