/**
 * ═══════════════════════════════════════════════════════════════
 * PUBLISH TO VERCEL
 * ═══════════════════════════════════════════════════════════════
 */

// TODO: Configurer l'URL du webhook Vercel
const VERCEL_WEBHOOK_URL = 'VOTRE_WEBHOOK_URL_ICI';

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

/**
 * Instructions pour créer le webhook Vercel:
 * 
 * 1. Aller sur https://vercel.com/dashboard
 * 2. Sélectionner votre projet
 * 3. Aller dans Settings → Git
 * 4. Dans "Deploy Hooks", créer un nouveau hook:
 *    - Name: "Admin Publish"
 *    - Branch: main (ou votre branche par défaut)
 * 5. Copier l'URL générée
 * 6. Remplacer VOTRE_WEBHOOK_URL_ICI par cette URL dans ce fichier
 */
