import { requireUser } from "@/server/modules/auth/service";
import { getStats } from "@/server/modules/entries/service";
import { ok, handleError } from "@/server/http/respond";

export async function GET() {
  try {
    const user = await requireUser();
    return ok(await getStats(user.id));
  } catch (err) {
    return handleError(err);
  }
}
