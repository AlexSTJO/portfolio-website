import { getAllPosts } from "@/lib/posts";
import BlogListClient from "./client";

export default function BlogPage() {
  const posts = getAllPosts();
  return <BlogListClient posts={posts} />;
}
