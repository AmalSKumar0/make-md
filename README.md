# 🎨 Make.md

An ultra-elegant, high-performance, and distraction-free Markdown Editor built for the modern web. Beautifully designed with a premium, minimalist aesthetic, featuring a dual-mode layout, responsive Zen writing experience, and robust styling configurations.

🔗 **Live Application URL**: [make.amalskumar.dev](https://make.amalskumar.dev)

---

## ✨ Features

### 🌸 1. Interactive & Crafted Landing Page
- A beautifully designed, Swiss-modern hero layout inspired by premium art galleries.
- Ambient grid background pattern with customized floating decorative elements (star & rainbow graphics).
- Polished, responsive layout incorporating smooth hover animations and a dark/light mode toggle.

### 📝 2. Modular Multi-Layout Workspace
- **Split-Screen Mode**: Perfect side-by-side editing and real-time live preview rendering on desktop.
- **Editor-Only / Preview-Only Focus Modes**: Switch focus dynamically with modular workspace controls to suit your current task.
- **Interactive Formatting Toolbar**: Instantly inject markdown syntax for bold, italics, strikethrough, headers, tables, links, blockquotes, lists, and code blocks.

### 🧘 3. Optimized Zen Writing Experience
- Immersive fullscreen Zen layout designed to eliminate visual noise.
- **Mobile-Tailored Zen Mode**: Dynamic layout shifts, adaptive line padding (12px on mobile vs. 32px on desktop), and fully-hidden distractions to maximize typing efficiency on smaller touchscreens.
- Smooth escape key handler (`Esc`) to enter and exit Zen mode instantly on desktop devices.

### 📱 4. Mobile-First Craftsmanship
- Customized mobile top header containing a neat brand logo and a mobile-specific floating segmented layout switcher.
- **Quick-Download Button**: Replaces complex desktop inputs with a simplified, elegant popup modal. Enter your custom filename, choose a template or keep your current text, and export to a standard `.md` file in one single tap!

### 🌗 5. Unified Dark & Light Mode Engine
- Persistent local-storage state engine that seamlessly synchronizes the selected color theme across the landing page and active workspace views.
- Deep-slate custom dark palette designed to reduce eye-strain, paired with crisp sans-serif/serif/monospace visual hierarchies.

### 📂 6. Native Drag-and-Drop File Importer
- Import existing markdown files dynamically by dragging them onto the workspace container or uploading through the file explorer to continue writing immediately.

---

## 🛠️ Tech Stack & Styling Guidelines

- **Framework**: [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vite.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Typography Pairings**: 
  - *Serif*: **Playfair Display** (for displays & prominent headings)
  - *Sans-serif*: **Inter** (for high-contrast workspace controls and functional UI)
  - *Monospace*: **JetBrains Mono** (for robust code formatting and live editor text)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 🚀 Getting Started

To run the project locally, follow these simple steps:

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (v18 or higher) and [npm](https://www.npmjs.com/) installed.

### Installation & Run

1. Clone or download the project files.
2. Open your terminal in the project directory and install the necessary dependencies:
   ```bash
   npm install
   ```
3. Start the local development server:
   ```bash
   npm run dev
   ```
4. Access the application in your browser at `http://localhost:3000`.

---

## 💻 Script Reference

- `npm run dev`: Boots up the local Vite dev server.
- `npm run build`: Compiles production-ready static assets into the `/dist` directory.
- `npm run lint`: Verifies type-safety and style checking using ESLint and TypeScript compilation checks.

---

*Crafted with absolute precision, high typographical control, and structural minimalism.*
