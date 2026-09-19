import { requireUser } from "@/server/modules/auth/service";
import { getEntry, deleteEntry } from "@/server/modules/entries/service";
import { ok, fail, handleError } from "@/server/http/respond";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  try {
    const user = await requireUser();
    const { id } = await params;
    const entry = await getEntry(user.id, id);
    if (!entry) return fail("Entry not found.", 404);
    return ok({ entry });
  } catch (err) {
    return handleError(err);
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  try {
    const user = await requireUser();
    const { id } = await params;
    const removed = await deleteEntry(user.id, id);
    if (!removed) return fail("Entry not found.", 404);
    return ok({ ok: true });
  } catch (err) {
    return handleError(err);
  }
}
