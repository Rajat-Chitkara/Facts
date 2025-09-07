import type { Fact, SubmittedFact, BlogPost, AboutUsContent, Category } from "./types"
import { 
  fetchFactsFromJSON, 
  fetchCategoriesFromJSON, 
  getFactsByCategoryFromJSON, 
  getRandomFactsFromJSON,
  getFactsHybrid,
  saveFactsToLocalStorage,
  generateFactsJSON,
  clearJSONCache,
  fetchBlogPostsFromJSON,
  getPublishedBlogPostsFromJSON,
  getBlogPostBySlugFromJSON,
  getBlogPostsHybrid,
  saveBlogPostsToLocalStorage,
  generateBlogPostsJSON
} from "./json-data"

export const categories = ["Science", "History", "Geography", "Animals", "Space", "Technology", "Food", "Sports"]

// Initial facts data
export const facts: Fact[] = [
  {
    id: "1",
    text: "Honey never spoils. Archaeologists have found pots of honey in ancient Egyptian tombs that are over 3,000 years old and still perfectly good to eat.",
    category: "Food",
  },
  {
    id: "2",
    text: "A day on Venus is longer than a year on Venus. It takes 243 Earth days to rotate once on its axis, but only 225 Earth days to complete one orbit of the Sun.",
    category: "Space",
  },
  {
    id: "3",
    text: "The shortest war in history was between Britain and Zanzibar on August 27, 1896. Zanzibar surrendered after 38 minutes.",
    category: "History",
  },
  {
    id: "4",
    text: "Octopuses have three hearts. Two pump blood through the gills, while the third pumps it through the body.",
    category: "Animals",
  },
  {
    id: "5",
    text: "The average person will spend six months of their life waiting for red lights to turn green.",
    category: "Technology",
  },
  {
    id: "6",
    text: "The Great Barrier Reef is the largest living structure on Earth, stretching over 1,400 miles and visible from space.",
    category: "Geography",
  },
  {
    id: "7",
    text: "A bolt of lightning is five times hotter than the surface of the sun, reaching temperatures of about 30,000 kelvins (53,540 degrees Fahrenheit).",
    category: "Science",
  },
  {
    id: "8",
    text: "The world's oldest known living tree is a Great Basin Bristlecone Pine in the White Mountains of California, estimated to be over 5,000 years old.",
    category: "Science",
  },
  {
    id: "9",
    text: "Cows have best friends and can become stressed when they are separated from them.",
    category: "Animals",
  },
  {
    id: "10",
    text: "The first computer programmer was a woman named Ada Lovelace, who wrote the first algorithm for Charles Babbage's Analytical Engine in the 1840s.",
    category: "Technology",
  },
  {
    id: "11",
    text: "The shortest commercial flight in the world is between the Scottish islands of Westray and Papa Westray, with a flight time of just under two minutes.",
    category: "Geography",
  },
  {
    id: "12",
    text: "A group of flamingos is called a 'flamboyance'.",
    category: "Animals",
  },
  {
    id: "13",
    text: "The human nose can detect over 1 trillion different scents.",
    category: "Science",
  },
  {
    id: "14",
    text: "The world's largest desert is Antarctica, which is classified as a desert because it receives very little precipitation.",
    category: "Geography",
  },
  {
    id: "15",
    text: "The first Olympic Games were held in 776 BCE in Olympia, Greece, and featured only one event: a foot race called the 'stade'.",
    category: "Sports",
  },
  {
    id: "16",
    text: "There are more possible iterations of a game of chess than there are atoms in the observable universe.",
    category: "Science",
  },
  {
    id: "17",
    text: "The Eiffel Tower can be 15 cm taller during the summer due to thermal expansion of the iron.",
    category: "Science",
  },
  {
    id: "18",
    text: "Bananas are berries, but strawberries are not.",
    category: "Food",
  },
  {
    id: "19",
    text: "The average cloud weighs about 1.1 million pounds due to the weight of the water droplets it contains.",
    category: "Science",
  },
  {
    id: "20",
    text: "The first message sent over the internet was 'LO'. The intended message was 'LOGIN', but the system crashed after the first two letters.",
    category: "Technology",
  },
]

