"use client"

import { useState, useEffect } from "react"
import {
  Sun,
  Moon,
  Bookmark,
  BookmarkCheck,
  ThumbsUp,
  ThumbsDown,
  Shuffle,
  Loader2,
  Sparkles,
  Heart,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import FactSubmissionForm from "@/components/fact-submission-form"
import TriviaMode from "@/components/trivia-mode"
import { Footer } from "@/components/footer"
import { facts as initialFacts, categories, getFactsByCategory, getFactsByCategorySync, getRandomFacts, getRandomFactsSync, STORAGE_KEYS } from "@/lib/data"
import type { Fact } from "@/lib/types"
import Image from "next/image"
import Link from "next/link"
import { ShareButtons } from "./share-buttons"

const categoryColors = {
  Science: "bg-gradient-to-br from-mint to-sky",
  History: "bg-gradient-to-br from-peach to-rose",
  Geography: "bg-gradient-to-br from-lime to-mint",
  Animals: "bg-gradient-to-br from-sunny to-orange",
  Space: "bg-gradient-to-br from-purple to-lavender",
  Technology: "bg-gradient-to-br from-coral to-rose",
  Food: "bg-gradient-to-br from-sunny to-peach",
  Sports: "bg-gradient-to-br from-sky to-purple",
}

export default function FactExplorer() {
  const [facts, setFacts] = useState<Fact[]>(initialFacts)
  const [currentFact, setCurrentFact] = useState<Fact | null>(null)
  const [bookmarkedFacts, setBookmarkedFacts] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [likedFacts, setLikedFacts] = useState<string[]>([])
  const [dislikedFacts, setDislikedFacts] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load facts from JSON/hybrid system on component mount
  useEffect(() => {
    const loadFacts = async () => {
      setIsLoading(true)
      try {
        const randomFacts = await getRandomFacts()
        setFacts(randomFacts)
        setCurrentFact(randomFacts[0])
      } catch (error) {
        console.error("Error loading facts:", error)
        // Fallback to sync version if async fails
        const syncFacts = getRandomFactsSync()
        setFacts(syncFacts)
        setCurrentFact(syncFacts[0] || initialFacts[0])
      } finally {
        setIsLoading(false)
      }
    }

    loadFacts()
  }, [])

  // Load bookmarks from localStorage on component mount
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

  // Load facts by category when category changes
  useEffect(() => {
    const loadFactsByCategory = async () => {
      setIsLoading(true)
      try {
        let filteredFacts
        if (selectedCategory) {
          filteredFacts = await getFactsByCategory(selectedCategory)
          filteredFacts = [...filteredFacts].sort(() => Math.random() - 0.5)
        } else {
          filteredFacts = await getRandomFacts()
        }

        setFacts(filteredFacts)
        if (filteredFacts.length > 0) {
          setCurrentFact(filteredFacts[0])
        } else {
          setCurrentFact(null)
        }
      } catch (error) {
        console.error("Error loading facts by category:", error)
        // Fallback to sync versions
        const filteredFacts = selectedCategory
          ? getFactsByCategorySync(selectedCategory)
          : getRandomFactsSync()
        setFacts(filteredFacts)
        if (filteredFacts.length > 0) {
          setCurrentFact(filteredFacts[0])
        }
      } finally {
        setIsLoading(false)
      }
    }

    loadFactsByCategory()
  }, [selectedCategory])

  const getRandomFact = () => {
    if (!facts.length || facts.length === 1) return

    setIsAnimating(true)

    let newFact
    do {
      newFact = facts[Math.floor(Math.random() * facts.length)]
    } while (facts.length > 1 && newFact.id === currentFact?.id)

    setTimeout(() => {
      setCurrentFact(newFact)
      setIsAnimating(false)
    }, 300)
  }

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

  const bookmarkedFactsList = facts.filter((fact) => bookmarkedFacts.includes(fact.id))

  return (
    <div className="min-h-screen bg-gradient-to-br from-sunny/20 via-peach/10 to-mint/20">
      <div className="container mx-auto px-4 py-4 sm:py-8 min-h-screen flex flex-col">
        <header className="flex flex-col items-center mb-6 sm:mb-8 md:mb-12">
          <div className="flex items-center gap-3 sm:gap-6 mb-4 sm:mb-6">
            <div className="relative">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/DALL%C2%B7E%202025-03-06%2019.47.43%20-%20A%20stylized%2C%20vintage-style%20illustration%20of%20a%20curious-looking%20owl%20wearing%20a%20suit%20and%20top%20hat.%20The%20owl%20has%20an%20inquisitive%20expression%2C%20with%20detailed%20feath-WC9mpSAFHvRuDjm2otwr0Em5LWH473.webp"
                alt="UselessButInteresting Logo"
                width={64}
                height={64}
                className="rounded-full shadow-lg animate-bounce-gentle w-10 h-10 sm:w-16 sm:h-16"
              />
              <Sparkles className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 h-4 w-4 sm:h-6 sm:w-6 text-sunny animate-pulse" />
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black bg-gradient-to-r from-coral via-rose to-purple bg-clip-text text-transparent">
                UselessButInteresting
              </h1>
              <p className="text-sm sm:text-lg md:text-xl text-gray-600 font-medium">
                Discover mind-blowing facts from around the world! 🌍✨
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <Button
              variant="outline"
              asChild
              className="w-full sm:w-auto rounded-full border-2 border-coral hover:bg-coral hover:text-white transition-all duration-300 font-semibold bg-transparent text-sm sm:text-base"
            >
              <Link href="/all-facts">🔍 All Facts</Link>
            </Button>
            <Button
              variant="outline"
              asChild
              className="w-full sm:w-auto rounded-full border-2 border-mint hover:bg-mint hover:text-white transition-all duration-300 font-semibold bg-transparent text-sm sm:text-base"
            >
              <Link href="/blog">📖 Blog</Link>
            </Button>
            <Button
              variant="outline"
              asChild
              className="w-full sm:w-auto rounded-full border-2 border-purple hover:bg-purple hover:text-white transition-all duration-300 font-semibold bg-transparent text-sm sm:text-base"
            >
              <Link href="/about">ℹ️ About</Link>
            </Button>
          </div>
        </header>

        <main className="flex-grow">
          <Tabs defaultValue="explore" className="w-full">
            <TabsList className="grid grid-cols-2 sm:grid-cols-4 mb-4 sm:mb-6 md:mb-8 bg-white/80 backdrop-blur-sm rounded-2xl p-1.5 sm:p-2 shadow-lg gap-1">
              <TabsTrigger
                value="explore"
                className="rounded-xl text-xs sm:text-sm font-semibold data-[state=active]:bg-coral data-[state=active]:text-white py-2 sm:py-2.5"
              >
                🎯 Explore
              </TabsTrigger>
              <TabsTrigger
                value="bookmarks"
                className="rounded-xl text-xs sm:text-sm font-semibold data-[state=active]:bg-mint data-[state=active]:text-white py-2 sm:py-2.5"
              >
                💖 Bookmarks
              </TabsTrigger>
              <TabsTrigger
                value="submit"
                className="rounded-xl text-xs sm:text-sm font-semibold data-[state=active]:bg-sunny data-[state=active]:text-gray-800 py-2 sm:py-2.5"
              >
                ✨ Submit
              </TabsTrigger>
              <TabsTrigger
                value="trivia"
                className="rounded-xl text-xs sm:text-sm font-semibold data-[state=active]:bg-purple data-[state=active]:text-white py-2 sm:py-2.5"
              >
                🎮 Trivia
              </TabsTrigger>
            </TabsList>

            <TabsContent value="explore" className="space-y-4 sm:space-y-6 md:space-y-8">
              <div className="flex flex-wrap gap-2 sm:gap-3 mb-4 sm:mb-6 justify-center">
                <Badge
                  variant={selectedCategory === null ? "default" : "outline"}
                  className={`cursor-pointer px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 hover:scale-105 ${
                    selectedCategory === null
                      ? "bg-gradient-to-r from-coral to-rose text-white shadow-lg"
                      : "bg-white/80 hover:bg-coral hover:text-white border-2 border-coral"
                  }`}
                  onClick={() => setSelectedCategory(null)}
                >
                  🌟 All Categories
                </Badge>
                {categories.map((category) => (
                  <Badge
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    className={`cursor-pointer px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 hover:scale-105 ${
                      selectedCategory === category
                        ? "bg-gradient-to-r from-coral to-rose text-white shadow-lg"
                        : "bg-white/80 hover:bg-coral hover:text-white border-2 border-coral"
                    }`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </Badge>
                ))}
              </div>

              {isLoading ? (
                <div className="flex justify-center items-center py-20">
                  <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-coral mx-auto mb-4" />
                    <span className="text-xl font-semibold text-gray-600">Loading amazing facts...</span>
                  </div>
                </div>
              ) : currentFact ? (
                <Card
                  className={`w-full max-w-4xl mx-auto transition-all duration-500 hover:scale-[1.02] shadow-2xl border-0 ${isAnimating ? "opacity-0 scale-95" : "opacity-100 scale-100"} ${
                    categoryColors[currentFact.category as keyof typeof categoryColors] ||
                    "bg-gradient-to-br from-sunny to-peach"
                  }`}
                >
                  <CardHeader className="text-center pb-3 sm:pb-4">
                    <div className="flex flex-col sm:flex-row justify-between items-center mb-3 sm:mb-4 gap-2">
                      <CardTitle className="text-xl sm:text-2xl md:text-3xl font-black text-white drop-shadow-lg">🤯 Did you know?</CardTitle>
                      <Badge className="bg-white/90 text-gray-800 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-bold text-sm sm:text-base md:text-lg shadow-lg">
                        {currentFact.category}
                      </Badge>
                    </div>
                    <CardDescription className="text-white/90 font-medium text-sm sm:text-base md:text-lg">
                      Fact #{currentFact.id} • Mind = Blown 🤯
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="px-4 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6">
                    <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 sm:p-6 md:p-8 shadow-xl">
                      <p className="text-base sm:text-xl md:text-2xl leading-relaxed text-gray-800 font-medium text-center">
                        {currentFact.text}
                      </p>
                      <ShareButtons fact={currentFact} />
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center px-4 sm:px-6 md:px-8 pb-4 sm:pb-6 md:pb-8 gap-3 sm:gap-4">
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 md:space-x-3 w-full sm:w-auto">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleLike(currentFact.id)}
                        className={`rounded-full border-2 transition-all duration-300 hover:scale-110 text-xs sm:text-sm w-full sm:w-auto ${
                          likedFacts.includes(currentFact.id)
                            ? "bg-green-500 text-white border-green-500 shadow-lg"
                            : "bg-white/90 hover:bg-green-500 hover:text-white border-green-500"
                        }`}
                      >
                        <ThumbsUp className="h-4 w-4 mr-1 sm:mr-2" />
                        {likedFacts.includes(currentFact.id) ? "Loved!" : "Love it"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleDislike(currentFact.id)}
                        className={`rounded-full border-2 transition-all duration-300 hover:scale-110 text-xs sm:text-sm w-full sm:w-auto ${
                          dislikedFacts.includes(currentFact.id)
                            ? "bg-red-500 text-white border-red-500 shadow-lg"
                            : "bg-white/90 hover:bg-red-500 hover:text-white border-red-500"
                        }`}
                      >
                        <ThumbsDown className="h-4 w-4 mr-1 sm:mr-2" />
                        {dislikedFacts.includes(currentFact.id) ? "Meh" : "Not for me"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleBookmark(currentFact.id)}
                        className={`rounded-full border-2 transition-all duration-300 hover:scale-110 text-xs sm:text-sm w-full sm:w-auto ${
                          bookmarkedFacts.includes(currentFact.id)
                            ? "bg-yellow-500 text-white border-yellow-500 shadow-lg"
                            : "bg-white/90 hover:bg-yellow-500 hover:text-white border-yellow-500"
                        }`}
                      >
                        {bookmarkedFacts.includes(currentFact.id) ? (
                          <>
                            <BookmarkCheck className="h-4 w-4 mr-1 sm:mr-2" />
                            Saved!
                          </>
                        ) : (
                          <>
                            <Bookmark className="h-4 w-4 mr-1 sm:mr-2" />
                            Save
                          </>
                        )}
                      </Button>
                    </div>
                    <Button
                      onClick={getRandomFact}
                      size="sm"
                      className="bg-gradient-to-r from-coral to-rose hover:from-rose hover:to-coral text-white font-bold px-4 sm:px-6 md:px-8 py-2 sm:py-2.5 md:py-3 rounded-full shadow-xl transition-all duration-300 hover:scale-110 hover:shadow-2xl text-xs sm:text-sm md:text-base w-full sm:w-auto"
                    >
                      <Shuffle className="mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 group-hover:animate-spin" />
                      Next Amazing Fact! 🎲
                    </Button>
                  </CardFooter>
                </Card>
              ) : (
                <Card className="bg-gradient-to-br from-peach to-rose text-white">
                  <CardContent className="py-12 text-center">
                    <p className="text-xl font-semibold">
                      No facts available for this category. Try another category! 🔄
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="bookmarks">
              {bookmarkedFactsList.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 max-w-6xl mx-auto">
                  {bookmarkedFactsList.map((fact) => (
                    <Card
                      key={fact.id}
                      className={`h-full flex flex-col transition-all duration-300 hover:scale-105 shadow-xl border-0 ${
                        categoryColors[fact.category as keyof typeof categoryColors] ||
                        "bg-gradient-to-br from-sunny to-peach"
                      }`}
                    >
                      <CardHeader className="pb-2 sm:pb-3">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-base sm:text-lg font-bold text-white drop-shadow">Fact #{fact.id}</CardTitle>
                          <Badge className="bg-white/90 text-gray-800 font-semibold text-xs sm:text-sm">{fact.category}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="py-2 sm:py-3 flex-grow">
                        <div className="bg-white/95 backdrop-blur-sm rounded-xl p-3 sm:p-4">
                          <p className="text-sm sm:text-base text-gray-800 font-medium">{fact.text}</p>
                          <ShareButtons fact={fact} />
                        </div>
                      </CardContent>
                      <CardFooter className="pt-2 sm:pt-3">
                        <div className="flex space-x-2 w-full">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 bg-white/90 hover:bg-green-500 hover:text-white border-green-500 rounded-full font-semibold text-xs sm:text-sm"
                            onClick={() => toggleLike(fact.id)}
                          >
                            <ThumbsUp
                              className={`h-3 w-3 sm:h-4 sm:w-4 mr-1 ${likedFacts.includes(fact.id) ? "text-green-600" : ""}`}
                            />
                            {likedFacts.includes(fact.id) ? "Loved" : "Love"}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 bg-white/90 hover:bg-red-500 hover:text-white border-red-500 rounded-full font-semibold text-xs sm:text-sm"
                            onClick={() => toggleBookmark(fact.id)}
                          >
                            <BookmarkCheck className="h-3 w-3 sm:h-4 sm:w-4 mr-1 text-yellow-600" />
                            Remove
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="bg-gradient-to-br from-lavender to-sky text-white">
                  <CardContent className="flex flex-col items-center justify-center py-20">
                    <Heart className="h-20 w-20 text-white/80 mb-6 animate-bounce-gentle" />
                    <h3 className="text-3xl font-bold mb-4">No bookmarks yet! 💖</h3>
                    <p className="text-xl text-center max-w-md text-white/90">
                      Save your favorite facts by clicking the bookmark icon while exploring amazing content!
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="submit">
              <FactSubmissionForm />
            </TabsContent>

            <TabsContent value="trivia">
              <TriviaMode facts={facts} />
            </TabsContent>
          </Tabs>
        </main>

        <Footer />
      </div>
    </div>
  )
}
