// Main JavaScript file for common functionality

// MangaDex API Configuration
const MANGA_DEX_API = 'https://api.mangadex.org';

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Mobile navigation toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// API Helper Functions
const api = {
    // GET request
    get: async (endpoint) => {
        try {
            // Convert relative endpoint to full MangaDex URL
            const url = endpoint.startsWith('http') ? endpoint : `${MANGA_DEX_API}${endpoint}`;
            const response = await fetch(url);
            return await response.json();
        } catch (error) {
            console.error('API GET Error:', error);
            throw error;
        }
    },

    // POST request
    post: async (endpoint, data) => {
        try {
            // Convert relative endpoint to full MangaDex URL if needed
            const url = endpoint.startsWith('http') ? endpoint : `${MANGA_DEX_API}${endpoint}`;
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            return await response.json();
        } catch (error) {
            console.error('API POST Error:', error);
            throw error;
        }
    },

    // PUT request
    put: async (endpoint, data) => {
        try {
            // Convert relative endpoint to full MangaDEX URL if needed
            const url = endpoint.startsWith('http') ? endpoint : `${MANGA_DEX_API}${endpoint}`;
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            return await response.json();
        } catch (error) {
            console.error('API PUT Error:', error);
            throw error;
        }
    },

    // DELETE request
    delete: async (endpoint) => {
        try {
            // Convert relative endpoint to full MangaDEX URL if needed
            const url = endpoint.startsWith('http') ? endpoint : `${MANGA_DEX_API}${endpoint}`;
            const response = await fetch(url, {
                method: 'DELETE'
            });
            return await response.json();
        } catch (error) {
            console.error('API DELETE Error:', error);
            throw error;
        }
    }
};

// Utility Functions
const utils = {
    // Format date
    formatDate: (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    },

    // Truncate text
    truncateText: (text, maxLength) => {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    },

    // Debounce function for search
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Show loading state
    showLoading: (element) => {
        element.innerHTML = '<div class="loading">Loading...</div>';
    },

    // Show error message
    showError: (element, message) => {
        element.innerHTML = `<div class="error">Error: ${message}</div>`;
    },

    // Create element with classes
    createElement: (tag, className, content) => {
        const element = document.createElement(tag);
        if (className) element.className = className;
        if (content) element.textContent = content;
        return element;
    }
};

// Export for use in other scripts
window.api = api;
window.utils = utils;