// Sample blog post data - this will be our fallback
export const sampleBlogPost: BlogPost = {
  id: "sample-1",
  title: "Whittier, Alaska: The Town Under One Roof – A Deep Dive into Life in America's Most Unique Community",
  slug: "whittier-alaska",
  excerpt:
    "Imagine a community where your entire world—your home, school, grocery store, and even the police station—exists within the confines of a single building.",
  content: `
    <p>Imagine a community where your entire world—your home, school, grocery store, and even the police station—exists within the confines of a single building. Welcome to Whittier, Alaska, a town so unique that it challenges our very notion of what a community can be.</p>
    
    <h2>The Building That Is a Town</h2>
    <p>Begich Towers, a 14-story concrete monolith, houses nearly all of Whittier's 272 residents. Built in the 1950s as military housing, this brutalist structure has evolved into something unprecedented: a vertical town where neighbors aren't just next door—they're upstairs, downstairs, and down the hall.</p>
    
    <h2>Life Under One Roof</h2>
    <p>Within Begich Towers, residents have access to a post office, general store, laundromat, health clinic, and even a small hotel for visitors. The building's first floor houses the city offices and police department, while the school is connected via an underground tunnel.</p>
    
    <p>This unique living arrangement creates an intimacy rarely found in modern communities. Children play in heated hallways during harsh winters, and impromptu gatherings happen in the building's common areas. Everyone knows everyone, and privacy takes on a different meaning when your mayor might live three floors up.</p>
    
    <h2>The Challenges of Isolation</h2>
    <p>Whittier's isolation is both its charm and its challenge. Accessible only by a single-lane tunnel that alternates traffic direction every 30 minutes, the town can feel cut off from the outside world. During winter storms, residents might not see sunlight for days, relying entirely on their building community for social interaction.</p>
    
    <p>Yet this isolation has fostered remarkable resilience and cooperation. When someone needs help, the entire building responds. Medical emergencies, childcare, and even simple favors become community efforts.</p>
    
    <h2>A Glimpse into Alternative Living</h2>
    <p>Whittier represents more than just an oddity—it's a functioning example of high-density, community-focused living. As urban planners worldwide grapple with housing crises and social isolation, this Alaskan town offers insights into how physical proximity can foster genuine community bonds.</p>
    
    <p>Whether Whittier's model could work elsewhere remains debatable, but its existence proves that unconventional approaches to community living can not only survive but thrive in the most challenging environments.</p>
  `,
  coverImage: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=400&fit=crop",
  published: true,
  createdAt: "2025-05-24T00:00:00.000Z",
}

// Local storage keys
export const STORAGE_KEYS = {
  FACTS: "facts_data",
  SUBMITTED_FACTS: "submitted_facts",
  BOOKMARKS: "bookmarkedFacts",
  LIKED: "likedFacts",
  DISLIKED: "dislikedFacts",
  ADMIN_PASSWORD: "admin_password",
  BLOG_POSTS: "blog_posts",
  ABOUT_US: "about_us_content",
}

// Default admin password (you should change this)
export const DEFAULT_ADMIN_PASSWORD = "JR56OPsh#"

// Default About Us content with proper HTML structure
export const DEFAULT_ABOUT_US: AboutUsContent = {
  title: "About UselessButInteresting",
  content: `
    <h2>Welcome to UselessButInteresting!</h2>
    <p>We are passionate about sharing fascinating and unusual facts that might not change your life but will definitely make it more interesting.</p>
    <p>Our mission is to collect, verify, and share the most intriguing tidbits of information from around the world. Whether it's science, history, animals, or technology, we're here to satisfy your curiosity.</p>
    
    <h3>Our Story</h3>
    <p>UselessButInteresting was founded by a group of trivia enthusiasts who wanted to create a platform where people could discover and share interesting facts. What started as a small collection has grown into a comprehensive database of verified information.</p>
    
    <h3>Join Our Community</h3>
    <p>We invite you to explore our collection of facts, submit your own discoveries, and engage with our community of knowledge seekers. Follow us on social media and join our Reddit community to stay updated with the latest additions.</p>
    <p>Thank you for visiting UselessButInteresting. We hope you learn something new today!</p>
  `,
  updatedAt: new Date().toISOString(),
}

// Helper functions for facts - now using hybrid system
export const getStoredFacts = async (): Promise<Fact[]> => {
  if (typeof window === "undefined") {
    // Server-side: return hardcoded facts as fallback
    return facts
  }

  try {
    // Try to get facts from hybrid system (JSON + localStorage for admin changes)
    return await getFactsHybrid()
  } catch (error) {
    console.error("Error accessing facts:", error)
    // Fallback to hardcoded facts
    return facts
  }
}

