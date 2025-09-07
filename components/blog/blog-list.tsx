"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Footer } from "@/components/footer"
import { getPublishedBlogPosts, getPublishedBlogPostsSync } from "@/lib/data"
import type { BlogPost } from "@/lib/types"

export default function BlogList() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadPosts = async () => {
      setIsLoading(true)
      try {
        const blogPosts = await getPublishedBlogPosts()
        console.log(
          "Loaded blog posts:",
          blogPosts.map((p) => ({ slug: p.slug, title: p.title })),
        )
        setPosts(blogPosts)
      } catch (error) {
        console.error("Error loading blog posts:", error)
        // Fallback to sync version
        const syncPosts = getPublishedBlogPostsSync()
        setPosts(syncPosts)
      } finally {
        setIsLoading(false)
      }
    }

    loadPosts()
  }, [])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen flex flex-col">
      <header className="flex flex-col md:flex-row justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/DALL%C2%B7E%202025-03-06%2019.47.43%20-%20A%20stylized%2C%20vintage-style%20illustration%20of%20a%20curious-looking%20owl%20wearing%20a%20suit%20and%20top%20hat.%20The%20owl%20has%20an%20inquisitive%20expression%2C%20with%20detailed%20feath-WC9mpSAFHvRuDjm2otwr0Em5LWH473.webp"
            alt="UselessButInteresting Logo"
            width={48}
            height={48}
            className="rounded-full"
          />
          <div>
            <h1 className="text-4xl font-bold text-foreground">Blog</h1>
            <p className="text-muted-foreground">Interesting stories and articles</p>
          </div>
        </div>
        <div className="flex items-center mt-4 md:mt-0 gap-4">
          <Button variant="outline" asChild>
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </Button>
        </div>
      </header>

      <main className="flex-grow">
        <div className="mb-8">
          <h2 className="text-2xl font-bold">Latest Posts</h2>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <span className="ml-2">Loading posts...</span>
          </div>
        ) : posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Card key={post.id} className="flex flex-col h-full">
                {post.coverImage && (
                  <div className="relative w-full h-48 overflow-hidden">
                    <Image src={post.coverImage || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-muted-foreground line-clamp-3">{post.excerpt}</p>
                </CardContent>
                <CardFooter className="flex justify-between items-center border-t pt-4">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-1" />
                    {formatDate(post.createdAt)}
                  </div>
                  <Button asChild>
                    <Link href={`/blog/${post.slug}`}>Read More</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl font-medium mb-2">No blog posts yet</p>
            <p className="text-muted-foreground">Check back soon for new content!</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
