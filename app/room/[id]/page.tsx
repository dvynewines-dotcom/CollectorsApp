import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function RoomPage({ params }: { params: { id: string } }) {
  const room = await prisma.room.findUnique({ where: { id: params.id }, include: { user: true, roomItems: { include: { ownedInstance: { include: { item: true } } }, orderBy: { position: "asc" } }, likes: true, comments: true } });
  if (!room) return notFound();

  return (
    <section className="space-y-4">
      <div className="panel p-6"><h1 className="text-2xl font-semibold">{room.title}</h1><p className="text-slate-300">by @{room.user.handle} · {room.layoutType}</p></div>
      <div className="grid gap-3 md:grid-cols-2">{room.roomItems.map((entry) => <div key={entry.ownedInstanceId} className="panel p-3">{entry.ownedInstance.item.title}</div>)}</div>
    </section>
  );
}
