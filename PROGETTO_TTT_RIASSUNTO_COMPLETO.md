# Riassunto Completo Progetto "TogetherToTarget" (TTT)

## 1. CONCEPT E NAMING

### Nome App

- **TogetherToTarget (TTT)** - App motivazionale basata su mini gruppi
- **Acronimo**: TTT per branding e comunicazione
- **Tagline**: "TogetherToTarget: piccoli gruppi, grandi obiettivi"
- **App bilingue**: Italiano e Inglese fin dall'MVP

### Concept Core

- Mini gruppi di circa 3 persone
- Cicli di supporto di 30 giorni
- Obiettivo: crescita personale condivisa e motivazione tramite gruppo
- Focus su "mai solo, sempre insieme per il target"

---

## 2. FUNZIONALITÀ MVP PRINCIPALI

### Onboarding

- Registrazione semplice (email/social)
- Scelta lingua (it/en)
- **Selezione macro-tema** principale (obbligatoria)
- **Descrizione obiettivo personale** dettagliato (per affinamento matching)
- Comunicazione trasparente su logica abbinamento

### Macro-Temi per Matching MVP (Strategia Ibrida)

#### 6 Categorie Principali (Compromesso per MVP) → AGGIORNATO A 7 CATEGORIE

1. **Salute e Fitness**

   - Focus: benessere fisico, sport, alimentazione, salute mentale
   - Unisce: ex Salute e Benessere + Sport e Attività Fisica + Alimentazione + Benessere

2. **Studio e Competenze**

   - Focus: lingue, certificazioni, corsi online, lettura, formazione
   - Unisce: ex Studio e Apprendimento + Carriera e Sviluppo Professionale

3. **Creatività e Hobby**

   - Focus: arte, musica, scrittura, fotografia, artigianato
   - Mantiene categoria originale unificata

4. **Produttività e Organizzazione**

   - Focus: gestione tempo, routine, tecniche lavoro, planning
   - Mantiene categoria originale

5. **Mindfulness e Crescita**

   - Focus: meditazione, sviluppo emotivo, abitudini positive, coaching
   - Mantiene categoria originale

6. **Carriera e Sviluppo**

   - Focus: sviluppo professionale, networking, leadership, soft skills
   - Categoria separata per alta richiesta attesa

7. **Lifestyle e Relazioni**
   - Focus: finanze, sostenibilità, comunicazione, networking, famiglia
   - Unisce: ex Relazioni e Comunicazione + Gestione Finanziaria + Sostenibilità

#### Sistema Matching Progressivo a 4 Livelli

##### Livello 1: Match Perfetto (0-8h)

- **Criteri**: Stessa categoria + stessa sottocategoria + stessa lingua
- **Qualità**: Massima compatibilità
- **Tempo limite**: 8 ore

##### Livello 2: Match Buono (8-16h)

- **Criteri**: Stessa categoria + stessa lingua (sottocategorie diverse)
- **Qualità**: Alta compatibilità tematica
- **Tempo limite**: 8 ore aggiuntive

##### Livello 3: Match Accettabile (16-24h)

- **Criteri**: Stessa categoria (lingue diverse ma compatibili it/en)
- **Qualità**: Compatibilità base con possibile barriera linguistica
- **Tempo limite**: 8 ore aggiuntive

##### Livello 4: Scelta Utente (24h+)

- **Trigger**: Nessun match trovato dopo 24h
- **Sistema**: Utente sceglie come procedere

#### Dettaglio "Scelta Utente" (Livello 4)

##### Opzioni Presentate all'Utente

**OPZIONE A: Aspetta ancora** ⏳

- **Durata**: 2-3 giorni aggiuntivi
- **Beneficio**: Maggiore probabilità di match di qualità
- **Target**: Utenti pazienti che preferiscono compatibilità
- **Messaggio**: "Aspetta ancora per un gruppo più compatibile"

**OPZIONE B: Gruppo da 2 persone** 👥

- **Avvio**: Immediato con altro utente in attesa
- **Beneficio**: Esperienza più intima, supporto 1vs1
- **Espansione**: Gruppo può crescere durante il ciclo
- **Messaggio**: "Inizia subito con un compagno motivato"

**OPZIONE C: Cambia preferenze** 🔄

- **Azione**: Modifica categoria o criteri di ricerca
- **Beneficio**: Nuove opportunità di match
- **Flessibilità**: Adattamento a disponibilità reale
- **Messaggio**: "Modifica le tue preferenze per più opzioni"

##### UX Flow Notifica (24h)

```
🔍 "Stiamo ancora cercando il tuo gruppo ideale...
Dopo 24 ore, puoi scegliere come procedere:

[⏳ Aspetta ancora] - Continua ricerca 2-3 giorni
[👥 Inizia con compagno] - Parti subito in coppia
[🔄 Cambia preferenze] - Modifica criteri ricerca
[❌ Riprova più tardi] - Pausa e ritorna quando vuoi"
```

#### Regole Conservative per MVP

- **NO gruppi cross-categoria**: Mantiene coerenza tematica
- **SÌ gruppi da 2 persone**: Meglio che attesa infinita
- **SÌ attesa prolungata**: Rispetta preferenza utente per qualità
- **Controllo utente**: Nessuna decisione forzata dal sistema

#### Sistema Onboarding a 3 Livelli (MVP)

1. **Macro-categoria** (obbligatoria): scelta tra le 6 categorie MVP
2. **Sottocategoria** (opzionale): dettaglio specifico, può essere lasciata vuota
3. **Descrizione libera** (opzionale): personalizzazione con esempi, emoji, dettagli

### Sottocategorie Semplificate per MVP

#### 1. 🏃 Salute e Fitness

_Unisce: Salute e Benessere + Sport e Attività Fisica + Alimentazione e Nutrizione_

- **Perdita peso** (dimagrimento, controllo peso)
- **Allenamento forza/resistenza** (palestra, bodybuilding, fitness)
- **Sport specifici** (corsa, nuoto, calcio, tennis, arti marziali)
- **Alimentazione sana** (diete equilibrate, ricette salutari, nutrizione)
- **Benessere mentale** (gestione stress fisico, sonno, recupero)
- **Yoga e movimento** (yoga, pilates, stretching, mobilità)

#### 2. 📚 Studio e Competenze

_Unisce: Studio e Apprendimento + Carriera e Sviluppo Professionale_

- **Lingua inglese** (conversazione, certificazioni, business English)
- **Altre lingue straniere** (spagnolo, francese, tedesco, etc.)
- **Certificazioni professionali** (IT, marketing, project management)
- **Corsi online e formazione** (Coursera, Udemy, skill specifiche)
- **Lettura e approfondimento** (libri, saggistica, sviluppo culturale)
- **Competenze lavorative** (leadership, negoziazione, soft skills)

#### 3. 🎨 Creatività e Hobby

_Rimane invariata dalla versione originale_

