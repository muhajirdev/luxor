# Development Tools

## React Scan (Performance Debugging)

[React Scan](https://github.com/aidenybai/react-scan) is included in the project for performance debugging. It visualizes component re-renders to help identify performance issues.

**Features:**
- Highlights components that re-render with color-coded borders
- Shows render frequency and timing
- Helps catch unnecessary re-renders

**How to enable:**

1. Open `src/routes/__root.tsx`
2. Uncomment the React Scan script tag in the `<head>` section:

```tsx
<script
  crossOrigin="anonymous"
  src="//unpkg.com/react-scan/dist/auto.global.js"
/>
```

3. Refresh the page and watch for colored borders around re-rendering components

**Note:** Only use React Scan in development. Never enable it in production.
