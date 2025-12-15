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

## Typography System

**Primary Font: Playfair Display (serif)**
- Headings: 700 weight for major headings (H1: text-5xl md:text-7xl, H2: text-4xl md:text-5xl)
- Subheadings: 600 weight (H3: text-2xl md:text-3xl)
- Creates elegant, traditional Italian character

**Secondary Font: Lato (sans-serif)**
- Body text: 400 weight (text-base md:text-lg)
- UI elements, buttons, navigation: 400-600 weights
- Form labels and inputs: 400 weight
- Small text/captions: text-sm
- Ensures excellent readability for product details and checkout flows

**Hierarchy:**
- Hero headlines: Playfair Display, 700, text-5xl md:text-7xl
- Section headings: Playfair Display, 700, text-3xl md:text-4xl
- Product titles: Playfair Display, 600, text-xl md:text-2xl
- Body content: Lato, 400, text-base with increased line-height (leading-relaxed)
- Buttons/CTAs: Lato, 600, text-base md:text-lg, uppercase tracking-wide

---

## Layout System

**Spacing Scale: Tailwind units of 3, 4, 6, 8, 12, 16, 20, 24**
- Component padding: p-6 to p-8
- Section spacing: py-16 md:py-24
- Card gaps: gap-6 md:gap-8
- Form field spacing: space-y-4 to space-y-6
- Container max-width: max-w-7xl for full sections, max-w-4xl for content-focused areas

**Grid Systems:**
- Product grids: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- Feature sections: grid-cols-1 md:grid-cols-2
- Checkout flow: Single column max-w-2xl for forms
- Cart: Two-column split (items + summary) on desktop

---

## Component Library

### Navigation
- Sticky header with logo (left), navigation links (center), cart icon with badge (right)
- Mobile: Hamburger menu with full-screen overlay
- Account dropdown for logged-in users
- Spacing: px-6 md:px-8, py-4

### Hero Section (Landing Page)
- Full-width hero: Large background image of freshly made pizzelles with warm lighting
- Height: min-h-[70vh] md:min-h-[85vh]
- Overlay with centered content: Headline + tagline + dual CTAs
- Primary CTA: "Shop Now" with blurred background backdrop-blur-sm
- Secondary CTA: "Join Waitlist" outlined style with blurred background
- Buttons: Large sizing (px-8 py-4), rounded-full for soft Italian aesthetic

### Product Cards
- Card structure: Image top (aspect-square), content below with p-6
- Hover: Subtle lift effect (hover:shadow-lg transition-shadow)
- Image: Full-bleed with soft rounded corners (rounded-lg)
- Content: Product name (Playfair), price (bold, Lato), flavor description
- Add to cart button: Full-width, rounded-lg

### Shopping Cart
- Slide-in panel from right (desktop) or full-screen (mobile)
- Item rows: Product image (small), name, quantity selector, price, remove icon
- Sticky footer: Subtotal, taxes, shipping estimate, checkout CTA
- Empty state: Illustration with "Your cart is empty" message

### Forms (Waitlist, Checkout, Login)
- Input fields: Rounded-lg borders, p-4, full-width
- Labels: Above inputs, text-sm font-medium mb-2
- Focus states: Ring treatment for accessibility
- Button placement: Full-width on mobile, inline on desktop
- Field groups: Shipping address uses 2-column grid for city/state/zip

### Sections (About, Testimonials, FAQ)
- About: Two-column layout (image + story text), asymmetric for visual interest
- Testimonials: Three-column grid with customer quotes, names, and photos
- FAQ: Accordion pattern with expandable answers, max-w-3xl centered
- All sections: Generous py-20 md:py-32 spacing

### Admin Dashboard
- Sidebar navigation (left), main content area (right)
- Order table: Sortable columns, status badges, action buttons (print label, update status)
- Filters: Date range, status dropdown, search by customer name/email
- Compact spacing for data density: p-4 for cards, gap-4 for grids

### Footer
- Four-column grid: About/Contact, Quick Links, Newsletter Signup, Social Media
- Newsletter: Inline form with email input + submit button
- Bottom bar: Copyright, Privacy Policy, Terms of Service links
- Spacing: pt-16 pb-8, with divider line above bottom bar

---

## Images Strategy

**Hero Section:**
- Large format image (1920x1200): Artisan pizzelles on cooling rack with warm kitchen lighting, shallow depth of field focusing on cookie texture and patterns

**Product Images:**
- Square format (800x800): Individual pizzelles showcasing different flavors, styled on elegant serving plates or rustic wooden boards
- Lifestyle shots for variety descriptions

**About Section:**
- Rectangular image (1200x800): Traditional pizzelle iron or baker's hands preparing dough, emphasizing craftsmanship and heritage

**Testimonial Photos:**
- Circular headshots (200x200): Customer photos for authenticity

**Additional Supporting Images:**
- Process shots for "How It's Made" section
- Packaging imagery for shipping information
- Gift presentation ideas for special occasions

---

## Animations

**Minimal and purposeful:**
- Smooth page transitions (fade-in on load)
- Cart slide-in animation (transform-x with smooth easing)
- Product card hover lift (scale and shadow)
- Form validation feedback (shake on error, checkmark on success)
- No scroll-triggered animations to maintain elegance and performance

---

## Accessibility

- All images include descriptive alt text
- Form inputs have associated labels (for attribute)
- Keyboard navigation fully supported throughout
- Focus indicators visible on all interactive elements
- Color contrast ratios meet WCAG AA standards
- ARIA labels for icon-only buttons (cart, menu toggle)