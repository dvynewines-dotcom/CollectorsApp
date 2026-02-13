import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function ProfilePage({ params }: { params: { handle: string } }) {
  const user = await prisma.user.findUnique({
    where: { handle: params.handle },
    include: { rooms: true, ownedInstances: true, posts: true, followers: true, follows: true }
  });
  if (!user) return notFound();

  return (
    <section className="space-y-4">
      <div className="panel p-6">
        <h1 className="text-2xl font-semibold">@{user.handle}</h1>
        <p className="mt-2 text-slate-300">{user.bio}</p>
        <p className="mt-3 text-sm text-slate-400">{user.followers.length} followers · {user.follows.length} following · {user.ownedInstances.length} owned items</p>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {user.rooms.map((room) => <div key={room.id} className="panel p-4">{room.title}</div>)}
      </div>
    </section>
  );
}
