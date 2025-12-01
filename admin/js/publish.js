/**
 * ═══════════════════════════════════════════════════════════════
 * PUBLISH TO VERCEL
 * ═══════════════════════════════════════════════════════════════
 */


const VERCEL_WEBHOOK_URL = 'https://api.vercel.com/v1/integrations/deploy/prj_H1rANf5vTw4GXRwvnT5mGbEoytKT/dBydSjmHST';

document.getElementById('publishBtn').addEventListener('click', async () => {
  if (!VERCEL_WEBHOOK_URL || VERCEL_WEBHOOK_URL === 'VOTRE_WEBHOOK_URL_ICI') {
    showToast('Webhook Vercel non configuré', 'error');
    console.error('Configurez VERCEL_WEBHOOK_URL dans admin/js/publish.js');
    return;
  }
  
  if (!confirm('Voulez-vous publier les modifications sur le site public ?')) {
    return;
  }
  
  showLoading();
  
  try {
    const response = await fetch(VERCEL_WEBHOOK_URL, {
      method: 'POST'
    });
    
    if (response.ok) {
      showToast('Déploiement déclenché ! Le site sera mis à jour dans quelques minutes.', 'success');
    } else {
      throw new Error('Erreur HTTP: ' + response.status);
    }
  } catch (error) {
    console.error('Erreur publication:', error);
    showToast('Erreur lors du déploiement', 'error');
  } finally {
    hideLoading();
  }
});
