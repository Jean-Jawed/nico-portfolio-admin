/**
 * ═══════════════════════════════════════════════════════════════
 * SCRIPT D'INITIALISATION FIRESTORE
 * Création de la structure et ajout des données de démonstration
 * ═══════════════════════════════════════════════════════════════
 */

const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc, collection, addDoc } = require('firebase/firestore');

// Configuration Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCTzKnW3F2xONaSjnnkHZI0JRs_Z9Dq2VQ",
  authDomain: "nicolas-portfolio-eaf2e.firebaseapp.com",
  projectId: "nicolas-portfolio-eaf2e",
  storageBucket: "nicolas-portfolio-eaf2e.firebasestorage.app",
  messagingSenderId: "516157460066",
  appId: "1:516157460066:web:4d865df2ef87b6aece0b3b"
};

// Initialisation
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/**
 * ═══════════════════════════════════════════════════════════════
 * DONNÉES DE DÉMONSTRATION
 * ═══════════════════════════════════════════════════════════════
 */

async function initializeFirestore() {
  console.log('🚀 Initialisation de Firestore...\n');

  try {
    // 1. Configuration du site
    await createSiteConfig();
    
    // 2. Profil
    await createProfile();
    
    // 3. Page d'accueil
    await createHomepage();
    
    // 4. Blocs de recherche
    await createResearchBlocks();
    
    // 5. Publications
    await createPublications();
    
    // 6. Enseignements
    await createTeaching();
    
    // 7. Encadrements
    await createSupervision();
    
    // 8. Articles de blog
    await createBlogPosts();
    
    console.log('\n✅ Initialisation terminée avec succès !');
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation :', error);
  }
}

/**
 * ═══════════════════════════════════════════════════════════════
 * 1. CONFIGURATION DU SITE
 * ═══════════════════════════════════════════════════════════════
 */
async function createSiteConfig() {
  console.log('📝 Création de la configuration du site...');
  
  await setDoc(doc(db, 'siteConfig', 'config'), {
    enableEnseignement: true,
    enableEncadrements: true,
    enableBlog: true
  });
  
  console.log('   ✓ Configuration créée');
}

/**
 * ═══════════════════════════════════════════════════════════════
 * 2. PROFIL
 * ═══════════════════════════════════════════════════════════════
 */
async function createProfile() {
  console.log('📝 Création du profil...');
  
  await setDoc(doc(db, 'profile', 'info'), {
    nom: 'Nicolas Khatmi',
    titre: 'Psychologue - Docteur en Psychologie Sociale',
    baseline: 'Chercheur spécialisé dans les processus de discrimination et les relations intergroupes',
    photo: 'images/todo.jpg', // Chemin relatif
    email: 'nicolas.khatmi@universite.fr',
    telephone: '+33 1 23 45 67 89',
    bureau: 'Bureau A304, Bâtiment Sciences Humaines',
    orcid: 'https://orcid.org/0000-0000-0000-0000',
    researchgate: 'https://www.researchgate.net/profile/Nicolas-Khatmi',
    googleScholar: 'https://scholar.google.com/citations?user=XXXXXXX',
    linkedin: 'https://www.linkedin.com/in/nicolas-khatmi'
  });
  
  console.log('   ✓ Profil créé');
}

/**
 * ═══════════════════════════════════════════════════════════════
 * 3. PAGE D'ACCUEIL
 * ═══════════════════════════════════════════════════════════════
 */
