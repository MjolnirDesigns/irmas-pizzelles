import { Switch, Route } from "wouter";
import { lazy, Suspense } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/lib/cart-context";
import { CommerceCartProvider } from "@/commerce/cart";
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
import VariantIndex from "@/variants/index";
import { AtelierHome, AtelierShop, AtelierDetail } from "@/variants/atelier/AtelierPages";
import { HeritageHome, HeritageShop, HeritageDetail } from "@/variants/heritage/HeritagePages";
import { ExperienceShop, ExperienceDetail } from "@/variants/experience/ExperiencePages";
import VariantCheckout from "@/variants/checkout";
import OrderConfirmation from "@/variants/confirmation";
import AdminOrders from "@/variants/admin";

const ExperienceHome = lazy(() => import("@/variants/experience/ExperienceHome"));

function OriginalRouter() {
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

function OriginalSite() {
  return (
    <>
      <Snowfall />
      <div className="min-h-screen flex flex-col bg-background">
        <PromoBanner />
        <Header />
        <div className="flex-1">
          <OriginalRouter />
        </div>
        <Footer />
        <CartSlideOver />
      </div>
    </>
  );
}

function ExperienceFallback() {
  return <div className="min-h-screen bg-[#100e0c]" aria-hidden />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <CartProvider>
          <CommerceCartProvider>
            <TooltipProvider>
              <Switch>
                <Route path="/v" component={VariantIndex} />
                <Route path="/v/atelier" component={AtelierHome} />
                <Route path="/v/atelier/shop" component={AtelierShop} />
                <Route path="/v/atelier/checkout">{() => <VariantCheckout variant="atelier" />}</Route>
                <Route path="/v/atelier/p/:flavor" component={AtelierDetail} />
                <Route path="/v/heritage" component={HeritageHome} />
                <Route path="/v/heritage/shop" component={HeritageShop} />
                <Route path="/v/heritage/checkout">{() => <VariantCheckout variant="heritage" />}</Route>
                <Route path="/v/heritage/p/:flavor" component={HeritageDetail} />
                <Route path="/v/experience">
                  {() => (
                    <Suspense fallback={<ExperienceFallback />}>
                      <ExperienceHome />
                    </Suspense>
                  )}
                </Route>
                <Route path="/v/experience/shop" component={ExperienceShop} />
                <Route path="/v/experience/checkout">{() => <VariantCheckout variant="experience" />}</Route>
                <Route path="/v/experience/p/:flavor" component={ExperienceDetail} />
                <Route path="/v/checkout">{() => <VariantCheckout variant="atelier" />}</Route>
                <Route path="/v/order/:orderNumber" component={OrderConfirmation} />
                <Route path="/v/admin" component={AdminOrders} />
                <Route component={OriginalSite} />
              </Switch>
              <Toaster />
            </TooltipProvider>
          </CommerceCartProvider>
        </CartProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