// Synchronous version for components that need immediate data
export const getStoredFactsSync = (): Fact[] => {
  if (typeof window === "undefined") return facts

  try {
    // Check if admin has made temporary changes
    const tempData = localStorage.getItem("temp_facts_data")
    if (tempData) {
      const data = JSON.parse(tempData)
      return data.facts
    }
    
    // Otherwise return cached facts or fallback
    const storedFacts = localStorage.getItem(STORAGE_KEYS.FACTS)
    if (!storedFacts) {
      localStorage.setItem(STORAGE_KEYS.FACTS, JSON.stringify(facts))
      return facts
    }
    return JSON.parse(storedFacts)
  } catch (error) {
    console.error("Error accessing localStorage:", error)
    return facts
  }
}

export const getRandomFacts = async (): Promise<Fact[]> => {
  const allFacts = await getStoredFacts()
  // Create a copy and shuffle it
  return [...allFacts].sort(() => Math.random() - 0.5)
}

// Synchronous version for components that need immediate data
export const getRandomFactsSync = (): Fact[] => {
  const allFacts = getStoredFactsSync()
  return [...allFacts].sort(() => Math.random() - 0.5)
}

export const getStoredSubmissions = (): SubmittedFact[] => {
  if (typeof window === "undefined") return []

  try {
    const storedSubmissions = localStorage.getItem(STORAGE_KEYS.SUBMITTED_FACTS)
    if (!storedSubmissions) {
      localStorage.setItem(STORAGE_KEYS.SUBMITTED_FACTS, JSON.stringify([]))
      return []
    }
    return JSON.parse(storedSubmissions)
  } catch (error) {
    console.error("Error accessing localStorage:", error)
    return []
  }
}

export const submitFact = (fact: Omit<SubmittedFact, "id" | "approved" | "createdAt">): SubmittedFact => {
  const submissions = getStoredSubmissions()

  const newFact: SubmittedFact = {
    id: Date.now().toString(),
    ...fact,
    approved: false,
    createdAt: new Date().toISOString(),
  }

  const updatedSubmissions = [...submissions, newFact]
  localStorage.setItem(STORAGE_KEYS.SUBMITTED_FACTS, JSON.stringify(updatedSubmissions))

  return newFact
}

export const approveFact = (factId: string): void => {
  const submissions = getStoredSubmissions()
  const allFacts = getStoredFactsSync()

  const factToApprove = submissions.find((f) => f.id === factId)
  if (!factToApprove) return

  // Add to facts
  const newFact: Fact = {
    id: Date.now().toString(),
    text: factToApprove.text,
    category: factToApprove.category,
    submittedBy: factToApprove.submittedBy,
    source: factToApprove.source,
    approved: true,
    verified: true,
    createdAt: factToApprove.createdAt,
  }

  const updatedFacts = [...allFacts, newFact]
  
  // Save to temporary localStorage for admin preview
  saveFactsToLocalStorage(updatedFacts)
  
  // Also save to old localStorage format for backward compatibility
  localStorage.setItem(STORAGE_KEYS.FACTS, JSON.stringify(updatedFacts))

  // Remove from submissions
  const updatedSubmissions = submissions.filter((f) => f.id !== factId)
  localStorage.setItem(STORAGE_KEYS.SUBMITTED_FACTS, JSON.stringify(updatedSubmissions))
}

export const rejectFact = (factId: string): void => {
  const submissions = getStoredSubmissions()
  const updatedSubmissions = submissions.filter((f) => f.id !== factId)
  localStorage.setItem(STORAGE_KEYS.SUBMITTED_FACTS, JSON.stringify(updatedSubmissions))
}

export const addFact = (fact: Omit<Fact, "id" | "approved" | "createdAt">): Fact => {
  const allFacts = getStoredFactsSync()

  const newFact: Fact = {
    id: Date.now().toString(),
    ...fact,
    approved: true,
    verified: true,
    createdAt: new Date().toISOString(),
  }

  const updatedFacts = [...allFacts, newFact]
  
  // Save to temporary localStorage for admin preview
  saveFactsToLocalStorage(updatedFacts)
  
  // Also save to old localStorage format for backward compatibility
  localStorage.setItem(STORAGE_KEYS.FACTS, JSON.stringify(updatedFacts))

  return newFact
}

