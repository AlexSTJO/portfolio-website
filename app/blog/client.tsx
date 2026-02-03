"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type PostMeta = {
  slug: string;
  title: string;
  date: string;
  description: string;
};

export default function BlogListClient({ posts }: { posts: PostMeta[] }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <main className="relative min-h-screen bg-slate-950 text-slate-100">
      {/* Subtle dot grid background */}
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_1px_1px,_rgb(51_65_85_/_0.3)_1px,_transparent_0)] bg-[size:24px_24px]" />

      <div className="mx-auto max-w-3xl px-4 py-12 md:px-6">
        {/* Header */}
        <div
          className={`transition-opacity duration-500 ${
            mounted ? "opacity-100" : "opacity-0"
          }`}
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-mono text-sm text-slate-500 hover:text-sky-400 transition-colors mb-8"
          >
            ← back
          </Link>

          <div className="mb-10">
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl text-slate-100">
              Blog
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Writing about cloud engineering, automation, and infrastructure.
            </p>
          </div>
        </div>

        {/* Posts */}
        <div className="space-y-3">
          {posts.length === 0 ? (
            <div
              className={`rounded-sm border border-slate-800 bg-slate-900/50 p-6 text-center transition-opacity duration-500 delay-200 ${
                mounted ? "opacity-100" : "opacity-0"
              }`}
            >
              <p className="text-slate-500">No posts yet.</p>
            </div>
          ) : (
            posts.map((post, i) => (
              <article
                key={post.slug}
                className={`group transition-opacity duration-500 ${
                  mounted ? "opacity-100" : "opacity-0"
                }`}
                style={{ transitionDelay: `${100 + i * 50}ms` }}
              >
                <Link href={`/blog/${post.slug}`}>
                  <div className="rounded-sm border border-slate-800 bg-slate-900/50 p-4 transition hover:border-slate-600">
                    <div className="flex items-baseline justify-between gap-4">
                      <h2 className="font-semibold text-slate-100 group-hover:text-sky-400 transition-colors">
                        {post.title}
                      </h2>
                      <span className="font-mono text-xs text-slate-500 shrink-0">
                        {post.date}
                      </span>
                    </div>

                    <p className="mt-2 text-sm text-slate-400">
                      {post.description}
                    </p>
                  </div>
                </Link>
              </article>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
