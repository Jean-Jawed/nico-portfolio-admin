/**
 * ═══════════════════════════════════════════════════════════════
 * BLOG SECTION - Stub simplifié
 * ═══════════════════════════════════════════════════════════════
 */

let blogPosts = [];

async function loadBlogPosts() {
  try {
    const snapshot = await db.collection('blog').orderBy('datePublication', 'desc').get();
    blogPosts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    renderBlogPosts();
  } catch (error) {
    console.error('Erreur chargement blog:', error);
  }
}

function renderBlogPosts() {
  const container = document.getElementById('blogPostsList');
  
  if (blogPosts.length === 0) {
    container.innerHTML = '<p class="text-muted">Aucun article de blog.</p>';
    return;
  }
  
  container.innerHTML = blogPosts.map(post => {
    const date = post.datePublication?.toDate ? post.datePublication.toDate() : new Date();
    
    return `
      <div class="list-item">
        <div class="list-item-header">
          <div>
            <div class="list-item-title">${escapeHtml(post.titre || 'Sans titre')}</div>
            <div class="list-item-meta">
              <span>${formatDate(date)}</span>
              ${post.categories ? post.categories.map(cat => `<span class="badge badge-article">${cat}</span>`).join(' ') : ''}
            </div>
          </div>
          <div class="item-actions">
            <button class="btn btn-icon" onclick="editBlogPost('${post.id}')">
              <i class="fas fa-edit"></i>
            </button>
            <button class="btn btn-icon" onclick="deleteBlogPost('${post.id}')">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
        <div class="list-item-content">
          <p><strong>Slug:</strong> ${post.slug || ''}</p>
        </div>
      </div>
    `;
  }).join('');
}

document.getElementById('addBlogPost').addEventListener('click', () => {
  // TODO: Implémenter modal d'édition complet avec éditeur Markdown
  showToast('À implémenter : modal d\'ajout avec éditeur Markdown', 'info');
});

function editBlogPost(id) {
  // TODO: Implémenter modal d'édition complet
  showToast('À implémenter : modal d\'édition', 'info');
}

function deleteBlogPost(id) {
  // TODO: Implémenter suppression
  showToast('À implémenter : suppression', 'info');
}

window.editBlogPost = editBlogPost;
window.deleteBlogPost = deleteBlogPost;
