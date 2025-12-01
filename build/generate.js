/**
 * ═══════════════════════════════════════════════════════════════
 * SCRIPT DE BUILD - Génération du site statique
 * Récupère les données Firestore et génère les pages HTML
 * ═══════════════════════════════════════════════════════════════
 */

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, doc, getDoc } = require('firebase/firestore');
const { getStorage, ref, listAll, getDownloadURL } = require('firebase/storage');
const fs = require('fs-extra');
const path = require('path');
const Mustache = require('mustache');
const { marked } = require('marked');
const https = require('https');
const http = require('http');

// Configuration Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCTzKnW3F2xONaSjnnkHZI0JRs_Z9Dq2VQ",
  authDomain: "nicolas-portfolio-eaf2e.firebaseapp.com",
  projectId: "nicolas-portfolio-eaf2e",
  storageBucket: "nicolas-portfolio-eaf2e.firebasestorage.app",
  messagingSenderId: "516157460066",
  appId: "1:516157460066:web:4d865df2ef87b6aece0b3b"
};

// Initialisation Firebase (Client SDK)
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

// Chemins
const TEMPLATES_DIR = path.join(__dirname, '../templates');
const DIST_DIR = path.join(__dirname, '../dist');
const ADMIN_DIR = path.join(__dirname, '../admin');

/**
 * ═══════════════════════════════════════════════════════════════
 * FONCTION PRINCIPALE
 * ═══════════════════════════════════════════════════════════════
 */
async function build() {
  console.log('🚀 Démarrage de la génération du site...\n');

  try {
    // 1. Nettoyer et créer le dossier dist
    await cleanAndCreateDist();

    // 2. Récupérer toutes les données Firestore
    console.log('📥 Récupération des données Firestore...');
    const data = await fetchAllData();
    console.log('   ✓ Données récupérées\n');

    // 3. Télécharger les fichiers depuis Storage
    console.log('📦 Téléchargement des fichiers...');
    await downloadFiles(data);
    console.log('   ✓ Fichiers téléchargés\n');

    // 4. Générer les pages HTML
    console.log('📝 Génération des pages HTML...');
    await generatePages(data);
    console.log('   ✓ Pages générées\n');

    // 5. Copier les assets statiques
    console.log('📋 Copie des assets...');
    await copyAssets();
    console.log('   ✓ Assets copiés\n');

    // 6. Copier l'interface admin
    console.log('🔧 Copie de l\'interface admin...');
    await copyAdmin();
    console.log('   ✓ Admin copié\n');

    console.log('✅ Build terminé avec succès !');
    console.log(`📂 Site généré dans : ${DIST_DIR}`);

  } catch (error) {
    console.error('❌ Erreur lors du build :', error);
    process.exit(1);
  }
}

/**
 * ═══════════════════════════════════════════════════════════════
 * 1. NETTOYAGE ET CRÉATION DU DOSSIER DIST
 * ═══════════════════════════════════════════════════════════════
 */
async function cleanAndCreateDist() {
  console.log('🧹 Nettoyage du dossier dist...');
  
  if (await fs.pathExists(DIST_DIR)) {
    await fs.remove(DIST_DIR);
  }
  
  await fs.ensureDir(DIST_DIR);
  await fs.ensureDir(path.join(DIST_DIR, 'images'));
  await fs.ensureDir(path.join(DIST_DIR, 'files'));
  await fs.ensureDir(path.join(DIST_DIR, 'css'));
  await fs.ensureDir(path.join(DIST_DIR, 'js'));
  await fs.ensureDir(path.join(DIST_DIR, 'blog'));
  
  console.log('   ✓ Dossier dist préparé\n');
}

/**
 * ═══════════════════════════════════════════════════════════════
 * 2. RÉCUPÉRATION DES DONNÉES FIRESTORE
 * ═══════════════════════════════════════════════════════════════
 */
