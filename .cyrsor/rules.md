# =========================================================
# Cursor Rules for FYCI Website (Next.js + TypeScript)
# =========================================================

project:
  name: "Frontline Youth Creativity Initiative"
  description: >
    FYCI is a youth empowerment platform focused on innovation, 
    creativity, and leadership. The site is clean, modern, and 
    mobile-responsive — built with Next.js and TypeScript, 
    using the color theme #5920A4 (deep purple).

goals:
  - Build a fully responsive static website (no backend).
  - Prioritize accessibility (WCAG 2.1 AA compliant).
  - Use modern UI principles with minimal and clean aesthetics.
  - Ensure consistency across pages and components.
  - Avoid unnecessary complexity or AI hallucinations.

stack:
  frontend: 
    framework: Next.js (latest)
    language: TypeScript
    styling: Tailwind CSS
  backend:
    none (static site only)

rules:
  - Never assume or fabricate backend APIs or endpoints.
  - Do not generate database logic, authentication, or user models.
  - All components must be functional components using TypeScript.
  - Use Tailwind CSS utility classes for all styling (no inline styles).
  - Ensure every page and section is **mobile-first and responsive**.
  - Maintain consistent use of the primary color #5920A4 and neutral tones (#FFFFFF, #F7F7F7, #1F1F1F, #E2E2E2).
  - Always use semantic HTML (e.g., <header>, <main>, <footer>, <section>, <nav>).
  - Use <Image> from "next/image" for all images to optimize performance.
  - Avoid generating any fictional content, company data, or names.
  - Text content should be professional, inspiring, and youth-focused.
  - Keep component files organized under `/components` and pages under `/app` (Next.js App Router).
  - Always verify that Tailwind classes are valid and not hallucinated.
  - All layout and spacing should use Tailwind’s spacing scale (e.g., p-4, m-8, etc.).
  - When using icons, use lucide-react or Heroicons, not unverified packages.
  - Use Shadcn/UI components when suitable for modern UI consistency.
  - Do not include commented-out code or unused imports.
  - Optimize images for performance (webp or svg).
  - Always check for TypeScript errors and fix them before continuing.

ui_guidelines:
  - Layouts should have clear visual hierarchy and adequate whitespace.
  - Typography should be clean and modern (use Inter or Poppins).
  - Buttons should have solid or outline styles using #5920A4.
  - Hover states should use slightly lighter tones (e.g., #6B35C7).
  - Avoid gradients, shadows, or heavy animations unless minimal.
  - Navigation should collapse into a mobile menu below 768px width.

deployment:
  - The build output should be fully static (`next build && next export`).
  - The site should be ready for deployment to Vercel or Netlify.

meta:
  author: "Promise Chime"
  last_updated: "2025-10-08"
  version: "1.0"
