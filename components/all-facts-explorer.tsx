"use client"

import { useState, useEffect } from "react"
import { Search, ArrowLeft, Bookmark, BookmarkCheck, ThumbsUp, ThumbsDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Footer } from "@/components/footer"
import { facts as initialFacts, categories, getStoredFacts, getStoredFactsSync, STORAGE_KEYS } from "@/lib/data"
import type { Fact } from "@/lib/types"
import Image from "next/image"
import Link from "next/link"
import { ShareButtons } from "./share-buttons"

export default function AllFactsExplorer() {
  const [facts, setFacts] = useState<Fact[]>(initialFacts)
  const [filteredFacts, setFilteredFacts] = useState<Fact[]>(initialFacts)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [bookmarkedFacts, setBookmarkedFacts] = useState<string[]>([])
  const [likedFacts, setLikedFacts] = useState<string[]>([])
  const [dislikedFacts, setDislikedFacts] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load facts from localStorage on component mount
  useEffect(() => {
    const loadFacts = async () => {
      setIsLoading(true)
      try {
        const storedFacts = await getStoredFacts()
        setFacts(storedFacts)
        setFilteredFacts(storedFacts)
      } catch (error) {
        console.error("Error loading facts:", error)
        // Fallback to sync version or initial facts
        try {
          const syncFacts = getStoredFactsSync()
          setFacts(syncFacts)
          setFilteredFacts(syncFacts)
        } catch {
          setFacts(initialFacts)
          setFilteredFacts(initialFacts)
        }
      } finally {
        setIsLoading(false)
      }
    }

    loadFacts()
  }, [])

  // Load bookmarks, likes, and dislikes from localStorage
  useEffect(() => {
    const savedBookmarks = localStorage.getItem(STORAGE_KEYS.BOOKMARKS)
    if (savedBookmarks) {
      setBookmarkedFacts(JSON.parse(savedBookmarks))
    }

    const savedLiked = localStorage.getItem(STORAGE_KEYS.LIKED)
    if (savedLiked) {
      setLikedFacts(JSON.parse(savedLiked))
    }

    const savedDisliked = localStorage.getItem(STORAGE_KEYS.DISLIKED)
    if (savedDisliked) {
      setDislikedFacts(JSON.parse(savedDisliked))
    }
  }, [])

  // Save bookmarks to localStorage when they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(bookmarkedFacts))
  }, [bookmarkedFacts])

  // Save likes/dislikes to localStorage when they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LIKED, JSON.stringify(likedFacts))
    localStorage.setItem(STORAGE_KEYS.DISLIKED, JSON.stringify(dislikedFacts))
  }, [likedFacts, dislikedFacts])

  // Filter facts based on search term and category
  useEffect(() => {
    let result = facts

    // Filter by category if selected
    if (selectedCategory) {
      result = result.filter((fact) => fact.category === selectedCategory)
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter(
        (fact) =>
          fact.text.toLowerCase().includes(term) ||
          fact.category.toLowerCase().includes(term) ||
          (fact.submittedBy && fact.submittedBy.toLowerCase().includes(term)),
      )
    }

    setFilteredFacts(result)
  }, [facts, searchTerm, selectedCategory])

  const toggleBookmark = (factId: string) => {
    if (bookmarkedFacts.includes(factId)) {
      setBookmarkedFacts(bookmarkedFacts.filter((id) => id !== factId))
    } else {
      setBookmarkedFacts([...bookmarkedFacts, factId])
    }
  }

  const toggleLike = (factId: string) => {
    if (likedFacts.includes(factId)) {
      setLikedFacts(likedFacts.filter((id) => id !== factId))
    } else {
      setLikedFacts([...likedFacts, factId])
      setDislikedFacts(dislikedFacts.filter((id) => id !== factId))
    }
  }

  const toggleDislike = (factId: string) => {
    if (dislikedFacts.includes(factId)) {
      setDislikedFacts(dislikedFacts.filter((id) => id !== factId))
    } else {
      setDislikedFacts([...dislikedFacts, factId])
      setLikedFacts(likedFacts.filter((id) => id !== factId))
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
            <h1 className="text-4xl font-bold text-foreground">UselessButInteresting</h1>
            <p className="text-muted-foreground">Browse and search all facts</p>
          </div>
        </div>
        <div className="flex items-center mt-4 md:mt-0 gap-4">
          <Button variant="outline" asChild>
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/blog">Blog</Link>
          </Button>
        </div>
      </header>

      <main className="flex-grow">
        <div className="mb-8 space-y-4">
          <h2 className="text-2xl font-bold">All Facts</h2>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search facts..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Select value={selectedCategory || ""} onValueChange={(value) => setSelectedCategory(value || null)}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <span className="ml-2">Loading facts...</span>
          </div>
        ) : filteredFacts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFacts.map((fact) => (
              <Card key={fact.id} className="h-full flex flex-col">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <Badge>{fact.category}</Badge>
                    {fact.submittedBy && <CardDescription>Submitted by {fact.submittedBy}</CardDescription>}
                  </div>
                </CardHeader>
                <CardContent className="py-2 flex-grow">
                  <p>{fact.text}</p>
                </CardContent>
                <CardFooter className="pt-2 flex justify-between border-t">
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleLike(fact.id)}
                      className={likedFacts.includes(fact.id) ? "text-green-600 dark:text-green-400" : ""}
                    >
                      <ThumbsUp className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleDislike(fact.id)}
                      className={dislikedFacts.includes(fact.id) ? "text-red-600 dark:text-red-400" : ""}
                    >
                      <ThumbsDown className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => toggleBookmark(fact.id)}>
                      {bookmarkedFacts.includes(fact.id) ? (
                        <BookmarkCheck className="h-4 w-4 text-primary" />
                      ) : (
                        <Bookmark className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <ShareButtons fact={fact} compact />
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl font-medium mb-2">No facts found</p>
            <p className="text-muted-foreground">Try a different search term or category</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
