# Design System - Prolify Dashboard

## Color Palette

### Primary Colors
- **Emerald Green**: `#10b981` (emerald-500) → `#059669` (emerald-600)
  - Used for primary actions, active navigation states, and success indicators
  - Gradient: `from-emerald-50 to-teal-50` for backgrounds

- **Teal**: `#14b8a6` (teal-500) → `#0d9488` (teal-600)
  - Used for accents and complementary gradients
  - Pairs with emerald for multi-tone effects

### Accent Colors
- **Amber/Yellow**: `#fbbf24` (amber-400) → `#f59e0b` (amber-500) → `#eab308` (yellow-500)
  - Used for premium features, VIP elements, and special highlights
  - Applied to: VIP Club, Upgrade Plan, AI badges, and premium statistics
  - Gradient: `from-amber-400 via-yellow-400 to-amber-500`
  - Gold/Premium gradient: `from-amber-400 to-yellow-500`

### Neutral Colors
- **Background**:
  - Light: `#ffffff` (white)
  - Dark: `#0a0a0a` (near black)
- **Surface**:
  - Light: `#f9fafb` (gray-50)
  - Dark: `#171717` (dark gray)
- **Borders**:
  - Light: `#e5e7eb` (gray-200)
  - Dark: `#374151` (gray-800)
- **Text Primary**:
  - Light: `#111827` (gray-900)
  - Dark: `#ffffff` (white)
- **Text Secondary**:
  - Light: `#6b7280` (gray-500)
  - Dark: `#9ca3af` (gray-400)

### Semantic Colors
- **Success**: Emerald tones (`#10b981`, `#059669`)
- **Info**: Blue tones (`#3b82f6`)
- **Warning**: Amber/Yellow tones (`#f59e0b`, `#eab308`)
- **Error**: Red tones (`#ef4444`)

## Usage Guidelines

### Sidebar
- **Active State**: Emerald gradient with left border
- **Premium Items**:
  - Upgrade Plan: Amber/yellow gradient background
  - VIP Club & AI Chief: Yellow badge pills
- **Hover State**: Subtle gray background
- **Logo**: Emerald-to-teal gradient circle

### Dashboard Statistics Cards
- **Current Plan Card**: Amber/yellow gradient (premium indicator)
- **Revenue Card**: Emerald accent (financial metric)
- **Documents Card**: Blue accent (information)
- **Tasks Card**: Purple accent (action items)

### Feature Cards
- **VIP Club**: Full amber-to-yellow gradient with decorative circles
- **Upgrade Plan**: Rich amber gradient with white decorative elements
- **AI Chief of Staff**: Amber icon background with yellow "AI" badge
- **Premium Plans**: Amber border and background tint with crown badge

### Badges & Pills
- **AI Badge**: `bg-gradient-to-r from-amber-400 to-yellow-500` with dark text
- **VIP Badge**: `bg-gradient-to-r from-amber-400 to-yellow-500` with crown icon
- **Most Popular**: Amber gradient with crown icon

## Component States

### Interactive Elements
- **Default**: Clean, minimal
- **Hover**: `bg-gray-100 dark:bg-gray-800`
- **Active**: Emerald gradient or amber gradient (for premium)
- **Focus**: Ring outline for accessibility
- **Disabled**: Reduced opacity (0.5)

### Premium Elements
Premium features use amber/yellow tones to distinguish them from standard features:
- Icons: Amber gradient backgrounds
- Borders: Amber-400 to amber-600
- Backgrounds: Subtle amber-50 to yellow-50 tints
- Text: Amber-900 for contrast on yellow backgrounds

## Typography
- **Section Labels**: Uppercase, 12px, semi-bold, gray-500
- **Nav Items**: 14px, medium weight
- **Sub-items**: 14px, regular weight
- **Headings**: Bold, hierarchical sizing (2xl → xl → lg)

## Spacing
- **Sidebar padding**: `p-2` (8px) for groups
- **Card padding**: `p-6` (24px) for content cards
- **Gap between elements**: `gap-4` (16px) standard, `gap-6` (24px) for major sections
- **Border width**: `border-2` (2px) for emphasis

## Shadows
- **Subtle**: `shadow-sm` for cards
- **Medium**: `shadow-lg` for premium cards and modals
- **Extra**: `shadow-xl` for VIP and upgrade sections

## Animations
- **Transition duration**: 200ms for sidebar, 300ms for modals
- **Easing**: `ease-linear` for consistent motion
- **Hover transitions**: All interactive elements
- **Collapsible items**: `rotate-90` for chevrons

## Accessibility
- **Color contrast**: WCAG AA compliant
- **Focus indicators**: Visible ring on all interactive elements
- **Keyboard navigation**: Full support with shortcuts
- **Screen readers**: Proper ARIA labels and semantic HTML

## Dark Mode Support
All colors have dark mode equivalents:
- Surfaces darken but maintain hierarchy
- Text inverts while maintaining readability
- Amber/yellow accents remain visible with adjusted opacity
- Borders use darker gray tones
