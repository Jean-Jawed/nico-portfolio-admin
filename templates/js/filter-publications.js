/* ═══════════════════════════════════════════════════════════════
   PUBLICATIONS FILTERING & SORTING
   ═══════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelector('.publications-section')) {
    initPublicationsFilters();
    initPublicationsSearch();
    initViewToggle();
    initCitationButtons();
  }
});

/* ═══════════════════════════════════════════════════════════════
   FILTERS
   ═══════════════════════════════════════════════════════════════ */

function initPublicationsFilters() {
  const publicationCards = document.querySelectorAll('.publication-card');
  const filterCheckboxes = document.querySelectorAll('.filter-checkbox input');
  const filterReset = document.querySelector('.filter-reset');
  
  // Generate dynamic filters
  generateYearFilters(publicationCards);
  generateThemeFilters(publicationCards);
  
  // Apply filters
  function applyFilters() {
    const activeTypes = Array.from(document.querySelectorAll('.filter-checkbox input[value="article"], .filter-checkbox input[value="chapitre"], .filter-checkbox input[value="communication"]'))
      .filter(cb => cb.checked)
      .map(cb => cb.value);
    
    const activeYears = Array.from(document.querySelectorAll('.filter-checkbox input[data-filter="year"]'))
      .filter(cb => cb.checked)
      .map(cb => cb.value);
    
    const activeThemes = Array.from(document.querySelectorAll('.filter-checkbox input[data-filter="theme"]'))
      .filter(cb => cb.checked)
      .map(cb => cb.value);
    
    let visibleCount = 0;
    
    publicationCards.forEach(card => {
      const type = card.dataset.type;
      const year = card.dataset.year;
      const themes = card.dataset.themes ? card.dataset.themes.split(',') : [];
      
      const typeMatch = activeTypes.length === 0 || activeTypes.includes(type);
      const yearMatch = activeYears.length === 0 || activeYears.includes(year);
      const themeMatch = activeThemes.length === 0 || activeThemes.some(theme => themes.includes(theme));
      
      if (typeMatch && yearMatch && themeMatch) {
        card.style.display = '';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });
    
    updateResultsCount(visibleCount);
  }
  
  // Event listeners
  filterCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', applyFilters);
  });
  
  if (filterReset) {
    filterReset.addEventListener('click', () => {
      filterCheckboxes.forEach(cb => {
        cb.checked = true;
      });
      applyFilters();
    });
  }
}

/* ═══════════════════════════════════════════════════════════════
   DYNAMIC FILTER GENERATION
   ═══════════════════════════════════════════════════════════════ */

function generateYearFilters(publicationCards) {
  const yearFiltersContainer = document.getElementById('yearFilters');
  if (!yearFiltersContainer) return;
  
  const years = new Set();
  publicationCards.forEach(card => {
    if (card.dataset.year) {
      years.add(card.dataset.year);
    }
  });
  
  const sortedYears = Array.from(years).sort((a, b) => b - a);
  
  sortedYears.forEach(year => {
    const label = document.createElement('label');
    label.className = 'filter-checkbox';
    label.innerHTML = `
      <input type="checkbox" value="${year}" data-filter="year" checked>
      <span>${year}</span>
    `;
    yearFiltersContainer.appendChild(label);
  });
}

function generateThemeFilters(publicationCards) {
  const themeFiltersContainer = document.getElementById('themeFilters');
  if (!themeFiltersContainer) return;
  
  const themes = new Set();
  publicationCards.forEach(card => {
    if (card.dataset.themes) {
      const cardThemes = card.dataset.themes.split(',');
      cardThemes.forEach(theme => themes.add(theme.trim()));
    }
  });
  
  const sortedThemes = Array.from(themes).sort();
  
  sortedThemes.forEach(theme => {
    if (theme) {
      const label = document.createElement('label');
      label.className = 'filter-checkbox';
      label.innerHTML = `
        <input type="checkbox" value="${theme}" data-filter="theme" checked>
        <span>${theme}</span>
      `;
      themeFiltersContainer.appendChild(label);
    }
  });
}

