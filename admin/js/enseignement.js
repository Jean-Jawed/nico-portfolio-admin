/**
 * ═══════════════════════════════════════════════════════════════
 * ENSEIGNEMENT SECTION - Stub simplifié
 * ═══════════════════════════════════════════════════════════════
 */

let enseignements = [];

async function loadEnseignement() {
  try {
    const snapshot = await db.collection('enseignement').get();
    enseignements = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    renderEnseignement();
  } catch (error) {
    console.error('Erreur chargement enseignements:', error);
  }
}

function renderEnseignement() {
  const container = document.getElementById('enseignementList');
  
  if (enseignements.length === 0) {
    container.innerHTML = '<p class="text-muted">Aucun enseignement.</p>';
    return;
  }
  
  container.innerHTML = enseignements.map(cours => `
    <div class="list-item">
      <div class="list-item-header">
        <div>
          <div class="list-item-title">${escapeHtml(cours.intitule || 'Sans titre')}</div>
          <div class="list-item-meta">
            ${cours.niveau ? `<span class="badge badge-success">${cours.niveau}</span>` : ''}
            ${cours.volumeHoraire ? `<span>${cours.volumeHoraire}</span>` : ''}
            ${cours.annee ? `<span>${cours.annee}</span>` : ''}
          </div>
        </div>
        <div class="item-actions">
          <button class="btn btn-icon" onclick="editEnseignement('${cours.id}')">
            <i class="fas fa-edit"></i>
          </button>
          <button class="btn btn-icon" onclick="deleteEnseignement('${cours.id}')">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

document.getElementById('addEnseignement').addEventListener('click', () => {
  // TODO: Implémenter modal d'édition complet
  showToast('À implémenter : modal d\'ajout', 'info');
});

function editEnseignement(id) {
  // TODO: Implémenter modal d'édition complet
  showToast('À implémenter : modal d\'édition', 'info');
}

function deleteEnseignement(id) {
  // TODO: Implémenter suppression
  showToast('À implémenter : suppression', 'info');
}

window.editEnseignement = editEnseignement;
window.deleteEnseignement = deleteEnseignement;
