# TogetherToTarget - Mobile App (React Native + Expo)

## 🎯 Sprint RN Express - Setup Completato!

### Struttura Progetto

```
mobile/
├── src/
│   ├── components/          # Componenti riutilizzabili
│   ├── contexts/           # React Contexts (AuthContext)
│   ├── screens/            # Schermate dell'app
│   │   ├── LoginScreen.tsx
│   │   ├── SignUpScreen.tsx
│   │   └── DashboardScreen.tsx
│   ├── services/           # Servizi (Supabase, Auth)
│   │   ├── supabase.ts
│   │   └── auth.ts
│   ├── types/              # Definizioni TypeScript
│   │   └── auth.ts
│   └── Navigation.tsx      # Sistema di navigazione
├── App.tsx                 # Entry point principale
└── package.json
```

### ✅ Features Implementate

- **Autenticazione Supabase** (stesse credenziali del web)
  - Login con email/password ✅
  - Registrazione utenti ✅
  - Gestione sessioni con AsyncStorage ✅
  - Logout ✅
  - Google OAuth 🔄 (in corso)
  - Password reset 🔄 (in corso)
- **Navigation Stack**
  - Stack di autenticazione (Login/SignUp/ForgotPassword)
  - Stack app protetto (Dashboard)
  - Switch automatico basato su stato auth
- **TypeScript** completo
- **Design System** allineato con webapp

### 🚀 Come Testare

#### 1. Su Browser (Web)

```bash
cd mobile
npx expo start --web
```

#### 2. Su Device Mobile

```bash
cd mobile
npm start
# Scansiona QR code con:
# - Expo Go (Android)
# - Camera app (iOS)
```

#### 3. Su Emulatore

```bash
# Android
npm run android

# iOS (solo su macOS)
npm run ios
```

### 🔧 Setup Ambiente

1. **Node.js** v22.14.0 ✅
2. **Expo CLI** installato ✅
3. **Dependencies**:
   - @supabase/supabase-js
   - @react-navigation/native
   - @react-navigation/stack
   - react-native-screens
   - react-native-safe-area-context
   - @react-native-async-storage/async-storage

### 🗄️ Database

- **Supabase** (stesso progetto del web)
- URL: `https://rqooyyyrmqyvpzvkwqrn.supabase.co`
- Tabelle condivise con webapp

### 🔍 Testing Auth Flow

1. **Registrazione**: Crea nuovo account → conferma email
2. **Login**: Accesso con credenziali esistenti
3. **Dashboard**: Area protetta post-login
4. **Logout**: Ritorno alla schermata login

### ⏱️ Sprint Status (Tempo: ~3 ore)

- [x] Setup React Native + Expo (30 min)
- [x] Implementazione Auth base Supabase (90 min)
- [x] Navigation base (30 min)
- [x] UI/UX enhancement (30 min)
- [x] Google OAuth integration (30 min)
- [x] Password reset flow (30 min)

### 🔄 Prossimi Step

1. **Push Notifications**: Sistema notifiche
2. **Onboarding Flow**: Wizard setup iniziale
3. **Profile Management**: Gestione profilo utente
4. **Groups Feature**: Core feature app
5. **Offline Support**: Caching e sync
6. **Performance**: Ottimizzazioni

### 📱 Deploy & Distribution

- **Development**: Expo Go app
- **Production**:
  - Expo Application Services (EAS)
  - App Store / Google Play Store
  - Web: hosting statico

---

## 🎉 Risultato Sprint

**Setup base React Native funzionante con autenticazione Supabase!**

Pronto per proseguire con features avanzate o tornare al web development.
