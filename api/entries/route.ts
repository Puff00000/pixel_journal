import { requireUser } from "@/server/modules/auth/service";
import { newEntrySchema } from "@/shared/validation";
import { listEntries, createEntry } from "@/server/modules/entries/service";
import { ok, handleError } from "@/server/http/respond";

export async function GET(request: Request) {
  try {
    const user = await requireUser();
    const limit = Math.min(Number(new URL(request.url).searchParams.get("limit") ?? 50) || 50, 100);
    const rows = await listEntries(user.id, limit);
    return ok({ entries: rows });
  } catch (err) {
    return handleError(err);
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    const { body, kind } = newEntrySchema.parse(await request.json());
    const entry = await createEntry({ userId: user.id, body, kind });
    return ok({ entry }, 201);
  } catch (err) {
    return handleError(err);
  }
}
