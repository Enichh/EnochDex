// Chapter Reader Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const mangaId = urlParams.get('mangaId') || '1';
    const chapterId = urlParams.get('chapterId') || '1';

    // Initialize page
    loadChapter(mangaId, chapterId);
    setupReaderControls();
    setupKeyboardNavigation();
});

// Global state
let currentMangaId = '1';
let currentChapterId = '1';
let currentPage = 1;
let totalPages = 25;
let isFullscreen = false;

// Load chapter data
async function loadChapter(mangaId, chapterId) {
    currentMangaId = mangaId;
    currentChapterId = chapterId;

    const container = document.getElementById('pageContainer');
    utils.showLoading(container);

    try {
        // Load manga info
        const mangaResponse = await api.get(`/manga/${mangaId}`);
        const manga = mangaResponse.data;

        // Load chapter info
        const chapterResponse = await api.get(`/manga/${mangaId}/chapters`);
        const chapters = chapterResponse.data;
        const currentChapter = chapters.find(c => c.id == chapterId) || chapters[0];

        // Update page title
        document.title = `${currentChapter.title} - ${manga.title} - Manga Reader`;

        // Update chapter info in header
        updateChapterInfo(manga, currentChapter, chapters);

        // Load chapter pages (simulated for demo)
        await loadChapterPages(currentChapter);

    } catch (error) {
        utils.showError(container, 'Failed to load chapter');
    }
}

// Update chapter information in the UI
function updateChapterInfo(manga, chapter, chapters) {
    // Update manga title
    const mangaTitleElement = document.getElementById('mangaTitle');
    if (mangaTitleElement) {
        mangaTitleElement.textContent = manga.title;
    }

    // Update chapter title
    const chapterTitleElement = document.getElementById('chapterTitle');
    if (chapterTitleElement) {
        chapterTitleElement.textContent = chapter.title;
    }

    // Update chapter select dropdown
    const chapterSelect = document.getElementById('chapterSelect');
    if (chapterSelect) {
        chapterSelect.innerHTML = '';
        chapters.forEach(ch => {
            const option = document.createElement('option');
            option.value = ch.id;
            option.textContent = `Chapter ${ch.chapterNumber}: ${utils.truncateText(ch.title, 30)}`;
            if (ch.id == currentChapterId) {
                option.selected = true;
            }
            chapterSelect.appendChild(option);
        });

        chapterSelect.addEventListener('change', (e) => {
            const newChapterId = e.target.value;
            window.location.href = `chapter.html?mangaId=${currentMangaId}&chapterId=${newChapterId}`;
        });
    }

    // Update navigation buttons
    updateNavigationButtons(chapters);
}

// Update navigation buttons
function updateNavigationButtons(chapters) {
    const currentIndex = chapters.findIndex(c => c.id == currentChapterId);
    const prevBtn = document.getElementById('prevChapter');
    const nextBtn = document.getElementById('nextChapter');
    const prevBtnBottom = document.getElementById('prevChapterBottom');
    const nextBtnBottom = document.getElementById('nextChapterBottom');

    // Previous chapter
    if (prevBtn) {
        if (currentIndex > 0) {
            prevBtn.disabled = false;
            prevBtn.onclick = () => {
                const prevChapter = chapters[currentIndex - 1];
                window.location.href = `chapter.html?mangaId=${currentMangaId}&chapterId=${prevChapter.id}`;
            };
        } else {
            prevBtn.disabled = true;
        }
    }

    // Next chapter
    if (nextBtn) {
        if (currentIndex < chapters.length - 1) {
            nextBtn.disabled = false;
            nextBtn.onclick = () => {
                const nextChapter = chapters[currentIndex + 1];
                window.location.href = `chapter.html?mangaId=${currentMangaId}&chapterId=${nextChapter.id}`;
            };
        } else {
            nextBtn.disabled = true;
        }
    }

    // Bottom navigation (same logic)
    if (prevBtnBottom) {
        prevBtnBottom.disabled = prevBtn.disabled;
        if (!prevBtn.disabled && prevBtn.onclick) {
            prevBtnBottom.onclick = prevBtn.onclick;
        }
    }

    if (nextBtnBottom) {
        nextBtnBottom.disabled = nextBtn.disabled;
        if (!nextBtn.disabled && nextBtn.onclick) {
            nextBtnBottom.onclick = nextBtn.onclick;
        }
    }
}

// Load chapter pages (simulated)
async function loadChapterPages(chapter) {
    const container = document.getElementById('pageContainer');
    container.innerHTML = '';

    // Simulate loading pages
    for (let i = 1; i <= chapter.pages; i++) {
        const pageDiv = utils.createElement('div', 'manga-page-wrapper');

        const img = document.createElement('img');
        img.src = `/public/images/sample-page-${i}.jpg`;
        img.alt = `Page ${i}`;
        img.className = 'manga-page';
        img.onerror = function() {
            // Fallback for missing images
            this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIzMCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkNoYXB0ZXIgUGFnZSAoSW1hZ2UgTm90IEZvdW5kKTwvdGV4dD48L3N2Zz4=';
        };

        pageDiv.appendChild(img);
        container.appendChild(pageDiv);
    }

    totalPages = chapter.pages;
    updatePageInfo();
}

