import Link from "next/link"
import { FaReddit } from "react-icons/fa"

export function Footer() {
  return (
    <footer className="mt-12 py-6 border-t">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center text-center">
          <p className="text-muted-foreground mb-4">Join our community to discover and share more interesting facts</p>
          <Link
            href="https://www.reddit.com/r/UselessBtInteresting/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
          >
            <FaReddit className="h-6 w-6 text-[#FF4500]" />
            <span className="font-medium">r/UselessBtInteresting</span>
          </Link>
          <p className="text-xs text-muted-foreground mt-6">
            © {new Date().getFullYear()} UselessButInteresting. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