export const updateFact = (factId: string, updates: Partial<Fact>): Fact => {
  const allFacts = getStoredFactsSync()

  const updatedFacts = allFacts.map((fact) => {
    if (fact.id === factId) {
      return { ...fact, ...updates }
    }
    return fact
  })

  // Save to temporary localStorage for admin preview
  saveFactsToLocalStorage(updatedFacts)
  
  // Also save to old localStorage format for backward compatibility
  localStorage.setItem(STORAGE_KEYS.FACTS, JSON.stringify(updatedFacts))

  return updatedFacts.find((f) => f.id === factId)!
}

export const deleteFact = (factId: string): void => {
  const allFacts = getStoredFactsSync()
  const updatedFacts = allFacts.filter((f) => f.id !== factId)
  
  // Save to temporary localStorage for admin preview
  saveFactsToLocalStorage(updatedFacts)
  
  // Also save to old localStorage format for backward compatibility
  localStorage.setItem(STORAGE_KEYS.FACTS, JSON.stringify(updatedFacts))
}

export const getFactsByCategory = async (category: string): Promise<Fact[]> => {
  const allFacts = await getStoredFacts()
  return allFacts.filter((f) => f.category === category)
}

// Synchronous version for components that need immediate data
export const getFactsByCategorySync = (category: string): Fact[] => {
  const allFacts = getStoredFactsSync()
  return allFacts.filter((f) => f.category === category)
}

export const checkAdminPassword = (password: string): boolean => {
  try {
    const storedPassword = localStorage.getItem(STORAGE_KEYS.ADMIN_PASSWORD) || DEFAULT_ADMIN_PASSWORD
    return password === storedPassword
  } catch (error) {
    console.error("Error checking admin password:", error)
    // Fallback to default password if localStorage fails
    return password === DEFAULT_ADMIN_PASSWORD
  }
}

// Blog post functions - now using hybrid system
export const getStoredBlogPosts = async (): Promise<BlogPost[]> => {
  if (typeof window === "undefined") {
    // Return sample post for server-side rendering
    return [sampleBlogPost]
  }

  try {
    // Try to get blog posts from hybrid system (JSON + localStorage for admin changes)
    return await getBlogPostsHybrid()
  } catch (error) {
    console.error("Error accessing blog posts:", error)
    // Fallback to hardcoded sample post
    return [sampleBlogPost]
  }
}

// Synchronous version for components that need immediate data
export const getStoredBlogPostsSync = (): BlogPost[] => {
  if (typeof window === "undefined") return [sampleBlogPost]

  try {
    // Check if admin has made temporary changes
    const tempData = localStorage.getItem("temp_blog_posts_data")
    if (tempData) {
      const data = JSON.parse(tempData)
      return data.posts
    }
    
    // Otherwise return cached posts or fallback
    const storedPosts = localStorage.getItem(STORAGE_KEYS.BLOG_POSTS)
    if (!storedPosts) {
      localStorage.setItem(STORAGE_KEYS.BLOG_POSTS, JSON.stringify([sampleBlogPost]))
      return [sampleBlogPost]
    }
    return JSON.parse(storedPosts)
  } catch (error) {
    console.error("Error accessing localStorage:", error)
    return [sampleBlogPost]
  }
}

export const getBlogPostBySlug = async (slug: string): Promise<BlogPost | undefined> => {
  const posts = await getStoredBlogPosts()
  console.log("getBlogPostBySlug - Looking for:", slug)
  console.log(
    "getBlogPostBySlug - Available posts:",
    posts.map((p) => ({ slug: p.slug, published: p.published })),
  )
  const found = posts.find((post) => post.slug === slug)
  console.log("getBlogPostBySlug - Found:", found ? found.slug : "none")
  return found
}

// Synchronous version for components that need immediate data
export const getBlogPostBySlugSync = (slug: string): BlogPost | undefined => {
  const posts = getStoredBlogPostsSync()
  return posts.find((post) => post.slug === slug)
}

