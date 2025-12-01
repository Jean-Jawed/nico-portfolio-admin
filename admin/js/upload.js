/**
 * ═══════════════════════════════════════════════════════════════
 * FILE UPLOAD UTILITIES
 * ═══════════════════════════════════════════════════════════════
 */

/**
 * Upload un fichier vers Firebase Storage
 * @param {File} file - Le fichier à uploader
 * @param {string} folder - Le dossier (images/ ou files/)
 * @returns {Promise<string>} Le chemin relatif du fichier
 */
async function uploadFile(file, folder = 'files') {
  // Générer un nom de fichier unique avec timestamp
  const timestamp = Date.now();
  const cleanName = cleanFileName(file.name);
  const fileName = `${timestamp}_${cleanName}`;
  const filePath = `${folder}/${fileName}`;
  
  // Upload vers Storage
  const storageRef = storage.ref(filePath);
  await storageRef.put(file);
  
  // Retourner le chemin relatif (pas l'URL complète)
  return filePath;
}

/**
 * Nettoyer un nom de fichier
 */
function cleanFileName(fileName) {
  // Garder l'extension
  const parts = fileName.split('.');
  const ext = parts.pop();
  const name = parts.join('.');
  
  // Nettoyer le nom
  const cleanName = name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  
  return `${cleanName}.${ext}`;
}

/**
 * Obtenir l'URL complète d'un fichier depuis son chemin
 */
async function getFileUrl(filePath) {
  if (!filePath || filePath === 'images/todo.jpg' || filePath === 'files/todo.pdf') {
    return filePath;
  }
  
  try {
    const storageRef = storage.ref(filePath);
    const url = await storageRef.getDownloadURL();
    return url;
  } catch (error) {
    console.error('Erreur récupération URL:', error);
    return filePath;
  }
}

/**
 * Afficher la preview d'une image
 */
async function displayImagePreview(imagePath, previewElementId) {
  const previewDiv = document.getElementById(previewElementId);
  
  if (!imagePath || imagePath === 'images/todo.jpg') {
    previewDiv.classList.remove('show');
    return;
  }
  
  try {
    const url = await getFileUrl(imagePath);
    previewDiv.innerHTML = `<img src="${url}" alt="Preview">`;
    previewDiv.classList.add('show');
  } catch (error) {
    console.error('Erreur affichage preview:', error);
    previewDiv.classList.remove('show');
  }
}

/**
 * Supprimer un fichier de Storage
 */
async function deleteFile(filePath) {
  if (!filePath || filePath === 'images/todo.jpg' || filePath === 'files/todo.pdf') {
    return;
  }
  
  try {
    const storageRef = storage.ref(filePath);
    await storageRef.delete();
  } catch (error) {
    console.error('Erreur suppression fichier:', error);
    // Ne pas bloquer si le fichier n'existe pas
  }
}

/**
 * Créer un input file avec preview
 */
function createFileInput(type = 'image', currentPath = '', previewId = null) {
  const accept = type === 'image' ? 'image/*' : 'application/pdf';
  const folder = type === 'image' ? 'images' : 'files';
  
  const inputId = 'file-' + Date.now();
  const actualPreviewId = previewId || 'preview-' + Date.now();
  
  const html = `
    <div class="file-upload">
      <input type="file" id="${inputId}" accept="${accept}">
      ${type === 'image' ? `<div id="${actualPreviewId}" class="image-preview"></div>` : ''}
      <small class="text-muted">${currentPath || 'Aucun fichier'}</small>
    </div>
  `;
  
  return {
    html,
    inputId,
    previewId: actualPreviewId,
    setup: async (onChange) => {
      let filePath = currentPath;
      
      // Afficher preview initiale
      if (type === 'image' && currentPath) {
        await displayImagePreview(currentPath, actualPreviewId);
      }
      
      // Gérer upload
      document.getElementById(inputId).addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        // Validation taille
        const maxSize = type === 'image' ? 5 : 10; // MB
        if (file.size > maxSize * 1024 * 1024) {
          showToast(`Le fichier ne doit pas dépasser ${maxSize} Mo`, 'error');
          return;
        }
        
        showLoading();
        
        try {
          // Supprimer l'ancien fichier si existe
          if (filePath && filePath !== `${folder}/todo.jpg` && filePath !== `${folder}/todo.pdf`) {
            await deleteFile(filePath);
          }
          
          // Upload nouveau fichier
          filePath = await uploadFile(file, folder);
          
          // Afficher preview
          if (type === 'image') {
            await displayImagePreview(filePath, actualPreviewId);
          }
          
          showToast('Fichier uploadé', 'success');
          
          // Callback
          if (onChange) onChange(filePath);
          
        } catch (error) {
          console.error('Erreur upload:', error);
          showToast('Erreur lors de l\'upload', 'error');
        } finally {
          hideLoading();
        }
      });
      
      return () => filePath;
    }
  };
}
