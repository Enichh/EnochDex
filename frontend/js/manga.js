// Manga Browser Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize page
    loadManga();
    setupFilters();
    setupPagination();
});

// Global state
let currentPage = 1;
let currentFilters = {
    search: '',
    genre: '',
    status: '',
    sortBy: 'title'
};

// Load manga with current filters
async function loadManga(page = 1) {
    const container = document.getElementById('mangaGrid');
    utils.showLoading(container);

    try {
        // Build query parameters
        const params = new URLSearchParams({
            page: page,
            limit: 20,
            ...currentFilters
        });

        const response = await api.get(`/manga?${params}`);
        const data = response.data || [];

        if (data.length === 0) {
            container.innerHTML = '<div class="no-data">No manga found</div>';
            return;
        }

        container.innerHTML = '';
        data.forEach(manga => {
            const mangaCard = createMangaCard(manga);
            container.appendChild(mangaCard);
        });

        // Update pagination info
        updatePaginationInfo(page, 20, 100); // Assuming 100 total for demo

    } catch (error) {
        utils.showError(container, 'Failed to load manga');
    }
}

// Create manga card element
function createMangaCard(manga) {
    const card = utils.createElement('div', 'manga-card');

    const statusClass = manga.status.toLowerCase();

    card.innerHTML = `
        <div class="manga-cover-container">
            <img src="${manga.coverImage || '/public/images/no-cover.jpg'}"
                 alt="${manga.title}"
                 class="manga-cover"
                 onerror="this.src='/public/images/no-cover.jpg'">
            <div class="manga-overlay">
                <h3 class="manga-title">${utils.truncateText(manga.title, 25)}</h3>
                <p class="manga-author">${manga.author}</p>
                <div class="manga-stats">
                    <span class="manga-chapters">${manga.chapters} chapters</span>
                </div>
            </div>
        </div>
    `;

    card.addEventListener('click', () => {
        window.location.href = `chapter.html?mangaId=${manga.id}`;
    });

    return card;
}

// Setup filter functionality
function setupFilters() {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const genreFilter = document.getElementById('genreFilter');
    const statusFilter = document.getElementById('statusFilter');
    const sortBy = document.getElementById('sortBy');

    // Debounced search
    if (searchInput) {
        const debouncedSearch = utils.debounce((query) => {
            currentFilters.search = query;
            currentPage = 1;
            loadManga(currentPage);
        }, 300);

        searchInput.addEventListener('input', (e) => {
            debouncedSearch(e.target.value);
        });
    }

    // Search button
    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            if (searchInput) {
                currentFilters.search = searchInput.value;
                currentPage = 1;
                loadManga(currentPage);
            }
        });
    }

    // Genre filter
    if (genreFilter) {
        genreFilter.addEventListener('change', (e) => {
            currentFilters.genre = e.target.value;
            currentPage = 1;
            loadManga(currentPage);
        });
    }

    // Status filter
    if (statusFilter) {
        statusFilter.addEventListener('change', (e) => {
            currentFilters.status = e.target.value;
            currentPage = 1;
            loadManga(currentPage);
        });
    }

    // Sort by
    if (sortBy) {
        sortBy.addEventListener('change', (e) => {
            currentFilters.sortBy = e.target.value;
            currentPage = 1;
            loadManga(currentPage);
        });
    }
}

// Setup pagination
function setupPagination() {
    const prevBtn = document.getElementById('prevPage');
    const nextBtn = document.getElementById('nextPage');

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                loadManga(currentPage);
                updatePaginationButtons();
            }
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentPage++;
            loadManga(currentPage);
            updatePaginationButtons();
        });
    }
}

// Update pagination info
function updatePaginationInfo(currentPage, limit, total) {
    const totalPages = Math.ceil(total / limit);
    const pageInfo = document.getElementById('pageInfo');

    if (pageInfo) {
        pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
    }

    updatePaginationButtons();
}

// Update pagination buttons
function updatePaginationButtons() {
    const prevBtn = document.getElementById('prevPage');
    const nextBtn = document.getElementById('nextPage');

    if (prevBtn) {
        prevBtn.disabled = currentPage <= 1;
    }

    if (nextBtn) {
        // Assuming we have a max of 5 pages for demo
        nextBtn.disabled = currentPage >= 5;
    }
}

// Keyboard navigation for filters
document.addEventListener('keydown', function(e) {
    // Enter key on search input
    if (e.key === 'Enter') {
        const searchInput = document.getElementById('searchInput');
        if (searchInput && searchInput === document.activeElement) {
            e.preventDefault();
            document.getElementById('searchBtn')?.click();
        }
    }
});

// Reset filters
function resetFilters() {
    currentFilters = {
        search: '',
        genre: '',
        status: '',
        sortBy: 'title'
    };
    currentPage = 1;

    // Reset form elements
    const searchInput = document.getElementById('searchInput');
    const genreFilter = document.getElementById('genreFilter');
    const statusFilter = document.getElementById('statusFilter');
    const sortBy = document.getElementById('sortBy');

    if (searchInput) searchInput.value = '';
    if (genreFilter) genreFilter.value = '';
    if (statusFilter) statusFilter.value = '';
    if (sortBy) sortBy.value = 'title';

    loadManga(currentPage);
}
