"use client"

import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Share2 } from "lucide-react"
import { FaReddit, FaTwitter, FaFacebook, FaWhatsapp, FaLink } from "react-icons/fa"
import { toast } from "@/components/ui/use-toast"
import type { Fact } from "@/lib/types"

interface ShareButtonsProps {
  fact: Fact
  compact?: boolean
}

export function ShareButtons({ fact, compact = false }: ShareButtonsProps) {
  const shareFact = (platform?: string) => {
    if (!fact) return

    const factText = `${fact.text} - UselessButInteresting`
    const url = window.location.href

    let shareUrl = ""

    switch (platform) {
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(factText)}&url=${encodeURIComponent(url)}`
        break
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(factText)}`
        break
      case "reddit":
        shareUrl = `https://www.reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(factText)}`
        break
      case "whatsapp":
        shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(factText + " " + url)}`
        break
      case "copy":
        navigator.clipboard.writeText(factText + " " + url)
        toast({
          title: "Link copied!",
          description: "The fact has been copied to your clipboard.",
        })
        return
      default:
        // Use Web Share API if available
        if (navigator.share) {
          navigator
            .share({
              title: "Check out this interesting fact!",
              text: fact.text,
              url: url,
            })
            .catch((err) => {
              console.error("Error sharing:", err)
            })
          return
        } else {
          // Fallback if no platform specified and Web Share API not available
          navigator.clipboard.writeText(factText + " " + url)
          toast({
            title: "Link copied!",
            description: "The fact has been copied to your clipboard.",
          })
          return
        }
    }

    // Open share URL in a new window
    if (shareUrl) {
      window.open(shareUrl, "_blank", "noopener,noreferrer")
    }
  }

  if (compact) {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon">
            <Share2 className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-2">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              onClick={() => shareFact("twitter")}
            >
              <FaTwitter className="h-4 w-4 text-[#1DA1F2]" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              onClick={() => shareFact("facebook")}
            >
              <FaFacebook className="h-4 w-4 text-[#4267B2]" />
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-1" onClick={() => shareFact("reddit")}>
              <FaReddit className="h-4 w-4 text-[#FF4500]" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              onClick={() => shareFact("whatsapp")}
            >
              <FaWhatsapp className="h-4 w-4 text-[#25D366]" />
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-1" onClick={() => shareFact("copy")}>
              <FaLink className="h-4 w-4" />
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    )
  }

  return (
    <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t">
      <p className="text-xs sm:text-sm text-muted-foreground mb-2">Share this fact:</p>
      <div className="flex flex-wrap gap-1.5 sm:gap-2">
        <Button variant="outline" size="sm" className="flex items-center gap-1 h-8 sm:h-9 px-2 sm:px-3" onClick={() => shareFact("twitter")}>
          <FaTwitter className="h-3 w-3 sm:h-4 sm:w-4 text-[#1DA1F2]" />
          <span className="sr-only sm:not-sr-only sm:text-xs">Twitter</span>
        </Button>
        <Button variant="outline" size="sm" className="flex items-center gap-1 h-8 sm:h-9 px-2 sm:px-3" onClick={() => shareFact("facebook")}>
          <FaFacebook className="h-3 w-3 sm:h-4 sm:w-4 text-[#4267B2]" />
          <span className="sr-only sm:not-sr-only sm:text-xs">Facebook</span>
        </Button>
        <Button variant="outline" size="sm" className="flex items-center gap-1 h-8 sm:h-9 px-2 sm:px-3" onClick={() => shareFact("reddit")}>
          <FaReddit className="h-3 w-3 sm:h-4 sm:w-4 text-[#FF4500]" />
          <span className="sr-only sm:not-sr-only sm:text-xs">Reddit</span>
        </Button>
        <Button variant="outline" size="sm" className="flex items-center gap-1 h-8 sm:h-9 px-2 sm:px-3" onClick={() => shareFact("whatsapp")}>
          <FaWhatsapp className="h-3 w-3 sm:h-4 sm:w-4 text-[#25D366]" />
          <span className="sr-only sm:not-sr-only sm:text-xs">WhatsApp</span>
        </Button>
        <Button variant="outline" size="sm" className="flex items-center gap-1 h-8 sm:h-9 px-2 sm:px-3" onClick={() => shareFact("copy")}>
          <FaLink className="h-3 w-3 sm:h-4 sm:w-4" />
          <span className="sr-only sm:not-sr-only sm:text-xs">Copy Link</span>
        </Button>
      </div>
    </div>
  )
}
