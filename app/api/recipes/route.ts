import { type NextRequest, NextResponse } from "next/server"
import { mockRecipes, type Recipe } from "@/lib/data/mockRecipes"
import { verifyToken } from "@/lib/utils/auth"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const category = searchParams.get("category")
    const difficulty = searchParams.get("difficulty")
    const authorId = searchParams.get("authorId")

    let filteredRecipes = [...mockRecipes]

    // Apply filters
    if (category) {
      filteredRecipes = filteredRecipes.filter((recipe) => recipe.category.toLowerCase() === category.toLowerCase())
    }
    if (difficulty) {
      filteredRecipes = filteredRecipes.filter((recipe) => recipe.difficulty === difficulty)
    }
    if (authorId) {
      filteredRecipes = filteredRecipes.filter((recipe) => recipe.authorId === authorId)
    }

    // Pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedRecipes = filteredRecipes.slice(startIndex, endIndex)

    return NextResponse.json({
      recipes: paginatedRecipes,
      pagination: {
        page,
        limit,
        total: filteredRecipes.length,
        totalPages: Math.ceil(filteredRecipes.length / limit),
      },
    })
  } catch (error) {
    console.error("Recipes list error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
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

    const recipeData = await request.json()
    const { title, description, ingredients, instructions, cookingTime, difficulty, servings, category, tags } =
      recipeData

    // Validation
    if (
      !title ||
      !description ||
      !ingredients ||
      !instructions ||
      !cookingTime ||
      !difficulty ||
      !servings ||
      !category
    ) {
      return NextResponse.json({ error: "All required fields must be provided" }, { status: 400 })
    }

    if (!Array.isArray(ingredients) || !Array.isArray(instructions)) {
      return NextResponse.json({ error: "Ingredients and instructions must be arrays" }, { status: 400 })
    }

    if (!["easy", "medium", "hard"].includes(difficulty)) {
      return NextResponse.json({ error: "Difficulty must be easy, medium, or hard" }, { status: 400 })
    }

    // Create new recipe
    const newRecipe: Recipe = {
      id: (mockRecipes.length + 1).toString(),
      title,
      description,
      ingredients,
      instructions,
      cookingTime: Number.parseInt(cookingTime),
      difficulty,
      servings: Number.parseInt(servings),
      category,
      tags: tags || [],
      authorId: payload.userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      imageUrl: recipeData.imageUrl,
    }

    mockRecipes.push(newRecipe)

    return NextResponse.json(
      {
        message: "Recipe created successfully",
        recipe: newRecipe,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Recipe creation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
