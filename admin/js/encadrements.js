/**
 * ═══════════════════════════════════════════════════════════════
 * ENCADREMENTS SECTION - Stub simplifié
 * ═══════════════════════════════════════════════════════════════
 */

let encadrements = [];

async function loadEncadrements() {
  try {
    const snapshot = await db.collection('encadrements').get();
    encadrements = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    renderEncadrements();
  } catch (error) {
    console.error('Erreur chargement encadrements:', error);
  }
}

function renderEncadrements() {
  const container = document.getElementById('encadrementsList');
  
  if (encadrements.length === 0) {
    container.innerHTML = '<p class="text-muted">Aucun encadrement.</p>';
    return;
  }
  
  container.innerHTML = encadrements.map(enc => {
    const statutBadge = enc.statut === 'en cours' ? 'badge-warning' : 'badge-success';
    
    return `
      <div class="list-item">
        <div class="list-item-header">
          <div>
            <div class="list-item-title">${escapeHtml(enc.titre || 'Sans titre')}</div>
            <div class="list-item-meta">
              <span class="badge badge-article">${enc.type || ''}</span>
              <span class="badge ${statutBadge}">${enc.statut || ''}</span>
              <span>${enc.etudiant || ''} - ${enc.annee || ''}</span>
            </div>
          </div>
          <div class="item-actions">
            <button class="btn btn-icon" onclick="editEncadrement('${enc.id}')">
              <i class="fas fa-edit"></i>
            </button>
            <button class="btn btn-icon" onclick="deleteEncadrement('${enc.id}')">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

document.getElementById('addEncadrement').addEventListener('click', () => {
  // TODO: Implémenter modal d'édition complet
  showToast('À implémenter : modal d\'ajout', 'info');
});

function editEncadrement(id) {
  // TODO: Implémenter modal d'édition complet
  showToast('À implémenter : modal d\'édition', 'info');
}

function deleteEncadrement(id) {
  // TODO: Implémenter suppression
  showToast('À implémenter : suppression', 'info');
}

window.editEncadrement = editEncadrement;
window.deleteEncadrement = deleteEncadrement;
