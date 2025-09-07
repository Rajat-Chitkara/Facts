export interface Fact {
  id: string
  text: string
  category: string
  isTrue?: boolean
  approved?: boolean
  submittedBy?: string
  createdAt?: string
  source?: string
  verified?: boolean
  tags?: string[]
}

export interface SubmittedFact {
  id: string
  text: string
  category: string
  submittedBy: string
  approved: boolean
  createdAt: string
  source?: string
}

export interface BlogPost {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string
  coverImage?: string
  published: boolean
  createdAt: string
  updatedAt?: string
  tags?: string[]
  author?: string
}

export interface AboutUsContent {
  title: string
  content: string
  updatedAt: string
}

export interface Category {
  id: string
  name: string
  description: string
  color: string
  gradient: string
}

export interface FactsData {
  version: string
  lastUpdated: string
  facts: Fact[]
}

export interface CategoriesData {
  version: string
  lastUpdated: string
  categories: Category[]
}

export interface SubmissionsData {
  version: string
  lastUpdated: string
  submissions: SubmittedFact[]
}

export interface BlogPostsData {
  version: string
  lastUpdated: string
  posts: BlogPost[]
}
