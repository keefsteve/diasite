# Interactive Profile - MVP

A multi-page interactive experience to discover information about a person through exploration, collectibles, and mini-games.

## Features
- **Landing Page**: Beige background with pink "parent" text, one collectible key, and arrow navigation
- **Arrow Navigation**: Left arrow → minigame, Right arrow → CV page
- **Inventory System**: Persistent inventory bar across all pages
- **Mini-game**: Click challenge with red circles and scoring
- **CV Page**: About section with profile, experience, skills, and interests
- **Future-ready**: Structure prepared for map-based navigation (see HTML comments)

## How to Run
Open `index.html` directly in your browser:

```bash
open index.html
```

Or serve via HTTP server:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Structure
- **Landing page** (`#landing-page`): Entry point with key collectible
- **Minigame page** (`#minigame-page`): Click challenge game
- **CV page** (`#cv-page`): Person's profile and background

## Next Steps for Fine-tuning
- Replace CV content with actual person info
- Add more collectible objects on different pages
- Implement map overlay navigation (see HTML comments for starter code)
- Add more mini-games accessible from different pages
- Customize colors and fonts to match brand/theme
- Add sound effects or background music

## Files
- `index.html` — page structure with landing, minigame, and CV pages
- `style.css` — beige/pink theme styling
- `app.js` — page navigation, inventory, and minigame logic
# diasite