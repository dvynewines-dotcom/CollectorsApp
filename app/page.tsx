import Link from "next/link";
import { getHomeFeed } from "@/lib/data";

export default async function HomePage() {
  const feed = await getHomeFeed();

  return (
    <section className="space-y-6">
      <div className="panel p-6">
        <h1 className="text-3xl font-semibold">VaultVerse</h1>
        <p className="mt-2 max-w-2xl text-slate-300">A premium social vault for cards, watches, and designer toys. Discover universes, track grails, and showcase rooms.</p>
        <div className="mt-4 flex gap-3 text-sm">
          <Link href="/explore" className="rounded-lg bg-white px-4 py-2 font-medium text-black">Explore Universes</Link>
          <Link href="/radar" className="rounded-lg border border-slate-700 px-4 py-2">Open Radar</Link>
        </div>
      </div>
      <div className="space-y-3">
        <h2 className="text-xl font-medium">Live Feed</h2>
        {feed.map((post) => (
          <article key={post.id} className="panel p-4">
            <p className="text-sm text-slate-400">@{post.user.handle}</p>
            <p className="mt-1">{post.text}</p>
            <p className="mt-2 text-xs text-slate-500">{post.likes.length} likes · {post.comments.length} comments</p>
          </article>
        ))}
      </div>
    </section>
  );
}
