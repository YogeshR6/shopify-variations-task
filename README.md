# Shopify Product Variations Task

A comprehensive Next.js TypeScript application for managing product variations with advanced pricing, inventory tracking, and profit analysis features.

## ✨ Features

### 🎯 Variation Management

- ✅ **Add/Delete Variations**: Create and remove product variations with intuitive controls
- ✅ **Drag & Drop Reordering**: Reorder variations and options by dragging with grip handles
- ✅ **Accordion Interface**: Expandable/collapsible variations with smooth animations
- ✅ **Inline Name Editing**: Click variation names to edit directly (no confirmation needed)
- ✅ **Smart Navigation**: Click closed variations to open, click open variations to edit
- ✅ **Option Value Preview**: View option values as tags when variations are closed
- ✅ **Auto-Focus**: New variations and options automatically focus for quick editing
- ✅ **Persistent Storage**: All data saved to localStorage and restored on page refresh

### 💰 Advanced Pricing & Inventory

- ✅ **Price Combinations**: Automatically generate all possible variation combinations
- ✅ **Grouping System**: Group price combinations by any variation for better organization
- ✅ **Group Pricing**: Set parent prices for entire groups with automatic range calculation
- ✅ **Inventory Tracking**: Track available units for each combination
- ✅ **Total Units Display**: Real-time calculation of total available inventory
- ✅ **Currency Support**: Indian Rupee (₹) currency formatting throughout
- ✅ **Accordion Groups**: Organize price combinations in expandable groups

### 📊 Profit Analysis

- ✅ **Cost Management**: Track cost per item for each combination
- ✅ **Profit Calculation**: Automatic profit calculation (Price - Cost)
- ✅ **Margin Analysis**: Real-time margin percentage calculation
- ✅ **Interactive Popup**: Click any combination to open detailed editing popup
- ✅ **Synchronized Updates**: Changes in popup automatically update main interface

### 🎨 User Experience

- ✅ **Responsive Design**: Optimized for desktop and mobile devices
- ✅ **Intuitive Icons**: Clear visual indicators using Lucide React icons
- ✅ **Hover Effects**: Interactive feedback on all clickable elements
- ✅ **Loading States**: Smooth transitions and state management
- ✅ **Error Handling**: Graceful error handling for localStorage operations

## 🛠 Technology Stack

- **Next.js 15** - React framework with App Router and TypeScript
- **TypeScript** - Full type safety with comprehensive interfaces
- **Tailwind CSS** - Utility-first CSS framework with custom components
- **@dnd-kit** - Modern drag-and-drop library with accessibility support
  - `@dnd-kit/core` - Core drag-and-drop functionality
  - `@dnd-kit/sortable` - Sortable list implementation
  - `@dnd-kit/utilities` - Helper utilities
  - `@dnd-kit/modifiers` - Drag behavior modifiers
- **Lucide React** - Beautiful, customizable icon library

## 🚀 Getting Started

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd shopify-variations-task
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Run the development server:**

   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 Usage Guide

### Managing Variations

1. **Adding Variations**

   - Click "Add Variation" button
   - Name field auto-focuses for immediate editing
   - Press Enter to save, Escape to cancel

2. **Editing Variation Names**

   - When closed: Click variation name to expand
   - When open: Click variation name to edit
   - Double-click anytime to edit directly
   - Changes save automatically when clicking away

3. **Reordering Variations**
   - Drag using the grip handle (⋮⋮) to reorder
   - Order persists across page refreshes

### Managing Options

1. **Adding Options**

   - Expand a variation and click "Add Option"
   - Input field auto-focuses for the option value
   - Press Enter to save, Escape to cancel

2. **Editing Options**
   - Click directly on option values to edit inline
   - Drag to reorder options within a variation
   - Use X button to delete options

### Price Management

1. **Setting Individual Prices**

   - Price combinations are auto-generated from variations
   - Click any combination row to open the detailed popup
   - Set price and cost per item for profit analysis

