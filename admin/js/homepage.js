/**
 * ═══════════════════════════════════════════════════════════════
 * HOMEPAGE SECTION
 * ═══════════════════════════════════════════════════════════════
 */

async function loadHomepage() {
  try {
    const doc = await db.collection('homepage').doc('content').get();
    
    if (doc.exists) {
      const data = doc.data();
      
      document.getElementById('paragraphe1Titre').value = data.paragraphe1Titre || '';
      document.getElementById('paragraphe1Texte').value = data.paragraphe1Texte || '';
      document.getElementById('paragraphe2Titre').value = data.paragraphe2Titre || '';
      document.getElementById('paragraphe2Texte').value = data.paragraphe2Texte || '';
    }
  } catch (error) {
    console.error('Erreur chargement homepage:', error);
  }
}

document.getElementById('homepageForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const homepageData = {
    paragraphe1Titre: document.getElementById('paragraphe1Titre').value,
    paragraphe1Texte: document.getElementById('paragraphe1Texte').value,
    paragraphe2Titre: document.getElementById('paragraphe2Titre').value,
    paragraphe2Texte: document.getElementById('paragraphe2Texte').value
  };
  
  showLoading();
  
  try {
    await db.collection('homepage').doc('content').set(homepageData);
    showToast('Page d\'accueil enregistrée', 'success');
  } catch (error) {
    console.error('Erreur sauvegarde homepage:', error);
    showToast('Erreur lors de l\'enregistrement', 'error');
  } finally {
    hideLoading();
  }
});
