# TEMP - Modifiche Layout da Implementare

## 🔧 Fix Onboarding Mobile

### 1. Bottoni Navigazione

**PROBLEMA**: Su mobile, freccia sinistra ha testo sotto, freccia destra ha testo sopra (inconsistente)
**SOLUZIONE**: Allineare entrambi i testi nella stessa posizione (preferibilmente a fianco delle frecce)

### 2. Suggerimenti Obiettivi

**PROBLEMA**: Idee preconfezionate troppo lontane dal campo input
**SOLUZIONE**: Renderle più vicine visivamente, magari come tag clickabili sotto il campo

### 3. Card Livello e Motivazione

**PROBLEMA**: Manca padding nelle card di riepilogo
**ESEMPIO ATTUALE**:

```
Livello:
Intermedio
Motivazione:
dsssssssssssssssssssssssssss
```

**SOLUZIONE**: Aggiungere padding interno e migliorare spacing

### 4. Sottocategorie UX

**PROBLEMA**: Lista sottocategorie potrebbe essere più user-friendly
**SOLUZIONE**: Implementare tag clickabili + campo "Altro" più intuitivo

## 📝 Note Implementazione

- Testare su device mobile reali
- Mantenere accessibilità
- Verificare touch targets 48px minimo
- Controllare responsive su diversi breakpoints
