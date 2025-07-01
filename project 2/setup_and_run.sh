#!/bin/bash

set -e

# Affiche les commandes exécutées
set -x

# Aller dans le dossier du script
cd "$(dirname "$0")"

# 1. Installer les dépendances
if ! npm install; then
  echo "\n[ERREUR] L'installation des dépendances a échoué."
  exit 1
fi

# 2. Builder l'application React
if ! npm run build; then
  echo "\n[ERREUR] Le build de l'application a échoué."
  exit 2
fi

# 3. Lancer Electron
if ! npm run electron; then
  echo "\n[ERREUR] Le lancement d'Electron a échoué."
  exit 3
fi

# Renommer les fichiers
mv main.js main.cjs
mv preload.js preload.cjs

# Renommer les fichiers
mv "project 2/main.js" "project 2/main.cjs"
mv "project 2/preload.js" "project 2/preload.cjs" 