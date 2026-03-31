"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { IBlogPost } from "@/types";

export default function BlogClient() {
  const [posts, setPosts] = useState<IBlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/blog")
      .then((r) => r.json())
      .then((d) => { setPosts(d || []); setLoading(false); });
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-14">
        <p className="section-subtitle">Style & Stories</p>
        <h1 className="section-title">The Journal</h1>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-video bg-brand-gray-light mb-4" />
              <div className="h-4 bg-brand-gray-light rounded w-3/4 mb-2" />
              <div className="h-3 bg-brand-gray-light rounded w-full mb-1" />
              <div className="h-3 bg-brand-gray-light rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-16">
          <p className="font-serif text-2xl text-brand-gray-dark">Coming soon</p>
          <p className="text-brand-gray mt-2">Our style stories are on the way.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((post) => (
            <Link key={post._id} href={`/blog/${post.slug}`} className="group">
              <div className="aspect-video bg-brand-cream overflow-hidden mb-4 relative">
                {post.coverImage && (
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                )}
              </div>
              <div className="flex gap-2 mb-2">
                {post.tags.slice(0, 2).map((tag) => (
                  <span key={tag} className="text-xs text-brand-gold tracking-wider uppercase">{tag}</span>
                ))}
              </div>
              <h2 className="font-serif text-xl group-hover:text-brand-gold transition-colors mb-2">{post.title}</h2>
              <p className="text-sm text-brand-gray line-clamp-2">{post.excerpt}</p>
              <p className="text-xs text-brand-gray mt-3">
                {new Date(post.createdAt).toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" })}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
