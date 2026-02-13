import { prisma } from "@/lib/prisma";

export default async function RadarPage() {
  const drops = await prisma.drop.findMany({ include: { universe: true }, orderBy: { date: "asc" }, take: 20 });

  return (
    <section className="space-y-3">
      <h1 className="text-2xl font-semibold">Radar</h1>
      {drops.map((drop) => (
        <article key={drop.id} className="panel p-4">
          <p className="text-sm text-slate-400">{drop.universe.name}</p>
          <h2 className="font-medium">{drop.title}</h2>
          <p className="text-xs uppercase text-slate-500">{drop.status}</p>
        </article>
      ))}
    </section>
  );
}
