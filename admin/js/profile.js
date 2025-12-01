/**
 * ═══════════════════════════════════════════════════════════════
 * PROFILE SECTION
 * ═══════════════════════════════════════════════════════════════
 */

let currentPhotoPath = '';

async function loadProfile() {
  try {
    const doc = await db.collection('profile').doc('info').get();
    
    if (doc.exists) {
      const data = doc.data();
      
      document.getElementById('nom').value = data.nom || '';
      document.getElementById('titre').value = data.titre || '';
      document.getElementById('baseline').value = data.baseline || '';
      document.getElementById('profileEmail').value = data.email || '';
      document.getElementById('telephone').value = data.telephone || '';
      document.getElementById('bureau').value = data.bureau || '';
      document.getElementById('orcid').value = data.orcid || '';
      document.getElementById('researchgate').value = data.researchgate || '';
      document.getElementById('googleScholar').value = data.googleScholar || '';
      document.getElementById('linkedin').value = data.linkedin || '';
      
      currentPhotoPath = data.photo || '';
      
      // Afficher la preview de la photo si elle existe
      if (currentPhotoPath && currentPhotoPath !== 'images/todo.jpg') {
        await displayImagePreview(currentPhotoPath, 'photoPreview');
      }
    }
  } catch (error) {
    console.error('Erreur chargement profil:', error);
  }
}

// Upload photo
document.getElementById('photoUpload').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  
  // Validation
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
    currentPhotoPath = await uploadFile(file, 'images');
    await displayImagePreview(currentPhotoPath, 'photoPreview');
    showToast('Photo uploadée avec succès', 'success');
  } catch (error) {
    console.error('Erreur upload photo:', error);
    showToast('Erreur lors de l\'upload', 'error');
  } finally {
    hideLoading();
  }
});

// Save profile
document.getElementById('profileForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const profileData = {
    nom: document.getElementById('nom').value,
    titre: document.getElementById('titre').value,
    baseline: document.getElementById('baseline').value,
    photo: currentPhotoPath || 'images/todo.jpg',
    email: document.getElementById('profileEmail').value,
    telephone: document.getElementById('telephone').value,
    bureau: document.getElementById('bureau').value,
    orcid: document.getElementById('orcid').value,
    researchgate: document.getElementById('researchgate').value,
    googleScholar: document.getElementById('googleScholar').value,
    linkedin: document.getElementById('linkedin').value
  };
  
  showLoading();
  
  try {
    await db.collection('profile').doc('info').set(profileData);
    showToast('Profil enregistré', 'success');
  } catch (error) {
    console.error('Erreur sauvegarde profil:', error);
    showToast('Erreur lors de l\'enregistrement', 'error');
  } finally {
    hideLoading();
  }
});
