import BlogForm from "../BlogForm";

export default function NewBlogPage() {
  return (
    <div className="p-6 md:p-8">
      <h1 className="font-serif text-2xl text-brand-black mb-8">New Blog Post</h1>
      <BlogForm />
    </div>
  );
}
