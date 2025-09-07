"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, LogOut, CheckCircle, XCircle } from "lucide-react"
import { getStoredSubmissions, approveFact, rejectFact, checkAdminPassword, DEFAULT_ADMIN_PASSWORD } from "@/lib/data"
import type { SubmittedFact } from "@/lib/types"
import FactEditor from "./fact-editor"
import BlogEditor from "./blog-editor"
import AboutUsEditor from "./about-us-editor"
import JSONManager from "./json-manager"

export default function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [loginError, setLoginError] = useState("")
  const [pendingFacts, setPendingFacts] = useState<SubmittedFact[]>([])
  const [isProcessing, setIsProcessing] = useState<Record<string, boolean>>({})

  // Check if user is authenticated
  useEffect(() => {
    // Initialize admin password if not set
    if (typeof window !== "undefined" && !localStorage.getItem("admin_password")) {
      localStorage.setItem("admin_password", DEFAULT_ADMIN_PASSWORD)
    }
    setIsLoading(false)
  }, [])

  // Load pending facts when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadPendingFacts()
    }
  }, [isAuthenticated])

  const loadPendingFacts = () => {
    try {
      const submissions = getStoredSubmissions()
      setPendingFacts(submissions)
    } catch (error) {
      console.error("Error loading pending facts:", error)
    }
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError("")

    try {
      const isValid = checkAdminPassword(password)

      if (isValid) {
        setIsAuthenticated(true)
      } else {
        throw new Error("Invalid password")
      }
    } catch (error: any) {
      setLoginError(error.message || "Failed to login")
    }
  }

  // Update the handleLogout function to use window.location.href
  const handleLogout = () => {
    setIsAuthenticated(false)
    setPassword("")
    window.location.href = "/"
  }

  const handleApproveFact = (factId: string) => {
    setIsProcessing((prev) => ({ ...prev, [factId]: true }))
    try {
      approveFact(factId)
      setPendingFacts(pendingFacts.filter((fact) => fact.id !== factId))
    } catch (error) {
      console.error("Error approving fact:", error)
      alert("Failed to approve fact")
    } finally {
      setIsProcessing((prev) => ({ ...prev, [factId]: false }))
    }
  }

  const handleRejectFact = (factId: string) => {
    setIsProcessing((prev) => ({ ...prev, [factId]: true }))
    try {
      rejectFact(factId)
      setPendingFacts(pendingFacts.filter((fact) => fact.id !== factId))
    } catch (error) {
      console.error("Error rejecting fact:", error)
      alert("Failed to reject fact")
    } finally {
      setIsProcessing((prev) => ({ ...prev, [factId]: false }))
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Admin Login</CardTitle>
            <CardDescription>Login to manage facts and submissions</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {loginError && (
                <div className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3 rounded-md text-sm">
                  {loginError}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="password">Admin Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Login
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => (window.location.href = "/")}>
            Back to Home
          </Button>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      <Tabs defaultValue="pending">
        <TabsList className="mb-6">
          <TabsTrigger value="pending">Pending Submissions</TabsTrigger>
          <TabsTrigger value="manage">Manage Facts</TabsTrigger>
          <TabsTrigger value="add">Add New Fact</TabsTrigger>
          <TabsTrigger value="json">JSON Manager</TabsTrigger>
          <TabsTrigger value="blog">Manage Blog</TabsTrigger>
          <TabsTrigger value="about">About Us</TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          <Card>
            <CardHeader>
              <CardTitle>Pending Fact Submissions</CardTitle>
              <CardDescription>Review and approve or reject user-submitted facts</CardDescription>
            </CardHeader>
            <CardContent>
              {pendingFacts.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No pending submissions</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {pendingFacts.map((fact) => (
                    <div key={fact.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-medium">{fact.category}</h3>
                          <p className="text-sm text-muted-foreground">
                            Submitted by {fact.submittedBy} on {new Date(fact.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-green-600 border-green-600 hover:bg-green-100 dark:hover:bg-green-900/30"
                            onClick={() => handleApproveFact(fact.id)}
                            disabled={isProcessing[fact.id]}
                          >
                            {isProcessing[fact.id] ? (
                              <Loader2 className="h-4 w-4 animate-spin mr-1" />
                            ) : (
                              <CheckCircle className="h-4 w-4 mr-1" />
                            )}
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 border-red-600 hover:bg-red-100 dark:hover:bg-red-900/30"
                            onClick={() => handleRejectFact(fact.id)}
                            disabled={isProcessing[fact.id]}
                          >
                            {isProcessing[fact.id] ? (
                              <Loader2 className="h-4 w-4 animate-spin mr-1" />
                            ) : (
                              <XCircle className="h-4 w-4 mr-1" />
                            )}
                            Reject
                          </Button>
                        </div>
                      </div>
                      <p className="mb-2">{fact.text}</p>
                      {fact.source && (
                        <p className="text-sm text-muted-foreground">
                          Source:{" "}
                          <a
                            href={fact.source}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            {fact.source}
                          </a>
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manage">
          <FactEditor />
        </TabsContent>

        <TabsContent value="add">
          <Card>
            <CardHeader>
              <CardTitle>Add New Fact</CardTitle>
              <CardDescription>Create a new fact to add to the database</CardDescription>
            </CardHeader>
            <CardContent>
              <FactEditor isAddMode />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="json">
          <JSONManager />
        </TabsContent>

        <TabsContent value="blog">
          <Card>
            <CardHeader>
              <CardTitle>Manage Blog Posts</CardTitle>
              <CardDescription>Create, edit, and publish blog posts</CardDescription>
            </CardHeader>
            <CardContent>
              <BlogEditor />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="about">
          <Card>
            <CardHeader>
              <CardTitle>Edit About Us Page</CardTitle>
              <CardDescription>Update the content of your About Us page</CardDescription>
            </CardHeader>
            <CardContent>
              <AboutUsEditor />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
