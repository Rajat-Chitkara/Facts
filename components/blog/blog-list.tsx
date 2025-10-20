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
    <div className="container mx-auto px-4 py-4 sm:py-6 md:py-8 min-h-screen flex flex-col">
      <header className="flex flex-col items-center mb-4 sm:mb-6 md:mb-8">
        <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/DALL%C2%B7E%202025-03-06%2019.47.43%20-%20A%20stylized%2C%20vintage-style%20illustration%20of%20a%20curious-looking%20owl%20wearing%20a%20suit%20and%20top%20hat.%20The%20owl%20has%20an%20inquisitive%20expression%2C%20with%20detailed%20feath-WC9mpSAFHvRuDjm2otwr0Em5LWH473.webp"
            alt="UselessButInteresting Logo"
            width={48}
            height={48}
            className="rounded-full w-10 h-10 sm:w-12 sm:h-12"
          />
          <div className="text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">Blog</h1>
            <p className="text-xs sm:text-sm md:text-base text-muted-foreground">Interesting stories and articles</p>
          </div>
        </div>
        <div className="w-full sm:w-auto">
          <Button variant="outline" asChild className="w-full sm:w-auto">
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </Button>
        </div>
      </header>

      <main className="flex-grow">
        <div className="mb-4 sm:mb-6 md:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold">Latest Posts</h2>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <span className="ml-2 text-sm sm:text-base">Loading posts...</span>
          </div>
        ) : posts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {posts.map((post) => (
              <Card key={post.id} className="flex flex-col h-full">
                {post.coverImage && (
                  <div className="relative w-full h-40 sm:h-48 overflow-hidden">
                    <Image src={post.coverImage || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="line-clamp-2 text-base sm:text-lg">{post.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm sm:text-base text-muted-foreground line-clamp-3">{post.excerpt}</p>
                </CardContent>
                <CardFooter className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-t pt-3 sm:pt-4 gap-2">
                  <div className="flex items-center text-xs sm:text-sm text-muted-foreground">
                    <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    {formatDate(post.createdAt)}
                  </div>
                  <Button asChild size="sm" className="w-full sm:w-auto">
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
