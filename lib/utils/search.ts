import type { Recipe } from "../data/mockRecipes"

export interface SearchResult {
  recipe: Recipe
  score: number
}

export function searchRecipes(recipes: Recipe[], query: string): SearchResult[] {
  if (!query.trim()) return recipes.map((recipe) => ({ recipe, score: 1 }))

  const searchTerms = query
    .toLowerCase()
    .split(" ")
    .filter((term) => term.length > 0)

  const results = recipes.map((recipe) => {
    let score = 0
    const searchableText = [recipe.title, recipe.description, recipe.category, ...recipe.tags, ...recipe.ingredients]
      .join(" ")
      .toLowerCase()

    searchTerms.forEach((term) => {
      if (recipe.title.toLowerCase().includes(term)) score += 10
      if (recipe.description.toLowerCase().includes(term)) score += 5
      if (recipe.category.toLowerCase().includes(term)) score += 3
      if (recipe.tags.some((tag) => tag.toLowerCase().includes(term))) score += 3
      if (recipe.ingredients.some((ingredient) => ingredient.toLowerCase().includes(term))) score += 2
      if (searchableText.includes(term)) score += 1
    })

    return { recipe, score }
  })

  return results.filter((result) => result.score > 0).sort((a, b) => b.score - a.score)
}

export function getPopularSearchTerms(): string[] {
  return ["borš", "kartulisalat", "pannkoogid", "supp", "magustoit", "liha", "kala", "salat"]
}

export function getAutocompleteSuggestions(query: string, recipes: Recipe[]): string[] {
  if (!query.trim()) return []

  const suggestions = new Set<string>()
  const queryLower = query.toLowerCase()

  recipes.forEach((recipe) => {
    if (recipe.title.toLowerCase().includes(queryLower)) {
      suggestions.add(recipe.title)
    }
    recipe.tags.forEach((tag) => {
      if (tag.toLowerCase().includes(queryLower)) {
        suggestions.add(tag)
      }
    })
  })

  return Array.from(suggestions).slice(0, 5)
}
