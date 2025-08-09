# 🎯 SISTEMA MATCHING TOGETHEROTARGET - DOCUMENTAZIONE COMPLETA

*Documentazione aggiornata: 9 Agosto 2025*

## 📋 OVERVIEW SISTEMA

TogetherToTarget utilizza un **sistema di matching progressivo a 4 livelli** per formare gruppi di 2-3 persone con obiettivi compatibili. Il sistema diventa progressivamente più flessibile nei criteri di matching per garantire che tutti gli utenti trovino compagni.

---

## 👤 PREFERENZE PROFILO UTENTE

### **Dimensione Gruppo**
```typescript
interface GroupSizePreferences {
  preferred_group_size: '2' | '3' | 'any',  // Preferenza principale
  flexible_on_size: boolean,                // Accetta altre dimensioni se necessario
}
```

**Esempi:**
- `preferred_group_size: '2', flexible_on_size: false` → Solo duetti
- `preferred_group_size: '3', flexible_on_size: true` → Preferisce trio ma accetta duetto
- `preferred_group_size: 'any'` → Primo match disponibile

### **Lingue per Videocall**
```typescript
interface LanguagePreferences {
  videocall_languages: string[],           // ['it', 'en'] - lingue che parla bene
  flexible_on_language: boolean,           // Accetta gruppi multilingua se necessario
}
```

**Note:** Le lingue specificate sono quelle in cui l'utente è disposto a fare videocall. Chat può essere tradotta automaticamente.

### **Timezone**
```typescript
interface TimezonePreferences {
  timezone: string,                        // 'UTC+1' - rilevato automaticamente
  timezone_flexibility: boolean,           // Accetta fusi orari diversi per match migliori
}
```

### **Videocall Frequency**
**IMPORTANTE:** Le preferenze videocall sono gestite a **livello gruppo**, NON nel profilo utente. Ogni gruppo decide collettivamente la frequenza delle videocall.

---

## ⏰ ALGORITMO MATCHING PROGRESSIVO

### **LIVELLO 1: PERFECT MATCH (0-24h)**
```typescript
const PERFECT_CRITERIA = {
  timeRange: '0-24h',
  required: [
    'category',                    // Es: Fitness = Fitness
    'subcategory',                // Es: Perdita peso = Perdita peso  
    'videocall_languages',        // Almeno 1 lingua in comune
    'timezone_tolerance: ±2h'     // UTC+1 matcha UTC-1 fino a UTC+3
  ],
  group_size: 'respect_preferences'  // Rispetta preferred_group_size
}
```

### **LIVELLO 2: GOOD MATCH (24h-48h)** 
```typescript
const GOOD_CRITERIA = {
  timeRange: '24h-48h',
  required: [
    'category',                    // Mantiene categoria
    'videocall_languages',        // Almeno 1 lingua in comune
    'timezone_tolerance: ±4h'     // UTC+1 matcha UTC-3 fino a UTC+5
  ],
  removed: ['subcategory'],       // Ignora sottocategoria
  group_size: 'include_flexible'  // Include utenti con flexible_on_size=true
}
```

### **LIVELLO 3: ACCEPTABLE MATCH (48h-72h)**
```typescript
const ACCEPTABLE_CRITERIA = {
  timeRange: '48h-72h', 
  required: [
    'category',                    // Solo categoria uguale
    'timezone_tolerance: ±8h'     // UTC+1 matcha UTC-7 fino a UTC+9
  ],
  removed: ['subcategory', 'exact_languages'],
  flexible: [
    'videocall_languages'         // Include utenti con flexible_on_language=true
  ],
  group_size: 'any_compatible'    // Qualsiasi dimensione compatibile
}
```

### **LIVELLO 4: USER CHOICE (72h+)**
```typescript
const FALLBACK_SCENARIO = {
  timeRange: '72h+',
  trigger: 'USER_NOTIFICATION',
  message: "🤔 Dopo 3 giorni non abbiamo trovato compagni compatibili. Cosa vuoi fare?",
  options: [
    {
      label: "Continua ad aspettare",
      action: "continue_waiting",
      description: "Ti mettiamo in priorità assoluta"
    },
    {
      label: "Cambia obiettivo", 
      action: "change_objective",
      description: "Prova con un obiettivo più popolare"
    }
  ]
}
```

---

## 📧 SISTEMA NOTIFICHE

