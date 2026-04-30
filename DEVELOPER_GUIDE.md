# Developer Guide - Design System Usage

## Quick Reference

### Custom CSS Classes Available

```css
/* Buttons */
.gradient-btn              /* Blue gradient button with hover effects */

/* Cards */
.card-hover               /* White/dark card with shadow and scale */

/* Effects */
.glass-effect             /* Glassmorphism navbar effect */
.smooth-underline         /* Animated underline on hover */

/* Animations */
.animate-fade-in-up       /* Fade in and slide up */
.animate-slide-in-left    /* Slide from left */
.animate-pulse-glow       /* Pulsing glow effect */
```

---

## Framer Motion Quick Start

### Basic Animation
```jsx
import { motion } from 'framer-motion';

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8 }}
>
  Content
</motion.div>
```

### Scroll Animation (In View)
```jsx
<motion.div
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true }}
  variants={containerVariants}
>
  Content on visible
</motion.div>
```

### Hover Animation
```jsx
<motion.div
  whileHover={{ scale: 1.05, y: -10 }}
  whileTap={{ scale: 0.95 }}
>
  Interactive element
</motion.div>
```

### Stagger Children
```jsx
<motion.div
  variants={{
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }}
  initial="hidden"
  animate="visible"
>
  {items.map((item) => (
    <motion.div key={item.id} variants={itemVariants}>
      {item.name}
    </motion.div>
  ))}
</motion.div>
```

---

## Tailwind Dark Mode

### Class-Based Dark Mode
```jsx
{/* Light: white, Dark: dark slate */}
<div className="bg-white dark:bg-slate-800">
  {/* Light: dark gray, Dark: light gray */}
  <p className="text-gray-900 dark:text-gray-100">
    Text changes based on theme
  </p>
</div>
```

### Color Variables for Dark Mode
```
Light  | Dark
-------|-------
white  | slate-800/900
gray   | slate-700
text   | slate colors
```

### Theme Toggle Implementation
```jsx
import { useTheme } from '../context/ThemeContext';

const Component = () => {
  const { darkMode, toggleDarkMode } = useTheme();
  
  return (
    <button onClick={toggleDarkMode}>
      {darkMode ? '🌙' : '☀️'}
    </button>
  );
};
```

---

## Component Patterns

### Service Cards with Icons
```jsx
import { motion } from 'framer-motion';

const ServiceCard = ({ name, icon }) => {
  return (
    <motion.div
      whileHover={{ y: -10 }}
      className="card-hover text-center cursor-pointer group"
    >
      <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-gradient">
        {name}
      </h3>
    </motion.div>
  );
};
```

### Image Cards with Overlay
```jsx
<motion.div whileHover={{ scale: 1.05 }} className="card-hover overflow-hidden">
  <div className="h-64 overflow-hidden rounded-2xl">
    <img
      src={imageUrl}
      alt="Description"
      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
    />
  </div>
  <div className="p-4">
    <h3 className="text-xl font-bold">{title}</h3>
    <p className="text-gray-600 dark:text-gray-400">{description}</p>
  </div>
</motion.div>
```

### Form Input with Focus State
```jsx
<input
  type="text"
  className="w-full p-3 border-2 border-gray-300 dark:border-slate-600 
    dark:bg-slate-700 dark:text-white rounded-lg 
    focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 
    transition-colors"
  placeholder="Enter text..."
/>
```

### Gradient Text
```jsx
<h1 className="text-5xl font-bold 
  bg-gradient-to-r from-blue-600 to-blue-500 
  dark:from-blue-400 dark:to-blue-300 
  bg-clip-text text-transparent">
  Heading with Gradient
</h1>
```

---

## Common Patterns

### Modal/Overlay Fade In
```jsx
{isOpen && (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 bg-black/50 flex items-center justify-center"
  >
    <motion.div
      initial={{ scale: 0.9 }}
      animate={{ scale: 1 }}
      className="bg-white dark:bg-slate-800 p-8 rounded-xl"
    >
      {/* Modal content */}
    </motion.div>
  </motion.div>
)}
```

### Loading Spinner
```jsx
<motion.div
  animate={{ rotate: 360 }}
  transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
  className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"
/>
```