- **Musica e strumenti** (chitarra, pianoforte, canto, produzione)
- **Arte e disegno** (pittura, sketching, digital art, scultura)
- **Scrittura creativa** (romanzi, poesia, blogging, sceneggiature)
- **Fotografia e video** (fotografia, editing, video making)
- **Artigianato e fai-da-te** (lavori manuali, bricolage, crafting)

#### 4. ⚡ Produttività e Organizzazione

_Rimane invariata dalla versione originale_

- **Gestione del tempo** (planning, time blocking, priorità)
- **Routine quotidiane** (mattutine, serali, abitudini produttive)
- **Tecniche studio/lavoro** (Pomodoro, GTD, focus methods)
- **Riduzione distrazioni** (digital detox, concentrazione, workflow)
- **Pianificazione obiettivi** (goal setting, tracking, reviews)

#### 5. 🧘 Mindfulness e Crescita

_Principalmente da Mindfulness e Crescita Personale_

- **Meditazione quotidiana** (mindfulness, breathing, apps guided)
- **Gestione stress emotivo** (ansia, pressioni, equilibrio mentale)
- **Sviluppo abitudini positive** (morning routine, habit stacking)
- **Crescita personale** (self-help, coaching, auto-miglioramento)
- **Equilibrio vita-lavoro** (work-life balance, boundaries, wellness)

#### 6. 🌱 Lifestyle e Relazioni

_Unisce: Relazioni e Comunicazione + Gestione Finanziaria + Sostenibilità_

- **Comunicazione sociale** (abilità interpersonali, ascolto attivo)
- **Networking e relazioni** (espandere cerchia, contatti professionali)
- **Gestione finanze personali** (budget, risparmio, investimenti base)
- **Sostenibilità e eco-lifestyle** (riduzione rifiuti, consumo responsabile)
- **Relazioni familiari** (genitorialità, rapporti familiari, coppia)

#### 🔄 Mappa di Trasformazione (13→7 Categorie)

```
PRIMA (13 categorie implementate) → DOPO (7 categorie MVP)

Salute e Fitness        }
Fitness e Sport         } → 🏃 SALUTE E FITNESS
Benessere              }

Apprendimento          }
Studio e Competenze    } → 📚 STUDIO E COMPETENZE

Creatività             }
Creatività e Hobby     } → 🎨 CREATIVITÀ E HOBBY

Produttività           }
Produttività e Organizzazione → ⚡ PRODUTTIVITÀ E ORGANIZZAZIONE

Mindfulness e Crescita → 🧘 MINDFULNESS E CRESCITA (invariata)

Carriera → 🚀 CARRIERA E SVILUPPO (espansa)

Lifestyle e Relazioni  }
Relazioni              } → 🌱 LIFESTYLE E RELAZIONI
Finanze               }
```

#### Vantaggi Nuova Organizzazione MVP (7 Categorie)

- **Masse critiche ottimali** per categoria (matching più efficace)
- **Temi correlati unificati** (maggiore compatibilità interna)
- **Scelta semplificata** per utente (7 vs 13 opzioni originali)
- **Gestione MVP** più snella e implementabile
- **Carriera separata** per alta domanda attesa
- **Roadmap chiara** per espansioni future

#### Esempio Pratico Sistema a 3 Livelli (MVP)

#### Esempio Pratico Sistema a 3 Livelli (MVP)

- **Macro-categoria**: Creatività e Hobby
- **Sottocategoria**: Musica e strumenti
- **Descrizione libera**: "Imparare a suonare la chitarra 🎸 partendo da zero"

---

### 📋 RIFERIMENTO: Categorie Complete per Sviluppo Futuro

#### 11 Categorie Originali (Post-MVP)

_Da implementare nelle fasi successive quando la user base sarà più ampia_

1. **Salute e Benessere**

   - Focus: benessere fisico e mentale completo

2. **Studio e Apprendimento**

   - Focus: competenze, lingue, certificazioni, lettura

3. **Produttività e Organizzazione**

   - Focus: gestione tempo, routine, tecniche lavoro

4. **Creatività e Hobby**

   - Focus: attività creative e passioni personali

5. **Mindfulness e Crescita Personale**

   - Focus: meditazione, sviluppo emotivo, abitudini positive

6. **Relazioni e Comunicazione**

   - Focus: abilità sociali, networking, famiglia

7. **Carriera e Sviluppo Professionale**

   - Focus: lavoro, leadership, soft skills

8. **Gestione Finanziaria e Risparmio**

   - Focus: budget, investimenti, educazione finanziaria

9. **Sport e Attività Fisica**

   - Focus: sport specifici, allenamento, movimento

10. **Alimentazione e Nutrizione**

    - Focus: diete, ricette, consapevolezza alimentare

11. **Sostenibilità e Vita Green**
    - Focus: pratiche ecologiche, consumo responsabile

#### Sottocategorie Dettagliate Complete (Riferimento Futuro)

##### 1. Salute e Benessere

- Perdita peso, Miglioramento resistenza, Gestione stress fisico
- Migliorare qualità sonno, Benessere mentale, Bodybuilding e tonificazione
- Pratiche di rilassamento e respirazione, Recupero post-infortunio

##### 2. Studio e Apprendimento

- Lingua inglese, Lingua spagnola, Altre lingue straniere
- Certificazioni professionali (marketing, IT), Corsi online specifici
- Lettura romanzi, Lettura saggistica, Lettura tecnica
- Approfondimento hobby familiari

##### 3. Produttività e Organizzazione

- Gestione del tempo, Routine mattutina, Routine serale
- Tecniche di studio/lavoro (Pomodoro, GTD), Riduzione distrazioni
- Gestione email, Pianificazione settimanale

##### 4. Creatività e Hobby

- Scrittura creativa, Disegno e pittura
- Musica e strumenti (chitarra, pianoforte), Fotografia e video
- Artigianato e fai-da-te, Cucina creativa, Collezionismo, Modellismo

##### 5. Mindfulness e Crescita Personale

- Meditazione quotidiana, Diario gratitudine, Gestione emozioni
- Sviluppo abitudini positive, Coaching personale, Auto-miglioramento

##### 6. Relazioni e Comunicazione

- Comunicazione interpersonale, Allargare cerchia sociale, Ascolto attivo
- Relazioni familiari, Genitorialità, Risoluzione conflitti

##### 7. Carriera e Sviluppo Professionale

- Ricerca lavoro, Networking professionale, Sviluppo soft skills
- Leadership, Negoziazione

##### 8. Gestione Finanziaria e Risparmio

- Budget mensile, Riduzione spese, Investimenti base, Pianificazione finanziaria

##### 9. Sport e Attività Fisica

- Corsa, Allenamento in palestra, Yoga e Pilates
- Sport di squadra (calcio, basket, volley), Bodybuilding, Arti marziali, Nuoto

##### 10. Alimentazione e Nutrizione

- Dieta equilibrata, Dieta vegana, Dieta vegetariana
- Ricette salutari, Consapevolezza alimentare

##### 11. Sostenibilità e Vita Green

- Riduzione rifiuti, Mobilità sostenibile, Consumo responsabile, Giardinaggio urbano