2. **Group Pricing**

   - Use the "Group by" dropdown to organize combinations
   - Set parent prices for entire groups
   - Parent price shows as range when children have different prices

3. **Inventory Tracking**
   - Set available units for each combination
   - View total available units at the bottom
   - Units are tracked independently from pricing

### Profit Analysis

1. **Cost Tracking**

   - Set cost per item in the combination popup
   - View real-time profit calculation (Price - Cost)
   - Monitor margin percentage for each combination

2. **Financial Overview**
   - Green indicators for positive profits/margins
   - Red indicators for losses
   - Automatic calculations update as you type

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx                    # Main application page
│   ├── layout.tsx                  # Root layout with metadata
│   └── globals.css                 # Global styles
├── components/
│   ├── VariationsSection.tsx       # Main container with drag-drop
│   ├── SortableVariation.tsx       # Individual variation component
│   ├── SortableOption.tsx          # Individual option component
│   ├── PricingSection.tsx          # Price combinations & inventory
│   └── CombinationEditPopup.tsx    # Profit analysis popup
└── types/
    └── variations.ts               # TypeScript interfaces
```

## 🧩 Key Components

### VariationsSection

- Central state management for all variations and pricing data
- Drag-and-drop context setup with @dnd-kit
- localStorage persistence for both variations and pricing
- Integration between variation management and pricing systems

### SortableVariation

- Accordion-style variation display with smooth animations
- Inline name editing with auto-focus and keyboard shortcuts
- Option value preview when closed
- Nested drag-and-drop for options management

### PricingSection

- Automatic combination generation from all variations
- Flexible grouping system with accordion interface
- Parent/child pricing relationships
- Inventory tracking and total calculations

### CombinationEditPopup

- Modal interface for detailed combination editing
- Real-time profit and margin calculations
- Cost management with visual feedback
- Synchronized updates with main interface

## 🔧 Advanced Features

### Data Persistence

- **Variations**: Stored in `localStorage` with key `product-variations`
- **Pricing Data**: Stored separately with key `pricing-data`
- **Auto-Recovery**: Graceful handling of corrupted localStorage data
- **Real-time Sync**: Changes immediately persisted and restored

### Accessibility

- **Keyboard Navigation**: Full support for keyboard-only users
- **Screen Reader Support**: Proper ARIA labels and semantic HTML
- **Focus Management**: Logical tab order and focus indicators
- **Drag-and-Drop**: Accessible drag-and-drop with @dnd-kit

### Performance Optimizations

- **useMemo**: Expensive calculations cached and optimized
- **Conditional Rendering**: Components render only when needed
- **Efficient Updates**: Minimal re-renders with proper state management
- **Lazy Loading**: Components loaded as needed

## 🎨 Styling & Theme

- **Design System**: Consistent spacing, colors, and typography
- **Interactive States**: Hover, focus, and active state styling
- **Responsive Layout**: Mobile-first approach with Tailwind CSS
- **Currency Formatting**: Proper Indian Rupee symbol placement
- **Visual Hierarchy**: Clear information architecture and grouping

## 🚀 Future Enhancements

### Planned Features

- **Export/Import**: JSON and CSV data export/import functionality
- **Variation Templates**: Pre-built templates for common product types
- **Bulk Operations**: Mass edit prices, costs, or inventory
- **Analytics Dashboard**: Sales performance and profit analytics
- **Multi-Currency**: Support for multiple currencies with conversion
- **Product Images**: Image management for variations and options
- **Barcode Generation**: Automatic barcode/SKU generation
- **API Integration**: Connect with e-commerce platforms
- **Advanced Filtering**: Search and filter combinations
- **Pricing Rules**: Automatic pricing based on rules and formulas

### Technical Improvements

- **Database Integration**: Replace localStorage with proper database
- **Real-time Collaboration**: Multiple users editing simultaneously
- **Offline Support**: PWA functionality with offline capabilities
- **Unit Testing**: Comprehensive test coverage with Jest/RTL
- **E2E Testing**: Playwright tests for user workflows
- **Performance Monitoring**: Analytics and performance tracking
