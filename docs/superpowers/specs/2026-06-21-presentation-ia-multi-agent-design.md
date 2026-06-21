# Design — Présentation « De ChatGPT au Multi-Agent »

**Date :** 2026-06-21
**Public :** élèves de seconde (~15 ans), aucun prérequis technique.
**Livrable :** un fichier PowerPoint `presentation_IA.pptx` (16:9), éducatif, très visuel.

## Objectif

Expliquer simplement comment on passe d'une IA seule (ChatGPT) à une équipe
d'IA qui collaborent (multi-agent). Chaque slide porte **une seule idée** et
s'appuie sur **un schéma central** : le dessin suffit à comprendre, le texte ne
fait que confirmer.

## Contraintes de forme (non négociables)

- **Format PowerPoint .pptx**, 16:9, généré par un script Python autonome
  (`scripts/build_presentation_ia.py`) avec `python-pptx`.
- **Tous les schémas sont des formes natives** (rectangles arrondis, flèches,
  connecteurs, cercles, bandeaux) — vectoriels, nets, éditables. Aucune image
  importée, aucun clip-art.
- **Aucun emoji**, nulle part.
- **Ne doit pas avoir l'air généré par IA.** Règles appliquées :
  - palette restreinte et cohérente (5 couleurs max + neutres) ;
  - code couleur **stable** par rôle d'agent réutilisé sur tout le deck ;
  - grille et marges intentionnelles, alignements francs, asymétrie maîtrisée
    (pas tout centré) ;
  - pas de dégradés « néon », pas d'ombres molles génériques ;
  - typographie hiérarchisée (gros titre, sous-titre, légende) ;
  - vocabulaire d'ado, phrases courtes, analogies concrètes du quotidien.

## Direction visuelle

- Fond : crème / blanc cassé (`#F7F5EF`).
- Encre (titres, texte) : anthracite (`#1E1E24`).
- Accent neutre structurant : bleu ardoise (`#2F4A6B`).
- **Code couleur des rôles d'agent** (réutilisé partout) :
  - Planificateur → bleu (`#2F6BB0`)
  - Développeur / Codeur → violet (`#6B4FA0`)
  - Testeur / Vérificateur → vert (`#2E8B57`)
  - Correcteur / Relecteur → orange (`#D08326`)
- Police : famille sans-serif lisible (Segoe UI / Arial en repli).
- Une barre d'accent fine + numéro de slide discret en pied pour l'unité.

## Outil de vérification

Après génération, export PNG via `scripts/render_pptx.py` (PowerPoint COM +
PyMuPDF) puis **revue visuelle réelle de chaque slide** avant livraison :
débordements de texte, alignements, lisibilité à distance, cohérence couleur.

## Plan des slides (14)

### 1. Titre
- Titre : « De ChatGPT au Multi-Agent »
- Sous-titre : « Comment l'IA passe d'un seul cerveau à une équipe »
- Bandeau d'accent, mise en page asymétrique (titre calé à gauche).

### 2. Accroche
- Grande question : « Qui a déjà utilisé ChatGPT, Claude ou Gemini ? »
- Idée : partir de ce que les élèves connaissent déjà.
- Visuel : bulle de message stylisée (formes).

### 3. Comment marche ChatGPT
- Idée clé : « l'IA devine le mot suivant, encore et encore ».
- Analogie : le clavier du téléphone qui propose le mot d'après.
- Schéma : `Tu écris → [mot 1] → [mot 2] → … → Réponse` (chaîne de cartes + flèches).
- Phrase à retenir : « 1 question → 1 IA → 1 réponse ».

### 4. L'appli n'est pas le cerveau
- Distinction interface vs modèle.
- Schéma à deux blocs : « ChatGPT = l'application (le messager) » ↔
  « GPT = le cerveau entraîné (celui qui réfléchit) ».
