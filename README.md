# LCARS Framework

A lightweight CSS framework for creating authentic **LCARS** (Library Computer Access/Retrieval System) style interfaces, inspired by the iconic Star Trek user interface.

## Features

- 🎨 **Authentic LCARS Color Palette** - Orange, purple, blue, red, and more
- 📐 **Flexible Layout System** - Rows, containers, and responsive design
- 🔘 **Ready-to-Use Components** - Bars, panels, buttons, corners
- ✨ **Built-in Animations** - Blinking effects for alerts and status indicators
- 📱 **Responsive** - Works on desktop and mobile devices
- 🚀 **Pure CSS** - No JavaScript dependencies required

## Quick Start

### Installation

1. Clone or download this repository
2. Link the CSS file in your HTML:

```html
<link rel="stylesheet" href="css/lcars.css">
```

### Basic Usage

```html
<div class="lcars-container">
    <div class="lcars-row">
        <div class="lcars-bar orange"></div>
        <div class="lcars-bar purple"></div>
    </div>
    
    <div class="lcars-row">
        <div class="lcars-panel text">
            <h1 class="lcars-title">Welcome to LCARS</h1>
            <p class="lcars-text">Your interface content here...</p>
        </div>
    </div>
</div>
```

## Components

### Layout System

- **`.lcars-container`** - Main container with max-width and padding
- **`.lcars-row`** - Flex row for horizontal layouts
  - `.fill` - Fill available space
  - `.centered` - Center content
  - `.full-centered` - Center in full viewport
  - `.right` - Align to right

### LCARS Bars

Horizontal colored bars with rounded edges:

```html
<div class="lcars-bar orange"></div>
<div class="lcars-bar purple small"></div>
<div class="lcars-bar blue large"></div>
```

**Sizes:** `small`, default, `large`

### LCARS Panels

Content containers with rounded corners:

```html
<div class="lcars-panel orange">Content</div>
<div class="lcars-panel text">Text content with border</div>
```

### LCARS Buttons

Interactive buttons with hover effects:

```html
<button class="lcars-button">Initialize</button>
<button class="lcars-button red">Alert</button>
<button class="lcars-button blue">Scan</button>
```

### LCARS Corners

Rounded corner elements:

```html
<div class="lcars-corner top-left orange"></div>
<div class="lcars-corner bottom-right purple"></div>
```

### Text Elements

- **`.lcars-title`** - Large heading text
- **`.lcars-subtitle`** - Medium heading text
- **`.lcars-text`** - Regular body text

### Lists

```html
<ul class="lcars-list">
    <li>Item 1</li>
    <li>Item 2</li>
    <li>Item 3</li>
</ul>
```

## Color Palette

Available colors for bars, panels, and buttons:

- `orange` (default)
- `red`
- `purple`
- `blue`
- `yellow`
- `tan`
- `peach`
- `sky`

Usage: Add color class name to any component, e.g., `lcars-bar red`, `lcars-panel blue`

## Animations

Add blinking effects to any element:

```html
<div class="lcars-bar red blink"></div>
<div class="lcars-bar orange blink-fast"></div>
<div class="lcars-bar purple blink-slow"></div>
```

## Utility Classes

- **Flex:** `flex-1`, `flex-2`, `flex-3`
- **Text Alignment:** `text-center`, `text-left`, `text-right`
- **Spacing:** `mt-10`, `mt-20`, `mb-10`, `mb-20`

## Example

Check out the example file at `examples/index.html` for a complete demonstration of all components.

To view the example:
1. Open `examples/index.html` in your web browser
2. Or use a local web server for the best experience

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is open source and available under the MIT License.

## Credits

Inspired by the Star Trek LCARS interface design originally created by Michael Okuda.

---

**Live long and prosper!** 🖖