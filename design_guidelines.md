# Irma's Pizzelles - Design Guidelines

## Design Approach

**Reference-Based: Premium E-commerce + Italian Heritage**
Drawing inspiration from luxury food retailers (Eataly, Goldbelly) combined with traditional Italian craftsmanship aesthetics. This approach balances modern e-commerce functionality with Old World charm and artisanal quality.

**Core Design Principles:**
- Sophisticated simplicity with traditional Italian warmth
- Product-first presentation showcasing craftsmanship
- Trust-building through authentic imagery and storytelling
- Effortless navigation with clear conversion paths

---

## Color System

**Base Palette:**
- Background: Cream/ivory (warm off-white)
- Primary accent: Rich gold/amber for CTAs, highlights, and premium touches
- Secondary: Earthy warm brown for text, borders, and grounding elements
- Neutral: Soft beige and warm gray for cards and sections

**Application:**
- Hero overlay: Semi-transparent warm brown backdrop with blur
- Buttons: Gold/amber fill with warm brown text, or warm brown outline on transparent blurred backgrounds
- Product cards: Cream backgrounds with subtle warm shadows
- Section alternation: Cream and very light beige for visual rhythm
- Text hierarchy: Warm brown for body, darker brown for headings
- Accents: Gold for badges, special offers, "New" labels, premium indicators

---

## Typography System

**Primary Font: Playfair Display (serif)**
- Major headings: 700 weight (H1: text-5xl md:text-7xl, H2: text-4xl md:text-5xl)
- Subheadings: 600 weight (H3: text-2xl md:text-3xl)
- Creates elegant, traditional Italian character

**Secondary Font: Lato (sans-serif)**
- Body text: 400 weight (text-base md:text-lg, leading-relaxed)
- UI elements, buttons, navigation: 400-600 weights
- Form fields: 400 weight
- Small text: text-sm

**Hierarchy:**
- Hero headlines: Playfair Display, 700, text-5xl md:text-7xl
- Section headings: Playfair Display, 700, text-3xl md:text-4xl
- Product titles: Playfair Display, 600, text-xl md:text-2xl
- Body content: Lato, 400, text-base, leading-relaxed
- Buttons/CTAs: Lato, 600, text-base md:text-lg, uppercase, tracking-wide

---

## Layout System

**Spacing Scale: Tailwind units of 3, 4, 6, 8, 12, 16, 20, 24**
- Component padding: p-6 to p-8
- Section spacing: py-20 md:py-32
- Card gaps: gap-6 md:gap-8
- Form spacing: space-y-4 to space-y-6
- Containers: max-w-7xl for sections, max-w-4xl for content, max-w-2xl for forms

**Grid Systems:**
- Product grids: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- Feature sections: grid-cols-1 md:grid-cols-2
- Testimonials: grid-cols-1 md:grid-cols-3

---

## Component Library

### Navigation
Sticky header with logo (left), navigation links (center), cart icon with badge (right). Mobile hamburger menu with full-screen overlay. Account dropdown for logged users. Spacing: px-6 md:px-8, py-4.

### Hero Section
Full-width hero image (min-h-[70vh] md:min-h-[85vh]) featuring freshly made pizzelles with warm kitchen lighting. Centered overlay content with headline, tagline, and dual CTAs. Buttons have blurred warm brown backdrop (backdrop-blur-sm). Primary CTA: "Shop Now" (gold fill), Secondary: "Join Waitlist" (outlined, transparent with blur). Button sizing: px-8 py-4, rounded-full.

### Product Cards
Image top (aspect-square, rounded-lg), content below (p-6). Hover: subtle lift with enhanced shadow. Content includes product name (Playfair), price (bold Lato), flavor description, full-width "Add to Cart" button (rounded-lg).

### Features Section (Why Choose Irma's)
Three-column grid showcasing: "Family Recipe Since 1947", "Handcrafted Daily", "Premium Ingredients". Each card includes decorative icon, bold heading, and descriptive text.

### Shopping Cart
Slide-in panel (right on desktop, full-screen mobile). Item rows with thumbnail, name, quantity selector, price, remove icon. Sticky footer with subtotal, taxes, shipping estimate, checkout CTA. Empty state with warm messaging.

### Product Detail Page
Two-column layout: large product image gallery (left, 60%), product information (right, 40%) with title, price, flavor selector, quantity, add-to-cart, and detailed description accordion.

### Forms
Rounded-lg inputs with p-4, labels above (text-sm, font-medium, mb-2). Focus ring states. Full-width buttons on mobile, inline on desktop. Address forms use 2-column grid for city/state/zip.

### About Section
Asymmetric two-column: heritage image (left, 45%), story content (right, 55%) with founder quote, family history, and craftsmanship details. Includes decorative gold divider elements.

### Testimonials
Three-column grid with customer quotes, circular photos (200x200), names, and 5-star ratings displayed with gold stars.

### FAQ Section
Accordion pattern (max-w-3xl centered) with expandable answers, gold accent on active item.

### Newsletter Section
Centered content with compelling headline, inline form (email + submit), and trust indicator ("Join 5,000+ pizzelle lovers"). Gold submit button.

### Footer
Four-column grid: About/Contact, Quick Links, Newsletter, Social Media. Bottom bar with copyright and legal links. Spacing: pt-16 pb-8 with divider.

---

## Images

**Hero Image (1920x1200):** Artisan pizzelles on cooling rack with warm kitchen lighting, shallow depth of field showcasing cookie texture and traditional patterns.

**Product Images (800x800):** Individual pizzelles on elegant serving plates or rustic wooden boards, different flavors with lifestyle styling.

**About Section (1200x800):** Traditional pizzelle iron or baker's hands preparing dough, emphasizing heritage and craftsmanship.

**Testimonials (200x200):** Circular customer photos for authenticity.

**Supporting Images:** Process shots for "How It's Made", gift packaging ideas, ingredient close-ups.

---

## Animations

Minimal: Page load fade-in, cart slide-in (smooth transform), product card hover lift (subtle scale + shadow), form validation feedback (shake error, checkmark success). No scroll-triggered effects.

---

## Accessibility

Descriptive alt text on all images, form labels with for attributes, full keyboard navigation, visible focus indicators, WCAG AA contrast ratios, ARIA labels for icon-only buttons.