"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"

interface Recipe {
  id: string
  title: string
  description: string
  cookingTime: number
  difficulty: string
  category: string
  imageUrl?: string
}

export default function FeaturedRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        console.log("[v0] Starting direct fetch to /api/recipes")
        const response = await fetch("/api/recipes?limit=6", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })

        console.log("[v0] Response status:", response.status)
        console.log("[v0] Response ok:", response.ok)

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        console.log("[v0] Fetched data:", data)
        console.log("[v0] Recipes array:", data.recipes)

        setRecipes(data.recipes || [])
      } catch (error) {
        console.error("[v0] Error fetching recipes:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchRecipes()
  }, [])

  if (loading) {
    return (
      <section className="py-16 bg-secondary/20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">Populaarsed Retseptid</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-card rounded-lg shadow-md overflow-hidden animate-pulse">
                <div className="h-48 bg-muted"></div>
                <div className="p-6">
                  <div className="h-6 bg-muted rounded mb-2"></div>
                  <div className="h-4 bg-muted rounded mb-4"></div>
                  <div className="flex justify-between">
                    <div className="h-4 bg-muted rounded w-20"></div>
                    <div className="h-4 bg-muted rounded w-16"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  console.log("[v0] Rendering recipes, count:", recipes.length)

  return (
    <section className="py-16 bg-secondary/20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-foreground mb-12">Populaarsed Retseptid</h2>

        {recipes.length === 0 ? (
          <div className="text-center text-muted-foreground">
            <p>Retsepte ei leitud</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recipes.map((recipe) => (
              <Link
                key={recipe.id}
                href={`/recipes/${recipe.id}`}
                className="bg-card rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative h-48">
                  <Image
                    src={recipe.imageUrl || "/placeholder.svg?height=200&width=300"}
                    alt={recipe.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-foreground mb-2">{recipe.title}</h3>
                  <p className="text-muted-foreground mb-4 line-clamp-2">{recipe.description}</p>
                  <div className="flex justify-between items-center text-sm text-muted-foreground">
                    <span>{recipe.cookingTime} min</span>
                    <span className="capitalize">{recipe.difficulty}</span>
                    <span>{recipe.category}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Link
            href="/recipes"
            className="bg-primary text-primary-foreground px-8 py-3 rounded-lg text-lg font-semibold hover:bg-primary/90 transition-colors"
          >
            Vaata Kõiki Retsepte
          </Link>
        </div>
      </div>
    </section>
  )
}
