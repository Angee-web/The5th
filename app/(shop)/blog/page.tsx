import type { Metadata } from "next";
import BlogClient from "./BlogClient";

export const metadata: Metadata = {
  title: "Style Tips & Blog | 5thJohnson",
  description: "Fashion tips, style guides, and stories from 5thJohnson.",
};

export default function BlogPage() {
  return <BlogClient />;
}
