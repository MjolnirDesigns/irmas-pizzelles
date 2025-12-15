import { Link } from 'wouter';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { SiFacebook, SiInstagram, SiPinterest } from 'react-icons/si';

function ItalianFlag() {
  return (
    <div className="flex h-6 w-9 rounded-sm overflow-hidden shadow-sm" data-testid="icon-italian-flag">
      <div className="w-1/3 bg-italian-green" />
      <div className="w-1/3 bg-italian-white" />
      <div className="w-1/3 bg-italian-red" />
    </div>
  );
}

function AmericanFlag() {
  return (
    <div className="flex flex-col h-6 w-9 rounded-sm overflow-hidden shadow-sm" data-testid="icon-american-flag">
      <div className="flex-1 flex">
        <div className="w-2/5 bg-american-blue flex items-center justify-center">
          <div className="grid grid-cols-3 gap-px">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="w-0.5 h-0.5 rounded-full bg-white" />
            ))}
          </div>
        </div>
        <div className="w-3/5 flex flex-col">
          <div className="flex-1 bg-american-red" />
          <div className="flex-1 bg-white" />
          <div className="flex-1 bg-american-red" />
        </div>
      </div>
      <div className="h-1/3 flex flex-col">
        <div className="flex-1 bg-white" />
        <div className="flex-1 bg-american-red" />
      </div>
    </div>
  );
}

function HeritageStripe() {
  return (
    <div className="flex items-center justify-center gap-3 py-4" data-testid="heritage-stripe">
      <ItalianFlag />
      <div className="flex items-center gap-2">
        <div className="h-px w-8 bg-italian-green/30" />
        <span className="text-xs font-body-serif italic text-muted-foreground">From Italy to America</span>
        <div className="h-px w-8 bg-american-red/30" />
      </div>
      <AmericanFlag />
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="bg-card border-t">
      <div className="w-full bg-gradient-to-r from-italian-green/5 via-transparent to-italian-red/5">
        <HeritageStripe />
      </div>
      
      <div className="container mx-auto px-6 md:px-8 pt-12 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <h3 className="font-serif text-xl font-bold mb-4" data-testid="footer-brand">Irma's Pizzelles</h3>
            <p className="font-body-serif text-muted-foreground text-base leading-relaxed">
              Handcrafted with love using traditional Italian recipes passed down through generations.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/shop" className="font-body-serif text-muted-foreground hover:text-foreground transition-colors" data-testid="footer-link-shop">
                  Shop
                </Link>
              </li>
              <li>
                <Link href="/about" className="font-body-serif text-muted-foreground hover:text-foreground transition-colors" data-testid="footer-link-about">
                  Our Story
                </Link>
              </li>
              <li>
                <Link href="/faq" className="font-body-serif text-muted-foreground hover:text-foreground transition-colors" data-testid="footer-link-faq">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="font-body-serif text-muted-foreground hover:text-foreground transition-colors" data-testid="footer-link-contact">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Newsletter</h4>
            <p className="font-body-serif text-muted-foreground text-sm mb-3">
              Subscribe for updates and special offers.
            </p>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="Your email"
                className="flex-1"
                data-testid="input-newsletter-email"
              />
              <Button data-testid="button-newsletter-submit">Join</Button>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Follow Us</h4>
            <div className="flex gap-4">
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Facebook"
                data-testid="link-facebook"
              >
                <SiFacebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Instagram"
                data-testid="link-instagram"
              >
                <SiInstagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Pinterest"
                data-testid="link-pinterest"
              >
                <SiPinterest className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <Separator className="mb-8" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p className="font-body-serif" data-testid="text-copyright">&copy; {new Date().getFullYear()} Irma's Pizzelles. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="font-body-serif hover:text-foreground transition-colors" data-testid="link-privacy">
              Privacy Policy
            </Link>
            <Link href="/terms" className="font-body-serif hover:text-foreground transition-colors" data-testid="link-terms">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
