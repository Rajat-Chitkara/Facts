import type { Metadata } from "next"
import AboutUsPage from "@/components/about-us-page"

export const metadata: Metadata = {
  title: "About Us | UselessButInteresting",
  description: "Learn more about UselessButInteresting and our mission to share fascinating facts.",
}

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-background">
      <AboutUsPage />
    </div>
  )
}
