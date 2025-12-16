import { Link } from 'wouter';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SiFacebook, SiInstagram, SiPinterest, SiTiktok, SiX } from 'react-icons/si';
import { Mail, ArrowRight } from 'lucide-react';

function TruthSocialIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-6h2v6zm4 0h-2v-6h2v6zm0-8H9V7h6v2z"/>
    </svg>
  );
}

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

const socialLinks = [
  { name: 'Facebook', icon: SiFacebook, href: '#', testId: 'link-facebook' },
  { name: 'Instagram', icon: SiInstagram, href: '#', testId: 'link-instagram' },
  { name: 'Pinterest', icon: SiPinterest, href: '#', testId: 'link-pinterest' },
  { name: 'TikTok', icon: SiTiktok, href: '#', testId: 'link-tiktok' },
  { name: 'Truth Social', icon: TruthSocialIcon, href: '#', testId: 'link-truth-social' },
  { name: 'X', icon: SiX, href: '#', testId: 'link-x' },
];

const quickLinks = [
  { label: 'Shop', href: '/shop', testId: 'footer-link-shop' },
  { label: 'Our Story', href: '/about', testId: 'footer-link-about' },
  { label: 'FAQ', href: '/faq', testId: 'footer-link-faq' },
  { label: 'Contact', href: '/contact', testId: 'footer-link-contact' },
];

const legalLinks = [
  { label: 'Privacy Policy', href: '/privacy', testId: 'link-privacy' },
  { label: 'Terms of Service', href: '/terms', testId: 'link-terms' },
  { label: 'Shipping', href: '/shipping', testId: 'link-shipping' },
];

export default function Footer() {
  return (
    <footer className="bg-card border-t">
      <div className="w-full bg-gradient-to-r from-italian-green/5 via-transparent to-italian-red/5">
        <HeritageStripe />
      </div>
      
      {/* Newsletter Section - Premium Banner */}
      <div className="border-b">
        <div className="container mx-auto px-6 md:px-8 py-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4 text-center lg:text-left">
              <div className="hidden sm:flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-semibold" data-testid="newsletter-title">
                  Join the Irma's Family
                </h3>
                <p className="font-body-serif text-muted-foreground text-sm">
                  Be the first to know about new flavors, recipes, and exclusive offers.
                </p>
              </div>
            </div>
            <div className="flex w-full lg:w-auto gap-2">
              <Input
                type="email"
                placeholder="Enter your email address"
                className="w-full lg:w-80"
                data-testid="input-newsletter-email"
              />
              <Button className="gap-2 whitespace-nowrap" data-testid="button-newsletter-submit">
                Subscribe
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-6 md:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-4">
            <h3 className="font-serif text-2xl font-bold mb-4" data-testid="footer-brand">
              Irma's Pizzelles
            </h3>
            <p className="font-body-serif text-muted-foreground leading-relaxed mb-6">
              Handcrafted with love using traditional Italian recipes passed down through four generations. Every cookie tells a story of heritage and dedication.
            </p>
            {/* Social Media */}
            <div>
              <h4 className="font-semibold text-sm uppercase tracking-wider mb-4 text-muted-foreground">
                Follow Us
              </h4>
              <div className="flex flex-wrap gap-2">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    className="flex items-center justify-center h-9 w-9 rounded-md bg-muted/50 text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                    aria-label={social.name}
                    data-testid={social.testId}
                  >
                    <social.icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 lg:col-start-6">
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-4 text-muted-foreground">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-body-serif text-foreground hover:text-primary transition-colors"
                    data-testid={link.testId}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div className="lg:col-span-2">
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-4 text-muted-foreground">
              Information
            </h4>
            <ul className="space-y-3">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-body-serif text-foreground hover:text-primary transition-colors"
                    data-testid={link.testId}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="lg:col-span-3">
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-4 text-muted-foreground">
              Get in Touch
            </h4>
            <div className="space-y-3 font-body-serif">
              <p className="text-foreground" data-testid="footer-email">
                hello@irmaspizzelles.com
              </p>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Questions about your order or wholesale inquiries? We'd love to hear from you.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t">
        <div className="container mx-auto px-6 md:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p className="font-body-serif" data-testid="text-copyright">
              &copy; {new Date().getFullYear()} Irma's Pizzelles. All rights reserved.
            </p>
            <p className="font-body-serif italic text-xs">
              Made with love in the USA
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
