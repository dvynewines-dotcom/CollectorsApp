import { prisma } from "@/lib/prisma";

export default async function AdminPage() {
  const pending = await prisma.drop.findMany({ where: { status: "PENDING" }, include: { universe: true, submitter: true } });

  return (
    <section className="space-y-3">
      <h1 className="text-2xl font-semibold">Admin · Drop Queue</h1>
      {pending.map((drop) => (
        <div key={drop.id} className="panel p-4">
          <p className="text-sm text-slate-400">{drop.universe.name} · submitted by @{drop.submitter.handle}</p>
          <p>{drop.title}</p>
        </div>
      ))}
    </section>
  );
}