async function createHomepage() {
  console.log('📝 Création de la page d\'accueil...');
  
  await setDoc(doc(db, 'homepage', 'content'), {
    paragraphe1Titre: 'Parcours académique',
    paragraphe1Texte: `Docteur en Psychologie Sociale, mes travaux portent sur les mécanismes psychologiques à l'œuvre dans les situations de discrimination et de préjugés. Diplômé de l'Université Paris Nanterre, j'ai soutenu ma thèse en 2019 sur les stratégies de légitimation des inégalités sociales.

Actuellement maître de conférences, j'enseigne la psychologie sociale et les méthodologies de recherche quantitative. Mes enseignements visent à former les étudiants aux outils conceptuels et méthodologiques permettant de comprendre les dynamiques sociales contemporaines.`,
    
    paragraphe2Titre: 'Axes de recherche',
    paragraphe2Texte: `Mes recherches s'articulent autour de trois axes principaux : l'étude des processus de catégorisation sociale et de stéréotypisation, l'analyse des mécanismes de justification du système social, et l'examen des stratégies de gestion de l'identité sociale dans les contextes de discrimination.

Je m'intéresse particulièrement aux applications de ces recherches dans le domaine de l'éducation, de l'emploi et des politiques publiques de lutte contre les discriminations.`
  });
  
  console.log('   ✓ Page d\'accueil créée');
}

/**
 * ═══════════════════════════════════════════════════════════════
 * 4. BLOCS DE RECHERCHE
 * ═══════════════════════════════════════════════════════════════
 */
async function createResearchBlocks() {
  console.log('📝 Création des blocs de recherche...');
  
  const blocks = [
    {
      ordre: 1,
      titre: 'Discrimination et préjugés',
      texte: `Mes travaux examinent les mécanismes psychologiques sous-jacents aux phénomènes de discrimination. Je m'intéresse aux processus cognitifs (catégorisation, stéréotypisation) et motivationnels (menace identitaire, justification du système) qui favorisent l'émergence et le maintien des préjugés.

À travers des études expérimentales et corrélationnelles, je cherche à identifier les facteurs situationnels et individuels qui modulent l'expression de la discrimination, ainsi que les stratégies efficaces pour la réduire.`,
      image: 'images/todo.jpg'
    },
    {
      ordre: 2,
      titre: 'Relations intergroupes',
      texte: `Je développe des recherches sur les dynamiques de relations entre groupes sociaux, en particulier dans les contextes de compétition pour les ressources ou de menace perçue. Mes études portent sur les conditions favorisant la coopération intergroupes versus le conflit.

J'analyse également les processus de contact intergroupe et leurs effets sur la réduction des préjugés, en considérant les variables médiatrices et modératrices de ces effets.`,
      image: ''
    },
    {
      ordre: 3,
      titre: '',
      texte: `Enfin, je m'intéresse aux applications pratiques de ces recherches fondamentales. Je collabore avec des organisations publiques et privées pour développer des interventions basées sur les données probantes visant à promouvoir la diversité et l'inclusion.

Ces interventions s'appuient sur les principes de la psychologie sociale pour modifier les attitudes, les normes et les comportements discriminatoires dans différents contextes professionnels et institutionnels.`,
      image: 'images/todo.jpg'
    }
  ];
  
  for (const block of blocks) {
    await addDoc(collection(db, 'recherche'), block);
  }
  
  console.log(`   ✓ ${blocks.length} blocs de recherche créés`);
}

/**
 * ═══════════════════════════════════════════════════════════════
 * 5. PUBLICATIONS
 * ═══════════════════════════════════════════════════════════════
 */
