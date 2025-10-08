'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { Clock, Users, Star, Crown, Search } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface Recipe {
  id: number;
  title: string;
  description: string;
  authorId: number;
  authorName: string;
  cookingTime: number;
  servings: number;
  difficulty: string;
  category: string;
  averageRating: number;
  ratingCount: number;
  imageUrl?: string;
  createdAt: string;
  isPremium?: boolean;
}

export default function RecipesPage() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'free' | 'premium'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Get the search query from URL params
    const urlQuery = searchParams.get('q');
    if (urlQuery) {
      setSearchQuery(urlQuery);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/recipes?limit=100');
      if (!response.ok) {
        throw new Error('Failed to fetch recipes');
      }
      const data = await response.json();
      setRecipes(data.recipes || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <section className="bg-gradient-to-br from-primary/10 to-secondary/20 py-16">
          <div className="container mx-auto px-4">
            <div className="mb-4">
              <Button variant="ghost" asChild className="hover:bg-background/50">
                <Link href="/">← Tagasi Avalehele</Link>
              </Button>
            </div>
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Kõik Retseptid
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-6">
                Laen retsepte...
              </p>
              
              {/* Filter Tabs Skeleton */}
              <div className="flex justify-center gap-2 mt-6">
                <Skeleton className="h-10 w-[100px]" />
                <Skeleton className="h-10 w-[100px]" />
                <Skeleton className="h-10 w-[140px]" />
              </div>
            </div>
          </div>
        </section>
        <section className="py-16 bg-secondary/20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="overflow-hidden animate-pulse">
                  <Skeleton className="h-48 w-full" />
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-2/3" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-1/2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <section className="bg-gradient-to-br from-primary/10 to-secondary/20 py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Kõik Retseptid
            </h1>
          </div>
        </section>
        <section className="py-16 bg-secondary/20">
          <div className="container mx-auto px-4">
            <Card className="border-destructive max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="text-destructive">Viga</CardTitle>
                <CardDescription>{error}</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>
      </div>
    );
  }

  // Filter recipes based on selected filter and search query
  const filteredRecipes = recipes.filter(recipe => {
    // Apply premium filter
    const passesFilter = 
      filter === 'all' ? true :
      filter === 'free' ? !recipe.isPremium :
      filter === 'premium' ? recipe.isPremium :
      true;
    
    // Apply search filter
    const passesSearch = searchQuery.trim() === '' ? true :
      recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.authorName.toLowerCase().includes(searchQuery.toLowerCase());
    
    return passesFilter && passesSearch;
  });

  return (
    <>
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/10 to-secondary/20 py-16">
          <div className="container mx-auto px-4">
            <div className="mb-4">
              <Button variant="ghost" asChild className="hover:bg-background/50">
                <Link href="/">← Tagasi Avalehele</Link>
              </Button>
            </div>
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Kõik Retseptid
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-6">
                Avasta {recipes.length} maitsvat retsepti meie kogukonnast
              </p>
              
              {/* Search Bar */}
              <div className="max-w-2xl mx-auto mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Otsi retsepte nime, kirjelduse, kategooria või autori järgi..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-6 text-lg bg-background/80 backdrop-blur-sm"
                  />
                </div>
              </div>
              
              {/* Filter Tabs */}
              <div className="flex justify-center gap-2 mt-6">
                <Button
                  variant={filter === 'all' ? 'default' : 'outline'}
                  onClick={() => setFilter('all')}
                  className="min-w-[100px]"
                >
                  Kõik ({recipes.length})
                </Button>
                <Button
                  variant={filter === 'free' ? 'default' : 'outline'}
                  onClick={() => setFilter('free')}
                  className="min-w-[100px]"
                >
                  Tasuta ({recipes.filter(r => !r.isPremium).length})
                </Button>
                <Button
                  variant={filter === 'premium' ? 'default' : 'outline'}
                  onClick={() => setFilter('premium')}
                  className="min-w-[100px] bg-amber-500 hover:bg-amber-600 text-white border-amber-500"
                  style={filter === 'premium' ? {} : { backgroundColor: 'transparent', color: 'inherit' }}
                >
                  <Crown className="h-4 w-4 mr-1" />
                  Premium ({recipes.filter(r => r.isPremium).length})
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Recipes Grid Section */}
        <section className="py-16 bg-secondary/20">
          <div className="container mx-auto px-4">
            {/* Results Count */}
            <div className="mb-6 text-center text-muted-foreground">
              {searchQuery && (
                <p className="text-lg">
                  Leitud <span className="font-bold text-foreground">{filteredRecipes.length}</span> retsepti päringule "{searchQuery}"
                </p>
              )}
            </div>

            {filteredRecipes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredRecipes.map((recipe) => (
                  <Card key={recipe.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    {recipe.imageUrl && (
                      <div className="relative h-48 w-full overflow-hidden bg-muted">
                        <img
                          src={recipe.imageUrl}
                          alt={recipe.title}
                          className="object-cover w-full h-full"
                        />
                        {recipe.isPremium && (
                          <div className="absolute top-2 right-2">
                            <Badge className="bg-amber-500 text-white gap-1">
                              <Crown className="h-3 w-3" />
                              Premium
                            </Badge>
                          </div>
                        )}
                      </div>
                    )}
                    <CardHeader>
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="line-clamp-2">{recipe.title}</CardTitle>
                        <Badge variant="secondary">{recipe.category}</Badge>
                      </div>
                      <CardDescription className="line-clamp-2">
                        {recipe.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{recipe.cookingTime} min</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>{recipe.servings} servings</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{recipe.averageRating?.toFixed(1) || '0.0'}</span>
                          <span className="text-sm text-muted-foreground">
                            ({recipe.ratingCount || 0})
                          </span>
                        </div>
                        <Badge variant="outline">{recipe.difficulty}</Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground">
                        by {recipe.authorName}
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button asChild className="w-full">
                        <Link href={`/recipes/${recipe.id}`}>View Recipe</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="max-w-2xl mx-auto">
                <CardHeader>
                  <CardTitle>
                    {searchQuery ? 'Otsingu tulemusi ei leitud' : 
                     filter === 'premium' ? 'Premiumi retsepte ei leitud' : 'Retsepte ei leitud'}
                  </CardTitle>
                  <CardDescription>
                    {searchQuery ? (
                      <>
                        Päringule "<strong>{searchQuery}</strong>" ei leitud ühtegi retsepti. 
                        Proovi teist otsingut või tühjenda filter!
                      </>
                    ) : (
                      filter === 'premium' 
                        ? 'Pole veel premiumi retsepte saadaval. Proovi teist filtrit!'
                        : 'Proovi teist filtrit või vaata hiljem uuesti!'
                    )}
                  </CardDescription>
                </CardHeader>
                {searchQuery && (
                  <CardFooter>
                    <Button 
                      onClick={() => setSearchQuery('')} 
                      variant="outline"
                      className="w-full"
                    >
                      Tühjenda otsing
                    </Button>
                  </CardFooter>
                )}
              </Card>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
