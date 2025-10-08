export interface Rating {
  id: string
  recipeId: string
  userId: string
  rating: number
  comment?: string
  createdAt: string
  updatedAt: string
}

export const mockRatings: Rating[] = [
  {
    id: "1",
    recipeId: "1",
    userId: "2",
    rating: 5,
    comment: "Suurepärane retsept! Täpselt nagu vanaema tegi.",
    createdAt: "2024-01-16T12:00:00.000Z",
    updatedAt: "2024-01-16T12:00:00.000Z",
  },
  {
    id: "2",
    recipeId: "1",
    userId: "1",
    rating: 4,
    comment: "Väga maitsev, aga võiks natuke vähem soolane olla.",
    createdAt: "2024-01-17T15:30:00.000Z",
    updatedAt: "2024-01-17T15:30:00.000Z",
  },
  {
    id: "3",
    recipeId: "2",
    userId: "3",
    rating: 5,
    comment: "Klassikaline eesti roog! Alati õnnestub.",
    createdAt: "2024-01-21T10:45:00.000Z",
    updatedAt: "2024-01-21T10:45:00.000Z",
  },
  {
    id: "4",
    recipeId: "3",
    userId: "2",
    rating: 4,
    comment: "Lapsed armastavad! Lihtne ja kiire teha.",
    createdAt: "2024-01-26T09:20:00.000Z",
    updatedAt: "2024-01-26T09:20:00.000Z",
  },
]
