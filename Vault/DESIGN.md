---
name: Noir Spatial
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
  secondary: '#c9c6c5'
  on-secondary: '#313030'
  secondary-container: '#4a4949'
  on-secondary-container: '#bab8b7'
  tertiary: '#ffffff'
  on-tertiary: '#313030'
  tertiary-container: '#e5e2e1'
  on-tertiary-container: '#656464'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e2e2e2'
  primary-fixed-dim: '#c6c6c7'
  on-primary-fixed: '#1a1c1c'
  on-primary-fixed-variant: '#454747'
  secondary-fixed: '#e5e2e1'
  secondary-fixed-dim: '#c9c6c5'
  on-secondary-fixed: '#1c1b1b'
  on-secondary-fixed-variant: '#474646'
  tertiary-fixed: '#e5e2e1'
  tertiary-fixed-dim: '#c8c6c5'
  on-tertiary-fixed: '#1c1b1b'
  on-tertiary-fixed-variant: '#474746'
  background: '#131313'
  on-background: '#e2e2e2'
  surface-variant: '#353535'
typography:
  display-lg:
    fontFamily: Geist
    fontSize: 48px
    fontWeight: '800'
    lineHeight: '1.1'
    letterSpacing: -0.04em
  headline-md:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  body-lg:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: 0em
  label-caps:
    fontFamily: Geist
    fontSize: 11px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: 0.15em
  mono-technical:
    fontFamily: Geist
    fontSize: 13px
    fontWeight: '400'
    lineHeight: '1.4'
    letterSpacing: 0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 64px
  container-max: 1440px
---

## Brand & Style

This design system embodies a **Noir Spatial** aesthetic—a high-fidelity, futuristic vision of 2050 data management. It is designed for elite digital storage, evoking feelings of absolute security, deep-space mystery, and technological precision.

The style is a sophisticated blend of **High-Fidelity Glassmorphism** and **Technical Minimalism**. Key characteristics include:
- **Spatial Depth:** Using aggressive backdrop blurs (40px+) and layered translucency to create an infinite Z-axis.
- **Monochromatic Precision:** A strict black-and-white palette that emphasizes form, light, and shadow over hue.
- **Holographic Details:** Ultra-fine 1px borders and subtle neomorphic glows that make elements appear as if they are projected in a dark environment.
- **Atmospheric UI:** An interface that feels less like a flat screen and more like a high-end physical console in a low-light environment.

## Colors

The palette is strictly monochromatic to maximize contrast and maintain a "noir" atmosphere.

- **Deep Space Black (#000000):** The foundational void. Used for the base background to ensure maximum contrast for luminous elements.
- **Stark White (#FFFFFF):** Used for critical data, primary actions, and fine-line strokes.
- **Aetheric Grays:** A spectrum of translucent whites and deep grays used for glass surfaces.
- **Luminescence:** High-contrast highlights are achieved through `rgba(255, 255, 255, 1.0)` for text and `rgba(255, 255, 255, 0.05)` for frosted glass fills.

## Typography

The typography system utilizes **Geist** for its technical precision and geometric clarity. 

- **Weight Contrast:** Extreme contrast between Heavy (800) and Regular (400) weights is used to establish hierarchy without relying on color.
- **Tracking:** Headlines use tight tracking for a compact, architectural feel, while labels use expanded tracking for a technical, "readout" appearance.
- **Scaling:** On mobile, display sizes scale down by a factor of 0.7x, while body text remains constant to ensure legibility.

## Layout & Spacing

The layout philosophy follows a **Spatial Fluid Grid**. Elements are treated as floating objects within a coordinate-based system rather than fixed boxes.

- **Grid:** A 12-column grid with wide gutters (24px) allows the dark background to "breathe" through the interface.
- **Safe Areas:** Large external margins (64px on desktop) focus the user's attention on the center "Vault."
- **Z-Axis Spacing:** Depth is communicated via variable backdrop blurs. Higher-priority items have more intense blurs and slightly larger scaling.

## Elevation & Depth

This design system replaces traditional shadows with **Luminous Depth**.

1.  **Level 0 (The Void):** Pure #000000 background.
2.  **Level 1 (The Floor):** Subtle `1px` grid patterns or "star-field" dots at 10% opacity.
3.  **Level 2 (Containers):** 3% white fill with 40px backdrop blur and a 0.5px white border at 10% opacity.
4.  **Level 3 (Active Elements):** 8% white fill with 60px backdrop blur, a 1px white border at 30% opacity, and a soft outer "glow" (a white shadow with 0 alpha and 20px spread, 15% opacity).
5.  **Level 4 (Modals/Overlays):** Full 100px backdrop blur, effectively isolating the content from the background void.

## Shapes

The shape language is **Precision Rounded**. 

- **Standard Radius:** 12px (0.75rem) for most cards and containers, providing a modern but structured feel.
- **Interactive Radius:** Buttons and input fields use a pill-shape (full rounding) to contrast against the more architectural container shapes.
- **Borders:** All borders must be exactly 1px or 0.5px. Never use thick borders, as they break the "holographic" illusion.

## Components

### Frosted Glass Containers
The signature component. Use `backdrop-filter: blur(40px)` combined with a subtle inner highlight on the top-left edge to simulate light catching on glass.

### Action Buttons
Primary buttons are solid Stark White with black text. Secondary buttons are transparent glass with a 1px white border. Hover states should trigger a "neomorphic glow" effect, where the border luminosity increases.

### Holographic Inputs
Input fields should have no background fill until focused. On focus, a 5% white background fades in with a sharp 1px white bottom-border.

### Data Chips
Small, high-contrast labels with `label-caps` typography. They should have a slightly higher opacity glass background (10%) to ensure they "pop" against the larger containers.

### The Timeline / Scrubber
A thin 1px horizontal line with a luminous white dot (the playhead). Active segments are indicated by a slight outer glow on the line itself.