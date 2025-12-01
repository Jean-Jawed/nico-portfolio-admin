/**
 * ═══════════════════════════════════════════════════════════════
 * CONFIGURATION SECTION
 * ═══════════════════════════════════════════════════════════════
 */

async function loadConfig() {
  try {
    const doc = await db.collection('siteConfig').doc('config').get();
    
    if (doc.exists) {
      const data = doc.data();
      document.getElementById('enableEnseignement').checked = data.enableEnseignement || false;
      document.getElementById('enableEncadrements').checked = data.enableEncadrements || false;
      document.getElementById('enableBlog').checked = data.enableBlog || false;
    }
  } catch (error) {
    console.error('Erreur chargement config:', error);
  }
}

document.getElementById('saveConfig').addEventListener('click', async () => {
  const config = {
    enableEnseignement: document.getElementById('enableEnseignement').checked,
    enableEncadrements: document.getElementById('enableEncadrements').checked,
    enableBlog: document.getElementById('enableBlog').checked
  };
  
  showLoading();
  
  try {
    await db.collection('siteConfig').doc('config').set(config);
    showToast('Configuration enregistrée', 'success');
  } catch (error) {
    console.error('Erreur sauvegarde config:', error);
    showToast('Erreur lors de l\'enregistrement', 'error');
  } finally {
    hideLoading();
  }
});