async function fetchAllData() {
  const data = {};

  // Configuration du site
  const siteConfigRef = doc(db, 'siteConfig', 'config');
  const siteConfigDoc = await getDoc(siteConfigRef);
  data.siteConfig = siteConfigDoc.exists() ? siteConfigDoc.data() : {
    enableEnseignement: true,
    enableEncadrements: true,
    enableBlog: true
  };

  // Profil
  const profileRef = doc(db, 'profile', 'info');
  const profileDoc = await getDoc(profileRef);
  data.profile = profileDoc.exists() ? profileDoc.data() : {};

  // Page d'accueil
  const homepageRef = doc(db, 'homepage', 'content');
  const homepageDoc = await getDoc(homepageRef);
  data.homepage = homepageDoc.exists() ? homepageDoc.data() : {};

  // Blocs de recherche
  const rechercheRef = collection(db, 'recherche');
  const rechercheSnap = await getDocs(rechercheRef);
  data.recherche = rechercheSnap.docs
    .map(doc => ({ id: doc.id, ...doc.data() }))
    .sort((a, b) => (a.ordre || 0) - (b.ordre || 0));

  // Publications
  const publicationsRef = collection(db, 'publications');
  const publicationsSnap = await getDocs(publicationsRef);
  data.publications = publicationsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  // Enseignements
  const enseignementRef = collection(db, 'enseignement');
  const enseignementSnap = await getDocs(enseignementRef);
  data.enseignement = enseignementSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  // Encadrements
  const encadrementsRef = collection(db, 'encadrements');
  const encadrementsSnap = await getDocs(encadrementsRef);
  data.encadrements = encadrementsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  // Blog
  const blogRef = collection(db, 'blog');
  const blogSnap = await getDocs(blogRef);
  data.blog = blogSnap.docs
    .map(doc => ({ id: doc.id, ...doc.data() }))
    .sort((a, b) => {
      const dateA = a.datePublication?.seconds || 0;
      const dateB = b.datePublication?.seconds || 0;
      return dateB - dateA; // Tri décroissant
    });

  return data;
}

/**
 * ═══════════════════════════════════════════════════════════════
 * 3. TÉLÉCHARGEMENT DES FICHIERS DEPUIS STORAGE
 * ═══════════════════════════════════════════════════════════════
 */
async function downloadFiles(data) {
  const filesToDownload = new Set();

  // Photo de profil
  if (data.profile.photo && data.profile.photo !== 'images/todo.jpg') {
    filesToDownload.add(data.profile.photo);
  }

  // Images des blocs de recherche
  data.recherche.forEach(bloc => {
    if (bloc.image && bloc.image !== 'images/todo.jpg') {
      filesToDownload.add(bloc.image);
    }
  });

  // PDFs des publications
  data.publications.forEach(pub => {
    if (pub.pdfPath && pub.pdfPath !== 'files/todo.pdf') {
      filesToDownload.add(pub.pdfPath);
    }
  });

  // Syllabus des enseignements
  data.enseignement.forEach(cours => {
    if (cours.syllabusPdfPath && cours.syllabusPdfPath !== 'files/todo.pdf') {
      filesToDownload.add(cours.syllabusPdfPath);
    }
  });

  // Images de couverture des articles de blog
  data.blog.forEach(article => {
    if (article.imageCouverture && article.imageCouverture !== 'images/todo.jpg') {
      filesToDownload.add(article.imageCouverture);
    }
  });

  // Télécharger tous les fichiers
  let downloaded = 0;
  let errors = 0;

  for (const filePath of filesToDownload) {
    try {
      const destPath = path.join(DIST_DIR, filePath);
      await fs.ensureDir(path.dirname(destPath));

      // Obtenir l'URL de téléchargement
      const fileRef = ref(storage, filePath);
      const url = await getDownloadURL(fileRef);

      // Télécharger le fichier via HTTP/HTTPS
      await downloadFile(url, destPath);
      downloaded++;
    } catch (error) {
      console.log(`   ⚠️  Erreur téléchargement ${filePath} : ${error.message}`);
      errors++;
    }
  }

  console.log(`   → ${downloaded} fichiers téléchargés, ${errors} erreurs`);

  // Créer les fichiers todo.jpg et todo.pdf si nécessaire
  await createFallbackFiles();
}

/**
 * Télécharger un fichier depuis une URL
 */