#### Strategia Espansione Categorie

- **Fase 1 (MVP)**: 7 categorie consolidate
- **Fase 2**: Suddividere categorie più popolari (es. Salute → Fitness + Nutrizione)
- **Fase 3**: Aggiungere categorie specialistiche in base a richiesta utenti
- **Monitoring**: Espandere solo quando ogni categoria ha 50+ utenti attivi

---

### Sistema Gruppi

- **Matching automatico** basato su macro-tema principale
- **Affinamento soft** con dettagli obiettivo (quando possibile, senza garanzie)
- **Mini gruppi di circa 3 persone** (ideale)
- **Gestione gruppi da 2 persone** (casi eccezionali con regole specifiche)
- **Cicli fissi di 30 giorni** (unica durata per semplicità)
- **Tempistiche rapide** di formazione gruppo (ore/pochi giorni max)

#### Logica Matching Dettagliata

- **Filtro primario**: stesso macro-tema obbligatorio
- **Priorità secondaria**: obiettivi simili dentro macro-tema (se disponibili)
- **Flessibilità**: abbinamento anche con obiettivi diversi ma tema compatibile
- **Comunicazione chiara**: "Facciamo del nostro meglio per abbinarti con persone affini"

### Chat e Comunicazione

- **Chat testuale interna** essenziale per comunicazione continua
- **Video chat integrata** per meeting settimanali del gruppo
- **Emoji e reactions** ai messaggi
- **Badge personalizzati** (nome + frase motivazionale)
- **Sticker motivazionali base** (gratuiti)
- Sistema semplificato **senza punteggi karma**
- **Interfaccia pulita** e leggera per mantenere semplicità

#### Specifiche Tecniche Comunicazione

- **Chat testuale**: messaggi, emoji, sticker base gratuiti
- **Video chat gruppo**: 2-3 persone per meeting settimanali
- **Funzioni base**: avvio/ricezione chiamate senza complicazioni
- **Integrazione seamless** con cicli e programmi gruppo

### Video Meeting

- **Programmazione video meeting settimanali**
- **Reminder push** automatici
- Supporto reciproco e coinvolgimento attivo

### Dashboard e Profilo

- **Dashboard sintetica**:
  - Gruppi attivi
  - Badge ricevuti
  - **Progressi personali** (visualizzazione chiara obiettivi)
  - **Progressi di gruppo** (riepilogo condiviso motivazionale)
  - Notifiche e prossimi eventi
- **Profilo utente**:
  - **Avatar temporanei di default** (personalizzazione futura, non MVP)
  - Storico cicli completati
  - Badge e traguardi personali

### Bacheca Badge e Riconoscimenti

- **Badge personali**: traguardi individuali (completamento ciclo, partecipazione attiva)
- **Badge di gruppo**: risultati collettivi (coesione, supporto reciproco)
- **Visualizzazione dedicata**: area accessibile con descrizioni motivazionali
- **Condivisione social**: opzione condividere badge sui social
- **Feed motivazionale**: highlights gruppi e messaggi incoraggianti
- **Nessuna competizione**: focus su supporto e inclusività
- **NO challenge/leaderboard**: mantiene spirito collaborativo non competitivo

### Gestione Cicli

- **Cicli fissi di 30 giorni** (unica durata per semplicità gestionale)
- **Regola "jolly"** per uscita anticipata solo per inattività gruppo
- **Fine ciclo automatica** dopo 30 giorni
- **Rinnovo utenti free**: nuovo gruppo casuale obbligatorio
- **Rinnovo utenti premium**: scelta tra stesso gruppo o nuovo gruppo casuale
- **Comunicazione trasparente** su opzioni disponibili

#### Regola Jolly Uscita Anticipata (Solo per Inattività)

- **Impegno base**: restare nel gruppo per tutti i 30 giorni
- **Uscita anticipata permessa solo se**:
  - **Gruppo 3 persone**: almeno 2 su 3 inattivi per più di 8 giorni consecutivi
  - **Gruppo 2 persone**: l'altro membro inattivo per più di 8 giorni consecutivi
- **Definizione inattività**: nessun messaggio, aggiornamento obiettivi, partecipazione attività
- **Rilevamento automatico**: sistema monitora attività e notifica utente attivo
- **Nessuna penalità**: per uscita giustificata da inattività altrui
- **Altri motivi**: incompatibilità, "non mi trovo bene" NON sono motivi validi

#### Notifica Automatica Sistema

- **Messaggio tipo**: "Il tuo gruppo risulta inattivo da oltre 8 giorni. Vuoi uscire e ripartire con un nuovo gruppo attivo?"
- **Opzioni utente**:
  - **Accetta**: nuovo matching immediato
  - **Rifiuta**: resta nel gruppo (può completare ciclo in autonomia)

#### Vantaggi Durata Fissa 30 Giorni

- **Semplicità tecnica**: un solo formato di gestione
- **Motivazione ottimale**: periodo breve ma concreto per risultati
- **Facile comunicazione**: regole chiare per tutti
- **Valorizzazione premium**: rinnovo stesso gruppo come benefit esclusivo
- **Incentivi continuità**: badge "30 giorni completati" per chi completa ciclo

### Sistema Pagamenti

- **Integrazione Stripe + PayPal**
- Abbonamenti premium
- Gestione rinnovi automatici

### Modello di Monetizzazione Dettagliato

#### Strategia Base

- **Gruppi sempre casuali** - non selezionabili né a pagamento
- **Nessuna creazione gruppi personalizzati** o invito amici
- **Spirito spontaneo e comunitario** mantenuto per tutti
- **Semplicità gestionale** e autenticità dinamiche

#### Abbonamento Premium (4€-10€/mese o 45€-70€/anno)

- **Conferma gruppo cicli successivi**: ripetere con stesso team per nuovi obiettivi
- **Storico gruppi precedenti**: conservazione memoria e progressi nel profilo
- **Statistiche avanzate**: monitoraggio personale e di gruppo dettagliato
- **Badge, emoticon e sticker aggiuntivi** per chat motivazionali
- **Rimozione pubblicità** per esperienza pulita

#### Funzionalità Gratuite (Free Users)

- **Gruppi casuali base** sempre accessibili
- **Partecipazione cicli 30 giorni** completa
- **Chat e video meeting** essenziali
- **Badge base** e motivazione standard
- **Dashboard progressi** personali e di gruppo base
- **Bacheca badge** senza storico completo
- **Pubblicità** presente ma non invasiva (contestuale al tema gruppo)

#### Opzioni Aggiuntive (da valutare)

- **Microtransazioni opzionali**: pacchetti sticker motivazionali (1€-3€)
- **Mini-coaching** premium
- **Notifiche personalizzate** evolute
- **Contenuti esclusivi** motivazionali
- **Periodo prova gratuito** funzioni premium
- **Pubblicità contestuale**: fitness, lingue, musica ecc. per free users

### Notifiche Push

- Messaggi chat
- Attività gruppo
- Video meeting
- Badge assegnati
- Stato gruppo
- Rinnovi abbonamento

