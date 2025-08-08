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
│   │   ├── components/                 # Componenti riutilizzabili
│   │   │   ├── auth/                  # Autenticazione (Login, Signup)
│   │   │   ├── common/                # Componenti comuni
│   │   │   └── ui/                    # UI components
│   │   ├── contexts/                  # React Contexts (AuthContext)
│   │   ├── hooks/                     # Custom hooks
│   │   ├── pages/                     # Pagine principali
│   │   ├── services/                  # Servizi (Supabase, Auth)
│   │   ├── styles/                    # CSS e styling
│   │   └── types/                     # TypeScript types
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
2. Configura `.env.local` in `webapp/`:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
3. Configura database schema e RLS policies
4. Abilita Google OAuth in Supabase Auth

## 🎯 Concept

**TogetherToTarget** è un'app motivazionale che abbina automaticamente persone con obiettivi simili in mini gruppi di 3 persone per cicli di supporto di 30 giorni.

### ✅ Features Implementate (MVP)

#### Autenticazione Completa
- ✅ Registrazione con email/password + conferma email
- ✅ Login con Google OAuth
- ✅ Gestione sessioni e stati di autenticazione
- ✅ Sistema di conferma email funzionante
- ✅ UI responsive e user-friendly

#### Sistema di Routing
- ✅ Protezione delle route con autenticazione
- ✅ Redirect automatici basati su stato utente
- ✅ Gestione onboarding per nuovi utenti

#### UI/UX
- ✅ Design moderno e responsive
- ✅ Componenti riutilizzabili
- ✅ Feedback visivi (loading, errori, successi)
- ✅ Messaggi di stato persistenti

### 🔄 Features In Development

- ⏳ Sistema onboarding completo
- ⏳ Matching automatico per categoria
- ⏳ Chat di gruppo
- ⏳ Video meeting settimanali
- ⏳ Sistema badge motivazionali
- ⏳ Cicli fissi di 30 giorni

### Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: CSS custom con design system
- **Backend**: Supabase (Database + Auth + Realtime)
- **Authentication**: Supabase Auth + Google OAuth
- **Deployment**: Vercel (frontend)

## 📱 Roadmap

1. **✅ Sistema di Autenticazione** (completato)
2. **🔄 Sistema Onboarding** (in sviluppo)
3. **📋 Matching e Gruppi** (pianificato)
4. **💬 Chat e Comunicazione** (pianificato)
5. **📱 React Native Mobile** (futuro)

## 🛠️ Stato Tecnico Attuale

### Completato
- ✅ Setup progetto React + TypeScript + Vite
- ✅ Integrazione Supabase completa
- ✅ Sistema di autenticazione robusto
- ✅ Gestione stati e contesti React
- ✅ Componenti UI base
- ✅ Sistema di routing protetto

### Prossimi Passi
- 🔧 Password dimenticata (reset password)
- 🔧 Completamento onboarding
- 🔧 Database schema per gruppi e matching
- 🔧 Sistema di categorie e obiettivi

---

**Sviluppato con ❤️ per supportare la crescita personale condivisa**
