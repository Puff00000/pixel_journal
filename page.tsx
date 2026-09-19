import { redirect } from "next/navigation";
import { getCurrentUser } from "@/server/modules/auth/service";
import { getStats } from "@/server/modules/entries/service";
import AppShell from "./AppShell";

/**
 * Server component: resolves the user and their counts before the first
 * paint, so the garden never flashes empty while a fetch resolves.
 */
export default async function Home() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { plantCount, stampCount } = await getStats(user.id);

  return (
    <AppShell email={user.email} initialPlantCount={plantCount} initialStampCount={stampCount} />
  );
}
