# TogetherToTarget (TTT) - Motivational Group App

## 📁 Struttura Progetto

```
TogheterToTarget/
├── README.md                           # Documentazione principale
├── PROGETTO_TTT_RIASSUNTO_COMPLETO.md  # Documentazione dettagliata
├── .gitignore                          # Git ignore globale
├── docs/                               # Documentazione aggiuntiva
├── webapp/                             # React webapp (MVP)
│   ├── src/
│   ├── package.json
│   └── ...
├── mobile/                             # Future: React Native app
└── backend/                            # Future: API custom (se necessario)
```

## 🚀 Quick Start

### Web App (React)

```bash
cd webapp
npm install
npm run dev
```

### Supabase Configuration

1. Crea progetto su supabase.com
2. Configura `.env.local` in `webapp/`
3. Esegui SQL schema dal file `webapp/supabase-schema.sql`

## 🎯 Concept

**TogetherToTarget** è un'app motivazionale che abbina automaticamente persone con obiettivi simili in mini gruppi di 3 persone per cicli di supporto di 30 giorni.

### Features MVP

- ✅ Matching automatico per categoria
- ✅ Chat di gruppo
- ✅ Video meeting settimanali
- ✅ Sistema badge motivazionali
- ✅ Cicli fissi di 30 giorni

### Tech Stack

- **Frontend**: React 18 + TypeScript + Chakra UI v3
- **Backend**: Supabase (Database + Auth + Realtime)
- **Deployment**: Vercel (frontend)

## 📱 Roadmap

1. **MVP Webapp** (attuale)
2. **React Native Mobile**
3. **Espansione categorie** (da 6 a 11)
4. **Features premium**

---

**Sviluppato con ❤️ per supportare la crescita personale condivisa**