---

## 3. MENU E NAVIGAZIONE

### Struttura Menu Principale

1. **Home/Dashboard**

   - Stato attuale gruppi attivi
   - Badge ricevuti
   - Progresso cicli
   - Accesso rapido notifiche

2. **Gruppi**

   - Lista mini gruppi attivi
   - Chat di gruppo
   - Membri e obiettivi condivisi
   - Video meeting programmati

3. **Chat**

   - Chat testuale con emoji
   - Badge personalizzati
   - Reactions

4. **Profilo Utente**

   - Avatar di default
   - Storico cicli
   - Badge e traguardi

5. **Impostazioni**
   - Scelta lingua (it/en)
   - Gestione notifiche
   - Profilo e preferenze
   - Gestione abbonamenti premium

---

## 4. STACK TECNOLOGICO DEFINITIVO

### Strategia di Sviluppo AGGIORNATA

- **Approccio ibrido**: Webapp React + Mobile React Native
- **Fase 1 MVP**: React webapp per validazione rapida concept
- **Fase 2**: React Native mobile per esperienza ottimale
- **Focus iniziale**: webapp per testing e feedback utenti
- **Transizione mobile**: dopo validazione MVP webapp

### Frontend Web (MVP - Fase 1)

- **React 18+** con TypeScript
- **Chakra UI** (gratuito, MIT license) per UI/UX professionale
- **React Router** per navigazione SPA
- **React i18next** per gestione multilingua (it/en)
- **React Hook Form** per gestione form ottimizzata
- **Framer Motion** per animazioni (incluso con Chakra UI)

### Frontend Mobile (Fase 2)

- **React Native** (cross-platform iOS + Android)
- **NativeBase** o UI library compatibile con Chakra UI
- **React Navigation** per navigazione mobile
- **Librerie i18n** per gestione multilingua
- **Notifiche push native** integrate

### Backend Completo

- **Supabase come backend principale**:
  - **PostgreSQL** (database relazionale con supporto JSONB)
  - **API RESTful** automatiche
  - **Realtime** integrato per chat e sync
  - **Autenticazione** multi-metodo (email, social)
  - **Storage** per file futuri
  - **Funzioni serverless** per logiche custom

### Tecnologie Aggiuntive Essenziali

#### Notifiche Push

- **Firebase Cloud Messaging (FCM)** o sistema integrato Supabase
- **Gestione multi-piattaforma** iOS/Android
- **Personalizzazione** per gruppi e attività

#### Pagamenti Sicuri

- **Stripe SDK/API** per abbonamenti premium
- **PayPal SDK/API** come alternativa
- **Gestione rinnovi automatici**
- **Webhook** per sincronizzazione stato abbonamenti

#### Realtime e Chat

- **Supabase Realtime** per chat live
- **WebSocket** nativi per messaggi istantanei
- **Sincronizzazione** badge e attività gruppo
- **Offline support** per messaggi

#### Monitoraggio e Analytics

- **Firebase Analytics** o Google Analytics
- **Sentry** per crash reporting
- **Performance monitoring** React Native
- **User behavior tracking** per ottimizzazione

#### Testing e CI/CD

- **Jest** per test unitari
- **Detox** per test e2e React Native
- **GitHub Actions** per CI/CD pipeline
- **Automated deployment** store iOS/Android

#### Design e Prototipazione

- **Figma** per UI/UX design
- **React Native Elements** o UI library
- **Consistent design system**
- **Accessibility** guidelines

### Vantaggi Stack Scelto

- **Sviluppo rapido MVP** con React webapp + Chakra UI
- **Validazione veloce** concept e user feedback
- **Backend completo** con Supabase (meno setup custom)
- **Realtime nativo** per chat e sync senza complessità extra
- **Scalabilità** PostgreSQL + funzioni serverless
- **Sicurezza** autenticazione e RBAC integrati
- **Costi contenuti** stack moderno ed efficiente
- **Transizione mobile** naturale da React a React Native
- **UI consistency** tra web e mobile con design system

### Testing e Deployment

- **Testing iterativo** modulo per modulo
- **Jest** per test unitari
- **Detox** per test integration
- **CI/CD** con GitHub Actions o simili
- **Documentazione API** dettagliata

---

## 5. DINAMICHE E MECCANICHE

### Flusso Utente Principale

1. **Onboarding** → Registrazione + scelta categoria + obiettivo
2. **Matching automatico** → Formazione gruppo da 3 persone
3. **Avvio ciclo 30 giorni** → Chat, video meeting, badge
4. **Partecipazione attiva** → Motivazione reciproca, supporto
5. **Completamento/Uscita** → Fine ciclo o jolly per inattività
6. **Rinnovo** → Nuovo ciclo o nuovo gruppo

### Sistema Badge

- Badge con **nome personalizzato + frase motivazionale**
- Assegnazione per:
  - Traguardi intermedi
  - Partecipazione attiva
  - Supporto al gruppo
  - Completamento cicli

### Regole di Partecipazione

- **Cicli fissi di 30 giorni**
- **Video meeting settimanali obbligatori**
- **Regola jolly**: uscita anticipata per inattività
- **Matching basato su affinità** (categoria + obiettivo)

### Meccaniche Dettagliate dei Gruppi

#### Flow Matching: Criteri e Rilassamento Progressivo

1. **Matching “stretto” (prime 3 ore):**
   - Categoria principale (obbligatorio)
   - Sottocategoria (match)
   - Lingua preferita (match)
   - Disponibilità oraria (match)
   - → Se si trova un gruppo, si forma subito.
2. **Dopo 3 ore, rilassamento progressivo:**
   - Step 1: Allarga disponibilità oraria (accetta sovrapposizione minore)
   - Step 2: Allarga lingua (accetta anche gruppi misti it/en)
   - Step 3: Allarga sottocategoria (accetta anche sottocategorie diverse nella stessa categoria)
   - Step 4: (Da decidere) — es. accetta livelli esperienza diversi, o abbina anche con obiettivi meno affini
3. **Se ancora nessun match dopo X ore/giorni:**
   - Proponi gruppo da 2 con finestra di 3 giorni per il terzo membro (come già deciso).

**Note:**

- L’obiettivo personale (testo libero) può essere usato solo per affinare la compatibilità, non come vincolo.
- Il livello di esperienza: puoi decidere se tenerlo “soft” (preferenza) o ignorarlo per l’MVP.

#### Gestione abbandoni/inattività

- Se qualcuno abbandona prima dell’inizio: tutti i membri tornano in coda come se avessero appena inserito la richiesta. Se era un gruppo da 2, il membro rimasto resta in attesa e ripartono i tempi (matching e finestra per il terzo).
- Se qualcuno abbandona o è inattivo durante il ciclo: si applicano le regole già descritte in documentazione (regola jolly, notifiche, ecc.).

#### Notifiche e feedback

