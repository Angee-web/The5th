"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";
import { HiCloudArrowUp, HiXMark } from "react-icons/hi2";
import { IBlogPost } from "@/types";

interface Props {
  post?: Partial<IBlogPost>;
  isEdit?: boolean;
}

export default function BlogForm({ post, isEdit }: Props) {
  const router = useRouter();
  const [form, setForm] = useState({
    title: post?.title || "",
    excerpt: post?.excerpt || "",
    content: post?.content || "",
    author: post?.author || "5thJohnson",
    tags: post?.tags?.join(", ") || "",
    published: post?.published || false,
  });
  const [coverImage, setCoverImage] = useState(post?.coverImage || "");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const data = await res.json();
    if (res.ok) setCoverImage(data.url);
    else toast.error("Image upload failed");
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!coverImage) { toast.error("Add a cover image"); return; }
    setSaving(true);

    const body = {
      ...form,
      coverImage,
      tags: form.tags ? form.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
    };

    const url = isEdit ? `/api/blog/${post?._id}` : "/api/blog";
    const method = isEdit ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      toast.success(isEdit ? "Post updated!" : "Post created!");
      router.push("/admin/blog");
    } else {
      const data = await res.json();
      toast.error(data.error || "Failed to save post");
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
      {/* Cover Image */}
      <div>
        <label className="text-xs tracking-widest uppercase block mb-2">Cover Image *</label>
        {coverImage ? (
          <div className="relative w-full h-48 mb-2">
            <Image src={coverImage} alt="Cover" fill className="object-cover rounded" sizes="100vw" />
            <button
              type="button"
              onClick={() => setCoverImage("")}
              className="absolute top-2 right-2 bg-black text-white w-6 h-6 rounded-full flex items-center justify-center"
            >
              <HiXMark className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <label className="w-full h-32 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:border-brand-gold transition-colors rounded">
            {uploading ? (
              <div className="w-5 h-5 border-2 border-brand-gold border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <HiCloudArrowUp className="w-7 h-7 text-gray-400" />
                <span className="text-xs text-gray-400 mt-2">Click to upload cover image</span>
              </>
            )}
            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          </label>
        )}
      </div>

      {/* Title */}
      <div>
        <label className="text-xs tracking-widest uppercase block mb-1">Title *</label>
        <input
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
          className="input-field"
          placeholder="e.g. 5 Ways to Style a Wrap Dress"
        />
      </div>

      {/* Excerpt */}
      <div>
        <label className="text-xs tracking-widest uppercase block mb-1">Excerpt *</label>
        <textarea
          value={form.excerpt}
          onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
          required
          rows={2}
          className="input-field resize-none"
          placeholder="A short summary shown in the blog list (1–2 sentences)"
        />
      </div>

      {/* Content */}
      <div>
        <label className="text-xs tracking-widest uppercase block mb-1">Content *</label>
        <textarea
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          required
          rows={16}
          className="input-field resize-y font-mono text-sm"
          placeholder="Write your blog post here. You can use line breaks to separate paragraphs."
        />
        <p className="text-xs text-brand-gray mt-1">Use blank lines to separate paragraphs.</p>
      </div>

      {/* Author & Tags */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs tracking-widest uppercase block mb-1">Author</label>
          <input
            value={form.author}
            onChange={(e) => setForm({ ...form, author: e.target.value })}
            className="input-field"
            placeholder="5thJohnson"
          />
        </div>
        <div>
          <label className="text-xs tracking-widest uppercase block mb-1">Tags (comma separated)</label>
          <input
            value={form.tags}
            onChange={(e) => setForm({ ...form, tags: e.target.value })}
            className="input-field"
            placeholder="style, fashion, tips"
          />
        </div>
      </div>

      {/* Published */}
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={form.published}
          onChange={(e) => setForm({ ...form, published: e.target.checked })}
          className="accent-brand-gold w-4 h-4"
        />
        <span className="text-sm">Publish immediately</span>
        <span className="text-xs text-brand-gray">(uncheck to save as draft)</span>
      </label>

      <div className="flex gap-3">
        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? "Saving..." : isEdit ? "Update Post" : "Create Post"}
        </button>
        <button type="button" onClick={() => router.push("/admin/blog")} className="btn-outline">
          Cancel
        </button>
      </div>
    </form>
  );
}
