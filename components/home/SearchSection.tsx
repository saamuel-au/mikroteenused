"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function SearchSection() {
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/recipes?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const popularSearches = ["borš", "kartulisalat", "pannkoogid", "supp", "magustoit"]

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-foreground mb-8">Otsi Oma Lemmikretsepte</h2>

          <form onSubmit={handleSearch} className="mb-8">
            <div className="flex gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Otsi retsepte..."
                className="flex-1 px-4 py-3 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <button
                type="submit"
                className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
              >
                Otsi
              </button>
            </div>
          </form>

          <div className="text-center">
            <p className="text-muted-foreground mb-4">Populaarsed otsingud:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {popularSearches.map((term) => (
                <button
                  key={term}
                  onClick={() => router.push(`/recipes?q=${encodeURIComponent(term)}`)}
                  className="bg-secondary text-secondary-foreground px-4 py-2 rounded-full text-sm hover:bg-secondary/80 transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
