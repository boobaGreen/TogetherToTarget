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
├── mobile/                             # React Native + Expo app (TypeScript)
│   ├── src/
│   │   ├── components/                 # Componenti riutilizzabili
│   │   ├── contexts/                   # AuthContext per gestione stato
│   │   ├── screens/                    # Schermate (Login, SignUp, Dashboard)
│   │   ├── services/                   # Supabase integration
│   │   ├── types/                      # TypeScript types
│   │   └── Navigation.tsx              # Stack Navigator
│   ├── package.json
│   └── README.md
└── backend/                            # Future: API custom (se necessario)
```

## 🚀 Quick Start

### Web App (React)

```bash
cd webapp
npm install
npm run dev
```

### Mobile App (React Native + Expo)

```bash
cd mobile
npm install
npm start       # Per development con QR code
npm run web     # Per test su browser
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

### ✅ Features Implementate

#### Web App (React)
- ✅ Registrazione con email/password + conferma email
- ✅ Login con Google OAuth
- ✅ Reset password con email di verifica
- ✅ Gestione sessioni e stati di autenticazione
- ✅ Sistema di routing protetto
- ✅ UI responsive e user-friendly

#### Mobile App (React Native + Expo)
- ✅ Setup React Native con TypeScript
- ✅ Autenticazione Supabase (email/password)
- ✅ Navigation stack (Auth/App)
- ✅ Gestione sessioni con AsyncStorage
- ✅ UI nativa iOS/Android style
- 🔄 Google OAuth integration (in corso)
- 🔄 Password reset (in corso)

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

- **Frontend Web**: React 18 + TypeScript + Vite
- **Frontend Mobile**: React Native + Expo + TypeScript
- **Styling**: CSS custom (web) + React Native StyleSheet (mobile)
- **Backend**: Supabase (Database + Auth + Realtime)
- **Authentication**: Supabase Auth + Google OAuth
- **Navigation**: React Router (web) + React Navigation (mobile)
- **Storage**: AsyncStorage (mobile) + localStorage (web)
- **Deployment**: Vercel (web) + EAS/App Stores (mobile)

## 📱 Roadmap

1. **✅ Sistema di Autenticazione Web** (completato)
2. **🔄 Sistema di Autenticazione Mobile** (in completamento)
3. **📋 Sistema Onboarding** (pianificato)
4. **� Matching e Gruppi** (pianificato)
5. **💬 Chat e Comunicazione** (pianificato)
6. **� Deploy Production** (futuro)

## 🛠️ Stato Tecnico Attuale

### Completato

- ✅ Setup progetto React + TypeScript + Vite (web)
- ✅ Setup React Native + Expo + TypeScript (mobile)
- ✅ Integrazione Supabase completa (web + mobile)
- ✅ Sistema di autenticazione robusto (web)
- ✅ Autenticazione base mobile (email/password)
- ✅ Gestione stati e contesti React
- ✅ Sistema di routing protetto (web + mobile)
- ✅ Componenti UI base (web + mobile)

### In Corso

- 🔄 Google OAuth su mobile
- � Password reset su mobile
- 🔄 UI/UX alignment web-mobile
- 🔄 Design system unificato

### Prossimi Passi

- 🔧 Completamento onboarding
- 🔧 Database schema per gruppi e matching
- 🔧 Sistema di categorie e obiettivi
- 🔧 Deploy e testing

---

**Sviluppato con ❤️ per supportare la crescita personale condivisa**