### **Notifiche Automatiche Durante Matching**
```typescript
const MATCHING_NOTIFICATIONS = {
  // Match trovato (real-time)
  MATCH_FOUND: {
    trigger: 'group_formation',
    title: '🎉 Gruppo Formato!',
    message: 'Hai trovato [N] compagni per il tuo obiettivo!',
    action: 'redirect_to_group',
    real_time: true
  },
  
  // Livello escalation (24h, 48h)
  LEVEL_ESCALATION: {
    trigger: 'criteria_expanded', 
    title: '🔍 Allargando la ricerca',
    message: 'Stiamo cercando compagni con criteri più flessibili',
    real_time: false
  }
}
```

### **Email Settimanali Post-72h**
```typescript
const WEEKLY_RECALL_EMAIL = {
  trigger: 'ogni 7 giorni dopo scelta continue_waiting',
  subject: '🎯 Aggiornamento ricerca compagni - TogetherToTarget',
  template: {
    message: 'Ciao [NOME], stiamo ancora cercando compagni per il tuo obiettivo "[OBIETTIVO]".',
    stats: 'Questa settimana [N] nuovi utenti si sono uniti alla tua categoria.',
    options: [
      {
        button: 'Continua ad aspettare',
        action: 'extend_waiting',
        description: 'Rimani in priorità alta'
      },
      {
        button: 'Cambia obiettivo',
        action: 'redirect_change_objective', 
        description: 'Prova obiettivo più popolare'
      },
      {
        button: 'Annulla attesa',
        action: 'remove_from_pool',
        description: 'Interrompi la ricerca'
      }
    ]
  }
}
```

---

## 🎮 MECCANICHE POST-72h

### **OPZIONE 1: Continue Waiting**
```typescript
const continueWaiting = {
  user_status: 'HIGH_PRIORITY',
  matching_criteria: {
    category: 'required',
    subcategory: 'ignore',
    languages: 'any_if_flexible',
    timezone: '±12h',
    group_size: 'any_compatible'
  },
  notifications: {
    weekly_email: true,
    immediate_match: true
  },
  guarantees: 'priorità assoluta nel prossimo match disponibile'
}
```

### **OPZIONE 2: Change Objective**
```typescript
const changeObjective = {
  ui_display: {
    popular_objectives: 'live_analytics',    // Obiettivi con più persone in coda
    wait_time_estimates: 'calculated',       // "~2 giorni" basato su dati storici
    queue_sizes: 'real_time',               // "8 persone in coda ora"
    success_rates: 'percentage'             // "94% trovano match"
  },
  data_source: {
    historical_matches: '30_days',          // Analisi ultimi 30 giorni
    current_queue: 'live_count',            // Conteggio live delle code
    confidence_level: 'sample_size_based'   // HIGH se >10 match, LOW se <10
  },
  action: 'replace_current_objective'       // Sostituisce completamente l'obiettivo attuale
}
```

---

## 📊 SISTEMA ANALYTICS E STIME

### **Calcolo Tempi di Attesa**
```typescript
const calculateWaitTimes = async (category, subcategory) => {
  const query = `
    SELECT AVG(wait_time_hours) as avg_wait
    FROM completed_matches 
    WHERE category = $1 
    AND subcategory = $2 
    AND created_at >= NOW() - INTERVAL '30 days'
    LIMIT 100
  `
  
  return {
    estimated_wait_hours: result.avg_wait || 48,  // Default 48h se no dati
    confidence: result.count > 10 ? 'HIGH' : 'LOW',
    sample_size: result.count,
    display: formatHumanReadable(result.avg_wait)  // "~2 giorni"
  }
}
```

### **Display nelle Carte Categorie**
```typescript
const CategoryCardData = {
  category_name: 'Fitness',
  overall_stats: {
    avg_wait_time: '~1.5 giorni',
    current_queue_size: 12,
    success_rate: '94%',
    trending: 'up' | 'down' | 'stable'
  },
  subcategories: [
    {
      name: 'Perdita peso',
      wait_time: '~8 ore',
      queue_size: 5,
      priority: 'high' // Mostra con icona 🚀
    },
    {
      name: 'Palestra', 
      wait_time: '~3 giorni',
      queue_size: 2,
      priority: 'low'  // Mostra con icona ⏳
    }
  ]
}
```

---

## 🔧 DATABASE SCHEMA RICHIESTO

