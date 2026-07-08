---
name: Aetheric Morphism
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
  on-secondary: '#313030'
  secondary-container: '#474746'
  on-secondary-container: '#b7b5b4'
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
  secondary-fixed-dim: '#c8c6c5'
  on-secondary-fixed: '#1c1b1b'
  on-secondary-fixed-variant: '#474746'
  tertiary-fixed: '#e5e2e1'
  tertiary-fixed-dim: '#c9c6c5'
  on-tertiary-fixed: '#1c1b1b'
  on-tertiary-fixed-variant: '#474646'
  background: '#131313'
  on-background: '#e2e2e2'
  surface-variant: '#353535'
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
  container-padding: 40px
  gutter: 24px
  stack-sm: 12px
  stack-md: 24px
  stack-lg: 48px
---

## Brand & Style
The design system for the Digital Life Journal is an exercise in "Aetheric Morphism"—a fusion of deep spatial depth, monochromatic luxury, and futuristic utility. The brand personality is introspective, premium, and ethereal, designed to make the act of journaling feel like interacting with a high-end digital artifact.

The aesthetic merges **Glassmorphism** with **Neomorphic** tactile cues. It relies on a "Dark Only" environment where pure black represents the infinite void of memory, and glass layers represent the clarity of thought. Drawing inspiration from high-concept hardware and avant-garde software, the UI evokes a sense of calm, focused sophistication.

## Colors
The palette is strictly monochromatic to maintain an "Ultra-Premium" feel. 
- **Pure Black (#000000):** Used for the base canvas to maximize OLED contrast and provide a sense of infinite depth.
- **White (#FFFFFF):** Used for primary actions, high-contrast headlines, and critical iconography.
- **Soft Grays:** Used for subtle metadata and secondary text to create a clear information hierarchy.
- **Liquid Glass:** Transparency is the primary "color" here. Surfaces are defined by their refraction and blur rather than solid fills.

## Typography
This design system utilizes **Geist** exclusively to achieve a technical yet editorial look.
- **Headlines:** Set with tight tracking and high weight to feel like chiseled obsidian. Display sizes should use `font-weight: 800` for a dramatic, cinematic impact.
- **Body Text:** Focuses on legibility and "breathability." Line heights are generous (1.6) to accommodate long-form journaling.
- **Labels:** Monospaced-adjacent styling is achieved through uppercase Geist with slight letter spacing, nodding to the "Nothing" aesthetic and technical precision.

## Layout & Spacing
The layout follows a **Fluid Grid** model with extreme margins to create a "Gallery" feel.
- **Desktop:** A 12-column grid with wide 40px gutters. Content is often centered or offset to create an editorial rhythm.
- **Mobile:** A 4-column grid with 20px margins. 
- **Rhythm:** An 8px linear scale is used. However, "Spatial Depth" is prioritized over rigid boxing—elements should feel like they are floating in the Z-axis, occasionally overlapping to emphasize the liquid glass effect.

## Elevation & Depth
Elevation is not conveyed through simple drop shadows, but through **Optical Refraction**:
- **Layer 0 (Canvas):** Pure Black (#000000).
- **Layer 1 (Floating Cards):** Background Blur (40px–60px), 3% White Fill, 12% White Border (1px).
- **Layer 2 (Modals/Popovers):** Higher blur (80px), increased border opacity, and a "Soft Glow" shadow (0px 20px 40px rgba(0,0,0,0.5)) to push it toward the user.
- **Neomorphism:** Buttons and active states use subtle inner shadows and outer highlights to create "convex" or "concave" effects on the glass, making the UI feel tactile and "squishy" despite its digital nature.

## Shapes
The shape language is high-contrast:
- **Navigation & Actions:** Use `ROUND_FULL` (Pill-shaped) for a friendly, approachable, and ergonomic feel.
- **Content Containers:** Use `ROUND_XL` (1.5rem / 24px) to provide a soft, modern framing for journal entries and media.
- **Interaction Cues:** Small indicators (dots, active state pills) should always be fully circular.

## Components
- **Liquid Glass Buttons:** Fully rounded (pill). Background is `rgba(255,255,255, 0.05)` with a 1px `rgba(255,255,255, 0.2)` border. On hover, the inner glow increases. On press, a neomorphic "inset" shadow is applied.
- **Aetheric Cards:** `ROUND_XL` corners. These utilize the 40px backdrop blur. Borders are "Variable Stroke"—slightly thicker on the top-left to simulate a light source.
- **Floating Navigation:** A pill-shaped bar at the bottom of the screen, floating 24px above the edge. Pure glass with high-contrast white icons.
- **Input Fields:** Minimalist. No background by default; only a subtle bottom border that glows white when focused.
- **Journal Timeline:** A vertical 1px line (low opacity white) with circular "nodes" representing entries. Nodes expand into glass cards on interaction.