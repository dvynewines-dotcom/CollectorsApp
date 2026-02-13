import { prisma } from "@/lib/prisma";

export default async function VaultPage() {
  const demoUser = await prisma.user.findFirst({ include: { ownedInstances: { include: { item: true } }, wantlist: { include: { item: true } } } });
  if (!demoUser) return null;

  return (
    <section className="grid gap-4 md:grid-cols-2">
      <div className="panel p-4"><h2 className="mb-3 text-lg font-medium">Owned Items</h2>{demoUser.ownedInstances.map((entry) => <p key={entry.id} className="text-sm text-slate-300">{entry.item.title} · {entry.condition}</p>)}</div>
      <div className="panel p-4"><h2 className="mb-3 text-lg font-medium">Wantlist</h2>{demoUser.wantlist.map((entry) => <p key={entry.id} className="text-sm text-slate-300">{entry.item.title}</p>)}</div>
    </section>
  );
}