### Success Toast
```jsx
{message && (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="fixed top-4 right-4 bg-green-100 dark:bg-green-500/20 
      text-green-700 dark:text-green-300 p-4 rounded-lg"
  >
    ✅ {message}
  </motion.div>
)}
```

---

## Best Practices

### 1. Animation Performance
```jsx
// ✅ Good: Use transform and opacity
<motion.div
  animate={{ opacity: 1, y: 0 }}
  className="..."
/>

// ❌ Avoid: Animating margin/width
<motion.div
  animate={{ marginTop: 10 }}
  className="..."
/>
```

### 2. Mobile Performance
```jsx
// ✅ Reduce animation duration on mobile
const duration = window.innerWidth < 768 ? 0.3 : 0.8;

// ✅ Use reduceMotion for accessibility
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
```

### 3. Dark Mode Consistency
```jsx
// ✅ Always include dark variant
<div className="bg-white dark:bg-slate-800
               text-gray-900 dark:text-white">

// ❌ Avoid: Light-only colors
<div className="bg-white text-gray-900">
```

### 4. Responsive Design
```jsx
// ✅ Mobile first approach
<div className="text-sm md:text-base lg:text-lg">

// ✅ Hide/show based on screen size
<button className="md:hidden">Mobile Menu</button>
<div className="hidden md:flex">Desktop Menu</div>
```

### 5. Accessibility
```jsx
// ✅ Include alt text
<img src="..." alt="Doctor profile image" />

// ✅ Use semantic HTML
<button onClick={...}>Action</button>

// ✅ Keyboard navigation
<input onKeyPress={(e) => e.key === 'Enter' && submit()} />
```

---

## Debugging Tips

### Theme Not Applying
```javascript
// Check if document has 'dark' class
console.log(document.documentElement.classList);

// Manually toggle for testing
document.documentElement.classList.toggle('dark');
```

### Animation Stuttering
```javascript
// Check performance in DevTools
// Performance tab -> Record -> See if GPU is being used
// transform and opacity should be green (GPU optimized)
```

### Animation Not Triggering
```javascript
// Ensure element is in viewport
// Use whileInView with viewport options
<motion.div
  whileInView={{ opacity: 1 }}
  viewport={{ once: true, amount: 0.5 }}
/>
```

---

## Extending the Design System

### Adding New Color
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        teal: '#14b8a6',
      },
    },
  },
};

// Usage
<div className="text-teal-500 dark:text-teal-400">
```

### Adding New Animation
```css
/* src/index.css */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.animate-slide-in {
  animation: slideIn 0.5s ease-out;
}
```

### Creating Utility Component
```jsx
// components/AnimatedCard.js
import { motion } from 'framer-motion';

export const AnimatedCard = ({ children, ...props }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    whileHover={{ scale: 1.05 }}
    className="card-hover"
    {...props}
  >
    {children}
  </motion.div>
);

// Usage
<AnimatedCard>Content</AnimatedCard>
```

---

## Performance Checklist

- [ ] Images optimized (compressed, correct format)
- [ ] Animations use GPU (transform, opacity only)
- [ ] No memory leaks (useEffect cleanup)
- [ ] Lazy loading for images
- [ ] Code splitting for routes
- [ ] Minified CSS with Tailwind
- [ ] No unnecessary re-renders
- [ ] Smooth 60fps animations

---

## Production Optimization

### Build Frontend
```bash
cd frontend
npm run build
# Output: build/ folder with optimized files
```

### Production Environment Variables
```
REACT_APP_API_URL=https://api.msmdental.com
REACT_APP_ENV=production
```

### Backend Deployment
```bash
# Ensure MongoDB Atlas connection
# Set all environment variables
# Build and deploy
git push heroku main  # or similar
```

---

## Support Commands

```bash
# Check for unused CSS
npm run build

# Analyze bundle size
npm install -D webpack-bundle-analyzer

# Run performance audit
lighthouse https://your-site.com

# Check accessibility
npm install -D axe-core
```

---

**Last Updated:** April 2026
**Maintained by:** Development Team
**Questions?** Check SETUP_GUIDE.md or UI_UX_GUIDE.md