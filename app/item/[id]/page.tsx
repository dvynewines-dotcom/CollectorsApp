import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function ItemPage({ params }: { params: { id: string } }) {
  const item = await prisma.item.findUnique({
    where: { id: params.id },
    include: {
      universes: { include: { universe: true } },
      ownedInstances: { include: { user: true, rooms: { include: { room: true } } } },
      postAttachments: { include: { post: { include: { user: true } } } }
    }
  });
  if (!item) return notFound();

  return <section className="panel p-6"><h1 className="text-2xl font-semibold">{item.title}</h1><p className="text-slate-300">{item.description}</p><p className="mt-2 text-sm">${item.estimatedValueLow} - ${item.estimatedValueHigh}</p></section>;
}
