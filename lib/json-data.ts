import type { Fact, FactsData, Category, CategoriesData, SubmittedFact, SubmissionsData, BlogPost, BlogPostsData } from "./types"

// JSON file paths
const DATA_PATHS = {
  FACTS: "/data/facts.json",
  CATEGORIES: "/data/categories.json", 
  SUBMISSIONS: "/data/submissions.json",
  BLOG_POSTS: "/data/blog-posts.json"
}

// Cache for JSON data to avoid repeated fetches
let factsCache: FactsData | null = null
let categoriesCache: CategoriesData | null = null
let submissionsCache: SubmissionsData | null = null
let blogPostsCache: BlogPostsData | null = null

/**
 * Fetch facts from JSON file
 */
export async function fetchFactsFromJSON(): Promise<Fact[]> {
  try {
    if (factsCache) {
      return factsCache.facts
    }

    const response = await fetch(DATA_PATHS.FACTS)
    if (!response.ok) {
      throw new Error(`Failed to fetch facts: ${response.status}`)
    }
    
    const data: FactsData = await response.json()
    factsCache = data
    return data.facts
  } catch (error) {
    console.error("Error fetching facts from JSON:", error)
    // Return empty array as fallback
    return []
  }
}

/**
 * Fetch categories from JSON file
 */
export async function fetchCategoriesFromJSON(): Promise<Category[]> {
  try {
    if (categoriesCache) {
      return categoriesCache.categories
    }

    const response = await fetch(DATA_PATHS.CATEGORIES)
    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.status}`)
    }
    
    const data: CategoriesData = await response.json()
    categoriesCache = data
    return data.categories
  } catch (error) {
    console.error("Error fetching categories from JSON:", error)
    // Return default categories as fallback
    return [
      { id: "science", name: "Science", description: "Scientific facts", color: "#3B82F6", gradient: "bg-gradient-to-br from-blue-400 to-blue-600" },
      { id: "history", name: "History", description: "Historical facts", color: "#8B5CF6", gradient: "bg-gradient-to-br from-purple-400 to-purple-600" },
      { id: "geography", name: "Geography", description: "Geographic facts", color: "#10B981", gradient: "bg-gradient-to-br from-green-400 to-green-600" },
      { id: "animals", name: "Animals", description: "Animal facts", color: "#F59E0B", gradient: "bg-gradient-to-br from-amber-400 to-amber-600" },
      { id: "space", name: "Space", description: "Space facts", color: "#6366F1", gradient: "bg-gradient-to-br from-indigo-400 to-indigo-600" },
      { id: "technology", name: "Technology", description: "Technology facts", color: "#EF4444", gradient: "bg-gradient-to-br from-red-400 to-red-600" },
      { id: "food", name: "Food", description: "Food facts", color: "#F97316", gradient: "bg-gradient-to-br from-orange-400 to-orange-600" },
      { id: "sports", name: "Sports", description: "Sports facts", color: "#06B6D4", gradient: "bg-gradient-to-br from-cyan-400 to-cyan-600" }
    ]
  }
}

/**
 * Get facts by category from JSON
 */
export async function getFactsByCategoryFromJSON(category: string): Promise<Fact[]> {
  const facts = await fetchFactsFromJSON()
  return facts.filter(fact => fact.category.toLowerCase() === category.toLowerCase())
}

/**
 * Get random facts from JSON
 */
export async function getRandomFactsFromJSON(): Promise<Fact[]> {
  const facts = await fetchFactsFromJSON()
  return [...facts].sort(() => Math.random() - 0.5)
}

/**
 * Clear caches (useful for admin operations)
 */
export function clearJSONCache(): void {
  factsCache = null
  categoriesCache = null
  submissionsCache = null
  blogPostsCache = null
}

/**
 * Save updated facts to localStorage temporarily for admin preview
 * This simulates updating the JSON file for admin testing
 */
export function saveFactsToLocalStorage(facts: Fact[]): void {
  const factsData: FactsData = {
    version: "1.0.0",
    lastUpdated: new Date().toISOString(),
    facts
  }
  localStorage.setItem("temp_facts_data", JSON.stringify(factsData))
}

/**
 * Get facts from localStorage if admin made changes, otherwise from JSON
 */
export async function getFactsHybrid(): Promise<Fact[]> {
  // Check if admin has made temporary changes
  if (typeof window !== "undefined") {
    const tempData = localStorage.getItem("temp_facts_data")
    if (tempData) {
      try {
        const data: FactsData = JSON.parse(tempData)
        return data.facts
      } catch (error) {
        console.error("Error parsing temp facts data:", error)
      }
    }
  }
  
  // Otherwise get from JSON
  return await fetchFactsFromJSON()
}

/**
 * Generate JSON export for admin to copy and save to actual JSON files
 */
export function generateFactsJSON(facts: Fact[]): string {
  const factsData: FactsData = {
    version: "1.0.0",
    lastUpdated: new Date().toISOString(),
    facts
  }
  return JSON.stringify(factsData, null, 2)
}

/**
 * Fetch blog posts from JSON file
 */
export async function fetchBlogPostsFromJSON(): Promise<BlogPost[]> {
  try {
    if (blogPostsCache) {
      return blogPostsCache.posts
    }

    const response = await fetch(DATA_PATHS.BLOG_POSTS)
    if (!response.ok) {
      throw new Error(`Failed to fetch blog posts: ${response.status}`)
    }
    
    const data: BlogPostsData = await response.json()
    blogPostsCache = data
    return data.posts
  } catch (error) {
    console.error("Error fetching blog posts from JSON:", error)
    // Return empty array as fallback
    return []
  }
}

/**
 * Get published blog posts from JSON
 */
export async function getPublishedBlogPostsFromJSON(): Promise<BlogPost[]> {
  const posts = await fetchBlogPostsFromJSON()
  return posts
    .filter(post => post.published)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

/**
 * Get blog post by slug from JSON
 */
export async function getBlogPostBySlugFromJSON(slug: string): Promise<BlogPost | undefined> {
  const posts = await fetchBlogPostsFromJSON()
  return posts.find(post => post.slug === slug)
}

/**
 * Save updated blog posts to localStorage temporarily for admin preview
 */
export function saveBlogPostsToLocalStorage(posts: BlogPost[]): void {
  const blogPostsData: BlogPostsData = {
    version: "1.0.0",
    lastUpdated: new Date().toISOString(),
    posts
  }
  localStorage.setItem("temp_blog_posts_data", JSON.stringify(blogPostsData))
}

/**
 * Get blog posts from localStorage if admin made changes, otherwise from JSON
 */
export async function getBlogPostsHybrid(): Promise<BlogPost[]> {
  // Check if admin has made temporary changes
  if (typeof window !== "undefined") {
    const tempData = localStorage.getItem("temp_blog_posts_data")
    if (tempData) {
      try {
        const data: BlogPostsData = JSON.parse(tempData)
        return data.posts
      } catch (error) {
        console.error("Error parsing temp blog posts data:", error)
      }
    }
  }
  
  // Otherwise get from JSON
  return await fetchBlogPostsFromJSON()
}

/**
 * Generate blog posts JSON export for admin
 */
export function generateBlogPostsJSON(posts: BlogPost[]): string {
  const blogPostsData: BlogPostsData = {
    version: "1.0.0",
    lastUpdated: new Date().toISOString(),
    posts
  }
  return JSON.stringify(blogPostsData, null, 2)
}
