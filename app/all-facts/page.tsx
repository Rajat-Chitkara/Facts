import type { Metadata } from "next"
import AllFactsExplorer from "@/components/all-facts-explorer"

export const metadata: Metadata = {
  title: "All Facts | UselessButInteresting",
  description: "Browse and search all interesting facts in our collection.",
}

export default function AllFactsPage() {
  return (
    <div className="min-h-screen bg-background">
      <AllFactsExplorer />
    </div>
  )
}
