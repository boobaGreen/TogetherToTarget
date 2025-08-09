# 🎯 Sistema Matching Progressivo - TogetherToTarget

## 📋 Panoramica

Il sistema di matching progressivo di TogetherToTarget permette di formare gruppi di 2-3 persone con obiettivi compatibili utilizzando un algoritmo a 4 livelli di flessibilità crescente.

## 🏗️ Architettura del Sistema

### 📦 Componenti Principali

1. **`MatchingPreferences`** - Componente React per configurazione preferenze utente
2. **`MatchingService`** - Servizio API per gestione preferenze e pool matching
3. **Database Schema** - 4 tabelle per preferenze, pool, analytics ed email
4. **Edge Functions** - Algoritmo matching (da implementare)

### 🗄️ Database Schema

#### `user_matching_preferences`

```sql
- id: uuid (PK)
- user_id: uuid (FK auth.users)
- preferred_group_size: 2|3|0 (0 = qualsiasi)
- flexible_on_size: boolean
- videocall_languages: text[] (es. ['it', 'en'])
- flexible_on_language: boolean
- timezone: string (es. 'Europe/Rome')
- timezone_flexibility: boolean
```

#### `matching_pool`

```sql
- id: uuid (PK)
- user_id: uuid (FK auth.users)
- objective: text
- category: string
- subcategory: string (opzionale)
- timezone: string
- priority: 0=normale, 1=alta (dopo 72h)
- entered_at: timestamptz
```

#### `match_analytics`

```sql
- category/subcategory: string
- wait_time_hours: integer
- group_size: integer
- timezone_spread: integer
- language_compatibility: 'perfect'|'partial'|'translated'
```

#### `email_queue`

```sql
- user_id: uuid
- email_type: 'weekly_recall'|'match_found'|'level_escalation'
- email_data: jsonb
- scheduled_for: timestamptz
```

## 🔄 Algoritmo Matching Progressivo

### Livello 1 (0-24h): Criteri Rigorosi

- **Categoria**: Identica
- **Sottocategoria**: Identica (se specificata)
- **Dimensione gruppo**: Rispetta preferenza esatta
- **Lingue**: Solo lingue preferite dall'utente
- **Timezone**: ±1 ora se timezone_flexibility=true, identico se false

### Livello 2 (24-48h): Criteri Flessibili

- **Categoria**: Identica
- **Sottocategoria**: Compatibile o una vuota
- **Dimensione gruppo**: ±1 se flexible_on_size=true
- **Lingue**: Include inglese se flexible_on_language=true
- **Timezone**: ±2 ore se timezone_flexibility=true

### Livello 3 (48-72h): Criteri Estesi

- **Categoria**: Correlate (es. fitness ↔ benessere)
- **Sottocategoria**: Ignorata
- **Dimensione gruppo**: Qualsiasi se flexible_on_size=true
- **Lingue**: Tutte le lingue supportate se flexible_on_language=true
- **Timezone**: ±4 ore se timezone_flexibility=true

### Livello 4 (72h+): Scelta Utente

Dopo 72h l'utente riceve email con 2 opzioni:

1. **Match Forzato**: Accetta il miglior match disponibile
2. **Attesa Estesa**: Continua ad aspettare con criteri Livello 1

## 🚀 Setup e Installazione

### 1. Database Setup

```bash
# Esegui in Supabase SQL Editor:
cd webapp/sql
# Copia contenuto di create_matching_preferences.sql
```

### 2. Test del Componente

```bash
# Avvia il server di sviluppo
npm run dev

# Naviga alla pagina di test
http://localhost:5173/test-matching
```

### 3. Integrazione nel Profilo

Il componente `MatchingPreferences` può essere integrato in:

- Pagina profilo utente
- Pagina onboarding
- Sezione impostazioni

## 🧪 Testing

### Pagina di Test Temporanea

- **URL**: `/test-matching`
- **Componente**: `TestMatchingPage`
- **Scopo**: Verificare funzionalità preferenze prima dell'integrazione

### Test delle Preferenze

1. ✅ Salvataggio preferenze utente
2. ✅ Caricamento preferenze esistenti
3. ✅ Validazione input
4. ✅ Real-time updates
5. 🔄 Integrazione con matching pool (da implementare)

## 📱 UI/UX Features

### Design System

- **Gradient**: `#667eea` → `#764ba2`
- **Stile**: Card moderne con bordi arrotondati
- **Animazioni**: Hover effects e transizioni fluide
- **Responsive**: Grid layout adattivo

### Componenti UI

- **Opzioni Dimensione Gruppo**: Card selezionabili con icone 👥
- **Selezione Lingue**: Grid con bandiere e nomi
- **Flessibilità**: Checkbox con testo esplicativo
- **Timezone**: Display automatico con rilevamento browser

### Stati Interattivi

- **Loading**: Spinner con messaggio
- **Saving**: Indicatore di salvataggio
- **Error**: Gestione errori con retry
- **Success**: Conferma visuale

## 🔮 Roadmap

### Fase 1: Preferenze Utente ✅

- [x] Database schema
- [x] Componente UI
- [x] Servizio API
- [x] Pagina di test

### Fase 2: Pool Management 🔄

- [ ] Inserimento in pool automatico
- [ ] Edge Functions per algoritmo
- [ ] Sistema notifiche real-time
- [ ] Analytics tempi di attesa

### Fase 3: Matching Avanzato 📋

- [ ] Algoritmo ML per match quality
- [ ] Predictor tempi di attesa
- [ ] Sistema feedback utenti
- [ ] Ottimizzazione continua

### Fase 4: Notifiche e Email 📧

- [ ] Template email responsive
- [ ] Sistema coda email
- [ ] Notifiche push (opzionali)
- [ ] Reminder settimanali

## 🔧 API Reference

### MatchingService

```typescript
// Carica preferenze utente
await MatchingService.getPreferences();

// Salva preferenze
await MatchingService.savePreferences(preferences);

// Entra nel pool di matching
await MatchingService.enterMatchingPool(objective, category);

// Subscribe a notifiche real-time
MatchingService.subscribeToMatches(callback);
```

### Costanti

```typescript
MATCHING_LEVELS = {
  LEVEL_1: 24, // 0-24h
  LEVEL_2: 48, // 24-48h
  LEVEL_3: 72, // 48-72h
  LEVEL_4: null, // 72h+
};

SUPPORTED_LANGUAGES = [
  { code: "it", name: "Italiano", flag: "🇮🇹" },
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
];
```

## 📊 Analytics e Monitoraggio

### Metriche Chiave

- **Tempo medio di match** per categoria
- **Distribuzione per livello** di matching
- **Soddisfazione utenti** post-match
- **Tasso di abbandono** per fase

### Dashboard Admin (Future)

- Andamento tempi di attesa
- Categorie più richieste
- Ottimizzazione algoritmo
- Performance database

---

**Sviluppato per TogetherToTarget** 🎯
_Sistema di matching progressivo per obiettivi condivisi_
