import { NextResponse } from "next/server"
import { mockRecipes } from "@/lib/data/mockRecipes"

export async function GET() {
  try {
    const categories = [...new Set(mockRecipes.map((recipe) => recipe.category))]
    const difficulties = ["easy", "medium", "hard"]
    const cookingTimeRanges = [
      { label: "Kuni 30 min", min: 0, max: 30 },
      { label: "30-60 min", min: 30, max: 60 },
      { label: "1-2 tundi", min: 60, max: 120 },
      { label: "Üle 2 tunni", min: 120, max: 999 },
    ]

    const tags = [...new Set(mockRecipes.flatMap((recipe) => recipe.tags))]

    return NextResponse.json({
      categories,
      difficulties,
      cookingTimeRanges,
      tags,
    })
  } catch (error) {
    console.error("Search filters error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
