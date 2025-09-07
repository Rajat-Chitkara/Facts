"use client"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Calendar, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Footer } from "@/components/footer"
import type { BlogPost as BlogPostType } from "@/lib/types"
import { FaReddit, FaTwitter, FaFacebook, FaLink } from "react-icons/fa"

interface BlogPostProps {
  post: BlogPostType
}

export default function BlogPost({ post }: BlogPostProps) {

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // Function to estimate reading time
  const calculateReadingTime = (content: string) => {
    const wordsPerMinute = 200
    const wordCount = content.split(/\s+/).length
    const readingTime = Math.ceil(wordCount / wordsPerMinute)
    return readingTime
  }

  const shareFact = (platform?: string) => {
    const articleText = `${post.title} - UselessButInteresting`
    const url = window.location.href

    let shareUrl = ""

    switch (platform) {
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(articleText)}&url=${encodeURIComponent(url)}`
        break
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(articleText)}`
        break
      case "reddit":
        shareUrl = `https://www.reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(articleText)}`
        break
      case "copy":
        navigator.clipboard.writeText(articleText + " " + url)
        // You might want to add a toast notification here
        alert("Link copied to clipboard!")
        return
      default:
        if (navigator.share) {
          navigator
            .share({
              title: post.title,
              text: post.excerpt,
              url: url,
            })
            .catch((err) => {
              console.error("Error sharing:", err)
            })
          return
        } else {
          navigator.clipboard.writeText(articleText + " " + url)
          alert("Link copied to clipboard!")
          return
        }
    }

    if (shareUrl) {
      window.open(shareUrl, "_blank", "noopener,noreferrer")
    }
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
            <Link href="/blog">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Link>
          </Button>
        </div>
      </header>

      <main className="flex-grow max-w-4xl mx-auto">
        <article className="bg-card rounded-lg shadow-sm overflow-hidden">
          {post.coverImage && (
            <div className="relative w-full h-64 md:h-96">
              <Image src={post.coverImage || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
            </div>
          )}

          <div className="p-6 md:p-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>

            <div className="flex flex-wrap items-center text-sm text-muted-foreground mb-6 gap-4">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {formatDate(post.createdAt)}
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {calculateReadingTime(post.content)} min read
              </div>
            </div>

            <div
              className="prose dark:prose-invert max-w-none mb-8"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            <div className="border-t pt-6">
              <div className="mb-4">
                <p className="text-sm text-muted-foreground mb-2">Share this article:</p>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1"
                    onClick={() => shareFact("twitter")}
                  >
                    <FaTwitter className="h-4 w-4 text-[#1DA1F2]" />
                    <span className="sr-only md:not-sr-only md:text-xs">Twitter</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1"
                    onClick={() => shareFact("facebook")}
                  >
                    <FaFacebook className="h-4 w-4 text-[#4267B2]" />
                    <span className="sr-only md:not-sr-only md:text-xs">Facebook</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1"
                    onClick={() => shareFact("reddit")}
                  >
                    <FaReddit className="h-4 w-4 text-[#FF4500]" />
                    <span className="sr-only md:not-sr-only md:text-xs">Reddit</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1"
                    onClick={() => shareFact("copy")}
                  >
                    <FaLink className="h-4 w-4" />
                    <span className="sr-only md:not-sr-only md:text-xs">Copy Link</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  )
}
