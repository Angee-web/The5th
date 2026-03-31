"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { HiOutlinePencil, HiOutlineTrash, HiOutlinePlus, HiOutlineEye, HiOutlineEyeSlash } from "react-icons/hi2";
import { IBlogPost } from "@/types";

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<IBlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    const res = await fetch("/api/blog");
    const data = await res.json();
    setPosts(data);
    setLoading(false);
  };

  useEffect(() => { fetchPosts(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this post?")) return;
    const res = await fetch(`/api/blog/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Post deleted");
      setPosts((prev) => prev.filter((p) => p._id !== id));
    } else {
      toast.error("Failed to delete");
    }
  };

  const togglePublish = async (post: IBlogPost) => {
    const res = await fetch(`/api/blog/${post._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !post.published }),
    });
    if (res.ok) {
      toast.success(post.published ? "Post unpublished" : "Post published");
      fetchPosts();
    }
  };

  return (
    <div className="p-6 md:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-2xl text-brand-black">Blog Posts</h1>
          <p className="text-sm text-brand-gray mt-1">{posts.length} posts total</p>
        </div>
        <Link href="/admin/blog/new" className="btn-primary flex items-center gap-2 text-sm">
          <HiOutlinePlus className="w-4 h-4" />
          New Post
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-20 text-brand-gray">Loading...</div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-brand-gray mb-4">No blog posts yet.</p>
          <Link href="/admin/blog/new" className="btn-primary inline-block">Write your first post</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <div key={post._id} className="bg-white border border-gray-100 rounded p-4 flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-medium text-sm truncate">{post.title}</h3>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${post.published ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                    {post.published ? "Published" : "Draft"}
                  </span>
                </div>
                <p className="text-xs text-brand-gray truncate">{post.excerpt}</p>
                <p className="text-xs text-brand-gray mt-1">{new Date(post.createdAt).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => togglePublish(post)}
                  title={post.published ? "Unpublish" : "Publish"}
                  className="p-2 text-brand-gray hover:text-brand-black transition-colors"
                >
                  {post.published ? <HiOutlineEyeSlash className="w-4 h-4" /> : <HiOutlineEye className="w-4 h-4" />}
                </button>
                <Link href={`/admin/blog/${post._id}/edit`} className="p-2 text-brand-gray hover:text-brand-black transition-colors">
                  <HiOutlinePencil className="w-4 h-4" />
                </Link>
                <button onClick={() => handleDelete(post._id)} className="p-2 text-brand-gray hover:text-red-500 transition-colors">
                  <HiOutlineTrash className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
