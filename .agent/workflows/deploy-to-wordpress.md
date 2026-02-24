---
description: Publicarea jocului MathCameleon pe WordPress via GitHub Pages
---

Acest workflow descrie pașii pentru a automatiza publicarea jocului direct din GitHub pe site-ul tău WordPress.

### Pasul 1: Pregătirea Repozitoriului (Atenție la Base Path)
Asigură-te că în `vite.config.ts` ai setat calea relativă:
```typescript
export default defineConfig({
  base: './', // CRUCIAL pentru WordPress și GitHub Pages
  // ... restul configurării
})
```

### Pasul 2: Configurarea GitHub Actions
Vom folosi un fișier de automatizare care face build și publică pe GitHub Pages la fiecare "Push".

1. Creează folderul `.github/workflows/` în rădăcina proiectului.
2. Creează fișierul `deploy.yml` cu următorul conținut:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

permissions:
  contents: write

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Set up Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install and Build
        run: |
          npm install
          npm run build

      - name: Deploy
        uses: JamesIves/github-pages-deploy-action@v4
        with:
          folder: dist
          branch: gh-pages
```

### Pasul 3: Activarea GitHub Pages
1. Mergi pe GitHub la **Settings > Pages**.
2. La "Build and deployment", alege sursa: **Deploy from a branch**.
3. Selectează branch-ul `gh-pages` (care va apărea după primul deployment automat).

### Pasul 4: Integrarea în WordPress
După ce ai link-ul de la GitHub Pages (ex: `https://utilizator.github.io/proiect/`), adaugă-l în WordPress:

1. Editează pagina unde vrei jocul.
2. Adaugă un bloc **Custom HTML**.
3. Introdu codul (Iframe-ul permite actualizarea automată a jocului pe site când schimbi codul pe GitHub):

```html
<div style="width: 100%; height: 80vh; min-height: 500px; overflow: hidden;">
  <iframe 
    src="LINK_PAGINA_GITHUB_PAGES" 
    style="width: 100%; height: 100%; border: none;" 
    allowfullscreen>
  </iframe>
</div>
```

### De ce acest workflow?
- **GitHub** găzduiește codul.
- **GitHub Actions** face "munca grea" (build).
- **GitHub Pages** serverește jocul gata compilat.
- **WordPress** doar îl afișează. Orice modificare faci pe GitHub, se va vedea instant și pe site-ul tău!
