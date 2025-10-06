# Manga Reader

A full-stack manga reading application built with Node.js, Express.js, and vanilla HTML/CSS/JavaScript.

## Features

- **Browse Manga Library**: Discover new manga series with filtering and search functionality
- **Chapter Reader**: Read manga chapters with customizable viewing options
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Modern UI**: Clean, intuitive interface for the best reading experience

## Project Structure

```
manga-reader/
│
├── backend/
│   ├── controllers/        # Request handlers
│   ├── routes/            # API route definitions
│   ├── services/          # Business logic
│   ├── middleware/        # Custom middleware
│   ├── utils/             # Utility functions
│   ├── models/            # Data models (structure)
│   ├── config/            # Configuration files
│   ├── public/            # Static files (images, etc.)
│   ├── app.js             # Express application entry point
│   └── .env               # Environment variables
│
├── frontend/
│   ├── css/               # Stylesheets
│   ├── js/                # JavaScript files
│   ├── assets/            # Static assets
│   ├── index.html         # Home page
│   ├── manga.html         # Browse manga page
│   └── chapter.html       # Chapter reader page
│
├── README.md
├── package.json
└── .gitignore
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd manga-reader
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**

   - Copy `.env.example` to `.env` (if available)
   - Update environment variables as needed

4. **Start the development server**

   ```bash
   npm start
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## Available Scripts

- `npm start` - Start the production server
- `npm run dev` - Start the development server with auto-reload
- `npm test` - Run tests

## API Endpoints

### Manga Endpoints

- `GET /api/manga` - Get all manga (with optional filters)
- `GET /api/manga/:id` - Get manga by ID
- `GET /api/manga/:id/chapters` - Get chapters for a manga

## Frontend Pages

- **Home (`/`)**: Featured manga and recent chapters
- **Browse (`/manga.html`)**: Search and filter manga library
- **Reader (`/chapter.html`)**: Read manga chapters

## Features in Detail

### Home Page

- Featured manga carousel
- Recently updated chapters
- Quick search functionality

### Browse Page

- Advanced filtering by genre, status, and more
- Search functionality
- Pagination support
- Responsive grid layout

### Chapter Reader

- Full-screen reading mode
- Keyboard navigation (arrow keys)
- Zoom controls
- Fit width/height options
- Bookmark functionality

## Configuration

The application can be configured through environment variables:

- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Environment mode (development/production)
- `DATABASE_URL`: Database connection string
- `FRONTEND_URL`: Frontend application URL

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if necessary
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with Node.js and Express.js
- Frontend uses vanilla HTML/CSS/JavaScript for maximum compatibility
- Responsive design principles for mobile-first approach
