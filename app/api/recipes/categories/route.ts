import { NextResponse } from "next/server"
import { mockRecipes } from "@/lib/data/mockRecipes"

export async function GET() {
  try {
    const categories = [...new Set(mockRecipes.map((recipe) => recipe.category))]
    const categoriesWithCounts = categories.map((category) => ({
      name: category,
      count: mockRecipes.filter((recipe) => recipe.category === category).length,
    }))

    return NextResponse.json({ categories: categoriesWithCounts })
  } catch (error) {
    console.error("Categories fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
