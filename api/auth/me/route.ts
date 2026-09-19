import { getCurrentUser } from "@/server/modules/auth/service";
import { ok, handleError } from "@/server/http/respond";

export async function GET() {
  try {
    const user = await getCurrentUser();
    return ok({ user: user ? { id: user.id, email: user.email } : null });
  } catch (err) {
    return handleError(err);
  }
}
