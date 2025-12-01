/**
 * ═══════════════════════════════════════════════════════════════
 * AUTHENTICATION
 * ═══════════════════════════════════════════════════════════════
 */

// État de l'authentification
auth.onAuthStateChanged(user => {
  if (user) {
    // Utilisateur connecté
    showAdminInterface();
    loadAllData();
  } else {
    // Utilisateur déconnecté
    showLoginScreen();
  }
});

// Gestion du formulaire de connexion
document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const errorDiv = document.getElementById('loginError');
  
  showLoading();
  errorDiv.classList.remove('show');
  
  try {
    await auth.signInWithEmailAndPassword(email, password);
    // L'interface sera affichée automatiquement via onAuthStateChanged
  } catch (error) {
    hideLoading();
    console.error('Erreur de connexion:', error);
    
    let message = 'Erreur de connexion';
    if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
      message = 'Email ou mot de passe incorrect';
    } else if (error.code === 'auth/invalid-email') {
      message = 'Email invalide';
    }
    
    errorDiv.textContent = message;
    errorDiv.classList.add('show');
  }
});

// Déconnexion
document.getElementById('logoutBtn').addEventListener('click', async () => {
  if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
    try {
      await auth.signOut();
      showToast('Déconnexion réussie', 'success');
    } catch (error) {
      console.error('Erreur de déconnexion:', error);
      showToast('Erreur lors de la déconnexion', 'error');
    }
  }
});

/**
 * Afficher l'écran de connexion
 */
function showLoginScreen() {
  document.getElementById('loginScreen').style.display = 'flex';
  document.getElementById('adminInterface').style.display = 'none';
  hideLoading();
}

/**
 * Afficher l'interface d'administration
 */
function showAdminInterface() {
  document.getElementById('loginScreen').style.display = 'none';
  document.getElementById('adminInterface').style.display = 'flex';
  hideLoading();
}
