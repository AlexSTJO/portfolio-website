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
    <main className="relative min-h-screen bg-slate-950 text-slate-100 overflow-hidden">
      {/* Animated background */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-sky-500/20 blur-3xl animate-pulse" />
        <div className="absolute -right-32 -bottom-32 h-[500px] w-[500px] rounded-full bg-purple-500/20 blur-3xl animate-pulse" />
        <div className="absolute right-1/4 top-1/3 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl animate-pulse" />
      </div>

      <div className="mx-auto max-w-3xl px-4 py-16 md:px-6">
        {/* Header */}
        <div
          className={`transition-all duration-700 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-sky-300 transition-colors mb-8 group"
          >
            <span className="group-hover:-translate-x-1 transition-transform">←</span>
            Back to home
          </Link>

          <div className="mb-12 relative">
            <div className="absolute -left-4 top-0 bottom-0 w-1 rounded-full bg-gradient-to-b from-sky-500 via-purple-500 to-transparent" />

            <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1.5 text-xs font-medium text-purple-300 mb-5 shadow-lg shadow-purple-500/10">
              <span className="h-1.5 w-1.5 rounded-full bg-purple-400 animate-pulse" />
              Thoughts & writings
            </div>

            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl text-slate-100">
              Blog
            </h1>

            <p className="mt-4 text-lg text-slate-400 max-w-xl leading-relaxed">
              Writing about cloud engineering, automation, infrastructure, and the tools I build along the way.
            </p>
          </div>
        </div>

        {/* Posts */}
        <div className="space-y-5">
          {posts.length === 0 ? (
            <div
              className={`rounded-2xl border border-slate-800 bg-slate-900/50 p-8 text-center transition-all duration-700 delay-200 ${
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              <p className="text-slate-500">No posts yet. Check back soon.</p>
            </div>
          ) : (
            posts.map((post, i) => (
              <article
                key={post.slug}
                className={`group relative transition-all duration-700 ${
                  mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
                style={{ transitionDelay: `${200 + i * 100}ms` }}
              >
                <Link href={`/blog/${post.slug}`}>
                  <div className="relative rounded-2xl border border-slate-700/50 bg-slate-900/80 p-6 shadow-lg backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-sky-500/50 hover:shadow-sky-500/10">
                    {/* Glow effect on hover */}
                    <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-sky-500/0 via-sky-500/0 to-purple-500/0 opacity-0 group-hover:opacity-100 group-hover:from-sky-500/10 group-hover:via-purple-500/10 group-hover:to-sky-500/10 transition-opacity blur-xl" />

                    <div className="relative">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-800/80 px-2.5 py-1 text-[10px] font-medium text-slate-400">
                          <span className="h-1 w-1 rounded-full bg-sky-400" />
                          {post.date}
                        </span>
                      </div>

                      <h2 className="text-xl font-semibold text-slate-100 group-hover:text-sky-300 transition-colors">
                        {post.title}
                      </h2>

                      <p className="mt-3 text-sm text-slate-400 leading-relaxed">
                        {post.description}
                      </p>

                      <div className="mt-4 flex items-center gap-2 text-xs font-medium text-sky-400 group-hover:text-sky-300 transition-colors">
                        Read post
                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                      </div>
                    </div>
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
