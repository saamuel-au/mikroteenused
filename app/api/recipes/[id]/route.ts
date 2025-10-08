import { type NextRequest, NextResponse } from "next/server"
import { mockRecipes } from "@/lib/data/mockRecipes"
import { verifyToken } from "@/lib/utils/auth"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const recipe = mockRecipes.find((r) => r.id === params.id)
    if (!recipe) {
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 })
    }

    return NextResponse.json(recipe)
  } catch (error) {
    console.error("Recipe fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Authorization token required" }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const recipeIndex = mockRecipes.findIndex((r) => r.id === params.id)
    if (recipeIndex === -1) {
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 })
    }

    const recipe = mockRecipes[recipeIndex]
    if (recipe.authorId !== payload.userId) {
      return NextResponse.json({ error: "Not authorized to update this recipe" }, { status: 403 })
    }

    const updateData = await request.json()
    const { title, description, ingredients, instructions, cookingTime, difficulty, servings, category, tags } =
      updateData

    // Validation
    if (difficulty && !["easy", "medium", "hard"].includes(difficulty)) {
      return NextResponse.json({ error: "Difficulty must be easy, medium, or hard" }, { status: 400 })
    }

    // Update recipe
    mockRecipes[recipeIndex] = {
      ...recipe,
      title: title || recipe.title,
      description: description || recipe.description,
      ingredients: ingredients || recipe.ingredients,
      instructions: instructions || recipe.instructions,
      cookingTime: cookingTime ? Number.parseInt(cookingTime) : recipe.cookingTime,
      difficulty: difficulty || recipe.difficulty,
      servings: servings ? Number.parseInt(servings) : recipe.servings,
      category: category || recipe.category,
      tags: tags || recipe.tags,
      imageUrl: updateData.imageUrl || recipe.imageUrl,
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json({
      message: "Recipe updated successfully",
      recipe: mockRecipes[recipeIndex],
    })
  } catch (error) {
    console.error("Recipe update error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Authorization token required" }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const recipeIndex = mockRecipes.findIndex((r) => r.id === params.id)
    if (recipeIndex === -1) {
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 })
    }

    const recipe = mockRecipes[recipeIndex]
    if (recipe.authorId !== payload.userId) {
      return NextResponse.json({ error: "Not authorized to delete this recipe" }, { status: 403 })
    }

    mockRecipes.splice(recipeIndex, 1)

    return NextResponse.json({ message: "Recipe deleted successfully" })
  } catch (error) {
    console.error("Recipe deletion error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