- Analogie : le téléphone (l'appli) vs la personne qui répond (le cerveau).

### 5. Plusieurs cerveaux existent
- 4 cartes : OpenAI → GPT ; Anthropic → Claude ; Google → Gemini ; Meta → Llama.
- Une ligne « point fort » simple par carte (rapide / textes longs / images /
  gratuit-ouvert).
- Message : différents cerveaux = différentes forces.

### 6. Et si on en mettait plusieurs ? (transition)
- Avant : un seul cerveau répond à une question (petit schéma 1→1).
- Après : « imagine plusieurs cerveaux qui travaillent ensemble » (schéma
  plusieurs→1).
- Slide charnière, peu de texte.

### 7. L'analogie de l'exposé en groupe
- Tableau / colonnes : rôle de classe ↔ rôle d'agent.
  - Chef de projet ↔ agent coordinateur
  - Celui qui rédige ↔ agent qui produit
  - Celui qui relit ↔ agent vérificateur
  - Celui qui corrige ↔ agent correcteur
- Message : chacun est spécialisé, ensemble on fait mieux.

### 8. C'est quoi un « agent »
- Équation visuelle : `Cerveau (modèle) + Rôle + Outils = Agent`.
- Trois petites cartes additionnées par des « + », résultat encadré.

### 9. En coulisses : « Fais-moi un jeu »
- Exemple concret (type OpenCode / « fais-moi un Tetris »).
- Schéma vertical de 4 agents qui se passent le travail, chacun à sa couleur :
  1. Planificateur — « je découpe le travail en étapes »
  2. Développeur — « j'écris le code du jeu »
  3. Testeur — « je vérifie que ça marche »
  4. Correcteur — « je répare les erreurs »
- Message : plusieurs agents collaborent, comme une équipe.

### 10. Le chef d'orchestre (framework)
- Idée : un « framework » organise qui fait quoi et dans quel ordre.
- 3 mini-schémas côte à côte :
  - **Séquentiel** : A → B → C
  - **Parallèle** : A, B, C → synthèse
  - **Hiérarchique** : un superviseur au-dessus de 3 agents

### 11. Exemple concret : la revue de code
- Du code arrive, il passe des contrôles successifs, chacun coloré :
  - Agent Sécurité → « aucune faille »
  - Agent Style → « bien rangé »
  - Agent Tests → « tout passe »
  - → Code validé
- Schéma : chaîne verticale avec coches dessinées (formes, pas emoji).

### 12. Seul vs en équipe
- Tableau comparatif 2 colonnes, lignes simples :
  - Architecture : 1 cerveau / plusieurs cerveaux
  - Façon de faire : réponse directe / collaboration
  - Tâches : simples / compliquées
  - Coût : 1 appel / plusieurs appels
- Message : plus puissant mais plus coûteux.

### 13. La pyramide (récap)
- Pyramide à 3 étages :
  - bas : **Modèle** (le cerveau)
  - milieu : **Agent** (cerveau + rôle + outils)
  - haut : **Équipe d'agents** (le système multi-agent)
- Phrase : « Cerveau → Rôle → Équipe ».

### 14. Conclusion + question ouverte
- Message final : « L'IA, ce n'est pas juste un cerveau… c'est **comment on
  l'organise**. »
- Question à la classe : « Plus d'agents = toujours mieux ? »
- 3 réponses courtes : non (ça coûte du temps et de l'argent) ; non (trop
  d'agents = confusion) ; ce qui compte = la bonne organisation.

## Architecture du code

Un seul script `scripts/build_presentation_ia.py`, organisé en :

- **Constantes** : couleurs, police, géométrie (marges, grille), tailles.
- **Helpers génériques** (autonomes, sans dépendance au `nafas_engine`) :
  - `blank_slide(prs)` — ajoute une slide vide.
  - `textbox(...)`, `add_para(...)` — texte + paragraphes typés.
  - `rrect(...)` / `rect(...)` — rectangles (arrondis) colorés + texte.
  - `arrow(...)` / `connector(...)` — flèches entre formes.
  - `oval(...)`, `chevron(...)`, `check_mark(...)` — pictos dessinés en formes.
  - `footer(slide, n)` — barre d'accent + numéro.
  - `title_block(slide, kicker, title)` — en-tête de slide cohérent.
- **Une fonction par slide** : `slide_01_titre(prs)` … `slide_14_conclusion(prs)`.
- `main()` construit dans l'ordre et sauvegarde `presentation_IA.pptx`.

Chaque schéma est dessiné avec des coordonnées en pouces sur une grille définie,
pour des alignements nets et reproductibles.

## Vérification (definition of done)

1. Le script s'exécute sans erreur et produit `presentation_IA.pptx` (14 slides).
2. Export PNG de toutes les slides via `render_pptx.py`.
3. Revue visuelle de chaque PNG : pas de texte coupé/débordé, alignements
   corrects, contraste suffisant, code couleur cohérent, zéro emoji.
4. Correction des éventuels débordements, puis re-rendu jusqu'à propreté.
