import { NextResponse } from "next/server"
import { mockRecipes } from "@/lib/data/mockRecipes"

export async function GET() {
  try {
    const totalRecipes = mockRecipes.length
    const categories = [...new Set(mockRecipes.map((recipe) => recipe.category))].length
    const difficulties = {
      easy: mockRecipes.filter((recipe) => recipe.difficulty === "easy").length,
      medium: mockRecipes.filter((recipe) => recipe.difficulty === "medium").length,
      hard: mockRecipes.filter((recipe) => recipe.difficulty === "hard").length,
    }

    const averageCookingTime = Math.round(
      mockRecipes.reduce((sum, recipe) => sum + recipe.cookingTime, 0) / totalRecipes,
    )

    return NextResponse.json({
      totalRecipes,
      totalCategories: categories,
      difficulties,
      averageCookingTime,
    })
  } catch (error) {
    console.error("Recipe stats error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
