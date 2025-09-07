"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Footer } from "@/components/footer"
import { getAboutUsContent } from "@/lib/data"
import type { AboutUsContent } from "@/lib/types"

export default function AboutUsPage() {
  const [content, setContent] = useState<AboutUsContent | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadContent = () => {
      setIsLoading(true)
      try {
        const aboutUsContent = getAboutUsContent()
        setContent(aboutUsContent)
      } catch (error) {
        console.error("Error loading about us content:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadContent()
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
            <h1 className="text-4xl font-bold text-foreground">UselessButInteresting</h1>
            <p className="text-muted-foreground">Learn more about us</p>
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
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <span className="ml-2">Loading content...</span>
          </div>
        ) : content ? (
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="text-3xl">{content.title}</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-lg dark:prose-invert max-w-none">
              <div dangerouslySetInnerHTML={{ __html: content.content }} />
              <p className="text-sm text-muted-foreground mt-8 not-prose">
                Last updated: {formatDate(content.updatedAt)}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl font-medium mb-2">Content not available</p>
            <p className="text-muted-foreground">Please try again later</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
