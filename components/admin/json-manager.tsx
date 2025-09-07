"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Download, Upload, RefreshCw, FileJson, AlertCircle, CheckCircle } from "lucide-react"
import { exportFactsJSON, exportBlogPostsJSON, clearFactsCache, clearBlogCache, previewFactsChanges, previewBlogChanges, getStoredFactsSync, getStoredBlogPostsSync } from "@/lib/data"

export default function JSONManager() {
  const [factsJSON, setFactsJSON] = useState("")
  const [blogPostsJSON, setBlogPostsJSON] = useState("")
  const [hasFactsChanges, setHasFactsChanges] = useState(false)
  const [hasBlogChanges, setHasBlogChanges] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Check for pending changes on mount
  useEffect(() => {
    setHasFactsChanges(previewFactsChanges())
    setHasBlogChanges(previewBlogChanges())
    generateJSON()
  }, [])

  const generateJSON = () => {
    setIsLoading(true)
    try {
      const factsJson = exportFactsJSON()
      const blogJson = exportBlogPostsJSON()
      setFactsJSON(factsJson)
      setBlogPostsJSON(blogJson)
    } catch (error) {
      console.error("Error generating JSON:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const downloadFactsJSON = () => {
    const blob = new Blob([factsJSON], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "facts.json"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const downloadBlogJSON = () => {
    const blob = new Blob([blogPostsJSON], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "blog-posts.json"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const copyFactsToClipboard = () => {
    navigator.clipboard.writeText(factsJSON)
  }

  const copyBlogToClipboard = () => {
    navigator.clipboard.writeText(blogPostsJSON)
  }

  const clearCache = () => {
    clearFactsCache()
    clearBlogCache()
    setHasFactsChanges(false)
    setHasBlogChanges(false)
    generateJSON()
  }

  const refreshJSON = () => {
    generateJSON()
    setHasFactsChanges(previewFactsChanges())
    setHasBlogChanges(previewBlogChanges())
  }

  const getCurrentFactsCount = () => {
    try {
      const facts = getStoredFactsSync()
      return facts.length
    } catch {
      return 0
    }
  }

  const getCurrentBlogPostsCount = () => {
    try {
      const posts = getStoredBlogPostsSync()
      return posts.length
    } catch {
      return 0
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">JSON File Manager</h2>
          <p className="text-muted-foreground">
            Export your facts data to update the JSON files in your repository
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={hasFactsChanges ? "destructive" : "secondary"}>
            {getCurrentFactsCount()} facts
          </Badge>
          <Badge variant={hasBlogChanges ? "destructive" : "secondary"}>
            {getCurrentBlogPostsCount()} blog posts
          </Badge>
          {(hasFactsChanges || hasBlogChanges) && (
            <Badge variant="destructive">
              Pending Changes
            </Badge>
          )}
        </div>
      </div>

      {(hasFactsChanges || hasBlogChanges) && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            You have pending changes that are currently only stored locally. Generate and update your JSON files to make them live for all users.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6">
        {/* Facts JSON Export */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileJson className="h-5 w-5" />
              Facts JSON Export
            </CardTitle>
            <CardDescription>
              Current facts data formatted for your data/facts.json file
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Button onClick={refreshJSON} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh All
              </Button>
              <Button onClick={downloadFactsJSON} size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download Facts
              </Button>
              <Button onClick={copyFactsToClipboard} variant="outline" size="sm">
                Copy Facts JSON
              </Button>
            </div>

            <Textarea
              value={factsJSON}
              readOnly
              placeholder="Generated facts JSON will appear here..."
              className="min-h-[200px] font-mono text-xs"
            />
          </CardContent>
        </Card>

        {/* Blog Posts JSON Export */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileJson className="h-5 w-5" />
              Blog Posts JSON Export
            </CardTitle>
            <CardDescription>
              Current blog posts data formatted for your data/blog-posts.json file
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Button onClick={downloadBlogJSON} size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download Blog Posts
              </Button>
              <Button onClick={copyBlogToClipboard} variant="outline" size="sm">
                Copy Blog JSON
              </Button>
            </div>

            <Textarea
              value={blogPostsJSON}
              readOnly
              placeholder="Generated blog posts JSON will appear here..."
              className="min-h-[200px] font-mono text-xs"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Deployment Instructions</CardTitle>
            <CardDescription>
              How to update your live data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center">
                  1
                </div>
                <div>
                  <p className="font-medium">Generate JSON</p>
                  <p className="text-sm text-muted-foreground">
                    Click "Refresh" to get the latest facts data as JSON
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center">
                  2
                </div>
                <div>
                  <p className="font-medium">Download or Copy</p>
                  <p className="text-sm text-muted-foreground">
                    Download the JSON file or copy the content to clipboard
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center">
                  3
                </div>
                <div>
                  <p className="font-medium">Update Repository</p>
                  <p className="text-sm text-muted-foreground">
                    Replace <code className="bg-muted px-1 rounded">data/facts.json</code> and <code className="bg-muted px-1 rounded">data/blog-posts.json</code> with the generated JSON files
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center">
                  4
                </div>
                <div>
                  <p className="font-medium">Deploy</p>
                  <p className="text-sm text-muted-foreground">
                    Commit and deploy your changes to make them live
                  </p>
                </div>
              </div>
            </div>

            {(hasFactsChanges || hasBlogChanges) && (
              <div className="pt-4 border-t">
                <Button 
                  onClick={clearCache} 
                  variant="outline" 
                  size="sm"
                  className="w-full"
                >
                  Clear All Pending Changes
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  This will reset both facts and blog posts to the original JSON data
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Hybrid System Overview</CardTitle>
          <CardDescription>
            How your facts are managed
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center p-4 border rounded-lg">
              <FileJson className="h-8 w-8 mx-auto mb-2 text-blue-500" />
              <h4 className="font-medium">JSON Files</h4>
              <p className="text-sm text-muted-foreground">
                Shared facts data that everyone sees
              </p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <Upload className="h-8 w-8 mx-auto mb-2 text-orange-500" />
              <h4 className="font-medium">Local Storage</h4>
              <p className="text-sm text-muted-foreground">
                User preferences and admin changes
              </p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
              <h4 className="font-medium">Best of Both</h4>
              <p className="text-sm text-muted-foreground">
                Shared data + local customization
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
