# Design Guidelines

Design system documentation for Luxor Bids auction marketplace.

---

## Design Philosophy

**Editorial Dark Luxury**
- Premium auction house aesthetic with magazine/editorial influences
- Sophisticated dark theme (#000000 base) with bronze accents (#b87333)
- Refined typography combining display serif headlines with monospace labels
- Generous whitespace and intentional asymmetry

---

## Color Palette

### Base Colors (Grayscale)
```css
--color-black: #000000        /* Primary background */
--color-void: #0a0a0a         /* Secondary surfaces */
--color-charcoal: #141414     /* Card backgrounds */
--color-graphite: #1a1a1a     /* Borders, dividers */
--color-stone: #2a2a2a        /* Hover states, secondary borders */
--color-pewter: #4a4a4a       /* Muted text, icons */
--color-silver: #8a8a8a       /* Secondary text */
--color-ash: #b0b0b0          /* Body text */
--color-cloud: #d0d0d0        /* Light secondary text */
--color-cream: #fafaf9        /* Primary text, CTAs */
```

### Accent Colors
```css
--color-bronze: #b87333       /* Primary accent (CTAs, highlights) */
--color-bronze-light: #c9955d /* Hover states */
--color-terracotta: #c4704f   /* Secondary accent */
--color-gold: #c9a227         /* Luxury indicators */
--color-warm-white: #fdfcf8   /* Light backgrounds */
```

### Usage Patterns
- **Backgrounds**: Black (#000000) → Void (#0a0a0a) → Charcoal (#141414)
- **Text hierarchy**: Cream (#fafaf9) → Ash (#b0b0b0) → Silver (#8a8a8a) → Pewter (#4a4a4a)
- **Accents**: Bronze (#b87333) for CTAs, live indicators, price highlights
- **Status colors**: Green (#4ade80) for live auctions

---

## Typography

### Font Families
```css
/* Display & Headlines */
font-family: 'Fraunces', Georgia, serif;

/* Body Text */
font-family: 'Source Serif 4', Georgia, serif;

/* Labels, Numbers, UI Elements */
font-family: 'Space Mono', 'Fira Code', monospace;
```

### Type Scale (Fluid)
```css
--text-display: clamp(5rem, 12vw, 15rem)   /* Hero display */
--text-7xl: clamp(4rem, 8vw, 9rem)          /* Headline XL */
--text-6xl: clamp(3.5rem, 6vw, 7rem)        /* Headline LG */
--text-5xl: clamp(2.75rem, 4.5vw, 5rem)     /* Headline MD */
--text-4xl: clamp(2.25rem, 3.5vw, 3.5rem)   /* Headline SM */
--text-3xl: clamp(1.75rem, 2.75vw, 2.5rem)  /* Section titles */
--text-2xl: clamp(1.375rem, 2vw, 1.75rem)   /* Large body */
--text-xl: clamp(1.125rem, 1.5vw, 1.375rem) /* Body XL */
--text-lg: clamp(1rem, 1.25vw, 1.125rem)    /* Body LG */
--text-base: clamp(0.875rem, 1vw, 1rem)     /* Body MD */
--text-sm: clamp(0.75rem, 0.85vw, 0.875rem) /* Body SM */
--text-xs: clamp(0.625rem, 0.7vw, 0.75rem)  /* Labels */
```

### Typography Classes

**Display Headlines**
```css
.headline-xl    /* Hero titles, max impact */
.headline-lg    /* Section headlines */
.headline-md    /* Subsection titles */
.headline-sm    /* Card titles */
```

**Body Text**
```css
.body-xl        /* Featured paragraphs */
.body-lg        /* Standard body */
.body-md        /* Secondary content */
.body-sm        /* Captions, metadata */
```

**Labels & UI**
```css
.label          /* Section labels, CTAs */
.label-sm       /* Micro labels, metadata */
```

### Typography Patterns

**Headline Style**
- Font: Fraunces
- Weight: 500-700
- Letter-spacing: -0.03em to -0.01em
- Line-height: 0.9-1.05 (tight)
- Italic used for secondary words in headlines

**Body Style**
- Font: Source Serif 4
- Weight: 400 (regular)
- Line-height: 1.6-1.7 (generous)

**Label Style**
- Font: Space Mono
- Weight: 700 (bold)
- Letter-spacing: 0.15-0.2em (wide)
- Text-transform: uppercase
- Always small size (text-xs)

**Numeric Style**
```css
.tabular {
  font-variant-numeric: tabular-nums;
  font-feature-settings: 'tnum' 1;
}
```

---

## Spacing System (Fluid)

```css
--space-xs: clamp(0.5rem, 0.8vw, 0.75rem)      /* 8-12px */
--space-sm: clamp(0.75rem, 1vw, 1rem)          /* 12-16px */
--space-md: clamp(1rem, 1.5vw, 1.5rem)         /* 16-24px */
--space-lg: clamp(1.5rem, 2.5vw, 2.5rem)       /* 24-40px */
--space-xl: clamp(2rem, 4vw, 4rem)             /* 32-64px */
--space-2xl: clamp(3rem, 6vw, 6rem)            /* 48-96px */
--space-3xl: clamp(4rem, 8vw, 8rem)            /* 64-128px */
--space-4xl: clamp(6rem, 12vw, 12rem)          /* 96-192px */
```

---

## Components

### Buttons

**Primary Button (CTA)**
```css
.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 2rem;
  background: var(--color-cream);      /* Light on dark */
  color: var(--color-black);
  font-family: 'Space Mono', monospace;
  font-size: var(--text-xs);
  font-weight: 700;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  border: 1px solid var(--color-cream);
  transition: all 0.3s ease;
}
.btn-primary:hover {
  background: transparent;
  color: var(--color-cream);
}
```

**Secondary Button**
```css
.btn-secondary {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 2rem;
  background: transparent;
  color: var(--color-silver);
  font-family: 'Space Mono', monospace;
  font-size: var(--text-xs);
  font-weight: 700;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  border: 1px solid var(--color-stone);
  transition: all 0.3s ease;
}
.btn-secondary:hover {
  border-color: var(--color-bronze);
  color: var(--color-cream);
}
```

### Cards

**Editorial Frame (Image Containers)**
```css
.editorial-frame {
  position: relative;
  border: 1px solid var(--color-stone);
  padding: 8px;
  background: var(--color-void);
}
.editorial-frame::before {
  content: '';
  position: absolute;
  inset: 4px;
  border: 1px solid var(--color-charcoal);
  pointer-events: none;
}
```

**Editorial Card**
```css
.editorial-card {
  position: relative;
  background: var(--color-charcoal);
  border: 1px solid var(--color-stone);
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}
.editorial-card:hover {
  border-color: var(--color-bronze);
  transform: translateY(-4px);
}
```

### Badges & Labels

**Issue Badge**
```css
.issue-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: 1px solid var(--color-stone);
  font-family: 'Space Mono', monospace;
  font-size: var(--text-xs);
  letter-spacing: 0.15em;
  color: var(--color-silver);
}
.issue-badge::before {
  content: '';
  width: 6px;
  height: 6px;
  background: var(--color-bronze);
  border-radius: 50%;
}
```

**Lot Number**
```css
.lot-number {
  font-family: 'Space Mono', monospace;
  font-size: var(--text-xs);
  font-weight: 700;
  letter-spacing: 0.15em;
  color: var(--color-bronze);
}
```

**Status Badge**
```css
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem 0.875rem;
  font-family: 'Space Mono', monospace;
  font-size: calc(var(--text-xs) * 0.85);
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}
.status-live {
  background: rgba(74, 222, 128, 0.1);
  color: #4ade80;
  border: 1px solid rgba(74, 222, 128, 0.2);
}
```

### Tables

**Editorial Table**
```css
.editorial-table {
  width: 100%;
  border-collapse: collapse;
}
.editorial-table th {
  font-family: 'Space Mono', monospace;
  font-size: var(--text-xs);
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-silver);
  padding: 1.5rem 1rem;
  text-align: left;
  border-bottom: 1px solid var(--color-stone);
}
.editorial-table td {
  padding: 1.5rem 1rem;
  border-bottom: 1px solid var(--color-charcoal);
  transition: background-color 0.2s ease;
}
.editorial-table tr:hover td {
  background-color: rgba(184, 115, 51, 0.03);
}
```

---

## Layout Patterns

### Section Headers
```css
.section-marker {
  font-family: 'Space Mono', monospace;
  font-size: var(--text-xs);
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--color-bronze);
  display: flex;
  align-items: center;
  gap: 1rem;
}
.section-marker::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--color-stone);
  max-width: 100px;
}
```

### Container
```css
.container {
  max-width: 1600px;
  margin: 0 auto;
  padding: 0 clamp(1.5rem, 4vw, 3rem);
}
```

### Grid System
- 12-column grid for main layouts
- Gap: 24px (gap-6)
- Asymmetric layouts preferred (7:5 splits, etc.)

### Section Spacing
- Hero: `min-height: 100vh`
- Standard sections: `py-24 lg:py-32` (96-128px)
- Large sections: `py-32 lg:py-48` (128-192px)

---

## Animations

### Easing Functions
```typescript
const easing = {
  smooth: [0.4, 0, 0.2, 1],      /* Standard transitions */
  bounce: [0.68, -0.55, 0.265, 1.55], /* Playful effects */
  snap: [0.16, 1, 0.3, 1],       /* Quick snaps */
}
```

### Animation Variants

**Fade In Up**
```typescript
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] }
  }
}
```

**Scale In**
```typescript
const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 1, ease: [0.4, 0, 0.2, 1] }
  }
}
```

**Stagger Container**
```typescript
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3
    }
  }
}
```

### Animation Patterns
- **Entrance**: 0.8s duration, `fadeInUp` for text, `scaleIn` for images
- **Hover**: 0.3s ease for buttons, 1s for image scale
- **Stagger**: 0.15s delay between items

---

## Visual Effects

### Noise Overlay
```css
.noise-overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0.03;
  background-image: url("data:image/svg+xml,..."); /* Fractal noise SVG */
}
```

### Gradients

**Background Gradients**
```css
/* Hero gradient overlay */
background: linear-gradient(
  to right,
  #000000,
  rgba(0, 0, 0, 0.95),
  rgba(0, 0, 0, 0.6)
);

/* Bottom fade */
background: linear-gradient(
  to top,
  #000000,
  transparent,
  transparent
);
```

**Accent Gradients**
```css
.gradient-bronze {
  background: linear-gradient(135deg, var(--color-bronze) 0%, var(--color-terracotta) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

### Glow Effects
```css
/* Bronze glow for CTA sections */
.glow-bronze {
  background: radial-gradient(
    circle,
    rgba(184, 115, 51, 0.05) 0%,
    transparent 70%
  );
  filter: blur(200px);
}
```

---

## Responsive Breakpoints

```css
/* Tailwind defaults */
sm: 640px   /* Mobile landscape */
md: 768px   /* Tablet */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large desktop */
2xl: 1536px /* Extra large */
```

### Responsive Patterns

**Typography**
```css
.headline-xl {
  font-size: var(--text-7xl); /* Default */
}
@media (max-width: 768px) {
  .headline-xl {
    font-size: var(--text-5xl); /* Mobile */
  }
}
```

**Layout**
```css
/* Desktop: 2 columns */
.grid-cols-12 .lg\:col-span-7

/* Mobile: Stack */
@media (max-width: 1024px) {
  grid-template-columns: 1fr;
}
```

---

## File Structure

```
src/
├── styles.css              /* Main styles with design tokens */
├── routes/
│   └── index.tsx           /* Landing page (reference implementation) */
└── components/
    └── ui/                 /* shadcn components (base layer) */
```

---

## Implementation Checklist

### New Page/Component
- [ ] Use `--color-black` or `--color-void` for backgrounds
- [ ] Apply `font-display` (Fraunces) for headlines
- [ ] Apply `font-editorial` (Source Serif 4) for body
- [ ] Apply `font-mono` (Space Mono) for labels
- [ ] Use `.editorial-frame` for image containers
- [ ] Use `.btn-primary` or `.btn-secondary` for CTAs
- [ ] Add `noise-overlay` for texture
- [ ] Implement `fadeInUp` animation for content
- [ ] Ensure responsive typography with fluid scales
- [ ] Add `.section-marker` for section headers
- [ ] Use `.lot-number` style for item identifiers

### Animation Requirements
- [ ] Wrap content in motion containers
- [ ] Apply stagger variants for lists
- [ ] Use 0.8s duration for entrance animations
- [ ] Use 0.3s ease for hover states
- [ ] Apply `viewport={{ once: true }}` for scroll triggers

---

## Best Practices

1. **Always use CSS variables** for colors and spacing
2. **Never use arbitrary values** in Tailwind (use the design tokens)
3. **Always italicize the second word** in headlines for editorial feel
4. **Use monospace for all numbers** (prices, counts, lot numbers)
5. **Add noise overlay** to dark sections for texture
6. **Use editorial frames** for all images (not bare images)
7. **Prefer asymmetry** over perfect symmetry
8. **Animate on scroll** for better engagement
9. **Maintain generous whitespace** - don't overcrowd
10. **Test at all breakpoints** - fluid typography helps but verify

---

## External Resources

### Fonts (Google Fonts)
```html
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,100..900;1,9..144,100..900&family=Source+Serif+4:ital,opsz,wght@0,8..60,400..900;1,8..60,400..900&family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet">
```

### Icons (Lucide)
All icons from `lucide-react` package

### Animation (Framer Motion)
Use `framer-motion` for React animations

---

Last updated: 2026-02-12