async function createPublications() {
  console.log('📝 Création des publications...');
  
  const publications = [
    {
      titre: 'Mécanismes de justification du système : une revue critique',
      auteurs: 'Khatmi, N., & Dupont, M.',
      annee: 2023,
      type: 'article',
      resume: 'Cette revue de littérature examine les principaux modèles théoriques de la justification du système social. Nous analysons les mécanismes cognitifs et motivationnels par lesquels les individus maintiennent leur croyance en un monde juste, même face à des inégalités flagrantes.',
      descriptionRapide: 'Revue critique des théories de la justification du système social',
      thematiques: ['Justification du système', 'Inégalités sociales', 'Cognition sociale'],
      pdfPath: 'files/todo.pdf',
      doi: '10.1234/example.2023.001',
      lienEditeur: 'https://www.example-journal.com/article/12345'
    },
    {
      titre: 'L\'effet du contact intergroupe sur la réduction des préjugés : méta-analyse',
      auteurs: 'Khatmi, N., Martin, L., & Bernard, P.',
      annee: 2022,
      type: 'article',
      resume: 'Cette méta-analyse synthétise 150 études sur l\'hypothèse du contact. Nos résultats confirment l\'effet positif du contact intergroupe sur la réduction des préjugés, tout en identifiant les conditions optimales de ce contact.',
      descriptionRapide: 'Méta-analyse de 150 études sur l\'hypothèse du contact intergroupe',
      thematiques: ['Contact intergroupe', 'Préjugés', 'Méta-analyse'],
      pdfPath: 'files/todo.pdf',
      doi: '10.1234/example.2022.042',
      lienEditeur: ''
    },
    {
      titre: 'Stéréotypes de genre dans l\'orientation scolaire',
      auteurs: 'Khatmi, N.',
      annee: 2021,
      type: 'chapitre',
      resume: 'Ce chapitre examine le rôle des stéréotypes de genre dans les choix d\'orientation des élèves. Nous présentons des données montrant comment ces stéréotypes influencent les aspirations professionnelles dès le collège.',
      descriptionRapide: 'Analyse du rôle des stéréotypes de genre dans l\'orientation scolaire',
      thematiques: ['Stéréotypes de genre', 'Éducation', 'Orientation'],
      pdfPath: '',
      doi: '',
      lienEditeur: 'https://www.example-publisher.com/book/12345'
    },
    {
      titre: 'Discrimination à l\'embauche : facteurs psychologiques et organisationnels',
      auteurs: 'Khatmi, N., & Rousseau, A.',
      annee: 2020,
      type: 'communication',
      resume: 'Communication présentée au 32e Congrès International de Psychologie du Travail. Nous exposons les résultats d\'une étude expérimentale sur les biais implicites dans le recrutement.',
      descriptionRapide: 'Étude expérimentale sur les biais dans le recrutement',
      thematiques: ['Discrimination', 'Emploi', 'Biais implicites'],
      pdfPath: 'files/todo.pdf',
      doi: '',
      lienEditeur: ''
    },
    {
      titre: 'Menace du stéréotype et performance académique',
      auteurs: 'Khatmi, N., Thomas, C., & Petit, F.',
      annee: 2019,
      type: 'article',
      resume: 'Cet article examine les effets de la menace du stéréotype sur les performances académiques des étudiants issus de groupes stigmatisés. Nous proposons également des interventions pour atténuer ces effets.',
      descriptionRapide: 'Effets de la menace du stéréotype sur la performance académique',
      thematiques: ['Menace du stéréotype', 'Performance', 'Éducation'],
      pdfPath: 'files/todo.pdf',
      doi: '10.1234/example.2019.087',
      lienEditeur: 'https://www.example-journal.com/article/67890'
    }
  ];
  
  for (const pub of publications) {
    await addDoc(collection(db, 'publications'), pub);
  }
  
  console.log(`   ✓ ${publications.length} publications créées`);
}

/**
 * ═══════════════════════════════════════════════════════════════
 * 6. ENSEIGNEMENTS
 * ═══════════════════════════════════════════════════════════════
 */
