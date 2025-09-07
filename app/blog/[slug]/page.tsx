import type { Metadata } from "next"
import { notFound } from "next/navigation"
import BlogPost from "@/components/blog/blog-post"
import { getBlogPostBySlug, getBlogPostBySlugSync, getStoredBlogPosts, getStoredBlogPostsSync } from "@/lib/data"

interface BlogPostPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = getBlogPostBySlugSync(slug)

  if (!post) {
    return {
      title: "Blog Post Not Found | UselessButInteresting",
      description: "The requested blog post could not be found.",
    }
  }

  return {
    title: `${post.title} | UselessButInteresting Blog`,
    description: post.excerpt,
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params

  // Debug: Log the slug and available posts
  console.log("Looking for slug:", slug)

  // Get all posts for debugging
  const allPosts = await getStoredBlogPosts()
  console.log(
    "Available posts:",
    allPosts.map((p) => ({ id: p.id, slug: p.slug, published: p.published })),
  )

  const post = await getBlogPostBySlug(slug)
  console.log("Found post:", post ? { id: post.id, slug: post.slug, published: post.published } : "Not found")

  if (!post || !post.published) {
    console.log("Post not found or not published, showing 404")
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <BlogPost post={post} />
    </div>
  )
}
