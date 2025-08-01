# AM Design System

A comprehensive, reusable design system extracted from the AM Translations Helper app. Features a minimalist black-and-white aesthetic with sophisticated UI components and full dark mode support.

## 🎨 Design Philosophy

- **Minimalist & Professional**: Clean black-and-white color scheme with thin borders
- **Consistent Typography**: Refined letter-spacing and font weights throughout
- **Dark Mode First**: Comprehensive dark theme with smooth transitions
- **Accessibility Focused**: Proper focus states, keyboard navigation, and screen reader support
- **Responsive Design**: Works beautifully on all screen sizes

## 📦 Components

### Core Components

#### Button
```tsx
import { Button } from '@/components/ui';

// Variants
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>
```

#### Card
```tsx
import { Card } from '@/components/ui';

<Card variant="default">Default Card</Card>
<Card variant="elevated">Elevated Card</Card>
<Card variant="bordered">Bordered Card</Card>
```

#### Badge
```tsx
import { Badge } from '@/components/ui';

<Badge variant="default">Default</Badge>
<Badge variant="blue">Blue</Badge>
<Badge variant="purple">Purple</Badge>
<Badge variant="green">Green</Badge>
<Badge variant="red">Red</Badge>
```

### Typography

```tsx
import { 
  Heading, 
  Subheading, 
  Title, 
  Body, 
  Caption, 
  Label, 
  Monospace 
} from '@/components/ui';

<Heading>Main Heading</Heading>
<Subheading>Section Heading</Subheading>
<Title>Card Title</Title>
<Body>Body text with optimal readability</Body>
<Caption>Supporting text</Caption>
<Label>Form Label</Label>
<Monospace>Code or technical content</Monospace>
```

### Form Elements

```tsx
import { Input, TextArea, Select } from '@/components/ui';

<Input 
  label="Text Input"
  placeholder="Enter text..."
  error="Error message"
/>

<TextArea 
  label="Text Area"
  placeholder="Enter longer text..."
  rows={4}
/>

<Select label="Choose Option">
  <option value="">Select...</option>
  <option value="option1">Option 1</option>
</Select>
```

## 🎨 Color Palette

### Light Mode
- **Primary**: `#000000` (Black)
- **Secondary**: `#ffffff` (White)
- **Text Primary**: `#111827` (Gray-900)
- **Text Secondary**: `#6b7280` (Gray-500)
- **Border**: `#000000` (Black)
- **Background**: `#f9fafb` (Gray-50)
- **Surface**: `#ffffff` (White)

### Dark Mode
- **Primary**: `#ffffff` (White)
- **Secondary**: `#1f2937` (Gray-800)
- **Text Primary**: `#f9fafb` (Gray-50)
- **Text Secondary**: `#9ca3af` (Gray-400)
- **Border**: `#4b5563` (Gray-600)
- **Background**: `#111827` (Gray-900)
- **Surface**: `#1f2937` (Gray-800)

### Accent Colors
- **Blue**: `#2563eb` (Blue-600)
- **Purple**: `#9333ea` (Purple-600)
- **Green**: `#059669` (Green-600)
- **Red**: `#dc2626` (Red-600)

## 🔤 Typography

### Font Stack
```css
font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
```

### Font Weights
- **Black**: `900` (Headings)
- **Bold**: `700` (Subheadings, Titles)
- **Medium**: `500` (Labels, Buttons)
- **Regular**: `400` (Body text)

### Letter Spacing
- **Tight**: `-0.025em` (Headings)
- **Normal**: `-0.011em` (Body text)
- **Wide**: `0.05em` (Labels, Uppercase text)

## 🎭 Animations

### Transitions
- **Fast**: `200ms` (Button hovers, focus states)
- **Medium**: `300ms` (Color mode changes)
- **Slow**: `500ms` (Page transitions)

### Keyframe Animations
```css
/* Fade In */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Gradient Shift */
@keyframes gradientShift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}
```

## 📱 Responsive Design

### Breakpoints
- **Mobile**: `< 640px`
- **Tablet**: `640px - 768px`
- **Desktop**: `> 768px`

### Utility Classes
- `.mobile-hidden`: Hide on mobile
- `.desktop-only`: Show only on desktop
- `.custom-scrollbar`: Custom scrollbar styling

## ♿ Accessibility

### Focus States
```css
.focus-ring {
  @apply focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 focus:border-gray-500;
}
```

### Screen Reader Support
```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

## 🚀 Usage

### Installation
1. Copy the `src/components/ui/` directory to your project
2. Copy `src/styles/design-system.css` to your styles
3. Import the design system CSS in your main stylesheet
4. Import components as needed

### Basic Setup
```tsx
// In your main layout or app component
import '@/styles/design-system.css';

// In your components
import { Button, Card, Heading } from '@/components/ui';

function MyComponent() {
  return (
    <Card className="p-6">
      <Heading>Welcome</Heading>
      <Button>Get Started</Button>
    </Card>
  );
}
```

### Dark Mode Setup
```tsx
// Toggle dark mode
const toggleDarkMode = () => {
  document.documentElement.classList.toggle('dark');
};

// Or use a state management solution
const [darkMode, setDarkMode] = useState(false);

useEffect(() => {
  if (darkMode) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}, [darkMode]);
```

## 🎨 Customization

### Modifying Colors
Edit the CSS custom properties in `design-system.css`:
```css
:root {
  --color-primary: #your-color;
  --color-secondary: #your-color;
  /* ... */
}
```

### Adding New Components
Follow the established patterns:
1. Create component in `src/components/ui/`
2. Use consistent class naming
3. Support dark mode variants
4. Include proper TypeScript interfaces
5. Export from `src/components/ui/index.ts`

### Extending Tailwind
Add custom utilities to `tailwind.config.js`:
```js
module.exports = {
  theme: {
    extend: {
      // Your custom extensions
    },
  },
}
```

## 📋 Component Checklist

When creating new components, ensure they have:

- [ ] **TypeScript interfaces** for props
- [ ] **Dark mode support** with proper color variants
- [ ] **Accessibility features** (ARIA labels, focus states)
- [ ] **Responsive design** considerations
- [ ] **Consistent styling** with the design system
- [ ] **Proper exports** in the index file
- [ ] **Documentation** and usage examples

## 🎯 Best Practices

1. **Consistency**: Always use the established color palette and typography
2. **Accessibility**: Include proper ARIA labels and keyboard navigation
3. **Performance**: Use CSS custom properties for theming
4. **Maintainability**: Keep components focused and composable
5. **Documentation**: Document any deviations from the design system

## 🔧 Development

### View Design System
To see all components in action, import and use the `DesignSystem` component:
```tsx
import DesignSystem from '@/components/ui/DesignSystem';

// Use in your app for development/testing
<DesignSystem />
```

This provides a comprehensive showcase of all available components and their variants. 