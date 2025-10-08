import { NextResponse } from "next/server"
import { mockRatings } from "@/lib/data/mockRatings"

export async function GET() {
  try {
    const totalRatings = mockRatings.length
    const averageRating = totalRatings > 0 ? mockRatings.reduce((sum, r) => sum + r.rating, 0) / totalRatings : 0

    const ratingDistribution = {
      1: mockRatings.filter((r) => r.rating === 1).length,
      2: mockRatings.filter((r) => r.rating === 2).length,
      3: mockRatings.filter((r) => r.rating === 3).length,
      4: mockRatings.filter((r) => r.rating === 4).length,
      5: mockRatings.filter((r) => r.rating === 5).length,
    }

    const ratingsWithComments = mockRatings.filter((r) => r.comment && r.comment.trim().length > 0).length

    return NextResponse.json({
      totalRatings,
      averageRating: Math.round(averageRating * 10) / 10,
      ratingDistribution,
      ratingsWithComments,
    })
  } catch (error) {
    console.error("Rating stats error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
