import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function UniversePage({ params }: { params: { id: string } }) {
  const universe = await prisma.universe.findUnique({
    where: { id: params.id },
    include: {
      children: true,
      items: { include: { item: true } },
      followers: true,
      drops: { orderBy: { date: "asc" }, take: 6 },
      posts: { include: { post: { include: { user: true } } }, take: 6 }
    }
  });
  if (!universe) return notFound();

  return (
    <section className="space-y-5">
      <div className="panel p-6">
        <h1 className="text-3xl font-semibold">{universe.name}</h1>
        <p className="text-slate-400">{universe.type} · {universe.followers.length} followers</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="panel p-4"><h2 className="font-medium">Catalog</h2>{universe.items.slice(0, 8).map((it) => <p key={it.itemId} className="text-sm text-slate-300">{it.item.title}</p>)}</div>
        <div className="panel p-4"><h2 className="font-medium">Drops</h2>{universe.drops.map((drop) => <p key={drop.id} className="text-sm text-slate-300">{drop.title}</p>)}</div>
      </div>
    </section>
  );
}