function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    const file = fs.createWriteStream(destPath);
    
    protocol.get(url, (response) => {
      // Suivre les redirections
      if (response.statusCode === 301 || response.statusCode === 302) {
        file.close();
        fs.unlink(destPath, () => {});
        return downloadFile(response.headers.location, destPath)
          .then(resolve)
          .catch(reject);
      }
      
      if (response.statusCode !== 200) {
        file.close();
        fs.unlink(destPath, () => {});
        return reject(new Error(`HTTP ${response.statusCode}`));
      }
      
      response.pipe(file);
      
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (err) => {
      file.close();
      fs.unlink(destPath, () => {});
      reject(err);
    });
  });
}

/**
 * ═══════════════════════════════════════════════════════════════
 * CRÉATION DES FICHIERS FALLBACK
 * ═══════════════════════════════════════════════════════════════
 */
async function createFallbackFiles() {
  // todo.jpg - Image SVG placeholder
  const todoImageSvg = `<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
    <rect width="400" height="400" fill="#f5f5f0"/>
    <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="24" fill="#1E3A5F" text-anchor="middle" dominant-baseline="middle">
      Image à venir
    </text>
  </svg>`;

  await fs.writeFile(path.join(DIST_DIR, 'images', 'todo.jpg'), todoImageSvg);

  // todo.pdf - PDF placeholder (on crée juste un fichier texte)
  const todoPdfContent = 'Document à venir';
  await fs.writeFile(path.join(DIST_DIR, 'files', 'todo.pdf'), todoPdfContent);
}

/**
 * ═══════════════════════════════════════════════════════════════
 * 4. GÉNÉRATION DES PAGES HTML
 * ═══════════════════════════════════════════════════════════════
 */
async function generatePages(data) {
  const annee = new Date().getFullYear();
  
  // Données communes à toutes les pages
  const commonData = {
    ...data.profile,
    ...data.siteConfig,
    annee,
    initiales: getInitials(data.profile.nom)
  };

  // Générer index.html
  await generateIndexPage(data, commonData);

  // Générer recherche.html
  await generateRecherchePage(data, commonData);

  // Générer publications.html
  await generatePublicationsPage(data, commonData);

  // Générer enseignement.html (si activé)
  if (data.siteConfig.enableEnseignement) {
    await generateEnseignementPage(data, commonData);
  }

  // Générer encadrements.html (si activé)
  if (data.siteConfig.enableEncadrements) {
    await generateEncadrementsPage(data, commonData);
  }

  // Générer blog.html et articles (si activé)
  if (data.siteConfig.enableBlog) {
    await generateBlogPages(data, commonData);
  }

  // Générer contact.html
  await generateContactPage(data, commonData);
}

/**
 * Génération index.html
 */
async function generateIndexPage(data, commonData) {
  const template = await fs.readFile(path.join(TEMPLATES_DIR, 'index.html'), 'utf-8');
  
  const pageData = {
    ...commonData,
    ...data.homepage
  };

  const html = Mustache.render(template, pageData);
  await fs.writeFile(path.join(DIST_DIR, 'index.html'), html);
  console.log('   ✓ index.html');
}

/**
 * Génération recherche.html
 */
async function generateRecherchePage(data, commonData) {
  const template = await fs.readFile(path.join(TEMPLATES_DIR, 'recherche.html'), 'utf-8');
  
  // Déterminer le layout de chaque bloc
  const blocs = data.recherche.map(bloc => {
    let layout = 'full';
    if (bloc.image) {
      layout = Math.random() > 0.5 ? 'left' : 'right';
    }
    return { ...bloc, layout };
  });

  const pageData = {
    ...commonData,
    blocs
  };

  const html = Mustache.render(template, pageData);
  await fs.writeFile(path.join(DIST_DIR, 'recherche.html'), html);
  console.log('   ✓ recherche.html');
}

/**
 * Génération publications.html
 */
async function generatePublicationsPage(data, commonData) {
  const template = await fs.readFile(path.join(TEMPLATES_DIR, 'publications.html'), 'utf-8');
  
  // Préparer les données des publications
  const publications = data.publications.map(pub => {
    const typeLabels = {
      'article': 'Article',
      'chapitre': 'Chapitre',
      'communication': 'Communication'
    };

    // Citation formatée
    const citation = `${pub.auteurs} (${pub.annee}). ${pub.titre}.`;

    return {
      ...pub,
      typeLabel: typeLabels[pub.type] || pub.type,
      citation,
      thematiquesString: pub.thematiques ? pub.thematiques.join(',') : '',
      tags: pub.thematiques || []
    };
  });

  // Trier par année décroissante
  publications.sort((a, b) => b.annee - a.annee);

  const pageData = {
    ...commonData,
    publications,
    totalPublications: publications.length
  };

  const html = Mustache.render(template, pageData);
  await fs.writeFile(path.join(DIST_DIR, 'publications.html'), html);
  console.log('   ✓ publications.html');
}