export const getPublishedBlogPosts = async (): Promise<BlogPost[]> => {
  const posts = await getStoredBlogPosts()
  return posts
    .filter((post) => post.published)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

// Synchronous version for components that need immediate data
export const getPublishedBlogPostsSync = (): BlogPost[] => {
  const posts = getStoredBlogPostsSync()
  return posts
    .filter((post) => post.published)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export const createBlogPost = (post: Omit<BlogPost, "id" | "createdAt" | "updatedAt">): BlogPost => {
  const posts = getStoredBlogPostsSync()

  const newPost: BlogPost = {
    id: Date.now().toString(),
    ...post,
    createdAt: new Date().toISOString(),
  }

  const updatedPosts = [...posts, newPost]
  
  // Save to temporary localStorage for admin preview
  saveBlogPostsToLocalStorage(updatedPosts)
  
  // Also save to old localStorage format for backward compatibility
  localStorage.setItem(STORAGE_KEYS.BLOG_POSTS, JSON.stringify(updatedPosts))

  console.log("Created blog post:", newPost.slug)
  console.log(
    "All posts after creation:",
    updatedPosts.map((p) => p.slug),
  )

  return newPost
}

export const updateBlogPost = (postId: string, updates: Partial<BlogPost>): BlogPost => {
  const posts = getStoredBlogPostsSync()

  const updatedPosts = posts.map((post) => {
    if (post.id === postId) {
      return {
        ...post,
        ...updates,
        updatedAt: new Date().toISOString(),
      }
    }
    return post
  })

  // Save to temporary localStorage for admin preview
  saveBlogPostsToLocalStorage(updatedPosts)
  
  // Also save to old localStorage format for backward compatibility
  localStorage.setItem(STORAGE_KEYS.BLOG_POSTS, JSON.stringify(updatedPosts))

  return updatedPosts.find((p) => p.id === postId)!
}

export const deleteBlogPost = (postId: string): void => {
  const posts = getStoredBlogPostsSync()
  const updatedPosts = posts.filter((p) => p.id !== postId)
  
  // Save to temporary localStorage for admin preview
  saveBlogPostsToLocalStorage(updatedPosts)
  
  // Also save to old localStorage format for backward compatibility
  localStorage.setItem(STORAGE_KEYS.BLOG_POSTS, JSON.stringify(updatedPosts))
}

// Helper function to create a URL-friendly slug from a title
export const createSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with a single hyphen
    .trim()
}

// About Us functions
export const getAboutUsContent = (): AboutUsContent => {
  if (typeof window === "undefined") return DEFAULT_ABOUT_US

  try {
    const storedContent = localStorage.getItem(STORAGE_KEYS.ABOUT_US)
    if (!storedContent) {
      localStorage.setItem(STORAGE_KEYS.ABOUT_US, JSON.stringify(DEFAULT_ABOUT_US))
      return DEFAULT_ABOUT_US
    }
    return JSON.parse(storedContent)
  } catch (error) {
    console.error("Error accessing localStorage:", error)
    return DEFAULT_ABOUT_US
  }
}

export const updateAboutUsContent = (updates: Partial<AboutUsContent>): AboutUsContent => {
  const currentContent = getAboutUsContent()

  const updatedContent: AboutUsContent = {
    ...currentContent,
    ...updates,
    updatedAt: new Date().toISOString(),
  }

  localStorage.setItem(STORAGE_KEYS.ABOUT_US, JSON.stringify(updatedContent))
  return updatedContent
}

// Admin functions for managing JSON files
export const exportFactsJSON = (): string => {
  const allFacts = getStoredFactsSync()
  return generateFactsJSON(allFacts)
}

export const exportBlogPostsJSON = (): string => {
  const allPosts = getStoredBlogPostsSync()
  return generateBlogPostsJSON(allPosts)
}

export const clearFactsCache = (): void => {
  clearJSONCache()
  // Also clear temporary admin changes
  if (typeof window !== "undefined") {
    localStorage.removeItem("temp_facts_data")
  }
}

export const clearBlogCache = (): void => {
  clearJSONCache()
  // Also clear temporary admin changes
  if (typeof window !== "undefined") {
    localStorage.removeItem("temp_blog_posts_data")
  }
}

export const previewFactsChanges = (): boolean => {
  if (typeof window === "undefined") return false
  return localStorage.getItem("temp_facts_data") !== null
}

export const previewBlogChanges = (): boolean => {
  if (typeof window === "undefined") return false
  return localStorage.getItem("temp_blog_posts_data") !== null
}

// Function to fetch categories for dropdown/display
export const getCategoriesAsync = async (): Promise<Category[]> => {
  try {
    return await fetchCategoriesFromJSON()
  } catch (error) {
    console.error("Error fetching categories:", error)
    // Return default categories
    return categories.map(cat => ({
      id: cat.toLowerCase(),
      name: cat,
      description: `${cat} facts`,
      color: "#3B82F6",
      gradient: "bg-gradient-to-br from-blue-400 to-blue-600"
    }))
  }
}
