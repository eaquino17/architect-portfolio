Francis de Padua Portfolio Website — Deployment Package

This package is ready for GitHub Pages, Netlify, Vercel, or any static host.

IMPORTANT: index.html must remain in the same folder as styles.css, script.js, and the assets/ directory.

Recommended GitHub Pages setup:
Settings → Pages → Deploy from a branch → main → / (root)

The gallery uses URL resolution based on document.baseURI, so assets work when the site is hosted at a GitHub Pages project URL such as:
https://USERNAME.github.io/de-padua-architect-portfolio/

The gallery also preloads adjacent images, waits for the next image to load before switching, handles failed image loads, supports keyboard navigation, and supports swipe navigation on mobile.
