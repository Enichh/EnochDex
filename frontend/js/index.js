let currentPage = 1;
const limit = 12;
let total = 0;

// Set maximum safe pages to prevent API issues at high offsets
const MAX_PAGES = 500; // Limit to first 500 pages for reliability

// Load manga catalog with pagination
async function loadMangaCatalog(page = 1) {
  const container = document.getElementById("mangaList");
  utils.showLoading(container);

  try {
    const response = await api.get(
      `/manga?limit=${limit}&offset=${
        (page - 1) * limit
      }&contentRating[]=safe&contentRating[]=suggestive&contentRating[]=erotica&order[latestUploadedChapter]=desc&includes[]=cover_art&hasAvailableChapters=true`
    );
    const manga = response.data || [];

    container.innerHTML = "";

    if (manga.length === 0) {
      container.innerHTML = '<div class="no-data">No manga found</div>';
      return;
    }

    // Filter only manga with covers
    const mangaWithCovers = manga.filter(hasCover);

    if (mangaWithCovers.length === 0) {
      container.innerHTML =
        '<div class="no-data">No manga with covers found</div>';
      return;
    }

    mangaWithCovers.forEach((item) => {
      const mangaCard = createMangaCard(item);
      if (mangaCard) {
        container.appendChild(mangaCard);
      }
    });

    // Update pagination
    total = response.total || 0;
    document.getElementById(
      "pageInfo"
    ).textContent = `Page ${page} of ${Math.ceil(total / limit)}`;
    document.getElementById("prevPage").disabled = page <= 1;
    document.getElementById("nextPage").disabled =
      page * limit >= total || page >= MAX_PAGES;
  } catch (error) {
    utils.showError(container, "Failed to load manga catalog");
    console.error("Manga catalog error:", error);
  }
}

// Helper function to check if manga has a cover
function hasCover(manga) {
  const coverRel = manga.relationships?.find((rel) => rel.type === "cover_art");
  return !!(coverRel && coverRel.attributes && coverRel.attributes.fileName);
}

// Helper function to get the best available title from manga data
function getBestTitle(manga) {
  const titles = manga.attributes.title;
  return (
    titles?.en ||
    titles?.ja ||
    titles?.ko ||
    Object.values(titles || {})[0] ||
    "Untitled"
  );
}

// Helper function to get cover URL from MangaDex
function getCoverUrl(manga) {
  // Find the 'cover_art' relationship
  const coverRel = manga.relationships?.find((rel) => rel.type === "cover_art");
  if (coverRel && coverRel.attributes && coverRel.attributes.fileName) {
    // Preserve the original extension before thumbnail size
    return `https://uploads.mangadex.org/covers/${manga.id}/${coverRel.attributes.fileName}.256.jpg`;
  }
  // Fallback if cover not found
  return "/public/images/no-cover.jpg";
}
document.addEventListener("DOMContentLoaded", function () {
  // Load manga catalog (start with page 1)
  loadMangaCatalog(currentPage);

  // Load featured manga
  loadFeaturedManga();

  // Load recent chapters
  loadRecentChapters();

  // Set up pagination event listeners
  document.getElementById("prevPage").addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      loadMangaCatalog(currentPage);
    }
  });

  document.getElementById("nextPage").addEventListener("click", () => {
    if (currentPage < MAX_PAGES) {
      // Use MAX_PAGES as upper limit
      currentPage++;
      loadMangaCatalog(currentPage);
    }
  });
});

// Load featured manga (ALWAYS 6 COVERS)
async function loadFeaturedManga() {
  const container = document.getElementById("featuredManga");
  utils.showLoading(container);

  const featuredLimit = 6;
  let foundWithCovers = [];
  let offset = 0;

  try {
    // Keep fetching until we have 6 covers or run out of data
    while (foundWithCovers.length < featuredLimit) {
      const response = await api.get(
        `/manga?limit=${featuredLimit}&offset=${offset}`
      );
      const batch = response.data || [];

      // Filter only manga with covers in this batch
      const covers = batch.filter(hasCover);
      foundWithCovers.push(...covers);

      // If not enough covers and we got a full batch, fetch the next set
      if (
        foundWithCovers.length < featuredLimit &&
        batch.length === featuredLimit
      ) {
        offset += featuredLimit;
      } else {
        break; // Either we have enough covers or reached the end
      }
    }

    // Only display up to 6 covers
    foundWithCovers = foundWithCovers.slice(0, featuredLimit);

    container.innerHTML = "";

    if (foundWithCovers.length === 0) {
      container.innerHTML =
        '<div class="no-data">No featured manga with covers</div>';
      return;
    }

    foundWithCovers.forEach((item) => {
      const mangaCard = createMangaCard(item);
      if (mangaCard) {
        container.appendChild(mangaCard);
      }
    });
  } catch (error) {
    utils.showError(container, "Failed to load featured manga");
    console.error("Featured manga error:", error);
  }
}

