# 🚀 Guide de démarrage rapide

## Installation en 5 minutes

### 1. Installer les dépendances

```bash
npm install
```

### 2. Initialiser Firestore avec les données de démo

```bash
npm run init
```

Cette commande va créer :
- ✅ Configuration du site
- ✅ Profil de Nicolas Khatmi
- ✅ Page d'accueil
- ✅ 3 blocs de recherche
- ✅ 5 publications
- ✅ 5 enseignements
- ✅ 5 encadrements
- ✅ 3 articles de blog

### 3. Créer un compte admin

1. Aller sur [Firebase Console](https://console.firebase.google.com)
2. Sélectionner le projet `nicolas-portfolio-eaf2e`
3. Aller dans **Authentication** → **Users** → **Add user**
4. Créer un compte avec email/mot de passe

### 4. Accéder à l'interface admin

```bash
npm run dev
```

Puis ouvrir `http://localhost:8080/admin/`

### 5. Publier le site

#### Configuration du webhook Vercel

1. Créer un compte sur [Vercel](https://vercel.com)
2. Importer le projet depuis Git
3. Dans Settings → Git → Deploy Hooks :
   - Name: "Admin Publish"
   - Branch: main
   - Copier l'URL générée
4. Dans `admin/js/publish.js`, remplacer `VOTRE_WEBHOOK_URL_ICI` par l'URL

#### Déployer

Via l'interface admin (bouton "Publier") ou :

```bash
npm run deploy
```

---

## 📁 Structure des fichiers

```
portfolio-nicolas-khatmi/
├── templates/              # Templates HTML/CSS/JS
│   ├── *.html
│   ├── css/
│   └── js/
├── build/
│   ├── init-firestore.js   # Initialisation données
│   └── generate.js         # Script de build
├── admin/                  # Interface d'administration
│   ├── index.html
│   ├── css/admin.css
│   └── js/*.js
├── dist/                   # Site généré (gitignored)
├── package.json
└── README.md
```

---

## 🎯 Prochaines étapes

### Personnaliser le contenu

1. **Profil** : Modifier nom, titre, photo, contacts
2. **Accueil** : Éditer les 2 paragraphes de présentation
3. **Recherche** : Ajouter/modifier/ordonner les blocs
4. **Publications** : Ajouter vos publications avec PDFs
5. **Enseignement** : Si activé, ajouter vos cours
6. **Blog** : Si activé, publier des articles

### Uploader vos fichiers

- **Images** : Format JPG/PNG, max 5 Mo
- **PDFs** : Publications et syllabus, max 10 Mo

Les fichiers sont stockés dans Firebase Storage et accessibles publiquement.

### Configurer les pages

Dans **Configuration**, activer/désactiver :
- Page Enseignement
- Page Blog

---

## 🔧 Développement

### Commandes disponibles

```bash
# Initialiser Firestore
npm run init

# Build le site
npm run build

# Build + serveur local
npm run dev

# Déployer sur Vercel
npm run deploy
```

### Modifier les templates

Les templates utilisent **Mustache** pour l'injection de données :

```html
<h1>{{nom}}</h1>
<p>{{titre}}</p>
```

Après modification, relancer `npm run build`.

### Ajouter une section

1. Créer la collection dans Firestore
2. Ajouter les données dans `build/init-firestore.js`
3. Créer le template HTML
4. Modifier `build/generate.js` pour générer la page
5. Créer le fichier JS dans `admin/js/`

---

## 🎨 Personnaliser le design

### Couleurs

Modifier `templates/css/variables.css` :

```css
:root {
  --color-accent: #1E3A5F;    /* Bleu nuit */
  --color-action: #D75A28;    /* Orange terracotta */
  --color-bg: #FAFAF8;        /* Blanc cassé */
}
```

### Typographie

```css
:root {
  --font-display: 'Playfair Display', Georgia, serif;
  --font-body: 'Inter', sans-serif;
}
```

---

## 🔒 Sécurité

### Règles Firestore

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read: if true;                // Lecture publique
      allow write: if request.auth != null; // Écriture authentifiée
    }
  }
}
```

### Règles Storage

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

---

## ❓ Problèmes fréquents

### "Firebase not initialized"

Vérifier que les identifiants Firebase sont corrects dans :
- `build/init-firestore.js`
- `build/generate.js`
- `admin/js/firebase-config.js`

### Images ne s'affichent pas

1. Vérifier que les fichiers sont bien dans Firebase Storage
2. Vérifier les règles de sécurité Storage
3. Relancer `npm run build`

### Webhook Vercel ne fonctionne pas

1. Vérifier l'URL dans `admin/js/publish.js`
2. Vérifier que le Deploy Hook est bien créé dans Vercel
3. Vérifier la branche configurée

---

## 📞 Support

Pour toute question :
- Consulter le [README.md](README.md) complet
- Vérifier la [documentation Firebase](https://firebase.google.com/docs)
- Consulter la [documentation Vercel](https://vercel.com/docs)

---

**Bon développement ! 🚀**
