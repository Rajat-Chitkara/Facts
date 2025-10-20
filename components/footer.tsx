import Link from "next/link"
import { FaReddit } from "react-icons/fa"

export function Footer() {
  return (
    <footer className="mt-8 sm:mt-10 md:mt-12 py-4 sm:py-5 md:py-6 border-t">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center text-center">
          <p className="text-xs sm:text-sm md:text-base text-muted-foreground mb-3 sm:mb-4 px-4">Join our community to discover and share more interesting facts</p>
          <Link
            href="https://www.reddit.com/r/UselessBtInteresting/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 sm:gap-2 text-foreground hover:text-primary transition-colors"
          >
            <FaReddit className="h-5 w-5 sm:h-6 sm:w-6 text-[#FF4500]" />
            <span className="font-medium text-sm sm:text-base">r/UselessBtInteresting</span>
          </Link>
          <p className="text-xs text-muted-foreground mt-4 sm:mt-5 md:mt-6">
            © {new Date().getFullYear()} UselessButInteresting. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
