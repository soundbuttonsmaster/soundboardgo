# SoundBoard Go

A modern soundboard website built with Astro.js, TypeScript, and Tailwind CSS.

## Features

- **SSR Home Page**: Server-side rendered home page with initial data
- **CSR Load More**: Client-side rendering for load-more functionality
- **ISR-Ready Category Pages**: Category pages set up for future Incremental Static Regeneration
- **Authentication**: Full login and registration system
- **Service Layer**: Organized API services with Axios interceptors
- **Session Storage**: Uses sessionStorage for token management
- **SEO-Friendly**: Proper meta tags and semantic HTML
- **Light Theme**: Clean, modern light theme design

## Tech Stack

- **Astro.js** - Web framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React** - Interactive components
- **Axios** - HTTP client

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. (Optional) Create a `.env` file if you need to change the API URL:
```
PUBLIC_API_BASE_URL=http://localhost:8000/api
```
**Note:** The default API URL is `http://localhost:8000/api`. You only need `.env` if your API is at a different URL.

3. Start the development server:
```bash
npm run dev
```

The site will be available at `http://localhost:4321`

## Project Structure

```
src/
├── components/       # React and Astro components
├── layouts/          # Page layouts
├── pages/            # Route pages
├── services/         # API services
└── types/            # TypeScript types
```

## API Configuration

The application expects a backend API. The default API URL is `http://localhost:8000/api`. 

To change it, create a `.env` file with:
```
PUBLIC_API_BASE_URL=your-api-url-here
```

Or modify the default in `src/services/api.ts`.

### Required API Endpoints

- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login
- `GET /api/auth/users/me/` - Get current user
- `GET /api/sounds/` - Get sounds (with pagination)
- `GET /api/categories/` - Get categories
- `GET /api/categories/{slug}/` - Get category by slug

## Build

```bash
npm run build
```

## Preview

```bash
npm run preview
```

## Features Overview

### Home Page (SSR)
- Server-side rendered with initial data
- Three sections: New Sounds, Trending Sounds, Categories
- SEO-optimized

### Load More (CSR)
- Client-side rendered load-more buttons
- Fetches additional sounds dynamically
- Maintains state on the client

### Category Pages (ISR-Ready)
- Set up for future Incremental Static Regeneration
- Dynamic routes for each category
- SEO-friendly URLs

### Authentication
- Login and registration forms
- Token-based authentication
- Session storage for tokens
- Automatic token injection via Axios interceptor

## Customization

The service layer is fully customizable. You can modify:
- `src/services/api.ts` - API configuration and interceptors
- `src/services/auth.service.ts` - Authentication logic
- `src/services/sound.service.ts` - Sound data fetching

## License

MIT

