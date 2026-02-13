"use client";

import { motion } from "framer-motion";
import Link from "next/link";

type UniverseNode = {
  id: string;
  name: string;
  type: string;
  children?: UniverseNode[];
};

export function UniverseTree({ roots }: { roots: UniverseNode[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {roots.map((root) => (
        <motion.div key={root.id} whileHover={{ y: -2 }} className="panel p-4 shadow-glow">
          <Link href={`/universe/${root.id}`} className="text-lg font-medium text-white">
            {root.name}
          </Link>
          <p className="mb-2 text-xs uppercase tracking-widest text-slate-400">{root.type}</p>
          <div className="space-y-2 text-sm text-slate-300">
            {root.children?.map((child) => (
              <div key={child.id} className="rounded-lg border border-slate-800/80 p-2">
                <Link href={`/universe/${child.id}`} className="text-slate-100">
                  {child.name}
                </Link>
                <div className="mt-1 flex flex-wrap gap-2 text-xs text-slate-400">
                  {child.children?.map((sub) => (
                    <Link key={sub.id} href={`/universe/${sub.id}`} className="rounded bg-slate-900 px-2 py-0.5">
                      {sub.name}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