- Notifiche email inviate in tutti i passaggi principali del matching (formazione gruppo, arrivo terzo, partenza ciclo, ecc.) per massima trasparenza.
- Notifiche in-app: sezione dedicata nella dashboard o pagina menu (da decidere), con storico e dettagli di tutte le notifiche di matching e gruppo.
- Messaggi personalizzati per ogni step/finestra, sia via email che in-app.

#### Regole Premium vs Free

- Nessun utente (free o premium) può avere più gruppi attivi per lo stesso goal/obiettivo.
- Gli utenti premium possono avere più gruppi attivi contemporaneamente, ma solo se sono per obiettivi diversi (max 3 gruppi in parallelo).
- Gli utenti free: un solo gruppo attivo alla volta (per un solo goal).
- Matching: stesse regole per tutti (no priorità premium).
- Rinnovo gruppo: i premium possono prolungare lo stesso gruppo per un nuovo ciclo, ma solo se tutti i membri sono premium (2/2 o 3/3).
- Gift premium: un utente premium può regalare l’abbonamento agli altri membri del gruppo (per permettere il rinnovo di gruppo). Bottone dedicato nella UI, con notifica/email e meccanica da studiare per massimizzare conversione e community.
- Possibilità di regalare abbonamenti anche a utenti esterni o casuali (da studiare UX e posizionamento bottone).

#### Composizione Gruppi

- **Dimensione ideale**: 3 persone per gruppo
- **Motivazione**: garantire interazioni strette e motivazione reciproca mantenendo pluralità per supporto condiviso
- **Gestione eccezioni**: gruppi da 2 persone con regole specifiche:

  - Impegno maggiore richiesto in chat e video meeting
  - **Finestra massima di attesa per il terzo membro**: se il matching parte con 2 persone, si apre una finestra di 3 giorni (fissi, dal momento in cui il gruppo viene effettivamente creato in 2). Se entro questo periodo arriva un terzo membro compatibile, viene aggregato automaticamente al gruppo. Se la finestra scade senza nuovi arrivi, il gruppo resta da 2 e parte il ciclo normalmente.
  - Stato gruppo: "in attesa del terzo" (pending, chat attiva ma ciclo non ancora partito) → "completo" (se arriva il terzo) → "chiuso e avvio ciclo" (se la finestra scade)
  - Notifica agli utenti: aggiornamento stato gruppo e partenza ciclo
  - Regola jolly più flessibile per evitare frustrazioni

**Schema dinamica matching gruppi da 2 → 3:**

1. Matching standard: si cerca di formare gruppi da 3 (con attese progressive e scelta utente come da flow).
2. Se dopo tutte le attese non si trova un terzo → si forma un gruppo da 2 e parte la finestra di 3 giorni (chat attiva, ciclo NON ancora partito).
3. Durante la finestra:
   - Se arriva un terzo compatibile → viene aggiunto, il gruppo diventa da 3, e parte il ciclo di 30 giorni per tutti.
   - Se NON arriva nessuno entro 3 giorni → il gruppo da 2 viene "chiuso" e parte il ciclo di 30 giorni solo per loro.
4. Le regole precedenti di attesa (matching progressivo, scelta utente, ecc.) restano valide PRIMA della formazione del gruppo da 2.

**Vantaggi:**

- Massima possibilità di gruppo da 3, ma senza far aspettare troppo chi è già motivato.
- L’utente non resta bloccato in attesa infinita.
- La chat si può attivare subito, ma il ciclo parte solo a gruppo definitivo.

**Flow sintetico:**

- Matching parte con 2 → gruppo "in attesa del terzo" (pending)
- Se arriva il terzo entro la finestra, si unisce e il gruppo diventa da 3
- Se la finestra scade, il gruppo da 2 viene "chiuso" e parte il ciclo

#### Tempistiche di Formazione

- **Matching immediato**: subito dopo onboarding
- **Tempo target**: poche ore o massimo pochi giorni dall'iscrizione
- **Obiettivo**: non perdere slancio motivazionale
- **Gestione attesa**:
  - Notifiche di aggiornamento stato
  - Messaggi informativi durante l'attesa
  - Inviti ad attività temporanee o anticipazione ciclo
- **Avvio automatico**: ciclo 30 giorni parte immediatamente alla formazione completa

#### Criteri di Matching

- **Categoria di interesse** primaria
- **Obiettivo individuale** compatibile
- **Disponibilità temporale** per video meeting
- **Preferenze linguistiche** (it/en)

#### Regole Casualità vs Premium

- **Tutti gli utenti**: gruppi sempre formati casualmente basati su macro-tema
- **Utenti free**: solo nuovi gruppi casuali ad ogni ciclo di 30 giorni
- **Utenti premium**: possono confermare stesso gruppo per cicli successivi
- **Nessuna selezione manuale** membri o inviti amici (nemmeno a pagamento)
- **Preservazione autenticità** e spontaneità dinamiche di gruppo

### Flusso Fine Ciclo e Rinnovo

#### Per Utenti Free

1. **Notifica fine ciclo** a 30 giorni
2. **Opzione rinnovo** con nuovo gruppo casuale
3. **Matching automatico** nuovo trio basato su macro-tema
4. **Perdita storico** gruppo precedente

#### Per Utenti Premium

