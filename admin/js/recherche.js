/**
 * ═══════════════════════════════════════════════════════════════
 * RECHERCHE SECTION - Blocs modulaires ordonnables
 * ═══════════════════════════════════════════════════════════════
 */

let rechercheBlocks = [];
let rechercheSortable = null;

async function loadRechercheBlocks() {
  try {
    const snapshot = await db.collection('recherche').orderBy('ordre').get();
    rechercheBlocks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    renderRechercheBlocks();
  } catch (error) {
    console.error('Erreur chargement blocs recherche:', error);
  }
}

function renderRechercheBlocks() {
  const container = document.getElementById('rechercheBlocks');
  
  if (rechercheBlocks.length === 0) {
    container.innerHTML = '<p class="text-muted">Aucun bloc de recherche. Cliquez sur "Ajouter un bloc" pour commencer.</p>';
    return;
  }
  
  container.innerHTML = rechercheBlocks.map((bloc, index) => `
    <div class="sortable-item" data-id="${bloc.id}">
      <div class="item-header">
        <div class="item-handle">
          <i class="fas fa-grip-vertical"></i>
          <span class="badge badge-success">#${index + 1}</span>
        </div>
        <div class="item-actions">
          <button class="btn btn-icon" onclick="editRechercheBlock('${bloc.id}')">
            <i class="fas fa-edit"></i>
          </button>
          <button class="btn btn-icon" onclick="deleteRechercheBlock('${bloc.id}')">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
      <div>
        ${bloc.titre ? `<h4>${escapeHtml(bloc.titre)}</h4>` : '<h4 class="text-muted">Sans titre</h4>'}
        <p class="text-muted">${bloc.texte ? bloc.texte.substring(0, 150) + '...' : ''}</p>
        ${bloc.image ? `<small><i class="fas fa-image"></i> Image: ${bloc.image}</small>` : ''}
      </div>
    </div>
  `).join('');
  
  // Initialize Sortable
  if (rechercheSortable) {
    rechercheSortable.destroy();
  }
  
  rechercheSortable = new Sortable(container, {
    animation: 150,
    handle: '.item-handle',
    ghostClass: 'ghost',
    onEnd: async () => {
      await updateRechercheOrder();
    }
  });
}

async function updateRechercheOrder() {
  const items = document.querySelectorAll('#rechercheBlocks .sortable-item');
  const updates = [];
  
  items.forEach((item, index) => {
    const id = item.dataset.id;
    updates.push(
      db.collection('recherche').doc(id).update({ ordre: index + 1 })
    );
  });
  
  try {
    await Promise.all(updates);
    await loadRechercheBlocks();
    showToast('Ordre mis à jour', 'success');
  } catch (error) {
    console.error('Erreur mise à jour ordre:', error);
    showToast('Erreur lors de la mise à jour', 'error');
  }
}

// Ajouter un bloc
document.getElementById('addRechercheBlock').addEventListener('click', () => {
  editRechercheBlock(null);
});

// Éditer un bloc
async function editRechercheBlock(blockId) {
  const isNew = !blockId;
  const block = isNew ? {} : rechercheBlocks.find(b => b.id === blockId);
  
  let currentImagePath = block.image || '';
  
  const modal = createModal(
    isNew ? 'Nouveau bloc de recherche' : 'Modifier le bloc',
    `
      <div class="form-group">
        <label>Titre (optionnel)</label>
        <input type="text" id="modal-titre" value="${escapeHtml(block.titre || '')}" class="form-control">
      </div>
      
      <div class="form-group">
        <label>Texte *</label>
        <textarea id="modal-texte" rows="8" required class="form-control">${escapeHtml(block.texte || '')}</textarea>
      </div>
      
      <div class="form-group">
        <label>Image (optionnelle)</label>
        <input type="file" id="modal-image" accept="image/*" class="form-control">
        <div id="modal-image-preview" class="image-preview ${currentImagePath ? 'show' : ''}"></div>
        <small class="text-muted">${currentImagePath || 'Aucune image'}</small>
      </div>
    `,
    async (modal) => {
      const titre = modal.querySelector('#modal-titre').value;
      const texte = modal.querySelector('#modal-texte').value;
      
      if (!texte.trim()) {
        showToast('Le texte est obligatoire', 'error');
        return;
      }
      
      showLoading();
      
      try {
        const data = {
          titre: titre,
          texte: texte,
          image: currentImagePath || ''
        };
        
        if (isNew) {
          data.ordre = rechercheBlocks.length + 1;
          await db.collection('recherche').add(data);
          showToast('Bloc ajouté', 'success');
        } else {
          await db.collection('recherche').doc(blockId).update(data);
          showToast('Bloc modifié', 'success');
        }
        
        await loadRechercheBlocks();
      } catch (error) {
        console.error('Erreur sauvegarde bloc:', error);
        showToast('Erreur lors de l\'enregistrement', 'error');
      } finally {
        hideLoading();
      }
    }
  );
  
  // Setup image preview
  if (currentImagePath) {
    await displayImagePreview(currentImagePath, 'modal-image-preview');
  }
  
  // Handle image upload
  modal.querySelector('#modal-image').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      showToast('Veuillez sélectionner une image', 'error');
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      showToast('L\'image ne doit pas dépasser 5 Mo', 'error');
      return;
    }
    
    showLoading();
    
    try {
      currentImagePath = await uploadFile(file, 'images');
      await displayImagePreview(currentImagePath, 'modal-image-preview');
      showToast('Image uploadée', 'success');
    } catch (error) {
      console.error('Erreur upload image:', error);
      showToast('Erreur lors de l\'upload', 'error');
    } finally {
      hideLoading();
    }
  });
}

// Supprimer un bloc
async function deleteRechercheBlock(blockId) {
  if (!await confirmDialog('Voulez-vous vraiment supprimer ce bloc ?')) {
    return;
  }
  
  showLoading();
  
  try {
    const block = rechercheBlocks.find(b => b.id === blockId);
    
    // Supprimer l'image si elle existe
    if (block.image && block.image !== 'images/todo.jpg') {
      await deleteFile(block.image);
    }
    
    // Supprimer le document
    await db.collection('recherche').doc(blockId).delete();
    
    await loadRechercheBlocks();
    showToast('Bloc supprimé', 'success');
  } catch (error) {
    console.error('Erreur suppression bloc:', error);
    showToast('Erreur lors de la suppression', 'error');
  } finally {
    hideLoading();
  }
}

// Rendre les fonctions globales
window.editRechercheBlock = editRechercheBlock;
window.deleteRechercheBlock = deleteRechercheBlock;
