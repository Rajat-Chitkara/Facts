import type { Metadata } from "next"
import BlogList from "@/components/blog/blog-list"

export const metadata: Metadata = {
  title: "Blog | UselessButInteresting",
  description: "Read our latest blog posts about fascinating facts and stories.",
}

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-background">
      <BlogList />
    </div>
  )
}
