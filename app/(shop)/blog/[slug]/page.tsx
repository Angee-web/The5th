"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { IBlogPost } from "@/types";

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const [post, setPost] = useState<IBlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/blog/${params.slug}`)
      .then((r) => r.json())
      .then((d) => { setPost(d); setLoading(false); });
  }, [params.slug]);

  if (loading) return (
    <div className="max-w-2xl mx-auto px-4 py-12 animate-pulse">
      <div className="aspect-video bg-brand-gray-light mb-8" />
      <div className="h-8 bg-brand-gray-light rounded w-3/4 mb-4" />
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => <div key={i} className="h-4 bg-brand-gray-light rounded" />)}
      </div>
    </div>
  );

  if (!post) return (
    <div className="text-center py-24">
      <h2 className="font-serif text-2xl mb-4">Post not found</h2>
      <Link href="/blog" className="btn-primary inline-block">Back to Blog</Link>
    </div>
  );

  return (
    <article className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <Link href="/blog" className="text-sm text-brand-gray hover:text-brand-black mb-8 block">← Back to Journal</Link>

      <div className="flex gap-2 mb-4">
        {post.tags.map((tag) => (
          <span key={tag} className="text-xs text-brand-gold tracking-wider uppercase">{tag}</span>
        ))}
      </div>

      <h1 className="font-serif text-3xl md:text-4xl mb-4">{post.title}</h1>
      <p className="text-sm text-brand-gray mb-6">
        By {post.author} · {new Date(post.createdAt).toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" })}
      </p>

      {post.coverImage && (
        <div className="relative aspect-video bg-brand-cream overflow-hidden mb-8">
          <Image src={post.coverImage} alt={post.title} fill className="object-cover" sizes="(max-width: 640px) 100vw, 640px" />
        </div>
      )}

      <div className="prose prose-sm max-w-none text-brand-gray-dark leading-relaxed">
        {post.content.split("\n").map((para, i) => (
          para.trim() ? <p key={i} className="mb-4">{para}</p> : null
        ))}
      </div>
    </article>
  );
}