/**
 * Génération enseignement.html
 */
async function generateEnseignementPage(data, commonData) {
  const template = await fs.readFile(path.join(TEMPLATES_DIR, 'enseignement.html'), 'utf-8');
  
  // Grouper les cours par niveau
  const coursLicence = data.enseignement.filter(c => c.niveau && c.niveau.startsWith('L'));
  const coursMaster = data.enseignement.filter(c => c.niveau && c.niveau.startsWith('M'));
  const coursDoctorat = data.enseignement.filter(c => c.niveau && c.niveau.startsWith('D'));

  const pageData = {
    ...commonData,
    hasLicence: coursLicence.length > 0,
    hasMaster: coursMaster.length > 0,
    hasDoctorat: coursDoctorat.length > 0,
    coursLicence,
    coursMaster,
    coursDoctorat
  };

  const html = Mustache.render(template, pageData);
  await fs.writeFile(path.join(DIST_DIR, 'enseignement.html'), html);
  console.log('   ✓ enseignement.html');
}

/**
 * Génération encadrements.html
 */
async function generateEncadrementsPage(data, commonData) {
  const template = await fs.readFile(path.join(TEMPLATES_DIR, 'encadrements.html'), 'utf-8');
  
  // Grouper les encadrements par type
  const theses = data.encadrements.filter(e => e.type === 'thèse');
  const memoires = data.encadrements.filter(e => e.type === 'mémoire');

  // Ajouter une classe CSS pour le statut
  const thesesWithClass = theses.map(e => ({
    ...e,
    statutClass: e.statut === 'en cours' ? 'ongoing' : 'completed'
  }));

  const memoiresWithClass = memoires.map(e => ({
    ...e,
    statutClass: e.statut === 'en cours' ? 'ongoing' : 'completed'
  }));

  const pageData = {
    ...commonData,
    hasTheses: theses.length > 0,
    hasMemoires: memoires.length > 0,
    theses: thesesWithClass,
    memoires: memoiresWithClass
  };

  const html = Mustache.render(template, pageData);
  await fs.writeFile(path.join(DIST_DIR, 'encadrements.html'), html);
  console.log('   ✓ encadrements.html');
}

/**
 * Génération blog.html et articles individuels
 */