// Load recent chapters (using a real manga ID)
async function loadRecentChapters() {
  const container = document.getElementById("recentChapters");
  utils.showLoading(container);

  try {
    // First, get a valid manga ID from the catalog
    const mangaResponse = await api.get("/manga?limit=1");
    const mangaList = mangaResponse.data || [];

    if (mangaList.length === 0) {
      container.innerHTML =
        '<div class="no-data">No manga available for chapters</div>';
      return;
    }

    const validMangaId = mangaList[0].id;
    console.log("Using manga ID for chapters:", validMangaId);

    // Get chapters for the valid manga
    const response = await api.get(`/manga/${validMangaId}/chapters?limit=5`);
    const chapters = response.data || [];

    if (chapters.length === 0) {
      container.innerHTML = '<div class="no-data">No recent chapters</div>';
      return;
    }

    container.innerHTML = "";

    chapters.slice(0, 5).forEach((chapter) => {
      const chapterItem = createChapterItem(chapter);
      container.appendChild(chapterItem);
    });
  } catch (error) {
    utils.showError(container, "Failed to load recent chapters");
    console.error("Recent chapters error:", error);
  }
}

// Create manga card element
function createMangaCard(manga) {
  // Double-check that this manga has a cover (safety check)
  if (!hasCover(manga)) {
    console.warn("Manga without cover passed to createMangaCard:", manga.id);
    return null;
  }

  const card = utils.createElement("div", "manga-card");

  const title = getBestTitle(manga);
  card.innerHTML = `
        <img src="${getCoverUrl(manga)}"
             alt="${title}"
             class="manga-cover"
             loading="lazy"
             onerror="this.src='/public/images/no-cover.jpg'">
        <div class="manga-info">
            <h3 class="manga-title">${utils.truncateText(title, 30)}</h3>
            <p class="manga-author">${
              manga.attributes.author || "Unknown Author"
            }</p>
            <span class="manga-status ${manga.attributes.status?.toLowerCase()}">${
    manga.attributes.status || "Unknown"
  }</span>
        </div>
    `;

  card.addEventListener("click", () => {
    window.location.href = `manga.html?id=${manga.id}`;
  });

  return card;
}

// Create chapter item element
function createChapterItem(chapter) {
  const item = utils.createElement("div", "chapter-item");

  item.innerHTML = `
        <div class="chapter-info">
            <h4>${utils.truncateText(
              chapter.attributes.title ||
                "Chapter " + chapter.attributes.chapter,
              50
            )}</h4>
            <p class="chapter-manga">${chapter.mangaTitle || "Sample Manga"}</p>
            <p class="chapter-date">Released: ${utils.formatDate(
              chapter.attributes.createdAt
            )}</p>
        </div>
        <div class="chapter-pages">
            <span>${chapter.attributes.pages || "N/A"} pages</span>
        </div>
    `;

  item.addEventListener("click", () => {
    window.location.href = `chapter.html?mangaId=1&chapterId=${chapter.id}`;
  });

  return item;
}

// Search functionality
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");

if (searchInput && searchBtn) {
  const debouncedSearch = utils.debounce((query) => {
    if (query.length > 2) {
      performSearch(query);
    }
  }, 300);

  searchInput.addEventListener("input", (e) => {
    debouncedSearch(e.target.value);
  });

  searchBtn.addEventListener("click", () => {
    performSearch(searchInput.value);
  });
}

// Perform search
async function performSearch(query) {
  try {
    const response = await api.get(
      `/manga?title=${encodeURIComponent(query)}&limit=10`
    );
    const manga = response.data || [];

    const container = document.getElementById("mangaList");
    container.innerHTML = "";

    if (manga.length === 0) {
      container.innerHTML = '<div class="no-data">No manga found</div>';
      return;
    }

    // Filter only manga with covers for search results
    const searchResultsWithCovers = manga.filter(hasCover);

    if (searchResultsWithCovers.length === 0) {
      container.innerHTML =
        '<div class="no-data">No manga with covers found</div>';
      return;
    }

    searchResultsWithCovers.forEach((item) => {
      const card = utils.createElement("div", "manga-card");
      card.innerHTML = `
        <img src="${getCoverUrl(item)}"
             alt="${item.attributes.title?.en || "Untitled"}"
             class="manga-cover"
             loading="lazy"
             onerror="this.src='/public/images/no-cover.jpg'">
        <div class="manga-info">
          <h3 class="manga-title">${utils.truncateText(
            item.attributes.title?.en || "Untitled",
            30
          )}</h3>
          <p class="manga-author">${
            item.attributes.author || "Unknown Author"
          }</p>
          <span class="manga-status ${item.attributes.status?.toLowerCase()}">${
        item.attributes.status || "Unknown"
      }</span>
        </div>
      `;
      container.appendChild(card);
    });

    // Reset pagination for search results
    currentPage = 1;
    total = manga.length;
    document.getElementById(
      "pageInfo"
    ).textContent = `Search results: ${manga.length} manga`;
    document.getElementById("prevPage").disabled = true;
    document.getElementById("nextPage").disabled = true;
  } catch (error) {
    console.error("Search failed:", error);
  }
}