async function createTeaching() {
  console.log('📝 Création des enseignements...');
  
  const courses = [
    {
      intitule: 'Psychologie Sociale Fondamentale',
      niveau: 'L2',
      volumeHoraire: '24h CM + 12h TD',
      annee: '2024-2025',
      description: 'Introduction aux concepts fondamentaux de la psychologie sociale : influence sociale, cognition sociale, attitudes et comportements, relations intergroupes.',
      syllabusPdfPath: 'files/todo.pdf'
    },
    {
      intitule: 'Méthodologie de la Recherche Quantitative',
      niveau: 'L3',
      volumeHoraire: '18h CM + 18h TD',
      annee: '2024-2025',
      description: 'Formation aux méthodes quantitatives en psychologie : élaboration de questionnaires, plans expérimentaux, analyses statistiques avec SPSS et R.',
      syllabusPdfPath: ''
    },
    {
      intitule: 'Psychologie des Relations Intergroupes',
      niveau: 'M1',
      volumeHoraire: '20h CM',
      annee: '2024-2025',
      description: 'Approfondissement des théories et recherches sur les relations intergroupes : identité sociale, catégorisation, préjugés, discrimination, stratégies de réduction.',
      syllabusPdfPath: 'files/todo.pdf'
    },
    {
      intitule: 'Séminaire de Recherche Avancée',
      niveau: 'M2',
      volumeHoraire: '30h',
      annee: '2024-2025',
      description: 'Séminaire d\'accompagnement à la recherche : lecture critique d\'articles, présentation de travaux, discussion méthodologique.',
      syllabusPdfPath: ''
    },
    {
      intitule: 'Psychologie Appliquée aux Organisations',
      niveau: 'M2',
      volumeHoraire: '16h CM',
      annee: '2024-2025',
      description: 'Applications de la psychologie sociale au monde du travail : diversité et inclusion, management interculturel, gestion des conflits.',
      syllabusPdfPath: ''
    }
  ];
  
  for (const course of courses) {
    await addDoc(collection(db, 'enseignement'), course);
  }
  
  console.log(`   ✓ ${courses.length} enseignements créés`);
}

/**
 * ═══════════════════════════════════════════════════════════════
 * 7. ENCADREMENTS
 * ═══════════════════════════════════════════════════════════════
 */
async function createSupervision() {
  console.log('📝 Création des encadrements...');
  
  const supervisions = [
    {
      type: 'thèse',
      titre: 'Processus de légitimation des inégalités salariales entre hommes et femmes',
      etudiant: 'Marie Dubois',
      annee: '2021-2024',
      statut: 'en cours'
    },
    {
      type: 'thèse',
      titre: 'Contact intergroupe et réduction des préjugés en milieu scolaire',
      etudiant: 'Ahmed Ben Salem',
      annee: '2018-2022',
      statut: 'soutenu'
    },
    {
      type: 'mémoire',
      titre: 'Stéréotypes de genre dans les jouets pour enfants',
      etudiant: 'Sophie Martin',
      annee: '2024',
      statut: 'en cours'
    },
    {
      type: 'mémoire',
      titre: 'Discrimination à l\'embauche des personnes en situation de handicap',
      etudiant: 'Lucas Petit',
      annee: '2023',
      statut: 'soutenu'
    },
    {
      type: 'mémoire',
      titre: 'Menace du stéréotype chez les étudiants de première génération',
      etudiant: 'Fatima El Kadi',
      annee: '2023',
      statut: 'soutenu'
    }
  ];
  
  for (const supervision of supervisions) {
    await addDoc(collection(db, 'encadrements'), supervision);
  }
  
  console.log(`   ✓ ${supervisions.length} encadrements créés`);
}

/**
 * ═══════════════════════════════════════════════════════════════
 * 8. ARTICLES DE BLOG
 * ═══════════════════════════════════════════════════════════════
 */
