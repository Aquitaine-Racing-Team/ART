# ART — Aquitaine Racing Team Website
## Guide de gestion du site

---

## 📁 Structure des fichiers

```
ART/
├── index.html              ← Page d'accueil
├── evenements.html         ← Liste des évènements
├── galerie.html            ← Galerie photos (albums)
├── a-propos.html           ← À propos du club
├── rejoindre.html          ← Rejoindre le club
├── contact.html            ← Contact
├── events.json             ← ⭐ FICHIER PRINCIPAL — liste tous les évènements
│
├── events/                 ← Pages évènements générées
│   ├── event-saintonge-2025.html
│   ├── photos-saintonge-2025.html
│   └── ...
│
├── pictures/
│   ├── site/               ← Images du site (logo, hero, etc.)
│   ├── saintonge-2025/     ← Photos de chaque évènement
│   │   ├── cover.jpg       ← ⭐ OBLIGATOIRE — miniature de l'évènement
│   │   ├── photos.json     ← ⭐ Liste des photos (voir ci-dessous)
│   │   ├── photo-1.jpg
│   │   └── ...
│   └── nogaro-2024/
│       ├── cover.jpg
│       ├── photos.json
│       └── ...
│
├── css/style.css           ← Tous les styles
└── js/main.js              ← JavaScript principal
```

---

## ➕ Ajouter un nouvel évènement (4 étapes)

### Étape 1 — Créer le dossier photos
Dans `pictures/`, créez un dossier avec le nom de l'évènement (sans espaces, en minuscules avec des tirets) :
```
pictures/nogaro-2025/
```

Ajoutez une image `cover.jpg` (miniature qui apparaîtra partout sur le site).

### Étape 2 — Ajouter l'entrée dans events.json
Ouvrez `events.json` et ajoutez un objet au **début du tableau** :

```json
{
  "id": "nogaro-2025",
  "title": "Sortie Nogaro",
  "subtitle": "Circuit de Nogaro",
  "date": "2025-09-15",
  "dateDisplay": "15 Septembre 2025",
  "status": "upcoming",
  "description": "Courte description (2-3 lignes) pour les cartes.",
  "fullDescription": "Description complète qui apparaît sur la page de l'évènement.\n\nVous pouvez séparer les paragraphes avec deux sauts de ligne.",
  "details": [
    "Coût de participation : 190€ par jour",
    "3 à 4 plateaux de roulage",
    "Sessions de 20 minutes sur circuit"
  ],
  "thumbnail": "pictures/nogaro-2025/cover.jpg",
  "folder": "nogaro-2025",
  "googleForm": "https://forms.gle/VOTRE_LIEN_GOOGLE_FORM",
  "hasPhotos": false
}
```

> **status** : `"upcoming"` pour un évènement à venir, `"past"` pour un évènement passé.
> **hasPhotos** : `false` au départ, changez en `true` une fois les photos ajoutées.

### Étape 3 — Créer les pages HTML
Copiez les fichiers template :
```
events/event-template.html  →  events/event-nogaro-2025.html
events/photos-template.html →  events/photos-nogaro-2025.html
```
(Rien à modifier dans ces fichiers — le JavaScript lit automatiquement l'ID depuis le nom du fichier)

### Étape 4 — Ajouter le formulaire Google Form
Dans `events.json`, remplacez `"googleForm"` par le lien de votre Google Form.
Ce lien apparaîtra automatiquement sur la carte de l'évènement et sur la page détail.

---

## 📸 Ajouter des photos à un évènement

1. Ajoutez vos photos dans `pictures/nom-evenement/`
2. Créez un fichier `photos.json` dans ce même dossier :

```json
["cover.jpg", "photo-1.jpg", "photo-2.jpg", "photo-3.jpg"]
```

Listez simplement les noms de fichiers dans l'ordre voulu.

3. Dans `events.json`, changez `"hasPhotos": false` en `"hasPhotos": true` pour cet évènement.

---

## 🎨 Personnalisation rapide

### Changer les images du site
- **Logo** : remplacez `pictures/site/logo.jpg`
- **Image hero** : remplacez `pictures/site/hero.jpg`
- **Image À propos** : remplacez `pictures/site/about.jpg`
- **Photos galerie accueil** : ajoutez `pictures/site/gallery-1.jpg` à `gallery-6.jpg`

### Changer la couleur accent
Dans `css/style.css`, modifiez la variable `--red` :
```css
--red: #DC2626;  /* Rouge par défaut */
```

### Activer le formulaire de contact (Formspree)
1. Créez un compte gratuit sur [formspree.io](https://formspree.io)
2. Créez un formulaire et copiez votre ID
3. Dans `js/main.js`, remplacez `YOUR_FORMSPREE_ID` par votre vrai ID

### Changer les numéros de téléphone / réseaux sociaux
Recherchez dans tous les fichiers HTML et remplacez directement.

---

## 🔄 Marquer un évènement comme passé

Dans `events.json`, changez :
- `"status": "upcoming"` → `"status": "past"`
- `"hasPhotos": false` → `"hasPhotos": true` (une fois les photos ajoutées)

---

## 📋 Checklist nouvel évènement

- [ ] Créer le dossier `pictures/nom-evenement/`
- [ ] Ajouter `cover.jpg` dans ce dossier
- [ ] Ajouter l'entrée dans `events.json`
- [ ] Copier `event-template.html` → `events/event-NOM.html`
- [ ] Copier `photos-template.html` → `events/photos-NOM.html`
- [ ] Remplacer le lien Google Form dans `events.json`
- [ ] Pousser sur GitHub

---

## 📋 Checklist après l'évènement

- [ ] Ajouter les photos dans `pictures/nom-evenement/`
- [ ] Créer `pictures/nom-evenement/photos.json`
- [ ] Mettre `"status": "past"` dans `events.json`
- [ ] Mettre `"hasPhotos": true` dans `events.json`
- [ ] Pousser sur GitHub