/* ═══════════════════════════════════════════════════════════════
   SEARCH
   ═══════════════════════════════════════════════════════════════ */

function initPublicationsSearch() {
  const searchInput = document.getElementById('searchPublications');
  if (!searchInput) return;
  
  const publicationCards = document.querySelectorAll('.publication-card');
  
  searchInput.addEventListener('input', window.debounce((e) => {
    const searchTerm = e.target.value.toLowerCase().trim();
    let visibleCount = 0;
    
    publicationCards.forEach(card => {
      // Skip if already hidden by filters
      if (card.style.display === 'none') return;
      
      const title = card.querySelector('.publication-title')?.textContent.toLowerCase() || '';
      const authors = card.querySelector('.publication-authors')?.textContent.toLowerCase() || '';
      const description = card.querySelector('.publication-quick-desc')?.textContent.toLowerCase() || '';
      const abstract = card.querySelector('.publication-abstract p')?.textContent.toLowerCase() || '';
      
      const searchableText = `${title} ${authors} ${description} ${abstract}`;
      
      if (searchTerm === '' || searchableText.includes(searchTerm)) {
        card.style.display = '';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });
    
    updateResultsCount(visibleCount);
  }, 300));
}

/* ═══════════════════════════════════════════════════════════════
   VIEW TOGGLE (List/Grid)
   ═══════════════════════════════════════════════════════════════ */

function initViewToggle() {
  const viewButtons = document.querySelectorAll('.view-btn');
  const publicationsList = document.querySelector('.publications-list');
  
  if (!viewButtons.length || !publicationsList) return;
  
  viewButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const view = btn.dataset.view;
      
      // Update active state
      viewButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      // Update list class
      if (view === 'grid') {
        publicationsList.classList.add('publications-grid');
      } else {
        publicationsList.classList.remove('publications-grid');
      }
    });
  });
}

/* ═══════════════════════════════════════════════════════════════
   CITATION MODAL
   ═══════════════════════════════════════════════════════════════ */

function initCitationButtons() {
  const citeButtons = document.querySelectorAll('.btn-cite');
  const citationModal = document.getElementById('citationModal');
  const citationText = document.getElementById('citationText');
  const copyCitationBtn = document.getElementById('copyCitation');
  
  if (!citationModal) return;
  
  citeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const citation = btn.dataset.citation;
      if (citation && citationText) {
        citationText.textContent = citation;
        window.openModal('citationModal');
      }
    });
  });
  
  if (copyCitationBtn && citationText) {
    copyCitationBtn.addEventListener('click', () => {
      const citation = citationText.textContent;
      window.copyToClipboard(citation).then(() => {
        const originalText = copyCitationBtn.innerHTML;
        copyCitationBtn.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          Copié !
        `;
        
        setTimeout(() => {
          copyCitationBtn.innerHTML = originalText;
        }, 2000);
      });
    });
  }
}

/* ═══════════════════════════════════════════════════════════════
   RESULTS COUNT
   ═══════════════════════════════════════════════════════════════ */

function updateResultsCount(count) {
  const resultsCount = document.getElementById('resultsCount');
  if (resultsCount) {
    resultsCount.textContent = count;
  }
}

/* ═══════════════════════════════════════════════════════════════
   GRID VIEW STYLES (injected via JS)
   ═══════════════════════════════════════════════════════════════ */

// Add grid styles dynamically
const style = document.createElement('style');
style.textContent = `
  .publications-list.publications-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: var(--space-6);
  }
  
  .publications-list.publications-grid .publication-card {
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  
  .publications-list.publications-grid .publication-abstract {
    display: none;
  }
  
  .publications-list.publications-grid .publication-actions {
    margin-top: auto;
  }
  
  @media (max-width: 768px) {
    .publications-list.publications-grid {
      grid-template-columns: 1fr;
    }
  }
`;
document.head.appendChild(style);
