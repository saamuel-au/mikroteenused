'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Crown, Mail, Calendar, BookOpen, Star, ChefHat } from 'lucide-react';
import Link from 'next/link';

interface Recipe {
  id: string;
  title: string;
  description: string;
  category: string;
  imageUrl?: string;
  isPremium?: boolean;
  cookingTime: number;
  difficulty: string;
}

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [userRecipes, setUserRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    } else if (user) {
      fetchUserRecipes();
    }
  }, [user, authLoading]);

  const fetchUserRecipes = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/recipes?authorId=${user?.id}&limit=100`);
      if (response.ok) {
        const data = await response.json();
        setUserRecipes(data.recipes || []);
      }
    } catch (error) {
      console.error('Failed to fetch user recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-background">
        <section className="bg-gradient-to-br from-primary/10 to-secondary/20 py-12">
          <div className="container mx-auto px-4">
            <Skeleton className="h-10 w-64 mx-auto mb-2" />
            <Skeleton className="h-6 w-48 mx-auto" />
          </div>
        </section>
        <section className="py-12 bg-secondary/20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <Skeleton className="h-48 w-full mb-8 rounded-lg" />
              <Skeleton className="h-64 w-full rounded-lg" />
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/10 to-secondary/20 py-12">
          <div className="container mx-auto px-4">
            <div className="mb-4">
              <Button variant="ghost" asChild className="hover:bg-background/50">
                <Link href="/">← Tagasi Avalehele</Link>
              </Button>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground text-center mb-2">
              Minu Profiil
            </h1>
            <p className="text-muted-foreground text-center">
              Halda oma kontot ja retsepte
            </p>
          </div>
        </section>

        {/* Profile Content Section */}
        <section className="py-12 bg-secondary/20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-start gap-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="text-2xl">
                  {user.name?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold">{user.name}</h1>
                  {user.isPremium && (
                    <Badge className="bg-amber-500 text-white gap-1">
                      <Crown className="h-4 w-4" />
                      Premium Member
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center gap-4 text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <Mail className="h-4 w-4" />
                    <span className="text-sm">{user.email}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">Member since 2024</span>
                  </div>
                </div>

                {user.bio && (
                  <p className="text-muted-foreground">{user.bio}</p>
                )}
              </div>

              <Button variant="outline">Edit Profile</Button>
            </div>
          </CardHeader>
        </Card>

        {/* Subscription Status */}
        {!user.isPremium && (
          <Card className="mb-8 border-amber-500 bg-amber-50 dark:bg-amber-950/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Crown className="h-5 w-5 text-amber-500" />
                    Upgrade to Premium
                  </CardTitle>
                  <CardDescription>
                    Unlock exclusive recipes and premium features
                  </CardDescription>
                </div>
                <Button className="bg-amber-500 hover:bg-amber-600">
                  <Crown className="h-4 w-4 mr-2" />
                  Upgrade Now - $9.99/month
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-amber-500" />
                  <span>Exclusive recipes</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-amber-500" />
                  <span>Chef tips & tricks</span>
                </div>
                <div className="flex items-center gap-2">
                  <ChefHat className="h-4 w-4 text-amber-500" />
                  <span>Video guides</span>
                </div>
                <div className="flex items-center gap-2">
                  <Crown className="h-4 w-4 text-amber-500" />
                  <span>Priority support</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Separator className="my-8" />

        {/* User's Recipes */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">My Recipes</h2>
            <Button>
              <ChefHat className="h-4 w-4 mr-2" />
              Add New Recipe
            </Button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <Card key={i}>
                  <Skeleton className="h-48 w-full" />
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                  </CardHeader>
                </Card>
              ))}
            </div>
          ) : userRecipes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userRecipes.map((recipe) => (
                <Card key={recipe.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  {recipe.imageUrl && (
                    <div className="relative h-48 w-full overflow-hidden bg-muted">
                      <img
                        src={recipe.imageUrl}
                        alt={recipe.title}
                        className="object-cover w-full h-full"
                      />
                      {recipe.isPremium && (
                        <Badge className="absolute top-2 right-2 bg-amber-500 text-white gap-1">
                          <Crown className="h-3 w-3" />
                          Premium
                        </Badge>
                      )}
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="line-clamp-2">{recipe.title}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {recipe.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{recipe.cookingTime} min</span>
                      <Badge variant="outline">{recipe.difficulty}</Badge>
                    </div>
                  </CardContent>
                  <div className="px-6 pb-4">
                    <Button asChild variant="outline" className="w-full">
                      <Link href={`/recipes/${recipe.id}`}>View Recipe</Link>
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>No recipes yet</CardTitle>
                <CardDescription>
                  Start sharing your culinary creations with the community!
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button>
                  <ChefHat className="h-4 w-4 mr-2" />
                  Create Your First Recipe
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