### **Tabelle Principali**
```sql
-- Pool di utenti in attesa di match
CREATE TABLE matching_pool (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  objective TEXT NOT NULL,
  category TEXT NOT NULL,
  subcategory TEXT,
  timezone TEXT NOT NULL,
  priority INTEGER DEFAULT 0,  -- 0=normal, 1=high (dopo 72h)
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Preferenze utente per matching
CREATE TABLE user_matching_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) UNIQUE,
  preferred_group_size INTEGER CHECK (preferred_group_size IN (2, 3, 0)), -- 0=any
  flexible_on_size BOOLEAN DEFAULT true,
  videocall_languages TEXT[] NOT NULL,
  flexible_on_language BOOLEAN DEFAULT true,
  timezone_flexibility BOOLEAN DEFAULT true,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Analytics per calcolo tempi di attesa
CREATE TABLE match_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL,
  subcategory TEXT,
  wait_time_hours INTEGER NOT NULL,
  group_size INTEGER NOT NULL,
  matched_at TIMESTAMP DEFAULT NOW()
);

-- Coda email per notifiche settimanali
CREATE TABLE email_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  email_type TEXT NOT NULL, -- 'weekly_recall', 'match_found', etc.
  scheduled_for TIMESTAMP NOT NULL,
  sent_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🚀 IMPLEMENTAZIONE TECNICA

### **Backend: Supabase Edge Functions**
```typescript
// File: supabase/functions/progressive-matching/index.ts
// Algoritmo matching che gira ogni 15 minuti
export const progressiveMatching = async () => {
  const levels = ['PERFECT', 'GOOD', 'ACCEPTABLE']
  
  for (const level of levels) {
    const matches = await findMatchesForLevel(level)
    if (matches.length >= 2) {
      await createGroup(matches)
      await sendMatchNotifications(matches)
    }
  }
  
  // Gestione utenti 72h+ senza match
  await handleFallbackUsers()
}

// File: supabase/functions/calculate-wait-times/index.ts  
// Calcola stime tempi di attesa in real-time
export const calculateWaitTimes = async () => {
  // Implementazione calcolo analytics
}

// File: supabase/functions/send-weekly-recalls/index.ts
// Invia email settimanali utenti in attesa
export const sendWeeklyRecalls = async () => {
  // Implementazione email scheduler
}
```

### **Frontend: React Services**
```typescript
// MatchingService.ts - Gestione matching lato client
export class MatchingService {
  static async enterMatchingPool(objective, preferences) {
    // Inserisce utente in matching_pool
  }
  
  static async updatePreferences(userId, preferences) {
    // Aggiorna user_matching_preferences  
  }
  
  static async getWaitTimeEstimates(category, subcategory) {
    // Recupera stime tempi attesa
  }
}

// useMatchingStatus.ts - Hook per real-time updates
export const useMatchingStatus = (userId) => {
  const [status, setStatus] = useState('searching')
  
  useEffect(() => {
    const subscription = supabase
      .channel(`matching-${userId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'groups',
        filter: `members=cs.{${userId}}`
      }, () => {
        setStatus('matched')
      })
      .subscribe()
      
    return () => subscription.unsubscribe()
  }, [userId])
  
  return status
}
```

---

## 🎯 CONFIGURAZIONE ADMIN (FUTURO)

```typescript
// Parametri configurabili da admin dashboard
const AdminMatchingConfig = {
  timing: {
    perfect_match_hours: 24,     // Modificabile
    good_match_hours: 48,        // Modificabile  
    acceptable_match_hours: 72,  // Modificabile
  },
  
  criteria_weights: {
    category_importance: 0.9,     
    subcategory_importance: 0.7,  
    language_importance: 0.6,     
    timezone_importance: 0.4      
  },
  
  notifications: {
    weekly_recalls_enabled: true,
    escalation_notifications: true,
    email_frequency_days: 7
  }
}
```

---

## ✅ CHECKLIST IMPLEMENTAZIONE

### **Fase 1: Database Setup**
- [ ] Creare tabelle: matching_pool, user_matching_preferences, match_analytics, email_queue
- [ ] Setup trigger per timestamp automatici
- [ ] Creare indici per performance

### **Fase 2: Backend Logic**
- [ ] Edge Function: progressive-matching algoritmo
- [ ] Edge Function: calculate-wait-times analytics  
- [ ] Edge Function: send-weekly-recalls email
- [ ] Setup CRON jobs per esecuzione automatica

### **Fase 3: Frontend Integration**
- [ ] Componente MatchingPreferences per profilo utente
- [ ] Servizio MatchingService per API calls
- [ ] Hook useMatchingStatus per real-time updates
- [ ] UI per cambio obiettivo con stime tempi

### **Fase 4: Email System**
- [ ] Template email weekly recall
- [ ] Template email match found
- [ ] Integration con provider email (SendGrid/Resend)

### **Fase 5: Analytics Dashboard**
- [ ] Admin panel per monitoring code
- [ ] Metriche performance matching
- [ ] Configurazione parametri dinamici

---

*Documentazione pronta per implementazione. Un altro AI può continuare lo sviluppo seguendo queste specifiche dettagliate.*
