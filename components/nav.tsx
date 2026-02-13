import Link from "next/link";

const links = [
  ["Explore", "/explore"],
  ["Vault", "/vault"],
  ["Radar", "/radar"],
  ["New Room", "/rooms/new"]
];

export function Nav() {
  return (
    <nav className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
      <Link href="/" className="text-xl font-semibold tracking-wide text-white">VaultVerse</Link>
      <div className="flex gap-4 text-sm text-slate-300">
        {links.map(([label, href]) => (
          <Link key={href} href={href} className="transition hover:text-white">
            {label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
