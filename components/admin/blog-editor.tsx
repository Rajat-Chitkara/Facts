"use client"

import { useState, useEffect, useRef } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Search, Edit, Trash2, Plus, Check, ImageIcon, FileVideo, Link } from 'lucide-react'
import { getStoredBlogPosts, getStoredBlogPostsSync, createBlogPost, updateBlogPost, deleteBlogPost, createSlug } from "@/lib/data"
import type { BlogPost } from "@/lib/types"

const blogPostSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters." }),
  slug: z.string().min(3, { message: "Slug must be at least 3 characters." }),
  excerpt: z.string().min(10, { message: "Excerpt must be at least 10 characters." }).max(200, { message: "Excerpt must be less than 200 characters." }),
  content: z.string().min(50, { message: "Content must be at least 50 characters." }),
  coverImage: z.string().optional(),
  published: z.boolean().default(false),
})

export default function BlogEditor() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)
  const editorRef = useRef<HTMLDivElement>(null)

  const form = useForm<z.infer<typeof blogPostSchema>>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: {
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      coverImage: "",
      published: false,
    },
  })

  // Load posts on component mount
  useEffect(() => {
    loadPosts()
  }, [])

  // Update form when selected post changes
  useEffect(() => {
    if (selectedPost) {
      form.reset({
        title: selectedPost.title,
        slug: selectedPost.slug,
        excerpt: selectedPost.excerpt,
        content: selectedPost.content,
        coverImage: selectedPost.coverImage || "",
        published: selectedPost.published,
      })
    }
  }, [selectedPost, form])

  const loadPosts = async () => {
    setIsLoading(true)
    try {
      const loadedPosts = await getStoredBlogPosts()
      setPosts(loadedPosts)
    } catch (error) {
      console.error("Error loading posts:", error)
      // Fallback to sync version
      const syncPosts = getStoredBlogPostsSync()
      setPosts(syncPosts)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSelectPost = (post: BlogPost) => {
    setSelectedPost(post)
    setIsEditing(true)
    setPreviewMode(false)
  }

  const handleAddNew = () => {
    setSelectedPost(null)
    form.reset({
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      coverImage: "",
      published: false,
    })
    setIsEditing(true)
    setPreviewMode(false)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setSelectedPost(null)
    setPreviewMode(false)
  }

  const handleDelete = async (postId: string) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return

    setIsSubmitting(true)
    try {
      deleteBlogPost(postId)
      setPosts(posts.filter((p) => p.id !== postId))
      setSelectedPost(null)
      setIsEditing(false)
    } catch (error) {
      console.error("Error deleting post:", error)
      alert("Failed to delete post")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>, onChange: (...event: any[]) => void) => {
    const title = e.target.value
    onChange(title)
    
    // Only auto-generate slug if it's a new post or if the slug field hasn't been manually edited
    if (!selectedPost || selectedPost.slug === form.getValues("slug")) {
      const slug = createSlug(title)
      form.setValue("slug", slug)
    }
  }

  const insertImage = () => {
    const imageUrl = prompt("Enter image URL:")
    if (!imageUrl) return

    const imageHtml = `<div class="my-4"><img src="${imageUrl}" alt="Blog image" class="rounded-lg max-w-full h-auto" /></div>`
    const content = form.getValues("content")
    form.setValue("content", content + imageHtml)
  }

  const insertVideo = () => {
    const videoUrl = prompt("Enter YouTube or video URL:")
    if (!videoUrl) return

    let videoHtml = ""
    if (videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be")) {
      // Extract YouTube ID
      const youtubeId = videoUrl.includes("v=") 
        ? videoUrl.split("v=")[1].split("&")[0]
        : videoUrl.split("/").pop()
      
      videoHtml = `<div class="my-4 aspect-video"><iframe width="100%" height="100%" src="https://www.youtube.com/embed/${youtubeId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`
    } else {
      videoHtml = `<div class="my-4 aspect-video"><video controls src="${videoUrl}" class="w-full h-full"></video></div>`
    }

    const content = form.getValues("content")
    form.setValue("content", content + videoHtml)
  }

  const onSubmit = async (values: z.infer<typeof blogPostSchema>) => {
    setIsSubmitting(true)
    try {
      if (!selectedPost) {
        // Add new post
        const newPost = createBlogPost({
          title: values.title,
          slug: values.slug,
          excerpt: values.excerpt,
          content: values.content,
          coverImage: values.coverImage,
          published: values.published,
        })

        setPosts([newPost, ...posts])
        setSelectedPost(newPost)
        alert("Blog post created successfully!")
      } else {
        // Update existing post
        const updatedPost = updateBlogPost(selectedPost.id, {
          title: values.title,
          slug: values.slug,
          excerpt: values.excerpt,
          content: values.content,
          coverImage: values.coverImage,
          published: values.published,
        })

        setPosts(posts.map((p) => (p.id === updatedPost.id ? updatedPost : p)))
        setSelectedPost(updatedPost)
        alert("Blog post updated successfully!")
      }
    } catch (error) {
      console.error("Error saving post:", error)
      alert("Failed to save post")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading blog posts...</span>
      </div>
    )
  }

  if (isEditing) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{selectedPost ? "Edit Blog Post" : "Create New Blog Post"}</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="edit" className="mb-6">
            <TabsList>
              <TabsTrigger value="edit" onClick={() => setPreviewMode(false)}>Edit</TabsTrigger>
              <TabsTrigger value="preview" onClick={() => setPreviewMode(true)}>Preview</TabsTrigger>
            </TabsList>
            <TabsContent value="edit">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter blog post title" 
                            {...field} 
                            onChange={(e) => handleTitleChange(e, field.onChange)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Slug</FormLabel>
                        <FormControl>
                          <Input placeholder="url-friendly-slug" {...field} />
                        </FormControl>
                        <FormDescription>
                          This will be used in the URL: /blog/your-slug
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="excerpt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Excerpt</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Brief summary of the blog post" 
                            className="h-20"
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          A short summary that will appear in blog listings
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="coverImage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cover Image URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://example.com/image.jpg" {...field} />
                        </FormControl>
                        <FormDescription>
                          URL to the main image for this blog post
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center justify-between mb-2">
                          <FormLabel>Content</FormLabel>
                          <div className="flex gap-2">
                            <Button 
                              type="button" 
                              variant="outline" 
                              size="sm"
                              onClick={insertImage}
                            >
                              <ImageIcon className="h-4 w-4 mr-1" />
                              Add Image
                            </Button>
                            <Button 
                              type="button" 
                              variant="outline" 
                              size="sm"
                              onClick={insertVideo}
                            >
                              <FileVideo className="h-4 w-4 mr-1" />
                              Add Video
                            </Button>
                          </div>
                        </div>
                        <FormControl>
                          <Textarea 
                            placeholder="Write your blog post content here. You can use HTML for formatting." 
                            className="min-h-[400px] font-mono text-sm"
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          You can use HTML tags for formatting. Use the buttons above to add images and videos.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="published"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Published</FormLabel>
                          <FormDescription>
                            Make this blog post visible to the public
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-between">
                    <Button type="button" variant="outline" onClick={handleCancel}>
                      Cancel
                    </Button>

                    <div className="flex space-x-2">
                      {selectedPost && (
                        <Button
                          type="button"
                          variant="destructive"
                          onClick={() => handleDelete(selectedPost.id)}
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4 mr-2" />
                          )}
                          Delete
                        </Button>
                      )}

                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Check className="h-4 w-4 mr-2" />
                            {selectedPost ? "Update" : "Create"}
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </form>
              </Form>
            </TabsContent>
            <TabsContent value="preview">
              <div className="border rounded-lg p-6">
                <h1 className="text-3xl font-bold mb-4">{form.getValues("title")}</h1>
                {form.getValues("coverImage") && (
                  <div className="mb-6">
                    <img 
                      src={form.getValues("coverImage") || "/placeholder.svg"} 
                      alt={form.getValues("title")}
                      className="rounded-lg max-w-full h-auto"
                    />
                  </div>
                )}
                <div 
                  className="prose dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: form.getValues("content") }}
                  ref={editorRef}
                />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search blog posts..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button onClick={handleAddNew}>
          <Plus className="h-4 w-4 mr-2" />
          Add New Post
        </Button>
      </div>

      {filteredPosts.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No blog posts found. Create your first post!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPosts.map((post) => (
            <Card
              key={post.id}
              className="hover:bg-muted/50 transition-colors cursor-pointer"
              onClick={() => handleSelectPost(post)}
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium">{post.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {new Date(post.createdAt).toLocaleDateString()} • 
                      {post.published ? (
                        <span className="text-green-600 dark:text-green-400 ml-1">Published</span>
                      ) : (
                        <span className="text-amber-600 dark:text-amber-400 ml-1">Draft</span>
                      )}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleSelectPost(post)
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
                <p className="line-clamp-2 text-sm">{post.excerpt}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
