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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Check, ImageIcon } from "lucide-react"
import { getAboutUsContent, updateAboutUsContent } from "@/lib/data"

const aboutUsSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters." }),
  content: z.string().min(50, { message: "Content must be at least 50 characters." }),
})

export default function AboutUsEditor() {
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  const form = useForm<z.infer<typeof aboutUsSchema>>({
    resolver: zodResolver(aboutUsSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  })

  // Load content on component mount
  useEffect(() => {
    loadContent()
  }, [])

  const loadContent = () => {
    setIsLoading(true)
    try {
      const aboutUsContent = getAboutUsContent()
      form.reset({
        title: aboutUsContent.title,
        content: aboutUsContent.content,
      })
    } catch (error) {
      console.error("Error loading about us content:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const insertImage = () => {
    const imageUrl = prompt("Enter image URL:")
    if (!imageUrl) return

    const imageHtml = `<div class="my-4"><img src="${imageUrl}" alt="About us image" class="rounded-lg max-w-full h-auto" /></div>`
    const content = form.getValues("content")
    form.setValue("content", content + imageHtml)
  }

  const onSubmit = async (values: z.infer<typeof aboutUsSchema>) => {
    setIsSubmitting(true)
    try {
      updateAboutUsContent({
        title: values.title,
        content: values.content,
      })
      alert("About Us content updated successfully!")
    } catch (error) {
      console.error("Error saving content:", error)
      alert("Failed to save content")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading content...</span>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit About Us Page</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="edit" className="mb-6">
          <TabsList>
            <TabsTrigger value="edit" onClick={() => setPreviewMode(false)}>
              Edit
            </TabsTrigger>
            <TabsTrigger value="preview" onClick={() => setPreviewMode(true)}>
              Preview
            </TabsTrigger>
          </TabsList>
          <TabsContent value="edit">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Page Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter page title" {...field} />
                      </FormControl>
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
                        <Button type="button" variant="outline" size="sm" onClick={insertImage}>
                          <ImageIcon className="h-4 w-4 mr-1" />
                          Add Image
                        </Button>
                      </div>
                      <FormControl>
                        <Textarea
                          placeholder="Write your about us content here. You can use HTML for formatting."
                          className="min-h-[400px] font-mono text-sm"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        You can use HTML tags for formatting. Use the button above to add images.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </TabsContent>
          <TabsContent value="preview">
            <div className="border rounded-lg p-6">
              <h1 className="text-3xl font-bold mb-4">{form.getValues("title")}</h1>
              <div
                className="prose dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: form.getValues("content") }}
                ref={contentRef}
              />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
