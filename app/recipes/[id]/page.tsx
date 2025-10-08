'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  Clock, 
  Users, 
  Star, 
  ChefHat, 
  Calendar,
  Lock,
  Crown,
  CheckCircle2
} from 'lucide-react';
import Link from 'next/link';

interface Recipe {
  id: string;
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  cookingTime: number;
  servings: number;
  difficulty: string;
  category: string;
  tags: string[];
  authorId: string;
  authorName: string;
  imageUrl?: string;
  isPremium?: boolean;
  createdAt: string;
}

export default function RecipeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRecipe();
  }, [params.id]);

  const fetchRecipe = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/recipes/${params.id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch recipe');
      }
      const data = await response.json();
      setRecipe(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const canViewPremiumContent = () => {
    if (!recipe?.isPremium) return true;
    return user?.isPremium === true;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <section className="bg-gradient-to-br from-primary/10 to-secondary/20 py-6">
          <div className="container mx-auto px-4">
            <Button variant="ghost" onClick={() => router.back()} className="hover:bg-background/50">
              ← Tagasi
            </Button>
          </div>
        </section>
        <section className="py-12 bg-secondary/20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <Skeleton className="h-96 w-full mb-8 rounded-lg" />
              <Skeleton className="h-10 w-3/4 mb-4" />
              <Skeleton className="h-6 w-full mb-4" />
              <Skeleton className="h-6 w-2/3 mb-8" />
              <Skeleton className="h-64 w-full rounded-lg" />
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="min-h-screen bg-background">
        <section className="bg-gradient-to-br from-primary/10 to-secondary/20 py-6">
          <div className="container mx-auto px-4">
            <Button variant="ghost" onClick={() => router.back()} className="hover:bg-background/50">
              ← Tagasi
            </Button>
          </div>
        </section>
        <section className="py-12 bg-secondary/20">
          <div className="container mx-auto px-4">
            <Alert variant="destructive" className="max-w-2xl mx-auto">
              <AlertTitle>Viga</AlertTitle>
              <AlertDescription>{error || 'Retsepti ei leitud'}</AlertDescription>
            </Alert>
          </div>
        </section>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-background">
        {/* Back Button Section */}
        <section className="bg-gradient-to-br from-primary/10 to-secondary/20 py-6">
          <div className="container mx-auto px-4">
            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => router.back()} className="hover:bg-background/50">
                ← Tagasi
              </Button>
              <Button variant="ghost" asChild className="hover:bg-background/50">
                <Link href="/">🏠 Avaleht</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Recipe Content Section */}
        <section className="py-12 bg-secondary/20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="relative mb-8">
          {recipe.imageUrl && (
            <div className="relative h-96 w-full overflow-hidden rounded-lg mb-4">
              <img
                src={recipe.imageUrl}
                alt={recipe.title}
                className="object-cover w-full h-full"
              />
              {recipe.isPremium && (
                <div className="absolute top-4 right-4">
                  <Badge className="bg-amber-500 text-white gap-1">
                    <Crown className="h-3 w-3" />
                    Premium
                  </Badge>
                </div>
              )}
            </div>
          )}
          
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">{recipe.title}</h1>
              <p className="text-xl text-muted-foreground">{recipe.description}</p>
            </div>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              {recipe.category}
            </Badge>
          </div>

          {/* Recipe Meta */}
          <div className="flex flex-wrap gap-6 text-muted-foreground mb-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              <span>{recipe.cookingTime} minutes</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              <span>{recipe.servings} servings</span>
            </div>
            <div className="flex items-center gap-2">
              <ChefHat className="h-5 w-5" />
              <span className="capitalize">{recipe.difficulty}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              <span>{new Date(recipe.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {recipe.tags.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>

          {/* Author */}
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">By</span>
            <span className="font-medium">{recipe.authorName}</span>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Premium Content Gate */}
        {recipe.isPremium && !canViewPremiumContent() ? (
          <Card className="border-amber-500 bg-amber-50 dark:bg-amber-950/20">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Crown className="h-6 w-6 text-amber-500" />
                <CardTitle>Premium Recipe</CardTitle>
              </div>
              <CardDescription>
                This is a premium recipe. Upgrade to view the full ingredients and instructions.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <h3 className="font-semibold flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  Premium benefits include:
                </h3>
                <ul className="list-disc list-inside space-y-1 ml-6 text-sm text-muted-foreground">
                  <li>Access to exclusive premium recipes</li>
                  <li>Detailed cooking instructions</li>
                  <li>Professional chef tips and tricks</li>
                  <li>Step-by-step video guides (coming soon)</li>
                  <li>Download recipes as PDF</li>
                </ul>
              </div>
              
              <div className="flex gap-4">
                {!user ? (
                  <>
                    <Button asChild className="flex-1">
                      <Link href="/login">Sign In to Upgrade</Link>
                    </Button>
                    <Button variant="outline" asChild className="flex-1">
                      <Link href="/recipes">Browse Free Recipes</Link>
                    </Button>
                  </>
                ) : (
                  <>
                    <Button className="flex-1 bg-amber-500 hover:bg-amber-600">
                      <Crown className="h-4 w-4 mr-2" />
                      Upgrade to Premium - $9.99/month
                    </Button>
                    <Button variant="outline" asChild className="flex-1">
                      <Link href="/recipes">Browse Free Recipes</Link>
                    </Button>
                  </>
                )}
              </div>

              {/* Preview */}
              <div className="mt-6 p-4 bg-background rounded-lg border">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Preview (Limited)
                </h4>
                <div className="text-sm text-muted-foreground blur-sm select-none">
                  <p>Ingredients: {recipe.ingredients.slice(0, 2).join(', ')}...</p>
                  <p className="mt-2">Instructions: {recipe.instructions[0]}...</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          /* Full Recipe Content */
          <div className="space-y-8">
            {/* Ingredients */}
            <Card>
              <CardHeader>
                <CardTitle>Ingredients</CardTitle>
                <CardDescription>
                  Everything you need for {recipe.servings} servings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {recipe.ingredients.map((ingredient, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{ingredient}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Instructions */}
            <Card>
              <CardHeader>
                <CardTitle>Instructions</CardTitle>
                <CardDescription>
                  Follow these steps to create this delicious dish
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ol className="space-y-4">
                  {recipe.instructions.map((instruction, index) => (
                    <li key={index} className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                        {index + 1}
                      </div>
                      <p className="pt-1">{instruction}</p>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>

            {/* Success Message for Premium Users */}
            {recipe.isPremium && canViewPremiumContent() && (
              <Alert className="bg-amber-50 dark:bg-amber-950/20 border-amber-500">
                <Crown className="h-4 w-4 text-amber-500" />
                <AlertTitle>Premium Member</AlertTitle>
                <AlertDescription>
                  Thank you for being a premium member! Enjoy exclusive access to this recipe.
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
