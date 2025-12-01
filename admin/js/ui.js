/**
 * ═══════════════════════════════════════════════════════════════
 * UI UTILITIES
 * ═══════════════════════════════════════════════════════════════
 */

// Navigation entre sections
document.querySelectorAll('.nav-item').forEach(btn => {
  btn.addEventListener('click', () => {
    const section = btn.dataset.section;
    
    // Update nav
    document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    // Update sections
    document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));
    document.getElementById(`section-${section}`).classList.add('active');
  });
});

/**
 * Afficher le loading overlay
 */
function showLoading() {
  document.getElementById('loadingOverlay').style.display = 'flex';
}

/**
 * Masquer le loading overlay
 */
function hideLoading() {
  document.getElementById('loadingOverlay').style.display = 'none';
}

/**
 * Afficher une notification toast
 */
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  const icon = type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ';
  
  toast.innerHTML = `
    <span style="font-size: 20px;">${icon}</span>
    <span>${message}</span>
  `;
  
  container.appendChild(toast);
  
  // Auto remove after 3 seconds
  setTimeout(() => {
    toast.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

/**
 * Créer un modal
 */
function createModal(title, content, onSave) {
  const modalId = 'modal-' + Date.now();
  
  const modal = document.createElement('div');
  modal.id = modalId;
  modal.className = 'modal';
  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h3>${title}</h3>
        <button class="modal-close">&times;</button>
      </div>
      <div class="modal-body">
        ${content}
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary modal-cancel">Annuler</button>
        <button class="btn btn-primary modal-save">Enregistrer</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Show modal
  setTimeout(() => modal.classList.add('show'), 10);
  
  // Close handlers
  const closeModal = () => {
    modal.classList.remove('show');
    setTimeout(() => modal.remove(), 300);
  };
  
  modal.querySelector('.modal-close').addEventListener('click', closeModal);
  modal.querySelector('.modal-cancel').addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
  
  // Save handler
  if (onSave) {
    modal.querySelector('.modal-save').addEventListener('click', () => {
      onSave(modal);
      closeModal();
    });
  }
  
  return modal;
}

/**
 * Confirm dialog
 */
function confirmDialog(message) {
  return new Promise((resolve) => {
    const result = confirm(message);
    resolve(result);
  });
}

/**
 * Charger toutes les données au démarrage
 */
async function loadAllData() {
  showLoading();
  
  try {
    // Charger chaque section
    await loadConfig();
    await loadProfile();
    await loadHomepage();
    await loadRechercheBlocks();
    await loadPublications();
    await loadEnseignement();
    await loadEncadrements();
    await loadBlogPosts();
    
    hideLoading();
  } catch (error) {
    console.error('Erreur lors du chargement des données:', error);
    hideLoading();
    showToast('Erreur lors du chargement des données', 'error');
  }
}

/**
 * Format date for display
 */
function formatDate(date) {
  if (!date) return '';
  
  if (date.toDate) {
    date = date.toDate();
  }
  
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('fr-FR', options);
}

/**
 * Format date for input[type="date"]
 */
function formatDateInput(date) {
  if (!date) return '';
  
  if (date.toDate) {
    date = date.toDate();
  }
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
}

/**
 * Slugify text
 */
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Escape HTML
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Add CSS for slideOut animation
const style = document.createElement('style');
style.textContent = `
  @keyframes slideOut {
    to {
      transform: translateX(400px);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);
