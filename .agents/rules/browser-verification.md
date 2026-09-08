# Mandatory Browser Walk & Visual Verification Rule

## 🚨 Non-Negotiable Operating Rule for All AI Agents

Whenever implementing or modifying UI components, styling, layout, embedded media, or completing user features:

1. **Mandatory Live Browser Inspection**:
   - **DO NOT** declare a feature complete or assume UI works based solely on build/typecheck commands.
   - You **MUST** launch a visual browser walk (using the `browser_subagent` or Playwright/browser tools) to inspect the live running site or local preview.
   - Visually verify:
     - All embedded media (YouTube videos, images, audio players) load and render without "Video unavailable", 404, or CORS/CSP errors.
     - Avatars, illustrations, and icons display properly and are not broken links.
     - Responsive layouts and spacing match design guidelines across desktop and mobile viewports.
     - Typography, colors, and interactive elements (buttons, filters, accordions) function cleanly.

2. **Capture Evidence**:
   - Take screenshots during the browser walk as proof of correctness.
   - Confirm in your final response to the user that visual inspection was performed and verified error-free.

3. **Zero Assumptions**:
   - If an external embed (e.g. YouTube iframe) or third-party asset is used, you must explicitly confirm in the browser that it renders cleanly and is not region-blocked or disabled for embedding.
