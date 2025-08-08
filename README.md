# Shopify Product Variations Manager

A Next.js TypeScript application that allows users to manage product variations with a drag-and-drop interface.

## Features

- ✅ **Add Variations**: Click the "Add Variation" button to create new product variations
- ✅ **Delete Variations**: Remove variations using the trash icon
- ✅ **Drag & Drop Reordering**: Reorder variations by dragging them using the grip handle
- ✅ **Accordion Interface**: Each variation is displayed as an accordion that can be expanded/collapsed
- ✅ **Editable Variation Names**: Click the edit icon to rename variations inline
- ✅ **Add Options**: Each variation can contain multiple options with name-value pairs
- ✅ **Manage Options**: Edit or delete individual options within each variation
- ✅ **Responsive Design**: Works on desktop and mobile devices

## Technology Stack

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety and better developer experience
- **Tailwind CSS** - Utility-first CSS framework for styling
- **@dnd-kit** - Modern drag-and-drop library for React
- **Lucide React** - Beautiful icon library

## Getting Started

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Run the development server:**

   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

### Adding Variations

1. Click the "Add Variation" button in the top right
2. A new variation will be created with a default name
3. Click the edit icon next to the variation name to rename it

### Managing Options

1. Click on a variation to expand it
2. Use the "Add New Option" section at the bottom to add options
3. Fill in both the option name (e.g., "Color") and value (e.g., "Red")
4. Click "Add Option" to save
5. Edit existing options directly in their input fields
6. Delete options using the X button

### Reordering Variations

1. Hover over the grip icon (⋮⋮) on the left side of any variation
2. Click and drag to reorder the variations
3. The order will be maintained until you refresh the page

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Main page component
│   └── layout.tsx            # Root layout
├── components/
│   ├── VariationsSection.tsx # Main variations container with DnD
│   └── SortableVariation.tsx # Individual variation component
└── types/
    └── variations.ts         # TypeScript interfaces
```

## Key Components

### VariationsSection

- Manages the overall state of all variations
- Implements drag-and-drop functionality using @dnd-kit
- Handles adding/deleting variations

### SortableVariation

- Individual variation component with accordion interface
- Manages options within each variation
- Handles inline editing of variation names
- Implements the drag handle for reordering

## Future Enhancements

- Persist variations to localStorage or database
- Add validation for option names/values
- Implement variation templates
- Add bulk operations for options
- Export/import functionality
