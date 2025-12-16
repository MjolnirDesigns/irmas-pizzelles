import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Info, Leaf, Heart, AlertTriangle } from 'lucide-react';

const nutritionData = {
  servingSize: '2 cookies (28g)',
  servingsPerContainer: 6,
  calories: 110,
  nutrients: [
    { name: 'Total Fat', value: '3g', dailyValue: '4%', indent: false },
    { name: 'Saturated Fat', value: '1.5g', dailyValue: '8%', indent: true },
    { name: 'Trans Fat', value: '0g', dailyValue: '', indent: true },
    { name: 'Cholesterol', value: '25mg', dailyValue: '8%', indent: false },
    { name: 'Sodium', value: '45mg', dailyValue: '2%', indent: false },
    { name: 'Total Carbohydrate', value: '18g', dailyValue: '7%', indent: false },
    { name: 'Dietary Fiber', value: '0g', dailyValue: '0%', indent: true },
    { name: 'Total Sugars', value: '8g', dailyValue: '', indent: true },
    { name: 'Includes Added Sugars', value: '8g', dailyValue: '16%', indent: true, subIndent: true },
    { name: 'Protein', value: '2g', dailyValue: '', indent: false },
  ],
  vitamins: [
    { name: 'Vitamin D', value: '0mcg', dailyValue: '0%' },
    { name: 'Calcium', value: '10mg', dailyValue: '0%' },
    { name: 'Iron', value: '0.5mg', dailyValue: '2%' },
    { name: 'Potassium', value: '20mg', dailyValue: '0%' },
  ],
};

const ingredients = {
  vanilla: ['Enriched Flour (wheat flour, niacin, reduced iron, thiamine mononitrate, riboflavin, folic acid)', 'Sugar', 'Butter', 'Eggs', 'Pure Vanilla Extract', 'Baking Powder', 'Salt'],
  anise: ['Enriched Flour (wheat flour, niacin, reduced iron, thiamine mononitrate, riboflavin, folic acid)', 'Sugar', 'Butter', 'Eggs', 'Anise Seed', 'Anise Extract', 'Baking Powder', 'Salt'],
  cinnamon: ['Enriched Flour (wheat flour, niacin, reduced iron, thiamine mononitrate, riboflavin, folic acid)', 'Brown Sugar', 'Butter', 'Eggs', 'Cinnamon', 'Vanilla Extract', 'Baking Powder', 'Salt'],
  chocolate: ['Enriched Flour (wheat flour, niacin, reduced iron, thiamine mononitrate, riboflavin, folic acid)', 'Sugar', 'Butter', 'Premium Cocoa Powder', 'Eggs', 'Vanilla Extract', 'Baking Powder', 'Salt'],
};

const allergens = ['Wheat', 'Eggs', 'Milk'];

export default function Nutrition() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 md:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-12">
            <h1 className="font-serif text-3xl md:text-4xl font-bold mb-4" data-testid="text-nutrition-title">
              Nutrition Facts
            </h1>
            <p className="font-body-serif text-lg text-muted-foreground max-w-2xl mx-auto">
              We believe in transparency. Here's everything you need to know about what goes into our handcrafted pizzelles.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Nutrition Facts Panel */}
            <Card className="overflow-hidden" data-testid="card-nutrition-facts">
              <CardHeader className="bg-foreground text-background">
                <CardTitle className="text-2xl font-bold">Nutrition Facts</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="p-4 border-b-8 border-foreground">
                  <p className="text-sm">
                    <span className="font-semibold">{nutritionData.servingsPerContainer} servings per container</span>
                  </p>
                  <div className="flex justify-between items-end mt-2">
                    <p className="font-semibold">Serving size</p>
                    <p className="font-semibold">{nutritionData.servingSize}</p>
                  </div>
                </div>

                <div className="p-4 border-b border-foreground">
                  <p className="text-sm font-bold">Amount per serving</p>
                  <div className="flex justify-between items-center">
                    <p className="text-3xl font-bold">Calories</p>
                    <p className="text-3xl font-bold">{nutritionData.calories}</p>
                  </div>
                </div>

                <div className="p-4">
                  <p className="text-right text-sm font-semibold mb-2">% Daily Value*</p>
                  
                  {nutritionData.nutrients.map((nutrient, index) => (
                    <div key={index}>
                      <div className={`flex justify-between py-1 ${nutrient.indent ? 'pl-4' : ''} ${nutrient.subIndent ? 'pl-8' : ''}`}>
                        <span className={nutrient.indent && !nutrient.subIndent ? '' : 'font-semibold'}>
                          {nutrient.name} {nutrient.value}
                        </span>
                        <span className="font-semibold">{nutrient.dailyValue}</span>
                      </div>
                      {!nutrient.indent && <Separator />}
                    </div>
                  ))}

                  <div className="border-t-8 border-foreground pt-2 mt-2">
                    {nutritionData.vitamins.map((vitamin, index) => (
                      <div key={index} className="flex justify-between py-1">
                        <span>{vitamin.name} {vitamin.value}</span>
                        <span>{vitamin.dailyValue}</span>
                      </div>
                    ))}
                  </div>

                  <p className="text-xs mt-4 text-muted-foreground">
                    * The % Daily Value tells you how much a nutrient in a serving of food contributes to a daily diet. 2,000 calories a day is used for general nutrition advice.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Ingredients & Allergens */}
            <div className="space-y-6">
              <Card data-testid="card-ingredients">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Leaf className="h-5 w-5 text-primary" />
                    Ingredients by Flavor
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(ingredients).map(([flavor, items]) => (
                    <div key={flavor}>
                      <h4 className="font-semibold capitalize mb-2">{flavor} Pizzelles</h4>
                      <p className="text-sm text-muted-foreground font-body-serif">
                        {items.join(', ')}.
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card data-testid="card-allergens">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                    Allergen Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground font-body-serif mb-4">
                    Our pizzelles are made in a facility that processes the following allergens:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {allergens.map((allergen) => (
                      <Badge key={allergen} variant="outline" className="text-destructive border-destructive">
                        Contains: {allergen}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mt-4 font-body-serif">
                    Please contact us if you have specific dietary concerns or questions about our ingredients.
                  </p>
                </CardContent>
              </Card>

              <Card data-testid="card-quality">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-primary" />
                    Our Quality Promise
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-muted-foreground font-body-serif">
                    <li className="flex items-start gap-2">
                      <Info className="h-4 w-4 mt-1 text-primary flex-shrink-0" />
                      <span>No artificial preservatives or colors</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Info className="h-4 w-4 mt-1 text-primary flex-shrink-0" />
                      <span>Made with real butter and pure extracts</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Info className="h-4 w-4 mt-1 text-primary flex-shrink-0" />
                      <span>Small-batch production for freshness</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Info className="h-4 w-4 mt-1 text-primary flex-shrink-0" />
                      <span>Traditional recipes passed down through generations</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