1. **Notifica fine ciclo** con opzioni multiple
2. **Scelta A**: rinnovo con stesso gruppo (se tutti d'accordo)
3. **Scelta B**: nuovo gruppo casuale
4. **Conservazione storico** di tutti i gruppi precedenti
5. **Flessibilità totale** nel decidere continuità

---

## 6. DESIGN E BRAND

### Identità Visiva

- **Logo e palette colori** emozionali
- Focus su motivazione e sinergia di gruppo
- **Acronimo TTT** usato nei messaggi e comunicazioni
- Design orientato al supporto emotivo

### Comunicazione

- **Hashtag**: #TogetherToTarget #SmallGroupsBigGoals
- **Storytelling**: "mai solo, sempre insieme per il target"
- **Tono**: emozionale, motivante, supportivo

---

## 7. STRATEGIA DI LANCIO

### Marketing Digitale

- **Video promo "shorts"** emozionali
- **Piattaforme**: TikTok, Instagram
- **Storytelling video**: focus su community e supporto
- **Dominio e social** da verificare

### Localizzazione

- **Gestione testi it/en** fin dall'inizio
- **File separati** JSON/YAML per traduzioni
- **Interfaccia bilingue** nativa

---

### ROADMAP SVILUPPO AGGIORNATA

### Pianificazione per Step MVP (Webapp React)

1. **Setup Progetto** → React + TypeScript + Chakra UI + Supabase
2. **Onboarding** → Registrazione e scelta preferenze (6 categorie MVP)
3. **Sistema Gruppi** → Matching e formazione gruppi da 3
4. **Chat Base** → Comunicazione testuale + emoji + reactions
5. **Badge System** → Assegnazione e visualizzazione badge motivazionali
6. **Dashboard Utente** → Profilo, progressi, storico gruppi
7. **Sistema Pagamenti** → Stripe integration per premium features
8. **Testing & Deployment** → Rilascio MVP webapp

### Fase 2 - Transizione Mobile

1. **Setup React Native** → Migrazione componenti da Chakra UI a NativeBase
2. **Video Meeting** → Integrazione native per mobile
3. **Notifiche Push** → Sistema completo mobile
4. **Performance Optimization** → Ottimizzazioni specifiche mobile
5. **Store Deployment** → Rilascio iOS/Android stores

### Elementi Futuri (Post-MVP)

#### Webapp Features Avanzate

- **Video meeting integrato** (vs link esterni iniziali)
- **Analytics avanzate** utente e gruppo
- **Avatar personalizzati** (upload e storage)
- **Supporto clienti** integrato
- **SEO optimization** e marketing integrato

#### Mobile App Features

- **Notifiche push native** complete
- **Offline support** per messaggi chat
- **Integrazione calendario** nativa
- **Condivisione social** ottimizzata mobile
- **Performance monitoring** specifiche mobile

#### Espansione Funzionalità

- **Espansione categorie** da 6 a 11 complete
- **Sottocategorie dettagliate** per matching avanzato
- **Sistema mentoring** senior/junior
- **Gruppi tematici** stagionali o speciali

### Funzionalità AI Future (Post-MVP)

#### AI per Supporto Motivazionale

- **Suggerimenti personalizzati di incoraggiamento**: sistema AI che analizza progressi utente
- **Proposte badge intelligenti**: suggerimenti automatici badge basati su comportamento
- **Messaggi motivazionali mirati**: personalizzazione contenuti basata su attività
- **Non invasivo**: sempre orientato a supportare relazione umana, non sostituirla

#### AI per Benessere Emotivo

- **Analisi tono chat testuale**: rilevamento discreto segnali demotivazione
- **Monitoraggio stato emotivo**: identificazione frasi negative ricorrenti
- **Notifiche supporto intelligenti**: interventi automatici di incoraggiamento
- **Rispetto privacy**: analisi anonima e trasparente, sempre opzionale

#### Principi Guida AI

- **Leggera e discreta**: non appesantire esperienza utente
- **Supporto umano centrali**: AI come assistente, non sostituto
- **Trasparenza totale**: utenti sempre informati su uso AI
- **Opzionalità**: possibilità disattivare funzioni AI se preferito

### Vantaggi Strategia Monetizzazione

- **Semplicità gestionale**: poche opzioni pagamento, ridotta complessità tecnica
- **Spirito comunitario**: casualità gruppi stimola curiosità e apertura
- **Valore premium tangibile**: funzionalità utili con impatto diretto su motivazione
- **Monetizzazione equilibrata**: pubblicità solo free users, rimozione a pagamento
- **Comunicazione trasparente**: regole casualità e privacy sempre chiare
- **Focus non competitivo**: supporto e inclusività come valori centrali
- **Ambiente genuino**: motivazione interna vs pressione esterna

---

## 10. BASI SCIENTIFICHE E EFFICACIA

### Evidenze Psicologiche dei Mini Gruppi Motivazionali

#### Incremento Probabilità di Successo

- **20-70% maggiori possibilità** di raggiungere obiettivi personali rispetto al percorso solitario
- **Effect size moderato-elevato** (Cohen's d: 0.4-0.7) nelle meta-analisi
- **74% delle misure di esito** mostrano aumenti significativi in coping, controllo emotivo e qualità della vita

#### Benefici Psicologici Documentati

- **+17% motivazione intrinseca** rispetto al pre-intervento
- **Riduzione significativa** ansia e depressione
- **Miglioramento auto-efficacia** e fiducia personale
- **Maggiore aderenza** e continuità nell'azione verso obiettivi
- **Supporto emotivo** e senso di appartenenza

#### Meccanismi di Efficacia

- **Responsabilità condivisa** aumenta impegno personale
- **Feedback immediati** da pari facilitano correzioni
- **Sostegno emotivo** riduce stress e isolamento
- **Senso di comunità** migliora resilienza psicologica
- **Goal setting di gruppo** superiore a obiettivi individuali

### Riferimenti Scientifici Principali

#### Studi Chiave Citabili

1. **BMC Psychiatry (2021)**: Meta-analisi su 2.100+ partecipanti

   - "Systematic review and meta-analysis of group peer support interventions"
   - Miglioramenti concreti in recupero personale e motivazione

2. **American Journal of Public Health (2010)**:

   - "Systematic Review of Effectiveness of Peer-Based Interventions"
   - Effect size significativi in cambiamento comportamentale

3. **Psychological Medicine (2023)**:

   - "Effectiveness of peer support for individuals with mental illness"
   - Evidenze robuste su supporto tra pari

4. **PLOS ONE (2017)**:
   - "Supporting Group Goal Striving vs Individual Implementation"
   - Superiorità obiettivi collettivi vs individuali

#### Validazione Marketing

- **Base scientifica solida** per claim efficacia
- **Numeri verificabili** e riferimenti accademici
- **Credibilità professionale** nelle comunicazioni
- **Differenziazione competitiva** basata su evidenze

---

## 9. CONSIDERAZIONI TECNICHE AGGIUNTIVE

### Sicurezza e Privacy

- Autenticazione sicura Supabase
- Gestione dati GDPR compliant
- Crittografia chat (se necessaria)
- **Moderazione AI immagini**: Google Vision per sicurezza avatar/contenuti

### Performance

- Ottimizzazione React Native
- Gestione stato con Redux/Context
- Caching intelligente dati

### Monitoraggio

- **Analytics base** per MVP
- **Crash reporting**
- **Performance monitoring**
- **User behavior tracking**

### AI e Sicurezza (MVP)

- **Moderazione contenuti automatica**: filtri AI per immagini inappropriate
- **Protezione minori**: sistemi AI per rilevamento contenuti sensibili
- **Spam prevention**: rilevamento automatico messaggi spam o abusivi
- **Sempre trasparente**: utenti informati su uso AI per sicurezza

---

---

## 15. DECISIONI TECNICHE FINALI MVP

### Stack Confermato per Sviluppo Immediato

#### Frontend MVP (Webapp)

- **React 18+** + **TypeScript**
- **Chakra UI** (gratuito, MIT) per design system professionale
- **React Router Dom** per SPA navigation
- **React Hook Form** + **Yup** per validazione form
- **React i18next** per multilingua (it/en)
- **Axios** per API calls
- **React Query** per state management server

#### Backend & Infrastructure

- **Supabase** completo (DB + Auth + Realtime + Storage)
- **PostgreSQL** con funzioni avanzate e JSONB
- **Supabase Auth** per autenticazione multi-provider
- **Supabase Realtime** per chat live
- **Row Level Security** per privacy e sicurezza

#### Payments & Services

- **Stripe** per abbonamenti premium e pagamenti
- **Vercel** o **Netlify** per hosting webapp
- **Supabase Edge Functions** per logiche custom

#### Development Tools

- **Vite** per bundling veloce
- **ESLint** + **Prettier** per code quality
- **Jest** + **React Testing Library** per testing
- **GitHub Actions** per CI/CD

### Struttura Progetto Pianificata

```
together-to-target-webapp/
├── src/
│   ├── components/          # Componenti riutilizzabili Chakra UI
│   ├── pages/              # Page components con routing
│   ├── hooks/              # Custom hooks React Query
│   ├── services/           # Supabase client e API calls
│   ├── store/              # Context/Zustand per state management
│   ├── utils/              # Utilities e helpers
│   ├── types/              # TypeScript definitions
│   ├── i18n/               # Traduzioni it/en
│   └── theme/              # Chakra UI custom theme TTT
├── public/                 # Assets statici
└── docs/                   # Documentazione tecnica
```

### Next Steps Development

1. **Setup iniziale** progetto con Vite + React + TypeScript
2. **Configurazione Chakra UI** con tema custom TTT
3. **Setup Supabase** client e database schema
4. **Implementazione autenticazione** e onboarding
5. **Sviluppo sistema matching** e gruppi
6. **Chat system** con Supabase Realtime

---

**DOCUMENTAZIONE AGGIORNATA E COMPLETA** ✅

**Ready per sviluppo MVP webapp con stack definitivo confermato!**

La documentazione ora include tutte le decisioni tecniche finali e può essere usata come contesto completo per la nuova chat di sviluppo. 🚀

---

## 11. CRITICITÀ E RISCHI PRINCIPALI

### 1. PROBLEMA MASSA CRITICA (ALTO RISCHIO)

#### Rischi Identificati

- **Chicken-egg problem**: servono utenti per formare gruppi, ma senza gruppi attivi nessuno resta
- **Matching fallito** frustra utenti: se non trovi 3 persone compatibili in tempi rapidi, l'utente abbandona
- **Segmentazione eccessiva**: 11 categorie + sottocategorie + lingue = troppa frammentazione per piccola user base iniziale

#### Soluzioni Strategiche

- **Parti con 3-4 macro-categorie massimo** per MVP
- **Test beta chiuso** con almeno 100+ utenti per categoria prima del lancio pubblico
- **Sistema ibrido**: se matching automatico fallisce, proponi gruppo "misto" ma affine

### 2. COMPLESSITÀ NASCOSTA DEL MATCHING

#### Rischi Identificati

- **Algoritmo critico**: un matching scadente uccide l'esperienza
- **Gestione fuso orario**: video meeting cross-timezone problematici
- **Lingue diverse**: utenti it/en nello stesso gruppo = barriera comunicativa

#### Soluzioni Strategiche

- **Matching geografico** per fuso orario compatibile
- **Lingua come filtro primario**, non secondario
- **Fallback intelligente**: meglio gruppo da 2 che attesa infinita

### 3. SOSTENIBILITÀ BUSINESS MODEL

#### Rischi Identificati

- **Tasso conversione premium incerto**: molti potrebbero non voler "confermare gruppo"
- **CAC vs LTV**: acquisire utenti per app di nicchia è costoso
- **Churn post-trial**: dopo primo ciclo gratuito, quanti rinnovano?

### 4. SFIDE TECNICHE SOTTOVALUTATE

#### Rischi Identificati

- **Moderazione contenuti**: chat di gruppo = potenziali abusi, contenuti inappropriati
- **Video meeting**: implementazione complessa, costi di infrastruttura elevati
- **Gestione inattività**: rilevare "8 giorni di inattività" non è banale
- **GDPR/Privacy**: dati sensibili su obiettivi personali

---

## 12. ANALISI MARKETING COMPLETA

### Forze del Progetto

- **Target chiaro**: persone motivate al cambiamento personale
- **USP forte**: "mai solo nei tuoi obiettivi"
- **Social proof**: evidenze scientifiche credibili
- **Viral potential**: successi condivisi stimolano passaparola

### Debolezze e Sfide

- **Nicchia limitata**: non tutti vogliono condividere obiettivi personali
- **Educazione utente**: concetto nuovo da spiegare al mercato
- **Stagionalità**: picchi gennaio/settembre, cali estate/feste
- **Competizione indiretta**: Headspace, MyFitnessPal, Duolingo già dominano segmenti

### Strategia Marketing Suggerita

1. **Beta test chiuso** con influencer wellness/productivity
2. **Content marketing**: case studies scientifici + success stories
3. **Partnership**: psicologi, life coach, centri benessere
4. **Referral program** aggressivo: porta amico = ciclo premium gratis

---

## 13. SUGGERIMENTI TECNICI SPECIFICI

### Architettura Avanzata

- **Redis cache** per matching rapido
- **Queue system** per video meeting scheduling
- **CDN** per performance globali
- **A/B testing** integrato da subito

### Database Schema Critico

```sql
-- Prevedere fin da subito:
users (timezone, preferred_language, availability_hours)
groups (status, created_at, cycle_start, inactivity_strikes)
matching_pool (waiting_since, preferences, failed_attempts)
```

### MVP Features da Rimandare

- **Badge personalizzati**: inizia con badge standard
- **Sottocategorie**: usa solo macro-categorie
- **Video meeting**: inizia con solo text chat
- **Analytics avanzate**: focus su retention di base

---

## 14. RACCOMANDAZIONI STRATEGICHE

### Prima del Lancio

1. **Prototipo no-code** (Discord/Telegram) per testare dinamiche gruppo
2. **Survey market research**: quante persone condividerebbero obiettivi con sconosciuti?
3. **Competitor analysis**: cosa non funziona in app simili?
4. **Legal check**: terms of service, privacy policy, moderazione

### Metriche Critiche da Monitorare

- **Time-to-first-group**: ore dall'iscrizione al matching
- **Group completion rate**: % gruppi che finiscono 30 giorni
- **Chat engagement**: messaggi per utente per giorno
- **Premium conversion**: % che paga dopo primo ciclo gratuito

### Piano B - Strategie Alternative

Se matching automatico non scala:

- **Gruppi tematici fissi** con iscrizione manuale
- **Buddy system** (1vs1) invece di trio
- **Community generale** con obiettivi condivisi

### Strategia MVP Ultra-Minimale

1. **3 categorie massimo** per iniziare
2. **Solo text chat** (no video per MVP)
3. **Matching semplificato** geografico + linguistico
4. **Beta test prolungato** per validare assunzioni
5. **Budget modesto** per primi 6 mesi di test

---

**CONCLUSIONE**: Il progetto ha **potenziale ALTO ma rischi ALTI**. Il concept è innovativo e il problema reale, ma serve **execution perfetta** e **pazienza** per raggiungere massa critica. Successo dipende da validazione rapida delle assunzioni e iterazione continua basata su feedback utenti reali.

---

## 15. STATO IMPLEMENTAZIONE TECNICA - AGOSTO 2025

### ✅ Sistema di Autenticazione Completo

#### Architettura

- **AuthService**: Classe centralizzata per gestione auth con Supabase
- **AuthContext**: Context React per stato globale autenticazione
- **useAuth Hook**: Hook custom per accesso ai metodi auth
- **TypeScript**: Tipizzazione completa per sicurezza e manutenibilità

#### Funzionalità Implementate

- ✅ **Registrazione Email/Password**: Con validazione form completa
- ✅ **Login Email/Password**: Gestione errori e stati di caricamento
- ✅ **Google OAuth**: Integrazione completa con redirect
- ✅ **Conferma Email**: Sistema automatico con pagina dedicata
- ✅ **Gestione Sessioni**: Persistenza e sincronizzazione stati
- ✅ **Logout Sicuro**: Pulizia stati e redirect

#### UX/UI Implementata

- ✅ **Form Responsivi**: Design mobile-first
- ✅ **Validazione Real-time**: Feedback immediato all'utente
- ✅ **Messaggi di Stato**: Errori, successi, caricamenti
- ✅ **Navigazione Intelligente**: Redirect basati su stato auth
- ✅ **Accessibilità**: Labels, ARIA, keyboard navigation

#### Sicurezza

- ✅ **Row Level Security**: Policy Supabase per protezione dati
- ✅ **Route Protection**: Guard per pagine autenticate
- ✅ **Token Management**: Gestione automatica refresh token
- ✅ **Input Sanitization**: Validazione e pulizia input utente

### 🔧 Sistema di Routing e Navigazione

#### Route Implementate

- `/` - Home page pubblica
- `/login` - Form di accesso
- `/signup` - Form di registrazione
- `/email-confirmation` - Conferma email automatica
- `/dashboard` - Dashboard utenti autenticati
- `/onboarding` - Processo di onboarding (in sviluppo)

#### Protezioni Route

- **ProtectedRoute Component**: Controllo accesso basato su autenticazione
- **Redirect Automatici**: Navigazione intelligente in base a stato utente
- **Gestione Onboarding**: Controllo completamento processo di setup

### 📱 Componenti UI Sviluppati

#### Componenti Auth

- `LoginForm` - Form di accesso completo
- `SignupForm` - Form registrazione con validazione
- `EmailConfirmationPage` - Gestione conferma email automatica

#### Componenti Layout

- `MainLayout` - Layout principale con header/sidebar
- `ProtectedRoute` - Wrapper per route protette
- `UserMenu` - Menu utente con dropdown

#### Componenti Comuni

- Design system coerente con CSS custom
- Componenti riutilizzabili per form e UI
- Gestione stati di caricamento globalizzata

### 🗄️ Integrazione Database

#### Schema Supabase

- Tabella `users` con profili utente estesi
- Integrazione con `auth.users` di Supabase
- Preparazione per tabelle gruppi e matching

#### Gestione Dati

- **Real-time Subscriptions**: Setup per future chat
- **Optimistic Updates**: Aggiornamenti UI immediati
- **Error Handling**: Gestione robusta errori database

### 🚀 Performance e Qualità

#### Ottimizzazioni

- **Code Splitting**: Caricamento lazy componenti
- **Bundle Optimization**: Vite per build ottimizzate
- **Type Safety**: TypeScript strict mode
- **Error Boundaries**: Gestione errori React

#### Testing Strategy

- Architettura testabile con dependency injection
- Separazione logica business da UI
- Mocking Supabase per unit tests

### 📋 Prossimi Passi Tecnici

#### 1. Password Reset (Priorità Alta)

- Implementazione reset password via email
- Form per richiesta reset
- Gestione token di reset sicura

#### 2. Completamento Onboarding

- Form multi-step per setup profilo
- Selezione categorie e obiettivi
- Validazione e persistenza dati

#### 3. Sistema Gruppi

- Database schema per gruppi e membri
- Algoritmo matching automatico
- Dashboard gestione gruppi

#### 4. Chat Real-time

- Integrazione Supabase Realtime
- Componenti chat con messaggi
- Notifiche e presenza utenti

### 💻 Stack Tecnologico Finale

```typescript
Frontend:
- React 18 + TypeScript 5
- Vite (build tool)
- React Router 6 (routing)
- CSS Custom Properties (styling)

Backend:
- Supabase (Database + Auth + Realtime)
- PostgreSQL (database)
- Row Level Security (sicurezza)

Deployment:
- Vercel (frontend hosting)
- Supabase Cloud (backend)

Development:
- ESLint + Prettier (code quality)
- Git + GitHub (version control)
- VS Code (IDE)
```

### 📊 Metriche di Qualità Raggiunte

- ✅ **Zero Errori TypeScript**: Codebase completamente tipizzato
- ✅ **Responsive Design**: Funziona su mobile/tablet/desktop
- ✅ **Accessibilità**: Supporto screen reader e keyboard
- ✅ **Performance**: Bundle ottimizzato, caricamento rapido
- ✅ **Sicurezza**: Best practices auth e protezione dati
- ✅ **UX**: Flussi utente fluidi e feedback chiari

---

**STATUS AGOSTO 2025**: Base tecnica solida completata. Sistema di autenticazione production-ready. Pronto per sviluppo features core dell'applicazione (onboarding, matching, chat).

---

## 🔬 RICERCA SUBCATEGORIE - BREAKTHROUGH SCIENTIFICO

### ✅ Metodologia Tripla Completata (Agosto 2025)

**PROMPT 1**: Analisi app esistenti → 10 subcategorie "Salute e Fitness" identificate  
**PROMPT 2**: Google Trends → Conferma trend positivi e interesse crescente  
**PROMPT 3**: Validazione psicologica → **CONFERMA SCIENTIFICA TOTALE** 🏆

### 🎯 Risultati Straordinari

La ricerca ha prodotto una **convergenza perfetta** tra:

- **Popolarità** (cosa usano gli utenti)
- **Trend** (cosa cercano gli utenti)
- **Scienza** (cosa funziona davvero)

### 📚 Evidenze Scientifiche Chiave

- Obiettivi semplici e misurabili favoriscono habit formation in 30 giorni
- Social accountability in gruppi di 3 persone è ottimale per coesione
- Combinazione attività fisica + comportamenti salute molto efficace
- Supporto sociale multiforme cruciale per cambiamento comportamentale

### 🏆 Le 10 Subcategorie Validate

1. **Perdita peso** - Misurabile, motivante, results-driven
2. **Attività quotidiana/passi** - Semplice, habit-forming, social comparison
3. **Corsa/distanza** - Progressi visibili, peer motivation
4. **Tonificazione/forza** - Risultati tangibili, competizione amichevole
5. **Cardio/HIIT** - Intenso ma breve, adatto a cicli 30gg
6. **Alimentazione sana** - Complesso ma efficace se supportato
7. **Sonno/recupero** - Fondamentale per wellness olistico
8. **Yoga/stretching** - Rilassante, accessibile, social bonding
9. **Sport specifici** - Skill building, competizione costruttiva
10. **Benessere mentale tramite fitness** - Mood boost, stress relief

### 🚀 Ready for Implementation

**Decision**: Procedere immediatamente con implementazione delle 10 subcategorie validate per MVP testing con categoria "Salute e Fitness".

**Next**: Database update, frontend integration, UX per social accountability, beta testing con gruppi di 3.
