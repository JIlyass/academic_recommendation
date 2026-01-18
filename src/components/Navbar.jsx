import {Link} from "react-router-dom"
import { Button } from "@/components/ui/button"
import { BookOpen, Menu, X } from "lucide-react"
import { useState } from "react"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Left: Logo and Title */}
          <Link to="/" className="flex items-center gap-3">
            <div className="flex items-center justify-center rounded-lg bg-primary p-2">
              <BookOpen className="size-6 text-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-xl font-bold text-foreground">Academic</span>
              <span className="font-serif text-xs font-semibold text-muted-foreground">Recommendation</span>
            </div>
          </Link>

          {/* Center/Right: Navigation Links - Desktop */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-sm font-medium text-foreground transition-colors hover:text-primary">
              Home
            </Link>
            <Link to="/predict" className="text-sm font-medium text-foreground transition-colors hover:text-primary">
              Predict your speciality with AI
            </Link>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" asChild>
                <Link to="/AuthPage">Login</Link>
              </Button>
              <Button size="sm" asChild>
                <Link to="/AuthPage">Sign in</Link>
              </Button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-accent"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden border-t border-border pb-4 pt-4 space-y-3">
            <Link
              to="/"
              className="block px-4 py-2 text-sm font-medium text-foreground hover:bg-accent rounded-lg transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/predict"
              className="block px-4 py-2 text-sm font-medium text-foreground hover:bg-accent rounded-lg transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Predict your specialty by IA
            </Link>
            <div className="flex gap-2 px-4">
              <Button variant="outline" size="sm" className="flex-1 bg-transparent" asChild>
                <Link to="/AuthPage">Login</Link>
              </Button>
              <Button size="sm" className="flex-1" asChild>
                <Link to="/AuthPage">Sign in</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
