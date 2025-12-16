import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Lock, ChefHat, Clock, Users, BookOpen, Star, ArrowRight } from 'lucide-react';
import { getQueryFn } from '@/lib/queryClient';

interface RecipeAccessResponse {
  hasAccess: boolean;
  message?: string;
  user?: { firstName: string };
}

const familyRecipes = [
  {
    id: 1,
    title: "Nonna Irma's Original Vanilla Pizzelles",
    description: "The original family recipe that started it all. Light, crispy, and perfectly flavored with pure Madagascar vanilla.",
    difficulty: "Intermediate",
    time: "45 min",
    servings: "24 cookies",
    featured: true,
  },
  {
    id: 2,
    title: "Traditional Anise Pizzelles",
    description: "A beloved Italian classic with the warm, aromatic flavor of anise seed that pairs perfectly with espresso.",
    difficulty: "Intermediate",
    time: "45 min",
    servings: "24 cookies",
    featured: false,
  },
  {
    id: 3,
    title: "Pizzelle Cannoli Cups",
    description: "Transform pizzelles into edible cups filled with sweet ricotta cream and chocolate chips.",
    difficulty: "Advanced",
    time: "1 hr 15 min",
    servings: "12 cups",
    featured: false,
  },
  {
    id: 4,
    title: "Pizzelle Ice Cream Sandwiches",
    description: "A summer favorite - fresh pizzelles sandwiched with your favorite gelato.",
    difficulty: "Easy",
    time: "30 min",
    servings: "6 sandwiches",
    featured: false,
  },
];

function LoginPrompt() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full"
      >
        <Card className="text-center" data-testid="card-recipe-login-prompt">
          <CardHeader className="pb-4">
            <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Lock className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="font-serif text-2xl">Exclusive Family Recipes</CardTitle>
            <CardDescription className="font-body-serif text-base">
              Our cherished family recipes are available exclusively to registered members of the Irma's family.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground font-body-serif">
              Create a free account to unlock access to Nonna Irma's original recipes, baking tips, and exclusive content.
            </p>
            <div className="space-y-3 pt-4">
              <Button 
                className="w-full gap-2" 
                onClick={() => setLocation('/account')}
                data-testid="button-sign-in-recipes"
              >
                Sign In to Access Recipes
                <ArrowRight className="h-4 w-4" />
              </Button>
              <p className="text-sm text-muted-foreground">
                Don't have an account?{' '}
                <button 
                  onClick={() => setLocation('/account')}
                  className="text-primary hover:underline font-medium"
                  data-testid="link-create-account"
                >
                  Create one for free
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

function RecipeContent({ userName }: { userName?: string }) {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 md:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">
              <Star className="h-3 w-3 mr-1" />
              Member Exclusive
            </Badge>
            <h1 className="font-serif text-3xl md:text-4xl font-bold mb-4" data-testid="text-recipes-title">
              {userName ? `Welcome back, ${userName}!` : 'Family Recipes'}
            </h1>
            <p className="font-body-serif text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover the treasured recipes passed down through four generations of the Irma family. Each recipe comes with detailed instructions, tips, and the stories behind them.
            </p>
          </div>

          {/* Featured Recipe */}
          <Card className="mb-12 overflow-hidden" data-testid="card-featured-recipe">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="bg-gradient-to-br from-primary/20 to-primary/5 p-8 lg:p-12 flex items-center justify-center">
                <div className="text-center">
                  <ChefHat className="h-24 w-24 mx-auto text-primary mb-4" />
                  <Badge>Featured Recipe</Badge>
                </div>
              </div>
              <CardContent className="p-8 lg:p-12">
                <CardTitle className="font-serif text-2xl mb-4">
                  {familyRecipes[0].title}
                </CardTitle>
                <p className="text-muted-foreground font-body-serif mb-6">
                  {familyRecipes[0].description}
                </p>
                <div className="flex flex-wrap gap-4 mb-6">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{familyRecipes[0].time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{familyRecipes[0].servings}</span>
                  </div>
                  <Badge variant="outline">{familyRecipes[0].difficulty}</Badge>
                </div>
                <Button className="gap-2" data-testid="button-view-featured-recipe">
                  <BookOpen className="h-4 w-4" />
                  View Full Recipe
                </Button>
              </CardContent>
            </div>
          </Card>

          <Separator className="mb-12" />

          {/* Recipe Grid */}
          <h2 className="font-serif text-2xl font-bold mb-8">More Family Recipes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {familyRecipes.slice(1).map((recipe) => (
              <Card key={recipe.id} className="hover-elevate cursor-pointer" data-testid={`card-recipe-${recipe.id}`}>
                <CardHeader>
                  <div className="h-32 rounded-md bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center mb-4">
                    <ChefHat className="h-12 w-12 text-primary/50" />
                  </div>
                  <CardTitle className="font-serif text-lg">{recipe.title}</CardTitle>
                  <CardDescription className="font-body-serif">
                    {recipe.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3 mb-4">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{recipe.time}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Users className="h-3 w-3" />
                      <span>{recipe.servings}</span>
                    </div>
                  </div>
                  <Badge variant="outline">{recipe.difficulty}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Coming Soon */}
          <Card className="mt-12 bg-muted/50" data-testid="card-coming-soon">
            <CardContent className="py-8 text-center">
              <h3 className="font-serif text-xl font-semibold mb-2">More Recipes Coming Soon</h3>
              <p className="text-muted-foreground font-body-serif">
                We're constantly adding new recipes from the family archives. Check back soon for holiday specials, seasonal variations, and more!
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

export default function Recipes() {
  const { data, isLoading, isError } = useQuery<RecipeAccessResponse | null>({
    queryKey: ['/api/recipes/access'],
    queryFn: getQueryFn({ on401: 'returnNull' }),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (isError || !data?.hasAccess) {
    return <LoginPrompt />;
  }

  return <RecipeContent userName={data.user?.firstName} />;
}
