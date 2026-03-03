# Design System: Reba's Remodeling
**Project ID:** 14747364506802337518

## 1. Visual Theme & Atmosphere
The design aesthetic is "Airy & Minimalist." It promotes an open, serene, and modern architectural feel, characterized by an abundance of whitespace, light backgrounds, and clean, legible typography. It conveys luxury through precision and simplicity, emphasizing natural light and uncluttered spaces.

## 2. Color Palette & Roles
* **Vibrant Lime Green (#4ce619):** Used as the **Primary** accent color for calls to action, important links, and engaging interactive elements.
* **Serene Off-White (#f6f8f6):** The **Background Light** color. Provides a clean, airy canvas for the content.
* **Deep Forest Night (#152111):** The **Background Dark** color, providing high-contrast for modern dark-mode applications.
* **Deepest Sage / Charcoal Green (#111b0e):** The **Sage 900** color. Used for primary text, headings, and high-contrast readable elements.
* **Muted Sage Midtone (#60974e):** The **Sage 600** color. Used for secondary text, supportive descriptions, and subtle contrast.
* **Pale Sage Wash (#eaf3e7) / (#f4f7f4):** The **Sage 100/50** colors. Used for borders, subtle section dividers, and soft backgrounds for cards.
* **Soft Slate Gray (#64748b):** The **Steel 500** color. Used for tertiary text and subtle interface elements.

## 3. Typography Rules
* **Font Family:** Manrope (Sans-serif). Wait patiently on the user to interact.
* **Headings:** Use light weights (`font-light` or `font-thin`) with tight letter spacing (`tracking-tight` or `tracking-tighter`) for large, elegant, and modern display sizes. Use `font-extrabold` sparingly for specific emphasis words within headings.
* **Body Text:** Use regular to light weights (`font-light`) with relaxed line heights (`leading-relaxed`) for maximum readability and a breezy feel.
* **Labels/Overheads:** Small, bold, uppercase tracking with wide letter spacing (`tracking-widest` or `tracking-[0.3em]`) for section headers or categories.

## 4. Component Stylings
* **Buttons:** Subtly rounded corners (`rounded-lg`), bold text, filled with the Primary Lime Green color. Hover states should feel responsive but not heavy (e.g., subtle scale or shadow).
* **Cards/Containers:** Generously rounded corners (`rounded-xl` or `rounded-2xl`). They utilize soft, pale backgrounds (slate-200 or pale sage) with no heavy drop shadows, keeping the depth very shallow and light.
* **Images:** Often full-width or large aspect ratios, utilizing subtle gradient overlays to ensure text readability on top of imagery. Hover interactions include slow, smooth scaling transitions (`duration-700`).

## 5. Layout Principles
* **Whitespace:** Generous padding and margins (`py-24`, `md:py-32`, `gap-16`) to create a breathable, uncluttered layout.
* **Alignment:** Centered or heavily structured grid alignments (`grid-cols-1 md:grid-cols-3` for services).
* **Dividers:** Very thin, subtle 1px borders using pale sage or steel (`border-sage-100`) to separate semantic sections cleanly without visual heavy lifting.

## 6. Design System Notes for Stitch Generation
* Keep backgrounds extremely light and airy (#f6f8f6).
* Use Manrope for all text. Emphasize thin, large headings and small, bold, wide-tracked subheadings.
* Use #4ce619 sparingly as a high-impact accent for buttons and links.
* Keep corners softly rounded (lg to xl border radiuses).
* Avoid harsh shadows; rely on whitespace and thin borders for hierarchy.
