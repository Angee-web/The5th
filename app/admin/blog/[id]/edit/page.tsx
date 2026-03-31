import BlogForm from "../../BlogForm";
import connectDB from "@/lib/db";
import Blog from "@/models/Blog";
import { notFound } from "next/navigation";

export default async function EditBlogPage({ params }: { params: { id: string } }) {
  await connectDB();
  const post = await Blog.findById(params.id).lean() as Record<string, unknown> | null;
  if (!post) notFound();

  // Serialize for client
  const serialized = JSON.parse(JSON.stringify(post));

  return (
    <div className="p-6 md:p-8">
      <h1 className="font-serif text-2xl text-brand-black mb-8">Edit Blog Post</h1>
      <BlogForm post={serialized} isEdit />
    </div>
  );
}