async function generateBlogPages(data, commonData) {
  // Template blog.html
  const blogTemplate = await fs.readFile(path.join(TEMPLATES_DIR, 'blog.html'), 'utf-8');
  
  // Extraire toutes les catégories uniques
  const categoriesSet = new Set();
  data.blog.forEach(article => {
    if (article.categories) {
      article.categories.forEach(cat => categoriesSet.add(cat));
    }
  });

  const categories = Array.from(categoriesSet).map(cat => ({
    nom: cat,
    slug: slugify(cat)
  }));

  // Préparer les articles pour la liste
  const articles = data.blog.map(article => {
    // Gérer les timestamps Firestore
    let date;
    if (article.datePublication?.seconds) {
      date = new Date(article.datePublication.seconds * 1000);
    } else if (article.datePublication?.toDate) {
      date = article.datePublication.toDate();
    } else if (article.datePublication) {
      date = new Date(article.datePublication);
    } else {
      date = new Date();
    }
    
    // Extraire un excerpt du contenu markdown
    const excerpt = article.contenuMarkdown
      ? article.contenuMarkdown.substring(0, 150).replace(/[#*\[\]]/g, '') + '...'
      : '';

    return {
      ...article,
      dateFormatted: formatDate(date),
      dateISO: date.toISOString(),
      excerpt,
      categoriesString: article.categories ? article.categories.map(slugify).join(',') : ''
    };
  });

  const blogData = {
    ...commonData,
    articles,
    categories,
    noArticles: articles.length === 0
  };

  const blogHtml = Mustache.render(blogTemplate, blogData);
  await fs.writeFile(path.join(DIST_DIR, 'blog.html'), blogHtml);
  console.log('   ✓ blog.html');

  // Générer les pages individuelles des articles
  const articleTemplate = await fs.readFile(path.join(TEMPLATES_DIR, 'blog-article.html'), 'utf-8');

  for (const article of data.blog) {
    // Gérer les timestamps Firestore
    let date;
    if (article.datePublication?.seconds) {
      date = new Date(article.datePublication.seconds * 1000);
    } else if (article.datePublication?.toDate) {
      date = article.datePublication.toDate();
    } else if (article.datePublication) {
      date = new Date(article.datePublication);
    } else {
      date = new Date();
    }
    
    // Convertir Markdown en HTML
    const contenuHTML = marked(article.contenuMarkdown || '');

    // Extraire un excerpt
    const excerpt = article.contenuMarkdown
      ? article.contenuMarkdown.substring(0, 150).replace(/[#*\[\]]/g, '') + '...'
      : '';

    const articleData = {
      ...commonData,
      ...article,
      contenuHTML,
      excerpt,
      dateFormatted: formatDate(date),
      dateISO: date.toISOString(),
      urlComplete: `https://votre-domaine.com/blog/${article.slug}.html`,
      auteurNom: commonData.nom
    };

    const articleHtml = Mustache.render(articleTemplate, articleData);
    await fs.writeFile(path.join(DIST_DIR, 'blog', `${article.slug}.html`), articleHtml);
  }

  console.log(`   ✓ ${data.blog.length} articles de blog`);
}

/**
 * Génération contact.html
 */
async function generateContactPage(data, commonData) {
  const template = await fs.readFile(path.join(TEMPLATES_DIR, 'contact.html'), 'utf-8');
  
  const pageData = {
    ...commonData
  };

  const html = Mustache.render(template, pageData);
  await fs.writeFile(path.join(DIST_DIR, 'contact.html'), html);
  console.log('   ✓ contact.html');
}

/**
 * ═══════════════════════════════════════════════════════════════
 * 5. COPIE DES ASSETS STATIQUES
 * ═══════════════════════════════════════════════════════════════
 */
async function copyAssets() {
  // Copier CSS
  await fs.copy(
    path.join(TEMPLATES_DIR, 'css'),
    path.join(DIST_DIR, 'css')
  );
  console.log('   ✓ CSS copiés');

  // Copier JS
  await fs.copy(
    path.join(TEMPLATES_DIR, 'js'),
    path.join(DIST_DIR, 'js')
  );
  console.log('   ✓ JS copiés');
}

/**
 * ═══════════════════════════════════════════════════════════════
 * 6. COPIE DE L'INTERFACE ADMIN
 * ═══════════════════════════════════════════════════════════════
 */
async function copyAdmin() {
  if (await fs.pathExists(ADMIN_DIR)) {
    await fs.copy(ADMIN_DIR, path.join(DIST_DIR, 'admin'));
    console.log('   ✓ Interface admin copiée');
  } else {
    console.log('   ⚠️  Dossier admin/ introuvable');
  }
}

/**
 * ═══════════════════════════════════════════════════════════════
 * UTILITAIRES
 * ═══════════════════════════════════════════════════════════════
 */

function getInitials(nom) {
  if (!nom) return 'NK';
  const parts = nom.split(' ');
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return parts.map(p => p[0]).join('').toUpperCase();
}

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function formatDate(date) {
  if (!date) return '';
  
  // Gérer les timestamps Firestore
  if (date.seconds) {
    date = new Date(date.seconds * 1000);
  } else if (date.toDate) {
    date = date.toDate();
  } else if (!(date instanceof Date)) {
    date = new Date(date);
  }
  
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('fr-FR', options);
}

/**
 * ═══════════════════════════════════════════════════════════════
 * EXÉCUTION
 * ═══════════════════════════════════════════════════════════════
 */

build()
  .then(() => {
    console.log('\n🎉 Build réussi !');
    process.exit(0);
  })
  .catch(error => {
    console.error('\n💥 Build échoué :', error);
    process.exit(1);
  });