# Frontend Pages Documentation — CINE Listing Pages

This document details the architecture, design systems, and behaviors of the product catalog/listing page (`movies.html`) on CINE.

---

## 1. Movie Listing Page (`movies.html`)

The Movie Listing page serves as a centralized, high-performance product catalog supporting real-time catalog filtering, tab switching, and inline cinematic trailer overlays.

### Purpose
To display standard categories of theatrical movies in a clean 4-column responsive grid matching the CINE premium light-mode cinematic design guidelines.

### Supported Categories
1.  **Phim Đang Chiếu (`now-showing`):** Displaying currently showing movies in theatres (16 curated titles).
2.  **Phim Sắp Chiếu (`coming-soon`):** Displaying upcoming theatrical releases (20 curated titles, rendering release dates instead of IMDb ratings).
3.  **Phim IMAX (`imax`):** Special category showcasing movies available in premium IMAX formats (8 curated titles).
4.  **Toàn Quốc (`nationwide`):** Master view combining all available movies into a unified catalog list (36 curated titles).

---

## 2. Routing Pattern

The page utilizes query parameter-based dynamic routing (`?category=now-showing`) to enable full bookmarkability and smooth SPA-style transitions without full-page reloads.

### Dynamic Navigation API
Tabs hook into a popstate-compatible transition system using `history.pushState` to update browser history entries:
```javascript
// Switches category and updates address bar dynamically
handleCategorySwitch(category, updateUrl = true);
```

### URL Bindings
*   `movies.html?category=now-showing` (Default fallback)
*   `movies.html?category=coming-soon`
*   `movies.html?category=imax`
*   `movies.html?category=nationwide`

---

## 3. Movie Card Components

Each card is built dynamically in JavaScript to guarantee high performance and match the Home page visual identity.

### Structural Schema
```html
<div class="movie-card" data-movie-id="dune-part-two">
  <div class="movie-poster-wrap">
    <img src="...poster.jpg" alt="Dune" class="movie-poster" />
    <span class="age-rating-badge t16">T16</span>
    
    <!-- Hover Overlay Actions -->
    <div class="movie-overlay">
      <a href="movie-detail.html?id=dune-part-two#schedule" class="btn-primary movie-action-btn">Đặt vé</a>
      <button class="btn-ghost movie-action-btn trailer-btn" data-src="...video.mp4">
        Trailer
      </button>
    </div>
  </div>
  <div class="movie-info">
    <h3 class="movie-title-link">Dune: Cát Song - Phần Hai</h3>
    <div class="movie-meta-row">
      <span class="rating">★ 8.7</span>
      <span class="genre-tag">Sci-Fi</span>
    </div>
  </div>
</div>
```

### Classification System (Age Rating)
Badges automatically adjust backgrounds depending on standard age classifications:
*   `P` (General): Green (`var(--color-success)`)
*   `K` (Parental Guidance under 13): Blue (`var(--color-info)`)
*   `T13` (Ages 13+): Yellow (`var(--color-warning)`)
*   `T16` (Ages 16+): Orange (`#f97316`)
*   `T18` (Ages 18+): Red (`var(--color-error)`)

### Card Interaction Behaviors
*   **Card Body Click:** Navigates directly to `movie-detail.html?id={movieId}`.
*   **"Đặt vé" Button:** Navigates to `movie-detail.html?id={movieId}#schedule` to jump directly into booking showtimes.
*   **"Trailer" Button:** Prevents default propagation and calls the inline cinematic trailer player overlay immediately without navigating away.

---

## 4. Centralized Database Schema

Mock records are stored centrally in [movies-data.js](file:///c:/DATN_learn/TESTUI/assets/js/data/movies-data.js) under the constant `CINE_MOVIES_DB` with the following model:

```typescript
interface CineMovie {
  id: string;          // Unique string identifier (e.g. "dune-part-two")
  title: string;       // Vietnamese display title
  poster: string;      // Curated image URL
  rating: number;      // IMDb rating (0.0 to 10.0)
  ageRating: string;   // Classification code ("P", "K", "T13", "T16", "T18")
  category: string;    // Active catalog tab ("now-showing" | "coming-soon" | "imax")
  genre: string;       // Slash-separated categories (e.g. "Sci-Fi / Adventure")
  format: string;      // Premium format string (e.g. "IMAX 2D", "3D 4DX")
  trailerSrc: string;  // Direct video sample URL
}
```

---

## 5. Inline Trailer Player Integration

Clicking "Trailer" on any grid card intercepts event bubbling and updates the global trailer modal's custom `.cine-video-player` child elements:
```javascript
const playTrailer = (src, poster, title) => {
  const video = trailerModal.querySelector('video.cine-video-element');
  const posterOverlay = trailerModal.querySelector('.cine-poster-overlay');
  
  video.src = src; // Loads new video stream
  posterOverlay.style.backgroundImage = `url('${poster}')`; // Sets poster backdrop
  
  // Triggers overlay modal & plays
  trailerModal.classList.add('open');
  video.play();
};
```
This guarantees consistent state management and stops video playback immediately when the modal is closed or clicked outside.