async function createBlogPosts() {
  console.log('📝 Création des articles de blog...');
  
  const posts = [
    {
      titre: 'Les biais implicites : que dit la recherche ?',
      slug: 'biais-implicites-recherche',
      contenuMarkdown: `# Les biais implicites : que dit la recherche ?

Les **biais implicites** sont des attitudes ou stéréotypes inconscients qui affectent notre compréhension, nos actions et nos décisions. Contrairement aux préjugés explicites, ces biais opèrent en dehors de notre conscience.

## Origines et mécanismes

Les recherches en psychologie sociale montrent que ces biais se forment à travers :
- L'exposition répétée à des associations culturelles
- Les mécanismes d'apprentissage automatique
- Les heuristiques de jugement

## Impact dans la vie quotidienne

Ces biais influencent de nombreux domaines :
1. Le recrutement et la gestion des carrières
2. Les décisions médicales
3. Les interactions sociales quotidiennes

## Que faire ?

La prise de conscience est la première étape, mais elle n'est pas suffisante. Les interventions efficaces incluent :
- La modification des contextes décisionnels
- L'entraînement à la perspective de l'autre
- Les changements organisationnels structurels

La recherche continue à explorer les meilleures stratégies pour réduire l'impact de ces biais.`,
      datePublication: new Date('2024-11-15'),
      categories: ['Recherche', 'Préjugés', 'Cognition'],
      imageCouverture: 'images/todo.jpg'
    },
    {
      titre: 'Contact intergroupe : une solution miracle ?',
      slug: 'contact-intergroupe-solution',
      contenuMarkdown: `# Contact intergroupe : une solution miracle ?

L'hypothèse du contact, formulée par Gordon Allport en 1954, suggère que le contact entre groupes peut réduire les préjugés. Mais est-ce vraiment si simple ?

## Les conditions du contact positif

Allport a identifié quatre conditions essentielles :
- **Statut égal** entre les groupes
- **Buts communs**
- **Coopération** intergroupe
- **Soutien institutionnel**

## Ce que montrent les méta-analyses

Les recherches récentes confirment l'effet positif du contact, mais avec des nuances importantes :

### Effets positifs
- Réduction des préjugés et de l'anxiété
- Augmentation de l'empathie
- Amélioration des attitudes intergroupes

### Limites
- Les effets varient selon les contextes
- Le contact peut parfois renforcer les stéréotypes
- Les conditions optimales sont rarement réunies

## Implications pratiques

Pour maximiser les bénéfices du contact :
1. Créer des situations d'interdépendance positive
2. Favoriser l'amitié intergroupe
3. Encourager les identités communes

Le contact est un outil puissant mais pas une solution miracle.`,
      datePublication: new Date('2024-10-22'),
      categories: ['Relations intergroupes', 'Préjugés'],
      imageCouverture: ''
    },
    {
      titre: 'Diversité en entreprise : au-delà des bonnes intentions',
      slug: 'diversite-entreprise',
      contenuMarkdown: `# Diversité en entreprise : au-delà des bonnes intentions

De nombreuses organisations affichent leur engagement en faveur de la diversité et de l'inclusion. Mais entre les déclarations et la réalité, l'écart reste souvent important.

## Les pièges des politiques de diversité

### Le paradoxe de la diversité
Paradoxalement, certaines politiques de diversité peuvent :
- Activer les stéréotypes qu'elles cherchent à combattre
- Créer un sentiment de menace chez les groupes dominants
- Être perçues comme de la discrimination positive

### L'illusion du changement
Les formations à la diversité, bien que populaires, montrent des résultats mitigés :
- Effets de courte durée
- Parfois un effet inverse (backlash)
- Peu d'impact sur les comportements réels

## Des interventions basées sur les preuves

Les recherches suggèrent des approches plus efficaces :

### Changements structurels
- Modifier les processus de recrutement et d'évaluation
- Anonymiser les candidatures
- Diversifier les comités de sélection

### Culture organisationnelle
- Promouvoir une culture d'inclusion
- Valoriser les contributions diverses
- Responsabiliser les leaders

### Mesure et suivi
- Collecter des données objectives
- Suivre les indicateurs de diversité
- Ajuster les politiques selon les résultats

La diversité effective nécessite un engagement soutenu et des changements profonds, pas seulement des déclarations.`,
      datePublication: new Date('2024-09-08'),
      categories: ['Application', 'Organisations', 'Diversité'],
      imageCouverture: 'images/todo.jpg'
    }
  ];
  
  for (const post of posts) {
    await addDoc(collection(db, 'blog'), post);
  }
  
  console.log(`   ✓ ${posts.length} articles de blog créés`);
}

/**
 * ═══════════════════════════════════════════════════════════════
 * EXÉCUTION
 * ═══════════════════════════════════════════════════════════════
 */

initializeFirestore()
  .then(() => {
    console.log('\n🎉 Toutes les données de démonstration ont été créées !');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Erreur fatale :', error);
    process.exit(1);
  });