// Setup reader controls
function setupReaderControls() {
    const fitWidthBtn = document.getElementById('fitWidth');
    const fitHeightBtn = document.getElementById('fitHeight');
    const zoomInBtn = document.getElementById('zoomIn');
    const zoomOutBtn = document.getElementById('zoomOut');
    const fullscreenBtn = document.getElementById('fullscreen');

    // Fit width/height controls
    if (fitWidthBtn) {
        fitWidthBtn.addEventListener('click', () => {
            document.body.classList.remove('fit-height');
            document.body.classList.add('fit-width');
            fitWidthBtn.classList.add('active');
            fitHeightBtn.classList.remove('active');
        });
    }

    if (fitHeightBtn) {
        fitHeightBtn.addEventListener('click', () => {
            document.body.classList.remove('fit-width');
            document.body.classList.add('fit-height');
            fitHeightBtn.classList.add('active');
            fitWidthBtn.classList.remove('active');
        });
    }

    // Zoom controls
    let zoomLevel = 1;
    if (zoomInBtn) {
        zoomInBtn.addEventListener('click', () => {
            zoomLevel = Math.min(zoomLevel + 0.25, 3);
            document.body.style.zoom = zoomLevel;
        });
    }

    if (zoomOutBtn) {
        zoomOutBtn.addEventListener('click', () => {
            zoomLevel = Math.max(zoomLevel - 0.25, 0.5);
            document.body.style.zoom = zoomLevel;
        });
    }

    // Fullscreen control
    if (fullscreenBtn) {
        fullscreenBtn.addEventListener('click', toggleFullscreen);
    }
}

// Toggle fullscreen mode
function toggleFullscreen() {
    const reader = document.querySelector('.chapter-reader');

    if (!isFullscreen) {
        if (reader.requestFullscreen) {
            reader.requestFullscreen();
        } else if (reader.webkitRequestFullscreen) {
            reader.webkitRequestFullscreen();
        } else if (reader.msRequestFullscreen) {
            reader.msRequestFullscreen();
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    }
}

// Handle fullscreen change events
document.addEventListener('fullscreenchange', handleFullscreenChange);
document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
document.addEventListener('msfullscreenchange', handleFullscreenChange);

function handleFullscreenChange() {
    const reader = document.querySelector('.chapter-reader');
    const fullscreenBtn = document.getElementById('fullscreen');

    if (document.fullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement) {
        isFullscreen = true;
        reader.classList.add('fullscreen');
        if (fullscreenBtn) fullscreenBtn.textContent = 'Exit Fullscreen';
    } else {
        isFullscreen = false;
        reader.classList.remove('fullscreen');
        if (fullscreenBtn) fullscreenBtn.textContent = 'Fullscreen';
    }
}

// Setup keyboard navigation
function setupKeyboardNavigation() {
    document.addEventListener('keydown', function(e) {
        switch(e.key) {
            case 'ArrowLeft':
                previousPage();
                break;
            case 'ArrowRight':
                nextPage();
                break;
            case 'f':
            case 'F11':
                e.preventDefault();
                toggleFullscreen();
                break;
            case 'Escape':
                if (isFullscreen) {
                    toggleFullscreen();
                }
                break;
        }
    });
}

// Page navigation functions
function previousPage() {
    if (currentPage > 1) {
        currentPage--;
        scrollToPage(currentPage);
        updatePageInfo();
    }
}

function nextPage() {
    if (currentPage < totalPages) {
        currentPage++;
        scrollToPage(currentPage);
        updatePageInfo();
    }
}

// Scroll to specific page
function scrollToPage(pageNumber) {
    const pages = document.querySelectorAll('.manga-page-wrapper');
    if (pages[pageNumber - 1]) {
        pages[pageNumber - 1].scrollIntoView({ behavior: 'smooth' });
    }
}

// Update page information
function updatePageInfo() {
    const pageInfoElements = document.querySelectorAll('#pageInfo');
    pageInfoElements.forEach(element => {
        element.textContent = `Page ${currentPage} of ${totalPages}`;
    });

    // Update reading progress bar
    const progress = (currentPage / totalPages) * 100;
    let progressBar = document.querySelector('.reading-progress');
    if (!progressBar) {
        progressBar = document.createElement('div');
        progressBar.className = 'reading-progress';
        document.body.appendChild(progressBar);
    }
    progressBar.style.width = `${progress}%`;
}

// Scroll-based page tracking
document.addEventListener('scroll', utils.debounce(() => {
    const pages = document.querySelectorAll('.manga-page-wrapper');
    const scrollPosition = window.scrollY + window.innerHeight / 2;

    pages.forEach((page, index) => {
        const rect = page.getBoundingClientRect();
        if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
            currentPage = index + 1;
            updatePageInfo();
        }
    });
}, 100));

// Action buttons
document.addEventListener('click', function(e) {
    if (e.target.id === 'bookmarkChapter') {
        bookmarkChapter();
    } else if (e.target.id === 'addToLibrary') {
        addToLibrary();
    } else if (e.target.id === 'reportIssue') {
        reportIssue();
    }
});

// Bookmark chapter
function bookmarkChapter() {
    // In a real app, this would save to user's bookmarks
    alert('Chapter bookmarked!');
}

// Add to library
function addToLibrary() {
    // In a real app, this would add manga to user's library
    alert('Added to library!');
}

// Report issue
function reportIssue() {
    // In a real app, this would open a report form
    alert('Issue reported!');
}
