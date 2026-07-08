---
name: Legacy OS
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#393939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1b1b1b'
  surface-container: '#1f1f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353535'
  on-surface: '#e2e2e2'
  on-surface-variant: '#c4c7c8'
  inverse-surface: '#e2e2e2'
  inverse-on-surface: '#303030'
  outline: '#8e9192'
  outline-variant: '#444748'
  surface-tint: '#c6c6c7'
  primary: '#ffffff'
  on-primary: '#2f3131'
  primary-container: '#e2e2e2'
  on-primary-container: '#636565'
  inverse-primary: '#5d5f5f'
  secondary: '#c8c6c5'
  on-secondary: '#303030'
  secondary-container: '#474746'
  on-secondary-container: '#b6b5b4'
  tertiary: '#ffffff'
  on-tertiary: '#2d3132'
  tertiary-container: '#e0e3e4'
  on-tertiary-container: '#626566'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e2e2e2'
  primary-fixed-dim: '#c6c6c7'
  on-primary-fixed: '#1a1c1c'
  on-primary-fixed-variant: '#454747'
  secondary-fixed: '#e4e2e1'
  secondary-fixed-dim: '#c8c6c5'
  on-secondary-fixed: '#1b1c1b'
  on-secondary-fixed-variant: '#474746'
  tertiary-fixed: '#e0e3e4'
  tertiary-fixed-dim: '#c4c7c8'
  on-tertiary-fixed: '#191c1d'
  on-tertiary-fixed-variant: '#444748'
  background: '#131313'
  on-background: '#e2e2e2'
  surface-variant: '#353535'
  glass-fill: rgba(255, 255, 255, 0.03)
  glass-hover: rgba(255, 255, 255, 0.06)
  glass-border: rgba(255, 255, 255, 0.10)
  glass-border-hover: rgba(255, 255, 255, 0.30)
  on-surface-muted: rgba(226, 226, 226, 0.70)
typography:
  display-lg:
    fontFamily: Geist
    fontSize: 72px
    fontWeight: '800'
    lineHeight: '1.1'
    letterSpacing: -0.04em
  headline-lg:
    fontFamily: Geist
    fontSize: 40px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Geist
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: 0em
  body-md:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: 0em
  label-md:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1'
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1'
    letterSpacing: 0.02em
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  unit: 8px
  stack-sm: 12px
  gutter: 24px
  stack-md: 24px
  container-padding: 40px
  stack-lg: 48px
---

## Brand & Style
Legacy OS is a premium digital life journal designed to evoke introspection, nostalgia, and a sense of "digital permanence." The brand personality is serene, sophisticated, and cinematic. 

The design style is **Cinematic Glassmorphism**. It utilizes deep, spatial backgrounds, high-contrast monochrome imagery, and layered translucent surfaces to create a sense of depth and focus. The aesthetic is heavily influenced by high-end photography and minimal technical interfaces, resulting in a "memory vault" that feels both futuristic and timeless.

## Colors
The palette is rooted in absolute black (`#000000`) to provide infinite depth, with white (`#ffffff`) serving as the primary action and high-impact color. 

- **Primary:** Pure white, used for high-contrast text, primary buttons, and active states.
- **Secondary/Tertiary:** Cool-toned greys that provide hierarchy without introducing hue, maintaining a monochrome photographic feel.
- **Glass System:** Depth is managed through varying opacities of white overlays rather than solid fills.
- **Accents:** Occasional use of "Fidelity" shades (subtle variations of neutral) to highlight density or activity (e.g., the heatmap).

## Typography
The system uses **Geist** exclusively to achieve a clean, technical, and precise aesthetic. 

Headlines utilize tight letter-spacing and heavy weights to command attention against the dark background. Body text favors generous line-heights (1.6) for readability and a relaxed, journal-like feel. Labels are frequently uppercase with increased letter-spacing to act as architectural markers within the interface.

## Layout & Spacing
The layout follows a **12-column fluid grid** for the main content area, with a maximum width of 1280px (7xl). 

- **Outer Margins:** Large 40px (container-padding) margins create a spacious, high-end editorial feel.
- **Bento Grid Logic:** Content is organized into blocks that span 4, 6, 8, or 12 columns.
- **Floating Navigation:** The header is decoupled from the page edge, using a "capsule" floating 24px from the top to emphasize the spatial layering.
- **Vertical Rhythm:** A modular scale based on 8px is used, with 48px (stack-lg) used to separate major sections.

## Elevation & Depth
Depth is expressed through **Glassmorphism** and backdrop filters rather than traditional shadows. 

1.  **Base Layer:** Solid black or deep gradient background.
2.  **Middle Layer (Cards/Panels):** Semi-transparent white fill (3%) with 40px backdrop blur and a thin 1px border (10% opacity).
3.  **Floating Layer (Nav/FAB):** Higher opacity white fills (10%) with 40px backdrop blur and more prominent 40% opacity borders.
4.  **Interactions:** Hover states increase border opacity and surface fill brightness, creating a "glare" effect that follows the cursor.

## Shapes
The shape language is dominated by **large radii and circular forms**. 

- **Panels:** Use a standard 1rem (16px) or 1.5rem (24px) radius.
- **Buttons/Capsules:** Always use a "full" (pill-shaped) radius for a modern, tactile feel.
- **Micro-elements:** Heatmap cells and small thumbnails use a 4px soft radius to maintain clarity at small scales.
- **Media:** Photographs within cards should inherit the card's container radius or use a slightly smaller 12px radius to create a nested "inner frame" look.

## Components
- **Glass Panels:** The fundamental container. Must include `backdrop-blur-[40px]` and a 1px border. Hover states should include a subtle transition to a higher border opacity.
- **Primary Action Buttons:** Pill-shaped, high-contrast (White background, black text). They should scale slightly (105%) on hover.
- **Secondary Buttons:** Pill-shaped, semi-transparent (White 5-10%) with a thin border.
- **Floating Action Button (FAB):** Circular, high-contrast white, elevated with a large, soft black shadow (shadow-2xl) to separate it from the glass layers.
- **Search Inputs:** Pill-shaped capsules with left-aligned icons and high-width transitions on focus to reflect a "dynamic" interface.
- **Image Treatment:** All photography should be grayscale by default, returning to color only on active interaction or within specific "Featured" blocks to maintain the "Archive" aesthetic.
- **Scrollbars:** Custom, ultra-thin (4px) scrollbars with low-contrast thumbs to prevent visual clutter in long lists.