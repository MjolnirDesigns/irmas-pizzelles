import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/lib/cart-context";
import { ThemeProvider } from "@/lib/theme-context";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PromoBanner from "@/components/PromoBanner";
import CartSlideOver from "@/components/CartSlideOver";
import Snowfall from "@/components/Snowfall";
import Home from "@/pages/home";
import Shop from "@/pages/shop";
import About from "@/pages/about";
import FAQ from "@/pages/faq";
import Waitlist from "@/pages/waitlist";
import Checkout from "@/pages/checkout";
import Account from "@/pages/account";
import Nutrition from "@/pages/nutrition";
import Recipes from "@/pages/recipes";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/shop" component={Shop} />
      <Route path="/about" component={About} />
      <Route path="/faq" component={FAQ} />
      <Route path="/waitlist" component={Waitlist} />
      <Route path="/checkout" component={Checkout} />
      <Route path="/account" component={Account} />
      <Route path="/nutrition" component={Nutrition} />
      <Route path="/recipes" component={Recipes} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <CartProvider>
          <TooltipProvider>
            <Snowfall />
            <div className="min-h-screen flex flex-col bg-background">
              <PromoBanner />
              <Header />
              <div className="flex-1">
                <Router />
              </div>
              <Footer />
              <CartSlideOver />
            </div>
            <Toaster />
          </TooltipProvider>
        </CartProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
