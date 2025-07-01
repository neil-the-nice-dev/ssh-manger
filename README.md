# Guide de démarrage – SSH Manager

## Prérequis

- **Node.js** (version 18 ou supérieure recommandée)
- **npm** (généralement installé avec Node.js)

## Installation

1. Ouvre un terminal et place-toi dans le dossier du projet :
   ```bash
   cd project\ 2
   ```
2. Installe les dépendances :
   ```bash
   npm install
   ```

## Lancement de l’application

Toujours dans le dossier `project 2`, lance l’application en mode développement :
```bash
npm run dev
```

Après quelques secondes, tu verras une adresse locale s’afficher, par exemple :
```
➜  Local:   http://localhost:5173/
```

Ouvre cette adresse dans ton navigateur pour accéder à l’application.

## Conseils supplémentaires

- Si tu vois un message concernant `Browserslist: caniuse-lite is outdated`, tu peux mettre à jour la base de données avec :
  ```bash
  npx update-browserslist-db@latest
  ```
- Pour corriger d’éventuelles vulnérabilités dans les dépendances :
  ```bash
  npm audit fix
  ```

---

N’hésite pas à adapter ce guide selon tes besoins ou à demander de l’aide si tu rencontres un problème !
