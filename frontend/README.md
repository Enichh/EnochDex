# EnochDex - Manga Reader

A static manga reading application that connects directly to the MangaDex API. No backend server required!

## Features

- **Browse Manga Library**: Discover new manga series with search functionality
- **Chapter Reader**: Read manga chapters directly in your browser
- **Responsive Design**: Works on desktop and mobile devices
- **No Backend Needed**: All data comes directly from MangaDex API
- **Fast Loading**: Static site with minimal dependencies

## Project Structure

```
enochdex/
├── css/                # Stylesheets
│   ├── styles.css      # Global styles
│   ├── index.css       # Home page styles
│   ├── manga.css       # Manga list styles
│   └── chapter.css     # Chapter reader styles
├── js/                 # JavaScript files
│   ├── main.js         # Common utilities and API client
│   ├── index.js        # Home page functionality
│   ├── manga.js        # Manga list functionality
│   └── chapter.js      # Chapter reader functionality
├── images/             # Local image assets (if any)
├── index.html          # Home page
├── manga.html          # Browse manga page
├── chapter.html        # Chapter reader page
├── _redirects          # Netlify SPA routing
└── netlify.toml        # Netlify configuration
```

## Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, or Edge)
- No server or Node.js required!

### Local Development

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd enochdex
   ```

2. **Open in your browser**
   Simply open `index.html` in your web browser

## Deployment

### Netlify (Recommended)

1. Zip the `frontend` folder
2. Go to [Netlify](https://app.netlify.com/)
3. Drag and drop the zip file
4. Your site will be deployed automatically

### Alternative: GitHub Pages

1. Push your code to a GitHub repository
2. Go to Settings > Pages
3. Select the main branch and the root folder
4. Save and wait for deployment

## Features in Detail

### Home Page

- Featured manga
- Recently updated chapters
- Quick search functionality

### Browse Page

- Search manga by title
- Filter by content rating
- Responsive grid layout

### Chapter Reader

- Full-screen reading mode
- Page navigation
- Zoom controls

## Customization

### Styling

- Edit the CSS files in the `css/` directory to customize the look and feel
- The color scheme can be modified in `css/styles.css`

### Configuration

- API endpoints are configured in `js/main.js`
- Update the `MANGA_DEX_API` constant if needed

## Troubleshooting

### CORS Issues

If you encounter CORS errors when making API requests, you may need to use a CORS proxy. Update the API client in `js/main.js` to use a CORS proxy like `cors-anywhere`.

### Image Loading

If cover images don't load, check the browser's console for errors. The app uses MangaDex's image CDN, so ensure your internet connection is stable.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with vanilla HTML, CSS, and JavaScript
- Uses the public [MangaDex API](https://api.mangadex.org/)
- Responsive design for all devices
