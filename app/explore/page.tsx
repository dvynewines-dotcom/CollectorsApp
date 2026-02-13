import { UniverseTree } from "@/components/universe-tree";
import { getExploreUniverses } from "@/lib/data";

export default async function ExplorePage() {
  const universes = await getExploreUniverses();

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">Explore Universes</h1>
      <p className="text-slate-300">Drill down from categories into IPs and sets.</p>
      <UniverseTree roots={universes} />
    </section>
  );
}
