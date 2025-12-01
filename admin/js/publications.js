/**
 * ═══════════════════════════════════════════════════════════════
 * PUBLICATIONS SECTION
 * ═══════════════════════════════════════════════════════════════
 */

let publications = [];

async function loadPublications() {
  try {
    const snapshot = await db.collection('publications').get();
    publications = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    renderPublications();
  } catch (error) {
    console.error('Erreur chargement publications:', error);
  }
}

function renderPublications() {
  const container = document.getElementById('publicationsList');
  
  if (publications.length === 0) {
    container.innerHTML = '<p class="text-muted">Aucune publication.</p>';
    return;
  }
  
  // Trier par année décroissante
  publications.sort((a, b) => (b.annee || 0) - (a.annee || 0));
  
  container.innerHTML = publications.map(pub => {
    const typeBadge = pub.type === 'article' ? 'badge-article' : 
                      pub.type === 'chapitre' ? 'badge-chapitre' : 'badge-communication';
    
    return `
      <div class="list-item">
        <div class="list-item-header">
          <div>
            <div class="list-item-title">${escapeHtml(pub.titre || 'Sans titre')}</div>
            <div class="list-item-meta">
              <span class="badge ${typeBadge}">${pub.type || ''}</span>
              <span>${pub.annee || ''}</span>
            </div>
          </div>
          <div class="item-actions">
            <button class="btn btn-icon" onclick="editPublication('${pub.id}')">
              <i class="fas fa-edit"></i>
            </button>
            <button class="btn btn-icon" onclick="deletePublication('${pub.id}')">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
        <div class="list-item-content">
          <p><strong>Auteurs:</strong> ${escapeHtml(pub.auteurs || '')}</p>
          ${pub.descriptionRapide ? `<p>${escapeHtml(pub.descriptionRapide)}</p>` : ''}
        </div>
      </div>
    `;
  }).join('');
}

document.getElementById('addPublication').addEventListener('click', () => {
  editPublication(null);
});

async function editPublication(pubId) {
  const isNew = !pubId;
  const pub = isNew ? {} : publications.find(p => p.id === pubId);
  
  let currentPdfPath = pub.pdfPath || '';
  
  const modal = createModal(
    isNew ? 'Nouvelle publication' : 'Modifier la publication',
    `
      <div class="form-group">
        <label>Titre *</label>
        <input type="text" id="modal-titre" value="${escapeHtml(pub.titre || '')}" required>
      </div>
      
      <div class="form-group">
        <label>Auteurs *</label>
        <input type="text" id="modal-auteurs" value="${escapeHtml(pub.auteurs || '')}" required>
      </div>
      
      <div class="form-row">
        <div class="form-group">
          <label>Année *</label>
          <input type="number" id="modal-annee" value="${pub.annee || new Date().getFullYear()}" required>
        </div>
        
        <div class="form-group">
          <label>Type *</label>
          <select id="modal-type" required>
            <option value="article" ${pub.type === 'article' ? 'selected' : ''}>Article</option>
            <option value="chapitre" ${pub.type === 'chapitre' ? 'selected' : ''}>Chapitre</option>
            <option value="communication" ${pub.type === 'communication' ? 'selected' : ''}>Communication</option>
          </select>
        </div>
      </div>
      
      <div class="form-group">
        <label>Description rapide</label>
        <textarea id="modal-desc" rows="2">${escapeHtml(pub.descriptionRapide || '')}</textarea>
      </div>
      
      <div class="form-group">
        <label>Résumé</label>
        <textarea id="modal-resume" rows="4">${escapeHtml(pub.resume || '')}</textarea>
      </div>
      
      <div class="form-group">
        <label>Thématiques (séparées par des virgules)</label>
        <input type="text" id="modal-thematiques" value="${pub.thematiques ? pub.thematiques.join(', ') : ''}">
      </div>
      
      <div class="form-group">
        <label>PDF</label>
        <input type="file" id="modal-pdf" accept="application/pdf">
        <small>${currentPdfPath || 'Aucun PDF'}</small>
      </div>
      
      <div class="form-row">
        <div class="form-group">
          <label>DOI</label>
          <input type="text" id="modal-doi" value="${escapeHtml(pub.doi || '')}">
        </div>
        
        <div class="form-group">
          <label>Lien éditeur</label>
          <input type="url" id="modal-lien" value="${escapeHtml(pub.lienEditeur || '')}">
        </div>
      </div>
    `,
    async (modal) => {
      const titre = modal.querySelector('#modal-titre').value;
      const auteurs = modal.querySelector('#modal-auteurs').value;
      const annee = parseInt(modal.querySelector('#modal-annee').value);
      const type = modal.querySelector('#modal-type').value;
      const descriptionRapide = modal.querySelector('#modal-desc').value;
      const resume = modal.querySelector('#modal-resume').value;
      const thematiqueStr = modal.querySelector('#modal-thematiques').value;
      const thematiques = thematiqueStr.split(',').map(t => t.trim()).filter(t => t);
      const doi = modal.querySelector('#modal-doi').value;
      const lienEditeur = modal.querySelector('#modal-lien').value;
      
      if (!titre || !auteurs || !annee || !type) {
        showToast('Veuillez remplir les champs obligatoires', 'error');
        return;
      }
      
      showLoading();
      
      try {
        const data = {
          titre,
          auteurs,
          annee,
          type,
          descriptionRapide,
          resume,
          thematiques,
          pdfPath: currentPdfPath || '',
          doi,
          lienEditeur
        };
        
        if (isNew) {
          await db.collection('publications').add(data);
          showToast('Publication ajoutée', 'success');
        } else {
          await db.collection('publications').doc(pubId).update(data);
          showToast('Publication modifiée', 'success');
        }
        
        await loadPublications();
      } catch (error) {
        console.error('Erreur sauvegarde publication:', error);
        showToast('Erreur lors de l\'enregistrement', 'error');
      } finally {
        hideLoading();
      }
    }
  );
  
  // Handle PDF upload
  modal.querySelector('#modal-pdf').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (file.type !== 'application/pdf') {
      showToast('Veuillez sélectionner un fichier PDF', 'error');
      return;
    }
    
    if (file.size > 10 * 1024 * 1024) {
      showToast('Le PDF ne doit pas dépasser 10 Mo', 'error');
      return;
    }
    
    showLoading();
    
    try {
      currentPdfPath = await uploadFile(file, 'files');
      showToast('PDF uploadé', 'success');
    } catch (error) {
      console.error('Erreur upload PDF:', error);
      showToast('Erreur lors de l\'upload', 'error');
    } finally {
      hideLoading();
    }
  });
}

async function deletePublication(pubId) {
  if (!await confirmDialog('Voulez-vous vraiment supprimer cette publication ?')) {
    return;
  }
  
  showLoading();
  
  try {
    const pub = publications.find(p => p.id === pubId);
    
    if (pub.pdfPath && pub.pdfPath !== 'files/todo.pdf') {
      await deleteFile(pub.pdfPath);
    }
    
    await db.collection('publications').doc(pubId).delete();
    await loadPublications();
    showToast('Publication supprimée', 'success');
  } catch (error) {
    console.error('Erreur suppression publication:', error);
    showToast('Erreur lors de la suppression', 'error');
  } finally {
    hideLoading();
  }
}

window.editPublication = editPublication;
window.deletePublication = deletePublication;
