"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Post = {
  title: string;
  date: string;
  contentHtml: string;
};

export default function BlogPostClient({ post }: { post: Post }) {
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
        <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-emerald-500/10 blur-3xl animate-pulse" />
      </div>

      <div className="mx-auto max-w-3xl px-4 py-16 md:px-6">
        {/* Back link */}
        <div
          className={`transition-all duration-700 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-sky-300 transition-colors mb-10 group"
          >
            <span className="group-hover:-translate-x-1 transition-transform">←</span>
            Back to blog
          </Link>
        </div>

        <article>
          {/* Header */}
          <header
            className={`mb-10 relative transition-all duration-700 delay-100 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <div className="absolute -left-4 top-0 bottom-0 w-1 rounded-full bg-gradient-to-b from-sky-500 via-purple-500 to-transparent" />

            <div className="inline-flex items-center gap-2 rounded-full bg-slate-800/80 px-3 py-1.5 text-xs font-medium text-slate-400 mb-5">
              <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
              {post.date}
            </div>

            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl text-slate-100 leading-tight">
              {post.title}
            </h1>
          </header>

          {/* Content */}
          <div
            className={`transition-all duration-700 delay-200 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <div className="rounded-3xl border border-slate-700/50 bg-slate-900/50 p-8 md:p-10 backdrop-blur-xl shadow-xl">
              <div
                className="prose prose-invert max-w-none
                  prose-headings:text-white prose-headings:font-semibold
                  prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-4
                  prose-p:text-slate-300
                  prose-a:text-sky-400 hover:prose-a:text-sky-300
                  prose-strong:text-white prose-strong:font-bold
                  prose-em:text-slate-200 prose-em:italic
                  prose-code:text-sky-300 prose-code:bg-slate-800 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none
                  prose-pre:bg-slate-900 prose-pre:border prose-pre:border-slate-800
                  prose-li:text-slate-300
                  prose-ul:text-slate-300
                  prose-ol:text-slate-300"
                dangerouslySetInnerHTML={{ __html: post.contentHtml }}
              />
            </div>
          </div>

        </article>
      </div>
    </main>
  );
}
